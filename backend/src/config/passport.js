const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const pool = require('../config/db');
require('dotenv').config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails[0].value;
        const google_id = profile.id;
        const username = profile.displayName;

        // 1. Check if user exists by google_id or email
        let [users] = await pool.query('SELECT * FROM users WHERE google_id = ? OR email = ?', [google_id, email]);

        if (users.length > 0) {
            const user = users[0];
            // Update google_id if it was a manual email registration
            if (!user.google_id) {
                await pool.query('UPDATE users SET google_id = ?, is_verified = TRUE WHERE id = ?', [google_id, user.id]);
            }
            return done(null, { ...user, google_id, is_verified: true });
        }

        // 2. Register new user
        const [roles] = await pool.query('SELECT id FROM roles WHERE name = "Viewer"');
        const [result] = await pool.query(
            'INSERT INTO users (username, email, google_id, is_verified, role_id) VALUES (?, ?, ?, TRUE, ?)',
            [username, email, google_id, roles[0].id]
        );

        const newUser = { id: result.insertId, username, email, role: 'Viewer', is_verified: true };
        done(null, newUser);
    } catch (err) {
        done(err, null);
    }
  }
));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

module.exports = passport;
