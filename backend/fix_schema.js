const mysql = require('mysql2/promise');
require('dotenv').config();
const fs = require('fs');

(async () => {
    let conn;
    try {
        const ca = fs.readFileSync(process.env.DB_CA_PATH || './certs/mysql_ca.pem');
        conn = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            ssl: { ca }
        });

        console.log('--- financial_records table ---');
        const [fields] = await conn.query('DESCRIBE financial_records');
        console.table(fields);

        console.log('--- audit_logs table ---');
        const [auditFields] = await conn.query('DESCRIBE audit_logs');
        console.table(auditFields);

        // Actual fix for truncation
        console.log('Applying fixes...');
        await conn.query('ALTER TABLE audit_logs MODIFY request_path TEXT');
        await conn.query('ALTER TABLE financial_records MODIFY type VARCHAR(50)');
        await conn.query('ALTER TABLE financial_records MODIFY category VARCHAR(100)');
        await conn.query('ALTER TABLE financial_records MODIFY description TEXT');
        console.log('Fixes applied successfully.');

    } catch (e) {
        console.error('Error:', e.message);
    } finally {
        if (conn) await conn.end();
        process.exit(0);
    }
})();
