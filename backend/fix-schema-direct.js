const mysql = require('mysql2/promise');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

async function runFix() {
    const ca = fs.readFileSync(path.resolve(__dirname, './certs/mysql_ca.pem'));
    const config = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: { ca },
        connectTimeout: 60000 // 60s
    };

    let conn;
    try {
        console.log('Connecting for schema fix...');
        conn = await mysql.createConnection(config);
        
        const queries = [
            'ALTER TABLE audit_logs MODIFY request_path TEXT',
            'ALTER TABLE financial_records MODIFY type VARCHAR(50)',
            'ALTER TABLE financial_records MODIFY category VARCHAR(100)',
            'ALTER TABLE financial_records MODIFY description TEXT'
        ];

        for (const q of queries) {
            console.log('Executing:', q);
            await conn.query(q);
            console.log('Done.');
        }

        console.log('Schema fixed successfully.');
    } catch (err) {
        console.error('Error during schema fix:', err.message);
    } finally {
        if (conn) await conn.end();
    }
}

runFix();
