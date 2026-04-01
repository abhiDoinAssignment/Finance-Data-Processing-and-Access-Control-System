const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Resolve CA cert: prefer env variable (prod/Render), fall back to file (local dev)
let caCert;
if (process.env.DB_CA_CERT) {
    // On Render: store the base64-encoded cert as DB_CA_CERT env var
    caCert = Buffer.from(process.env.DB_CA_CERT, 'base64').toString('utf-8');
} else {
    // Local dev: read from file
    caCert = fs.readFileSync(path.resolve(__dirname, '../../certs/mysql_ca.pem'));
}

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        ca: caCert,
        rejectUnauthorized: true
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;
