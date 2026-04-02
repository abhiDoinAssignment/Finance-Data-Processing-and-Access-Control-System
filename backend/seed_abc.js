const mysql = require('mysql2/promise');
require('dotenv').config();
const fs = require('fs');

async function seedABC() {
    const ca = fs.readFileSync(process.env.DB_CA_PATH || './certs/mysql_ca.pem');
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: { ca }
    });

    try {
        console.log('--- Seeding Organization "abc" ---');

        // 1. Get or Create Org
        let [orgs] = await pool.query('SELECT id FROM organizations WHERE name = ?', ['abc']);
        let orgId;
        if (orgs.length === 0) {
            console.log('Creating organization "abc"...');
            const [res] = await pool.query('INSERT INTO organizations (name, slug) VALUES (?, ?)', ['abc', 'abc']);
            orgId = res.insertId;
        } else {
            orgId = orgs[0].id;
            console.log(`Organization "abc" exists with ID: ${orgId}`);
        }

        // 2. Get User
        let [users] = await pool.query('SELECT id FROM users WHERE organization_id = ? LIMIT 1', [orgId]);
        let userId;
        if (users.length === 0) {
            console.log('No user found for "abc". Checking for global user to assign...');
            let [globalUsers] = await pool.query('SELECT id FROM users LIMIT 1');
            userId = globalUsers[0].id;
            await pool.query('UPDATE users SET organization_id = ? WHERE id = ?', [orgId, userId]);
            console.log(`Assigned User ID ${userId} to "abc".`);
        } else {
            userId = users[0].id;
            console.log(`Found User ID: ${userId} for "abc".`);
        }

        // 3. Add Sample Records
        const records = [
            ['Quarterly Revenue - Sales', 5000.00, 'INFLOW', 'Completed', 'Sales revenue for Q1'],
            ['AWS Infrastructure Bill', 1200.50, 'OUTFLOW', 'Completed', 'Monthly server costs'],
            ['Marketing Campaign', 3000.00, 'OUTFLOW', 'Pending', 'Social media ads'],
            ['New Client Retainer', 2500.00, 'INFLOW', 'Completed', 'Consulting deposit']
        ];

        console.log(`Inserting ${records.length} sample records...`);
        for (const [title, amount, type, status, description] of records) {
            const [res] = await pool.query(
                'INSERT INTO financial_records (organization_id, user_id, title, amount, type, status, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [orgId, userId, title, amount, type, status, description]
            );

            // 4. Add Audit Logs
            await pool.query(
                'INSERT INTO audit_logs (organization_id, user_id, action, details) VALUES (?, ?, ?, ?)',
                [orgId, userId, 'RECORD_CREATED', JSON.stringify({ recordId: res.insertId, title, system: 'seeder' })]
            );
        }

        console.log('--- Seeding Complete ---');

    } catch (err) {
        console.error('Error seeding data:', err);
    } finally {
        await pool.end();
    }
}

seedABC();
