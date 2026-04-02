const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'backend', '.env') });

const caCert = fs.readFileSync(path.join(__dirname, 'backend', 'certs', 'mysql_ca.pem'), 'utf-8');

async function test() {
    try {
        console.log('Testing connection to:', process.env.DB_HOST);
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            ssl: { ca: caCert, rejectUnauthorized: true }
        });
        console.log('✅ Connection successful!');
        await connection.end();
    } catch (err) {
        console.error('❌ Connection failed:');
        console.error(err);
    }
}

test();
