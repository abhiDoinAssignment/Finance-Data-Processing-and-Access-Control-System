const pool = require('../config/db');

const logAction = async (user_id, action, details = {}, req = null, organization_id = null) => {
    try {
        const ip_address = req ? (req.headers['x-forwarded-for'] || req.socket.remoteAddress) : null;
        const user_agent = req ? req.headers['user-agent'] : null;
        const request_path = req ? req.originalUrl : null;

        const finalOrgId = organization_id || (req && req.user ? req.user.organization_id : null);

        await pool.query(
            'INSERT INTO audit_logs (user_id, organization_id, action, details, ip_address, user_agent, request_path) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [user_id, finalOrgId, action, JSON.stringify(details), ip_address, user_agent, request_path]
        );
    } catch (err) {
        console.error('Logging Error:', err);
    }
};

module.exports = { logAction };
