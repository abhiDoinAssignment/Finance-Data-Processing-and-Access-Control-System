const jwt = require('jsonwebtoken');
const pool = require('../config/db');
require('dotenv').config();

const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Authorization token missing' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const [users] = await pool.query(`
            SELECT u.id, u.username, u.email, u.status, r.name as role 
            FROM users u 
            JOIN roles r ON u.role_id = r.id 
            WHERE u.id = ? AND u.status = 'Active'
        `, [decoded.id]);

        if (users.length === 0) {
            return res.status(401).json({ message: 'User not found or inactive' });
        }

        req.user = users[0];
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = { authenticate };
