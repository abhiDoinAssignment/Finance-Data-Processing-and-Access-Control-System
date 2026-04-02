const mysql = require('mysql2/promise');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

async function seed() {
    let conn;
    try {
        const ca = fs.readFileSync(path.resolve(__dirname, './certs/mysql_ca.pem'));
        conn = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            ssl: { ca },
            connectTimeout: 60000
        });

        console.log('Seeding "abc" organization...');

        // 1. Ensure Org exists
        let [orgs] = await conn.query('SELECT id FROM organizations WHERE name = ?', ['abc']);
        let orgId;
        if (orgs.length === 0) {
            const [r] = await conn.query('INSERT INTO organizations (name, slug) VALUES (?, ?)', ['abc', 'abc']);
            orgId = r.insertId;
            console.log('Created Org "abc" with ID:', orgId);
        } else {
            orgId = orgs[0].id;
            console.log('Found Org "abc" with ID:', orgId);
        }

        // 2. Link first user to this org
        let [users] = await conn.query('SELECT id FROM users LIMIT 1');
        if (users.length === 0) throw new Error('No users found to link');
        const userId = users[0].id;
        await conn.query('UPDATE users SET organization_id = ? WHERE id = ?', [orgId, userId]);
        console.log(`Linked user ${userId} to org ${orgId}`);

        // 3. Add Records
        const date = '2024-04-02';
        const records = [
            [5000, 'Income', 'Consulting', date, 'Quarterly Sales'],
            [1200, 'Expense', 'Infrastructure', date, 'AWS Hosting'],
            [2500, 'Income', 'Retainer', date, 'New Client Deposit']
        ];
        
        console.log('Inserting records...');
        for (const [a, ty, cat, dt, d] of records) {
            try {
                await conn.query(
                    'INSERT INTO financial_records (amount, type, category, date, description, organization_id, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [a, ty, cat, dt, d, orgId, userId]
                );
            } catch (e) {
                console.error(`Failed to insert record: ${e.message}`);
                console.log('Attempting with fallback characters (I/E)...');
                await conn.query(
                    'INSERT INTO financial_records (amount, type, category, date, description, organization_id, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [a, ty[0], cat, dt, d, orgId, userId]
                );
            }
        }

        console.log('Seeding complete.');
    } catch (err) {
        console.error('Seeding error:', err.message);
    } finally {
        if (conn) await conn.end();
        process.exit(0);
    }
}

seed();
