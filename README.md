# Zorvyn Finance — Data Processing & Access Control System

A full-stack, security-hardened finance portal built as an internship assignment. It demonstrates enterprise-grade API architecture with granular role-based access control (RBAC), audit logging, and a modern React dashboard.

---

## Features

### Authentication & Identity
- **Email/Password Registration** — Passwords hashed with bcrypt (cost factor 12); accounts start unverified
- **OTP Email Verification** — 6-digit one-time code sent via [Resend](https://resend.com), valid for 10 minutes; account is activated only after successful verification
- **JWT Login** — Issues a signed JWT on successful credential check; token carries user ID and role
- **Google OAuth 2.0** — Passport.js strategy; new Google users are auto-provisioned with the Viewer role
- **Token-First Auth Middleware** — Every protected route re-validates the token AND re-queries the DB to confirm the user is still `Active`

### Role-Based Access Control (RBAC)
Three roles with explicit permission enforcement on every route:

| Role    | Records (Read) | Records (Write/Edit/Delete) | Dashboard Summary | Audit Logs |
|---------|:--------------:|:--------------------------:|:-----------------:|:----------:|
| Admin   | ✅             | ✅                          | ✅                | ✅          |
| Analyst | ✅             | ❌                          | ✅                | ❌          |
| Viewer  | ✅             | ❌                          | ❌                | ❌          |

### Financial Records
- **Create** — Amount, type (Income/Expense), category, date, description; Admin only
- **Read** — Full record list joined with owner username; available to all authenticated roles
- **Update** — Full field replacement with old-state snapshot logged; Admin only
- **Delete** — Soft-capture of deleted state in audit log before removal; Admin only

### Dashboard Analytics
- **Summary endpoint** — Aggregates total income, total expenses, net balance, monthly trends, and category totals
- **Recent Activity endpoint** — Latest financial events for the activity feed
- Visual charts rendered client-side with Recharts (Area chart for monthly trends, Bar chart for category breakdown)

### Audit Logging
Every significant action is written to an `audit_logs` table with:
- `user_id`, `action` (e.g. `USER_LOGIN`, `RECORD_CREATED`, `RECORD_DELETED`)
- `details` — JSON snapshot of the operation payload/state
- `ip_address`, `user_agent`, `request_path` — full request context
- Admin-only `/api/admin/logs` endpoint returns the 100 most recent entries joined with usernames

### Security Hardening
- **Helmet** — Sets `X-Content-Type-Options`, `X-Frame-Options`, CSP, HSTS, and other security headers
- **CORS** — Locked to a configurable origin (default: `localhost:5173`)
- **Rate Limiting** — Global: 100 req / 15 min per IP; Auth routes: 5 req / 15 min per IP
- **Body size cap** — `express.json({ limit: '10kb' })` to prevent payload-based DoS
- **Joi Validation** — All input validated against strict schemas before reaching controllers
- **Secure session cookies** — `httpOnly: true`, `sameSite: strict`, `secure: true` in production
- **Health Check** — `GET /health` endpoint pings the DB and returns uptime; excluded from rate limiting

---

## Tech Stack

### Backend
| Layer | Technology |
|-------|-----------|
| Runtime | Node.js (CommonJS) |
| Framework | Express.js v5 |
| Database | MySQL 2 (Aiven Cloud) |
| Auth | JWT (`jsonwebtoken`), Passport.js (Google OAuth) |
| Password | bcrypt |
| Validation | Joi |
| Email | Resend API |
| Security | Helmet, express-rate-limit, express-session |
| Env | dotenv |

### Frontend
| Layer | Technology |
|-------|-----------|
| Framework | React 19 + Vite 8 |
| Routing | React Router DOM v7 |
| Styling | Tailwind CSS v4 (CSS-first config) |
| State | Zustand |
| HTTP | Axios |
| Charts | Recharts |
| Icons | Lucide React |
| Token decode | jwt-decode |

---

## Project Structure

```
zorvyn-assignment/
├── backend/
│   ├── server.js              # Entry point, middleware, rate limiting
│   ├── src/
│   │   ├── config/            # DB pool, Passport strategy
│   │   ├── controllers/       # authController, recordController, summaryController
│   │   ├── middleware/        # auth (JWT), rbac (checkRole), validationMiddleware
│   │   ├── models/            # (DB schema helpers)
│   │   ├── routes/api.js      # All route definitions
│   │   ├── schemas/           # Joi schemas for auth and records
│   │   ├── services/          # emailService (Resend OTP), loggerService (audit)
│   │   └── loaders/           # DB initialisation helpers
│   └── docs/api.md            # API endpoint documentation
└── frontend/
    ├── src/
    │   ├── components/        # Layout, Sidebar, Footer, SummaryCard, InteractiveGlow
    │   ├── pages/             # Landing, Login, Register, VerifyOTP, Dashboard, Records, Logs
    │   ├── store/             # Zustand stores: authStore, financeStore
    │   └── config/apiConfig.js
    └── index.html
```

---

## API Endpoints

| Method | Route | Auth | Role | Description |
|--------|-------|------|------|-------------|
| `POST` | `/api/auth/register` | ❌ | — | Register a new user |
| `POST` | `/api/auth/verify-otp` | ❌ | — | Verify OTP and activate account |
| `POST` | `/api/auth/login` | ❌ | — | Login, returns JWT |
| `GET`  | `/api/auth/google` | ❌ | — | Initiate Google OAuth |
| `GET`  | `/api/auth/google/callback` | ❌ | — | Google OAuth callback |
| `GET`  | `/api/records` | ✅ | Admin, Analyst, Viewer | List all financial records |
| `POST` | `/api/records` | ✅ | Admin | Create a financial record |
| `PUT`  | `/api/records/:id` | ✅ | Admin | Update a record |
| `DELETE` | `/api/records/:id` | ✅ | Admin | Delete a record |
| `GET`  | `/api/dashboard/summary` | ✅ | Admin, Analyst | Aggregated financial summary |
| `GET`  | `/api/dashboard/activity` | ✅ | Admin, Analyst | Recent activity feed |
| `GET`  | `/api/admin/logs` | ✅ | Admin | Last 100 audit log entries |
| `GET`  | `/health` | ❌ | — | Service health + DB status |

---

## Running Locally

### Prerequisites
- Node.js ≥ 18
- A MySQL instance (local or Aiven Cloud)
- A [Resend](https://resend.com) API key for OTP emails

### 1. Clone & install dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure environment variables
Create `backend/.env`:
```env
PORT=5000
DB_HOST=your-db-host
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=your-db-name
DB_PORT=3306
JWT_SECRET=your-jwt-secret
JWT_EXPIRY=7d
RESEND_API_KEY=re_...
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FRONTEND_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

### 3. Initialise the database
```bash
cd backend
node init_db.js
```

### 4. Start servers
```bash
# Backend (port 5000)
cd backend && npm run dev

# Frontend (port 5173)
cd frontend && npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Author

**Abhishek Saini** — Backend Developer Intern Assignment  
[GitHub](https://github.com/OMEGA-5656) · [LinkedIn](https://linkedin.com/in/abhisheksaini-dev)
