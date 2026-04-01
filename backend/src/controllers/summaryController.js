const pool = require('../config/db');

const getSummary = async (req, res) => {
    try {
        const [incomeResult] = await pool.query('SELECT SUM(amount) as total FROM financial_records WHERE type = "Income"');
        const [expenseResult] = await pool.query('SELECT SUM(amount) as total FROM financial_records WHERE type = "Expense"');
        
        const totalIncome = incomeResult[0].total || 0;
        const totalExpenses = expenseResult[0].total || 0;
        const netBalance = totalIncome - totalExpenses;

        const [categoryTotals] = await pool.query(`
            SELECT category, SUM(amount) as total, type 
            FROM financial_records 
            GROUP BY category, type
        `);

        const [monthlyTrends] = await pool.query(`
            SELECT DATE_FORMAT(date, '%Y-%m') as month, 
                   SUM(CASE WHEN type = "Income" THEN amount ELSE 0 END) as income,
                   SUM(CASE WHEN type = "Expense" THEN amount ELSE 0 END) as expense
            FROM financial_records
            GROUP BY month
            ORDER BY month ASC
        `);

        res.json({
            totalIncome,
            totalExpenses,
            netBalance,
            categoryTotals,
            monthlyTrends
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch summary data' });
    }
};

const getRecentActivity = async (req, res) => {
    try {
        // Fetch last 10 entries directly for simplicity (could also use Kafka consumer)
        const [activities] = await pool.query(`
            SELECT f.*, u.username 
            FROM financial_records f
            JOIN users u ON f.user_id = u.id
            ORDER BY f.created_at DESC
            LIMIT 10
        `);
        res.json(activities);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch recent activity' });
    }
};

module.exports = { getSummary, getRecentActivity };
