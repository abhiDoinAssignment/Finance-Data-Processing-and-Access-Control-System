const bcrypt = require('bcrypt');
const pool = require('./src/config/db');

async function seed() {
    try {
        console.log('--- SEEDING SAMPLE DATA FOR "abc" ORGANIZATION ---');
        
        // 1. Ensure "abc" organization exists
        const [orgs] = await pool.query('SELECT id FROM organizations WHERE name = ?', ['abc']);
        let orgId;
        if (orgs.length === 0) {
            const [r] = await pool.query('INSERT INTO organizations (name, slug) VALUES (?, ?)', ['abc', 'abc']);
            orgId = r.insertId;
            console.log('Created Org "abc" with ID:', orgId);
        } else {
            orgId = orgs[0].id;
            console.log('Found Org "abc" with ID:', orgId);
        }

        // 2. Ensure test users exist (Admin, Analyst, Viewer)
        const password = 'Zorvyn2024!';
        const hashedPassword = await bcrypt.hash(password, 12);
        const testUsers = [
            { username: 'Zorvyn_Admin',   email: 'admin@abc.com',   role_id: 1 },
            { username: 'Zorvyn_Analyst', email: 'analyst@abc.com', role_id: 2 },
            { username: 'Zorvyn_Viewer',  email: 'viewer@abc.com',  role_id: 3 }
        ];

        let adminUserId;
        for (const user of testUsers) {
            const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [user.email]);
            if (existing.length === 0) {
                const [r] = await pool.query(
                    'INSERT INTO users (username, email, password_hash, role_id, organization_id, is_verified) VALUES (?, ?, ?, ?, ?, TRUE)',
                    [user.username, user.email, hashedPassword, user.role_id, orgId]
                );
                if (user.role_id === 1) adminUserId = r.insertId;
                console.log(`Created user: ${user.email}`);
            } else {
                if (user.role_id === 1) adminUserId = existing[0].id;
                console.log(`User exists: ${user.email}`);
            }
        }

        // 3. Clear existing sample records for "abc" to ensure a clean state
        console.log('Cleaning up old financial records for "abc"...');
        await pool.query('DELETE FROM financial_records WHERE organization_id = ?', [orgId]);

        // 4. Generate 4 Months of Data (Jan, Feb, Mar, Apr 2024)
        console.log('Generating 4 months of financial data...');
        const categories = {
            'Income': ['Consulting', 'Software License', 'Cloud Managed Services', 'Retainer'],
            'Expense': ['Infrastructure', 'Office Rent', 'Security Audit', 'Employee Benefits', 'Marketing']
        };

        const records = [];
        const baseIncome = 8500;
        const baseExpense = 4200;

        for (let month = 0; month < 4; month++) {
            const dateStr = `2024-0${month + 1}-15`;
            
            // Add Income records (varied)
            records.push([baseIncome + (month * 500), 'Income', categories.Income[0], dateStr, `Project Alpha (Milestone ${month + 1})`]);
            records.push([1200 + (month * 100), 'Income', categories.Income[1], dateStr, 'Monthly Subscription Fees']);
            
            // Add Expense records (varied)
            records.push([baseExpense + (month * 200), 'Expense', categories.Expense[0], dateStr, 'AWS/GCP Consumption']);
            records.push([800, 'Expense', categories.Expense[2], dateStr, 'Monthly Security Compliance']);
            records.push([1500, 'Expense', categories.Expense[1], dateStr, 'HQ Office Maintenance']);
        }

        console.log(`Inserting ${records.length} records...`);
        for (const [amount, type, category, date, description] of records) {
            await pool.query(
                'INSERT INTO financial_records (amount, type, category, date, description, organization_id, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [amount, type, category, date, description, orgId, adminUserId]
            );
        }

        console.log('\n--- SEEDING COMPLETE ---');
        console.log('Test Accounts (Password: Zorvyn2024!):');
        testUsers.forEach(u => console.log(`- ${u.email}`));
        
        process.exit(0);
    } catch (err) {
        console.error('SEEDING ERROR:', err.message);
        process.exit(1);
    }
}

seed();
