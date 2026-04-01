const pool = require('../config/db');
const { logAction } = require('../services/loggerService');

const createRecord = async (req, res) => {
    try {
        const { amount, type, category, date, description } = req.body;
        const [result] = await pool.query(
            'INSERT INTO financial_records (user_id, amount, type, category, date, description) VALUES (?, ?, ?, ?, ?, ?)',
            [req.user.id, amount, type, category, date, description]
        );
        
        await logAction(req.user.id, 'RECORD_CREATED', { record_id: result.insertId, amount, type }, req);

        res.status(201).json({ message: 'Record created', id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to create record' });
    }
};

const getRecords = async (req, res) => {
    try {
        const [records] = await pool.query(`
            SELECT f.*, u.username as owner 
            FROM financial_records f 
            JOIN users u ON f.user_id = u.id 
            ORDER BY f.date DESC
        `);
        res.json(records);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch records' });
    }
};

const updateRecord = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, type, category, date, description } = req.body;
        
        const [old] = await pool.query('SELECT * FROM financial_records WHERE id = ?', [id]);
        
        await pool.query(
            'UPDATE financial_records SET amount=?, type=?, category=?, date=?, description=? WHERE id=?',
            [amount, type, category, date, description, id]
        );
        
        await logAction(req.user.id, 'RECORD_UPDATED', { record_id: id, old: old[0], new: req.body }, req);

        res.json({ message: 'Record updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to update record' });
    }
};

const deleteRecord = async (req, res) => {
    try {
        const { id } = req.params;
        const [old] = await pool.query('SELECT * FROM financial_records WHERE id = ?', [id]);
        
        await pool.query('DELETE FROM financial_records WHERE id = ?', [id]);
        
        await logAction(req.user.id, 'RECORD_DELETED', { record_id: id, state: old[0] }, req);

        res.json({ message: 'Record deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to delete record' });
    }
};

module.exports = { createRecord, getRecords, updateRecord, deleteRecord };
