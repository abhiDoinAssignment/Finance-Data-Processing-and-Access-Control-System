const express = require('express');
const router = express.Router();
const passport = require('passport');
const { authenticate } = require('../middleware/auth');
const { checkRole } = require('../middleware/rbac');
const validate = require('../middleware/validationMiddleware');
const { registerSchema, loginSchema, verifyOTPSchema } = require('../schemas/authSchemas');
const { recordSchema, updateRecordSchema } = require('../schemas/recordSchemas');

const { register, login, verifyOTP, googleCallback } = require('../controllers/authController');
const { createRecord, getRecords, updateRecord, deleteRecord } = require('../controllers/recordController');
const { getSummary, getRecentActivity } = require('../controllers/summaryController');

// Auth Routes
router.post('/auth/register', validate(registerSchema), register);
router.post('/auth/verify-otp', validate(verifyOTPSchema), verifyOTP);
router.post('/auth/login', validate(loginSchema), login);

// Google OAuth
router.get('/auth/google', (req, res, next) => {
    const role = req.query.role || 'Viewer';
    const org = req.query.organization_name || 'Zorvyn Global';
    req.session.signupRole = role;
    req.session.organizationName = org;
    
    // Flag to indicate this is a signup attempt
    if (req.query.signup === 'true') {
        req.session.isSignupProcess = true;
    } else {
        delete req.session.isSignupProcess;
    }
    
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

router.get('/auth/google/callback', (req, res, next) => {
    passport.authenticate('google', (err, user, info) => {
        if (err) return next(err);
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        
        if (!user) {
            // Handle specific errors like 'Account already exists'
            if (info && info.message === 'Account already exists') {
                return res.redirect(`${frontendUrl}/register?error=account_exists`);
            }
            return res.redirect(`${frontendUrl}/login?error=oauth_failed`);
        }
        
        req.logIn(user, (err) => {
            if (err) return next(err);
            return googleCallback(req, res);
        });
    })(req, res, next);
});

// Financial Records Routes
router.get('/records', authenticate, checkRole(['Admin', 'Analyst', 'Viewer']), getRecords);
router.post('/records', authenticate, checkRole(['Admin']), validate(recordSchema), createRecord);
router.put('/records/:id', authenticate, checkRole(['Admin']), validate(updateRecordSchema), updateRecord);
router.delete('/records/:id', authenticate, checkRole(['Admin']), deleteRecord);

// Dashboard Summary Routes
router.get('/dashboard/summary', authenticate, checkRole(['Admin', 'Analyst']), getSummary);
router.get('/dashboard/activity', authenticate, checkRole(['Admin', 'Analyst']), getRecentActivity);

// Admin Routes (New Logs)
router.get('/admin/logs', authenticate, checkRole(['Admin']), async (req, res) => {
    const pool = require('../config/db');
    try {
        const [logs] = await pool.query(`
            SELECT l.*, u.username as user 
            FROM audit_logs l 
            LEFT JOIN users u ON l.user_id = u.id 
            WHERE l.organization_id = ?
            ORDER BY l.created_at DESC 
            LIMIT 100
        `, [req.user.organization_id]);
        res.json(logs);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch logs' });
    }
});

module.exports = router;
