const bcrypt = require('bcrypt');
const pool = require('./src/config/db');

async function seed() {
    try {
        console.log('--- SEEDING ROLE-BASED TEST ACCOUNTS ---');
        
        const orgName = 'abc';
        const password = 'Zorvyn2024!';
        const hashedPassword = await bcrypt.hash(password, 12);

        // 1. Find the Organization ID for 'abc'
        const [orgs] = await pool.query('SELECT id FROM organizations WHERE name = ?', [orgName]);
        if (orgs.length === 0) {
            console.error(`ERROR: Organization "${orgName}" not found. Please run seed-abc.js first.`);
            process.exit(1);
        }
        const orgId = orgs[0].id;
        console.log(`Found "${orgName}" Organization ID: ${orgId}`);

        // 2. Define the test users
        const testUsers = [
            { username: 'Zorvyn_Admin',   email: 'admin@abc.com',   role_id: 1 },
            { username: 'Zorvyn_Analyst', email: 'analyst@abc.com', role_id: 2 },
            { username: 'Zorvyn_Viewer',  email: 'viewer@abc.com',  role_id: 3 }
        ];

        for (const user of testUsers) {
            // Check if user exists
            const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [user.email]);
            
            if (existing.length === 0) {
                console.log(`Creating user: ${user.email} (${user.username})...`);
                await pool.query(
                    'INSERT INTO users (username, email, password_hash, role_id, organization_id, is_verified) VALUES (?, ?, ?, ?, ?, TRUE)',
                    [user.username, user.email, hashedPassword, user.role_id, orgId]
                );
            } else {
                console.log(`User already exists: ${user.email}. Updating role/org/password...`);
                await pool.query(
                    'UPDATE users SET username = ?, password_hash = ?, role_id = ?, organization_id = ?, is_verified = TRUE WHERE id = ?',
                    [user.username, hashedPassword, user.role_id, orgId, existing[0].id]
                );
            }
        }

        console.log('\nSUCCESS: All test accounts seeded correctly.');
        console.log('--- CREDENTIALS ---');
        testUsers.forEach(u => console.log(`- ${u.email} / ${password}`));
        
        process.exit(0);
    } catch (err) {
        console.error('SEEDING ERROR:', err.message);
        process.exit(1);
    }
}

seed();
