const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { logAction } = require('../services/loggerService');
const { sendOTP } = require('../services/emailService');
require('dotenv').config();

const register = async (req, res) => {
    try {
        const { username, email, password, role_name, organization_name } = req.body;
        console.log(`DEBUG: Auth - Register attempt for ${email} in Org: ${organization_name}`);
        
        const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            console.log(`DEBUG: Auth - Register failed: ${email} already exists`);
            return res.status(400).json({ message: 'User already exists' });
        }

        // --- Multi-Tenancy: Org Creation/Lookup ---
        const orgName = organization_name || 'Zorvyn Global';
        const orgSlug = orgName.toLowerCase().replace(/\s+/g, '-');
        const [orgs] = await pool.query('SELECT id FROM organizations WHERE name = ?', [orgName]);
        let orgId;
        if (orgs.length === 0) {
            const [result] = await pool.query('INSERT INTO organizations (name, slug) VALUES (?, ?)', [orgName, orgSlug]);
            orgId = result.insertId;
        } else {
            orgId = orgs[0].id;
        }

        const [roles] = await pool.query('SELECT id FROM roles WHERE name = ?', [role_name || 'Viewer']);
        if (roles.length === 0) {
            console.log(`DEBUG: Auth - Register failed: Invalid role ${role_name}`);
            return res.status(400).json({ message: 'Invalid role' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const [result] = await pool.query(
            'INSERT INTO users (username, email, password_hash, role_id, organization_id, is_verified) VALUES (?, ?, ?, ?, ?, FALSE)',
            [username, email, hashedPassword, roles[0].id, orgId]
        );

        const userId = result.insertId;
        console.log(`DEBUG: Auth - User created with ID ${userId}`);

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        await pool.query('INSERT INTO otps (user_id, otp_code, expires_at) VALUES (?, ?, ?)', [userId, otp, expiresAt]);
        console.log(`DEBUG: Auth - OTP generated for ${email}`);
        
        await sendOTP(email, otp);
        console.log(`DEBUG: Auth - OTP sent to ${email} via Resend`);

        await logAction(userId, 'USER_REGISTERED', { email }, req, orgId);

        res.status(201).json({ message: 'User registered. Please verify your email with the OTP sent.', userId });
    } catch (err) {
        console.error('DEBUG: Auth - Registration ERROR:', err.message);
        res.status(500).json({ message: 'Registration failed' });
    }
};

const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        console.log(`DEBUG: Auth - Verify OTP attempt for ${email}`);
        
        const [users] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
        if (users.length === 0) return res.status(404).json({ message: 'User not found' });
        
        const userId = users[0].id;
        
        const [otps] = await pool.query(
            'SELECT * FROM otps WHERE user_id = ? AND otp_code = ? AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1',
            [userId, otp]
        );

        if (otps.length === 0) {
            console.log(`DEBUG: Auth - Verify OTP failed: Invalid or expired for ${email}`);
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        await pool.query('UPDATE users SET is_verified = TRUE WHERE id = ?', [userId]);
        await pool.query('DELETE FROM otps WHERE user_id = ?', [userId]);
        
        console.log(`DEBUG: Auth - User ${email} verified successfully`);
        const [userInfo] = await pool.query('SELECT organization_id FROM users WHERE id = ?', [userId]);
        await logAction(userId, 'USER_VERIFIED', { email }, req, userInfo[0].organization_id);

        res.json({ message: 'Email verified successfully' });
    } catch (err) {
        console.error('DEBUG: Auth - Verification ERROR:', err.message);
        res.status(500).json({ message: 'Verification failed' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(`DEBUG: Auth - Login attempt for ${email}`);

        const [users] = await pool.query(`
            SELECT u.*, r.name as role, o.name as org_name
            FROM users u 
            JOIN roles r ON u.role_id = r.id 
            JOIN organizations o ON u.organization_id = o.id
            WHERE u.email = ? AND u.status = 'Active'
        `, [email]);

        if (users.length === 0) {
            console.log(`DEBUG: Auth - Login failed: User ${email} not found or inactive`);
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = users[0];

        if (!user.is_verified) {
            console.log(`DEBUG: Auth - Login failed: User ${email} not verified`);
            return res.status(403).json({ message: 'Please verify your email before logging in' });
        }

        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) {
            console.log(`DEBUG: Auth - Login failed: Invalid password for ${email}`);
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role, organization_id: user.organization_id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRY }
        );

        console.log(`DEBUG: Auth - Login successful for ${email} (Role: ${user.role})`);
        await logAction(user.id, 'USER_LOGIN', { method: 'local' }, req, user.organization_id);

        res.json({
            message: 'Login successful',
            token,
            user: { 
                id: user.id, 
                username: user.username, 
                email: user.email, 
                role: user.role,
                org_name: user.org_name,
                organization_id: user.organization_id
            }
        });
    } catch (err) {
        console.error('DEBUG: Auth - Login ERROR:', err.message);
        res.status(500).json({ message: 'Login failed' });
    }
};

const googleCallback = async (req, res) => {
    try {
        const user = req.user;
        const token = jwt.sign(
            { 
                id: user.id, 
                role: user.role || 'Viewer', 
                organization_id: user.organization_id,
                username: user.username, 
                avatar_url: user.avatar_url 
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRY }
        );

        await logAction(user.id, 'USER_LOGIN', { method: 'google' }, req);
        
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const userParam = encodeURIComponent(JSON.stringify({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            avatar_url: user.avatar_url,
            org_name: user.org_name,
            organization_id: user.organization_id
        }));
        
        console.log(`DEBUG: Google Callback - Redirecting to ${frontendUrl}/auth/callback`);
        res.redirect(`${frontendUrl}/auth/callback?token=${token}&user=${userParam}`);
    } catch (err) {
        console.error(err);
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        res.redirect(`${frontendUrl}/login?error=oauth_failed`);
    }
};

module.exports = { register, login, verifyOTP, googleCallback };
