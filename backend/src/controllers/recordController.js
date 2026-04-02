const pool = require('../config/db');
const { logAction } = require('../services/loggerService');

const createRecord = async (req, res) => {
    try {
        const { amount, type, category, date, description } = req.body;
        const [result] = await pool.query(
            'INSERT INTO financial_records (user_id, organization_id, amount, type, category, date, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [req.user.id, req.user.organization_id, amount, type, category, date, description]
        );
        
        await logAction(req.user.id, 'RECORD_CREATED', { record_id: result.insertId, amount, type }, req, req.user.organization_id);

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
            WHERE f.organization_id = ?
            ORDER BY f.date DESC
        `, [req.user.organization_id]);
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
        
        const [old] = await pool.query('SELECT * FROM financial_records WHERE id = ? AND organization_id = ?', [id, req.user.organization_id]);
        if (old.length === 0) return res.status(404).json({ message: 'Record not found in your organization' });
        
        await pool.query(
            'UPDATE financial_records SET amount=?, type=?, category=?, date=?, description=? WHERE id=? AND organization_id=?',
            [amount, type, category, date, description, id, req.user.organization_id]
        );
        
        await logAction(req.user.id, 'RECORD_UPDATED', { record_id: id, old: old[0], new: req.body }, req, req.user.organization_id);

        res.json({ message: 'Record updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to update record' });
    }
};

const deleteRecord = async (req, res) => {
    try {
        const { id } = req.params;
        const [old] = await pool.query('SELECT * FROM financial_records WHERE id = ? AND organization_id = ?', [id, req.user.organization_id]);
        if (old.length === 0) return res.status(404).json({ message: 'Record not found in your organization' });
        
        await pool.query('DELETE FROM financial_records WHERE id = ? AND organization_id = ?', [id, req.user.organization_id]);
        
        await logAction(req.user.id, 'RECORD_DELETED', { record_id: id, state: old[0] }, req, req.user.organization_id);

        res.json({ message: 'Record deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to delete record' });
    }
};

module.exports = { createRecord, getRecords, updateRecord, deleteRecord };
