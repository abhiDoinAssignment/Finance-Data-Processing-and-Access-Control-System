const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

console.log('DEBUG: DB Config - Initializing pool at', new Date().toISOString());
console.log('DEBUG: DB Config - Target Host:', process.env.DB_HOST);

// Resolve CA cert: prefer env variable (prod/Render), fall back to file (local dev)
let caCert;
if (process.env.DB_CA_CERT) {
    console.log('DEBUG: DB Config - Using CA cert from environment (Base64 Mode)');
    caCert = Buffer.from(process.env.DB_CA_CERT, 'base64').toString('utf-8');
} else {
    try {
        const certPath = path.resolve(__dirname, '../../certs/mysql_ca.pem');
        console.log('DEBUG: DB Config - Reading CA file from', certPath);
        caCert = fs.readFileSync(certPath);
    } catch (err) {
        console.error('DEBUG: DB Config - FAILED to read CA file:', err.message);
    }
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

// Test immediate connection
pool.getConnection()
    .then(conn => {
        console.log('DEBUG: DB Config - Successfully connected to MySQL instance');
        conn.release();
    })
    .catch(err => {
        console.error('DEBUG: DB Config - Connection ERROR:', err.message);
        console.error('DEBUG: DB Config - Error Code:', err.code);
    });

module.exports = pool;
