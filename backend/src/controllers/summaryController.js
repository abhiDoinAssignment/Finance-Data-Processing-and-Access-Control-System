const pool = require('../config/db');

const getSummary = async (req, res) => {
    try {
        const [incomeResult] = await pool.query("SELECT SUM(amount) as total FROM financial_records WHERE type = 'Income' AND organization_id = ?", [req.user.organization_id]);
        const [expenseResult] = await pool.query("SELECT SUM(amount) as total FROM financial_records WHERE type = 'Expense' AND organization_id = ?", [req.user.organization_id]);
        
        const totalIncome = incomeResult[0].total || 0;
        const totalExpenses = expenseResult[0].total || 0;
        const netBalance = totalIncome - totalExpenses;

        const [categoryTotals] = await pool.query(`
            SELECT category, SUM(amount) as total, type 
            FROM financial_records 
            WHERE organization_id = ?
            GROUP BY category, type
            ORDER BY total DESC
        `, [req.user.organization_id]);

        const [monthlyTrends] = await pool.query(`
            SELECT DATE_FORMAT(date, '%b %Y') as month,
                   SUM(CASE WHEN type = 'Income' THEN amount ELSE 0 END) as income,
                   SUM(CASE WHEN type = 'Expense' THEN amount ELSE 0 END) as expense
            FROM financial_records
            WHERE organization_id = ?
            GROUP BY DATE_FORMAT(date, '%Y-%m'), month
            ORDER BY DATE_FORMAT(date, '%Y-%m') ASC
            LIMIT 6
        `, [req.user.organization_id]);

        const [recentActivity] = await pool.query(`
            SELECT id, category, amount, type, date, description
            FROM financial_records 
            WHERE organization_id = ?
            ORDER BY date DESC, created_at DESC
            LIMIT 8
        `, [req.user.organization_id]);

        res.json({
            totalIncome,
            totalExpenses,
            netBalance,
            categoryTotals,
            monthlyTrends,
            recentActivity
        });
    } catch (err) {
        console.error('[Summary] Error fetching dashboard data:', err);
    }
};

const getRecentActivity = async (req, res) => {
    try {
        const [recentActivity] = await pool.query(`
            SELECT id, category, amount, type, date, description
            FROM financial_records 
            WHERE organization_id = ?
            ORDER BY date DESC, created_at DESC
            LIMIT 20
        `, [req.user.organization_id]);

        res.json(recentActivity);
    } catch (err) {
        console.error('[Summary] Error fetching recent activity:', err);
        res.status(500).json({ message: 'Failed to fetch recent activity' });
    }
};

module.exports = { getSummary, getRecentActivity };
