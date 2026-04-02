const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const session = require('express-session');
const passport = require('./src/config/passport');
const rateLimit = require('express-rate-limit');
const apiRoutes = require('./src/routes/api');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "img-src": ["'self'", "data:", "https://*.googleusercontent.com"],
            "script-src": ["'self'"],
            "connect-src": ["'self'"]
        }
    }
})); // Sets security headers with custom CSP for local dev
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
    max: 20, // Increased from 5 to 20
    message: { message: 'Too many authentication attempts, please try again later' }
});

app.use('/api/', globalLimiter);
app.use('/api/auth/', authLimiter);

// Session for Passport OAuth
app.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'lax',
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
        const start = Date.now();
        await pool.query('SELECT 1');
        const ping = Date.now() - start;
        
        let dbUptimeRaw = null;
        try {
            // Fetch DB Uptime
            const [rows] = await pool.query("SHOW GLOBAL STATUS LIKE 'Uptime'");
            dbUptimeRaw = rows[0]?.Value;
        } catch (dbErr) {
            console.warn('DEBUG: Health Check - Could not fetch DB uptime:', dbErr.message);
        }

        const serverUptimeSec = Math.floor(process.uptime());

        res.status(200).json({
            status: 'OK',
            service: 'Zorvyn Finance API',
            database: {
                status: 'connected',
                ping: `${ping}ms`,
                uptime: dbUptimeRaw ? `${dbUptimeRaw}s` : null
            },
            timestamp: new Date().toISOString(),
            serverUptime: `${serverUptimeSec}s`,
            node_env: process.env.NODE_ENV || 'development'
        });
    } catch (err) {
        console.error('DEBUG: Health Check ERROR:', err.message);
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
    console.log(`DEBUG: Frontend URL configured as: ${process.env.FRONTEND_URL || 'UNDEFINED'}`);
});
