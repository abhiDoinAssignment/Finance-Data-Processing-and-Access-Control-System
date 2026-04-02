# Zorvyn Finance — Data Processing & Access Control System

A full-stack, security-hardened finance portal built as an internship assignment. It demonstrates enterprise-grade API architecture with granular role-based access control (RBAC), organization-based multi-tenancy, audit logging, and a modern React dashboard.

---

## Features

### Authentication & Identity
- **Email/Password Registration** — Passwords hashed with bcrypt (cost factor 12); accounts start unverified.
- **OTP Email Verification** — 6-digit one-time code sent via [Resend](https://resend.com), valid for 10 minutes; account is activated only after successful verification.
- **JWT Login** — Issues a signed JWT on successful credential check; token carries user ID and role.
- **Google OAuth 2.0** — Passport.js strategy; new Google users are auto-provisioned with the Viewer role.
- **Quick-Access RBAC Testing** — Dedicated "Quick Access" panel on the login page for one-click authentication as **Admin**, **Analyst**, or **Viewer** (seeded automatically with test data).
- **Hardened Duplicate Check** — Robust email uniqueness enforcement across both local and Google authentication flows.

### Multi-Tenant Architecture
- **Organization-Based Isolation** — All financial records and users are mapped to an `organization_id`.
- **Data Encapsulation** — Middleware ensures users can only view or modify records belonging to their specific organization.

### Role-Based Access Control (RBAC)
Three roles with explicit permission enforcement on every route:

| Role    | Records (Read) | Records (Write/Edit/Delete) | Dashboard Summary | Audit Logs |
|---------|:--------------:|:--------------------------:|:-----------------:|:----------:|
| Admin   | ✅             | ✅                          | ✅                | ✅          |
| Analyst | ✅             | ❌                          | ✅                | ❌          |
| Viewer  | ✅             | ❌                          | ❌                | ❌          |

### Financial Records & Dashboard
- **Full CRUD** — Admin-only write/edit/delete; Analyst/Viewer-only read.
- **Visual Analytics** — Area charts for monthly trends and Bar charts for category breakdown, now with **stabilized entry animations**.
- **Recent Activity** — Live feed of the latest financial events within the organization.

### System Observability
- **Global Status Bar** — A persistent bottom bar showing real-time **DB Ping**, **Uptime**, and **Environment**.
- **Intelligent Fallback** — Automatically switches to reporting Node.js server uptime if database-level uptime queries are restricted (e.g. by Aiven MySQL permissions).
- **Audit Logging** — JSON snapshots of all critical operations for security auditing.

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
│   ├── server.js              # Entry point, middleware, rate limiting, health
│   ├── seed-sample-data.js    # Multi-tenant & role seeding script
│   ├── src/
│   │   ├── config/            # DB pool, Passport strategy
│   │   ├── controllers/       # authController, recordController, dashboardController
│   │   ├── middleware/        # auth (JWT), rbac, validation
│   │   ├── routes/api.js      # All route definitions and OAuth handlers
│   │   └── services/          # emailService (Resend), loggerService (audit)
│   └── docs/api.md            # API documentation
└── frontend/
    ├── src/
    │   ├── components/        # Sidebar, AppShell (Status Bar), SummaryCard
    │   ├── pages/             # Dashboard, Login, Register, Records, Logs
    │   └── store/             # Zustand stores: authStore, financeStore
    └── index.html
```

---

## API Endpoints

| Method | Route | Auth | Role | Description |
|--------|-------|------|------|-------------|
| `POST` | `/api/auth/register` | ❌ | — | Register a new user |
| `POST` | `/api/auth/verify-otp` | ❌ | — | Verify OTP and activate account |
| `POST` | `/api/auth/login` | ❌ | — | Login, returns JWT |
| `GET`  | `/api/auth/google` | ❌ | — | Initiate Google OAuth (Signup/Login) |
| `GET`  | `/api/records` | ✅ | Any | List organization records |
| `POST` | `/api/records` | ✅ | Admin | Create organization record |
| `GET`  | `/api/dashboard/summary` | ✅ | Admin/Analyst | Aggregated financial summary |
| `GET`  | `/api/admin/logs` | ✅ | Admin | Last 100 audit log entries |
| `GET`  | `/health` | ❌ | — | Health ping with uptime fallback |

---

## Running Locally

### 1. Initialise the database
```bash
cd backend
node init_db.js
```

### 2. Seed Sample Data (RBAC & Multi-Tenant)
This script creates the test organization `abc` and three users (Admin, Analyst, Viewer) with 4 months of financial history.
```bash
cd backend
node seed-sample-data.js
```
- **Login Credentials**: `admin@abc.com` / `Zorvyn2024!` (Or use Quick-Access buttons)

### 3. Start servers
```bash
# Backend (port 5000)
cd backend && npm run dev

# Frontend (port 5173)
cd frontend && npm run dev
```

---

## Author

**Abhishek Saini** — Backend Developer Intern Assignment  
[GitHub](https://github.com/OMEGA-5656) · [LinkedIn](https://linkedin.com/in/abhisheksaini-dev)
