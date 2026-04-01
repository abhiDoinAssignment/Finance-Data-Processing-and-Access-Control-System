const pool = require('../config/db');

const logAction = async (user_id, action, details = {}) => {
    try {
        await pool.query(
            'INSERT INTO audit_logs (user_id, action, details) VALUES (?, ?, ?)',
            [user_id, action, JSON.stringify(details)]
        );
    } catch (err) {
        console.error('Logging Error:', err);
    }
};

module.exports = { logAction };
