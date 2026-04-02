const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const pool = require('./src/config/db');
const passport = require('./src/config/passport');
const rateLimit = require('express-rate-limit');
const apiRoutes = require('./src/routes/api');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ── Session Store Configuration ──────────────────────────────────────────────
const sessionStore = new MySQLStore({
    clearExpired: true,
    checkExpirationInterval: 900000, // 15 min
    expiration: 86400000,            // 24h
    createDatabaseTable: true,       // Auto-create 'sessions' table
}, pool);

// Security Middleware
app.use(helmet()); // Sets critical security headers
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json({ limit: '10kb' })); // Body limit to prevent DOS

// Global Rate Limiting
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    message: { message: 'Too many requests from this IP, please try again after 15 minutes' }
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5, 
    message: { message: 'Too many authentication attempts, please try again later' }
});

app.use('/api/', globalLimiter);
app.use('/api/auth/', authLimiter);

// Session for Passport OAuth
app.use(session({
    key: 'zorvyn_session',
    secret: process.env.JWT_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000
    }
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api', apiRoutes);

// Health Check — excluded from rate limiter, safe to ping externally
app.get('/health', async (req, res) => {
    try {
        const pool = require('./src/config/db');
        await pool.query('SELECT 1');
        res.status(200).json({
            status: 'OK',
            service: 'Zorvyn Finance API',
            database: 'connected',
            timestamp: new Date().toISOString(),
            uptime: `${Math.floor(process.uptime())}s`
        });
    } catch (err) {
        res.status(503).json({
            status: 'DEGRADED',
            service: 'Zorvyn Finance API',
            database: 'unreachable',
            timestamp: new Date().toISOString()
        });
    }
});

// Centralized Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { error: err.message })
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Finance Backend Service [Secure] running on port ${PORT}`);
});
