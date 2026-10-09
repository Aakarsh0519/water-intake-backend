# 💧 Water Intake Tracker - Backend REST API

A scalable, secure Node.js, Express, and MongoDB backend designed for tracking hydration habits, calculating physiological fluid targets, managing user accounts, and providing administrative auditing capabilities.

---

## 🏗️ Architecture & Technologies

- **Runtime Engine**: Node.js (v18+)
- **Application Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Security & Session Management**:
  - JSON Web Tokens (JWT) for stateless authentication
  - Password hashing via bcryptjs
  - CORS middleware configured for cross-origin client requests
- **Validation**: Schema-level Mongoose validation with unified field normalization (`userId` & `user`)

---

## 📁 Directory Structure

```text
water-intake-backend/
├── middleware/
│   └── auth.js             # JWT verification and RBAC role guards
├── models/
│   ├── IntakeLog.js        # Water consumption schema
│   └── User.js             # User accounts & physiological profile schema
├── routes/
│   ├── auth.js             # User registration & login endpoints
│   ├── intakeLogs.js       # Log, delete, fetch, & inspect consumption records
│   └── users.js            # User management, admin aggregation, & profile updates
├── .env                    # Environment variables
├── package.json            # Dependencies and scripts
└── server.js               # Application bootstrap & MongoDB connection