const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const caCertPath = path.resolve(__dirname, 'certs', 'mysql_ca.pem');
let caCert;
try {
    caCert = fs.readFileSync(caCertPath, 'utf-8');
    console.log('✅ Loaded CA certificate from:', caCertPath);
} catch (err) {
    console.error('❌ Failed to load CA certificate:', err.message);
    process.exit(1);
}

async function migrate() {
    console.log('DEBUG: Connecting to', process.env.DB_HOST);
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || 'zorvyn_finance',
        ssl: { ca: caCert, rejectUnauthorized: true }
    });

    console.log('🚀 Migrating to Multi-Tenancy...');

    try {
        // 1. Create organizations table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS organizations (
                id INT AUTO_INCREMENT PRIMARY KEY, 
                name VARCHAR(100) NOT NULL, 
                slug VARCHAR(100) UNIQUE, 
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Organizations table created.');

        // 2. Add organization_id to users
        try {
            await connection.query('ALTER TABLE users ADD COLUMN organization_id INT');
            await connection.query('ALTER TABLE users ADD FOREIGN KEY (organization_id) REFERENCES organizations(id)');
            console.log('✅ Added organization_id to users.');
        } catch (e) {
            console.log('ℹ️ organization_id already exists in users or error occurred.');
        }

        // 3. Add organization_id to financial_records
        try {
            await connection.query('ALTER TABLE financial_records ADD COLUMN organization_id INT');
            await connection.query('ALTER TABLE financial_records ADD FOREIGN KEY (organization_id) REFERENCES organizations(id)');
            console.log('✅ Added organization_id to financial_records.');
        } catch (e) {
             console.log('ℹ️ organization_id already exists in financial_records or error occurred.');
        }

        // 4. Add organization_id to audit_logs
        try {
            await connection.query('ALTER TABLE audit_logs ADD COLUMN organization_id INT');
            await connection.query('ALTER TABLE audit_logs ADD FOREIGN KEY (organization_id) REFERENCES organizations(id)');
            console.log('✅ Added organization_id to audit_logs.');
        } catch (e) {
             console.log('ℹ️ organization_id already exists in audit_logs or error occurred.');
        }

        // 5. Seed default organization
        const [orgs] = await connection.query("SELECT id FROM organizations WHERE name = 'Zorvyn Global'");
        let orgId;
        if (orgs.length === 0) {
            const [result] = await connection.query("INSERT INTO organizations (name, slug) VALUES ('Zorvyn Global', 'zorvyn-global')");
            orgId = result.insertId;
            console.log('✅ Created default organization: Zorvyn Global');
        } else {
            orgId = orgs[0].id;
        }

        // 6. Migrate existing data to default org
        await connection.query('UPDATE users SET organization_id = ? WHERE organization_id IS NULL', [orgId]);
        await connection.query('UPDATE financial_records SET organization_id = ? WHERE organization_id IS NULL', [orgId]);
        await connection.query('UPDATE audit_logs SET organization_id = ? WHERE organization_id IS NULL', [orgId]);
        console.log('✅ Existing records linked to Zorvyn Global.');

        console.log('🎉 Migration successful!');
    } catch (err) {
        console.error('❌ Migration failed:', err.message);
    } finally {
        await connection.end();
        process.exit();
    }
}

migrate();
