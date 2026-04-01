# zorvyn Finance: API Documentation

## Base URL
`http://localhost:5000/api`

---

## 🔐 Authentication

### 1. Register
`POST /auth/register`
- **Body**: `{ "username", "email", "password", "role_name" }`
- **Roles**: Admin, Analyst, Viewer (Default)
- **Response**: `201 Created` - Sends OTP to email.

### 2. Verify OTP
`POST /auth/verify-otp`
- **Body**: `{ "email", "otp" }`
- **Response**: `200 OK` - Verifies the account.

### 3. Login (Local)
`POST /auth/login`
- **Body**: `{ "email", "password" }`
- **Response**: `200 OK` - Returns JWT and user profile.

### 4. Google OAuth
`GET /auth/google` -> `GET /auth/google/callback`
- **Description**: Initiates Google OAuth2 flow. Redirects to frontend with token.

---

## 📊 Financial Records

### 1. List Records
`GET /records`
- **Access**: Viewer, Analyst, Admin
- **Response**: List of all financial records.

### 2. Create Record
`POST /records`
- **Access**: Admin only
- **Body**: `{ "amount", "type", "category", "date", "description" }`

### 3. Update/Delete
`PUT /records/:id`, `DELETE /records/:id`
- **Access**: Admin only

---

## 📈 Dashboard & Summaries

### 1. Unified Summary
`GET /dashboard/summary`
- **Access**: Analyst, Admin
- **Response**: `totalIncome`, `totalExpenses`, `netBalance`, `monthlyTrends`.

### 2. Recent Activity
`GET /dashboard/activity`
- **Access**: Analyst, Admin

---

## 🛠 Admin & Audit

### 1. Audit Logs
`GET /admin/logs`
- **Access**: Admin only
- **Response**: Full activity stream of the system.

---

## 🛡 Security
- **JWT**: Required for all non-auth routes (except health).
- **Rate Limiting**: 
    - 5 requests/15 mins for `/auth`.
    - 100 requests/15 mins for general API.
