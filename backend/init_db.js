require('dotenv').config({ path: '../.env' });
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function initDB() {
    const caCertPath = path.resolve(__dirname, './certs/mysql_ca.pem');
    const caCert = fs.readFileSync(caCertPath, 'utf-8');

    const config = {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: 'defaultdb',
        ssl: {
            ca: caCert,
            rejectUnauthorized: true
        }
    };

    console.log('Connecting to Aiven MySQL (defaultdb) to create "zorvyn_finance"...');

    const connection = await mysql.createConnection(config);

    try {
        await connection.query('CREATE DATABASE IF NOT EXISTS zorvyn_finance');
        console.log('Database "zorvyn_finance" created.');

        await connection.query('USE zorvyn_finance');

        console.log('Initializing tables...');
        
        await connection.query(`
            CREATE TABLE IF NOT EXISTS roles (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(50) NOT NULL UNIQUE
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL UNIQUE,
                password_hash VARCHAR(255),
                google_id VARCHAR(255) UNIQUE,
                is_verified BOOLEAN DEFAULT FALSE,
                role_id INT,
                status ENUM('Active', 'Inactive') DEFAULT 'Active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (role_id) REFERENCES roles(id)
            )
        `);

        // OTPs table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS otps (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                otp_code VARCHAR(6) NOT NULL,
                expires_at TIMESTAMP NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        `);

        // Audit Logs table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS audit_logs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                action VARCHAR(100) NOT NULL,
                details JSON,
                ip_address VARCHAR(45),
                user_agent TEXT,
                request_path VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS financial_records (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                amount DECIMAL(15, 2) NOT NULL,
                type ENUM('Income', 'Expense') NOT NULL,
                category VARCHAR(100) NOT NULL,
                date DATE NOT NULL,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        `);

        const [roles] = await connection.query('SELECT * FROM roles');
        if (roles.length === 0) {
            console.log('Seeding roles: Admin, Analyst, Viewer');
            await connection.query("INSERT INTO roles (name) VALUES ('Admin'), ('Analyst'), ('Viewer')");
        }

        console.log('SUCCESS: Database and tables are ready.');
    } catch (err) {
        console.error('FAILED to initialize database:', err);
    } finally {
        await connection.end();
    }
}

initDB();
