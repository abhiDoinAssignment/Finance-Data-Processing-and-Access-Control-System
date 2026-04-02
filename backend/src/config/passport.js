const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const pool = require('../config/db');
require('dotenv').config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback: true
  },
  async (req, accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails[0].value;
        const google_id = profile.id;
        const username = profile.displayName;
        const avatar_url = profile.photos && profile.photos[0] ? profile.photos[0].value : null;

        // 1. Check if user exists by google_id or email
        let [users] = await pool.query(`
            SELECT u.*, r.name as role 
            FROM users u 
            JOIN roles r ON u.role_id = r.id 
            WHERE u.google_id = ? OR u.email = ?
        `, [google_id, email]);

        const signupRole = req.session.signupRole || 'Viewer';
        const signupOrg = req.session.organizationName || 'Zorvyn Global';

        const [roles] = await pool.query('SELECT id FROM roles WHERE name = ?', [signupRole]);
        const roleId = roles.length > 0 ? roles[0].id : 3;

        // --- Multi-Tenancy: Org Creation/Lookup ---
        const orgSlug = signupOrg.toLowerCase().replace(/\s+/g, '-');
        const [orgs] = await pool.query('SELECT id FROM organizations WHERE name = ?', [signupOrg]);
        let orgId;
        if (orgs.length === 0) {
            const [result] = await pool.query('INSERT INTO organizations (name, slug) VALUES (?, ?)', [signupOrg, orgSlug]);
            orgId = result.insertId;
        } else {
            orgId = orgs[0].id;
        }

        if (users.length > 0) {
            const user = users[0];
            
            // If the user requested 'registration' but already exists
            if (req.session.isSignupProcess) {
                console.log(`DEBUG: Google Strategy - Registration failed (Account exists): ${email}`);
                // Clear the session flag and return an error
                delete req.session.isSignupProcess;
                return done(null, false, { message: 'Account already exists' });
            }

            // Normal login flow
            await pool.query(
                'UPDATE users SET google_id = ?, username = ?, avatar_url = ?, is_verified = TRUE WHERE id = ?', 
                [google_id, username, avatar_url, user.id]
            );
            return done(null, { ...user, username, avatar_url, is_verified: true });
        }

        // 2. Register new user
        const [result] = await pool.query(
            'INSERT INTO users (username, email, google_id, avatar_url, is_verified, role_id, organization_id) VALUES (?, ?, ?, ?, TRUE, ?, ?)',
            [username, email, google_id, avatar_url, roleId, orgId]
        );

        const newUser = { id: result.insertId, username, email, role: signupRole, organization_id: orgId, avatar_url, is_verified: true };
        done(null, newUser);
    } catch (err) {
        done(err, null);
    }
  }
));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

module.exports = passport;
