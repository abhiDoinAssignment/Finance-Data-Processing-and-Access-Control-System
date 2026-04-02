const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const caCert = fs.readFileSync(path.join(__dirname, 'certs', 'mysql_ca.pem'), 'utf-8');

async function seed() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: 'zorvyn_finance',
        ssl: { ca: caCert, rejectUnauthorized: true }
    });

    console.log('🚀 Seeding realistic financial data...');

    // User ID 2 (Abhi)
    const userId = 2;

    // Clear existing records for this user (Optional, but helps with clean visuals)
    await connection.query('DELETE FROM financial_records WHERE user_id = ?', [userId]);

    const records = [];
    const now = new Date();
    
    // October 2025 – March 2026 (6 months)
    for (let i = 5; i >= 0; i--) {
        const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthStr = monthDate.toISOString().slice(0, 7); // YYYY-MM

        // 1. Monthly Salary (Income)
        records.push([userId, 'Salary', 58000, 'Income', `${monthStr}-01`, `Monthly Salary for ${monthStr}`]);

        // 2. Freelance / Bonus (Occasional Income)
        if (i % 2 === 0) {
            records.push([userId, 'Freelance', 12500, 'Income', `${monthStr}-15`, 'Side project payment']);
        }

        // 3. Fixed Expenses
        records.push([userId, 'Rent', 16500, 'Expense', `${monthStr}-05`, 'Monthly House Rent']);
        records.push([userId, 'Utilities', 3200, 'Expense', `${monthStr}-10`, 'Electricity & Water']);
        records.push([userId, 'Insurance', 4500, 'Expense', `${monthStr}-02`, 'Health Insurance Premium']);

        // 4. Variable Expenses (Food, etc)
        const categories = ['Food', 'Shopping', 'Entertainment', 'Transport'];
        const numEvents = 5 + Math.floor(Math.random() * 5);
        
        for (let j = 0; j < numEvents; j++) {
            const cat = categories[Math.floor(Math.random() * categories.length)];
            const day = 2 + Math.floor(Math.random() * 26);
            const amt = 500 + Math.floor(Math.random() * 3500);
            records.push([userId, cat, amt, 'Expense', `${monthStr}-${day.toString().padStart(2, '0')}`, `Payment for ${cat}`]);
        }
    }

    const query = 'INSERT INTO financial_records (user_id, category, amount, type, date, description) VALUES ?';
    await connection.query(query, [records]);

    console.log(`✅ Seeded ${records.length} records successfully!`);
    process.exit();
}

seed().catch(err => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
});
