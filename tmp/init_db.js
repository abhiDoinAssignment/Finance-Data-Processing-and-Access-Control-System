require('dotenv').config({ path: './backend/.env' });
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function initDB() {
    const caCert = fs.readFileSync(path.resolve(__dirname, './backend/certs/mysql_ca.pem'), 'utf-8');

    // 1. Initial connection to existing defaultdb to create the new one
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: 'defaultdb',
        ssl: {
            ca: caCert,
            rejectUnauthorized: true
        }
    });

    console.log('Connected to MySQL. Creating new database...');

    try {
        // 2. Create the new database
        await connection.query('CREATE DATABASE IF NOT EXISTS zorvyn_finance');
        console.log('Database "zorvyn_finance" created or already exists.');

        // 3. Switch to the new database
        await connection.query('USE zorvyn_finance');

        // 4. Create Tables
        console.log('Creating tables...');

        // Roles table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS roles (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(50) NOT NULL UNIQUE
            )
        `);

        // Users table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL UNIQUE,
                password_hash VARCHAR(255) NOT NULL,
                role_id INT,
                status ENUM('Active', 'Inactive') DEFAULT 'Active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (role_id) REFERENCES roles(id)
            )
        `);

        // Financial Records table
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

        // 5. Seed Roles
        const [roles] = await connection.query('SELECT * FROM roles');
        if (roles.length === 0) {
            console.log('Seeding roles...');
            await connection.query("INSERT INTO roles (name) VALUES ('Admin'), ('Analyst'), ('Viewer')");
        }

        console.log('Initialization complete.');

    } catch (error) {
        console.error('Error during initialization:', error);
    } finally {
        await connection.end();
    }
}

initDB();
