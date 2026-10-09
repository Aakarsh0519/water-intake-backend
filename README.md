# 💧 Water Intake Tracker — Backend API

## Project description and features

### Project Description
A secure REST API built with Node.js, Express, and MongoDB using Mongoose. The backend manages user authentication, records individual fluid intake intervals, calculates physiologically tailored daily hydration targets, and provides administrative oversight with user auditing.

### Key Features
- **JWT Authentication & Role Guarding**: Stateless user sessions with bcrypt password hashing and separation of standard users from administrators.
- **Adaptive Physiological Goal Engine**: Computes hydration targets based on body weight, biological sex, exertion levels, health buffers (such as kidney stone flushing), and ambient temperature.
- **Clinical Safeguards**:
  - *Filtration Alert*: Flags rapid drinking exceeding 800 ml within 45 minutes to avoid overwhelming renal excretion rates.
  - *Hyponatremia Warning*: Warns when daily intake exceeds goals by more than 300 ml.
- **Dual-Model Schema Normalization**: Supports and validates both `userId` and `user` references in Mongoose to ensure consistent database queries.
- **Admin Management Portal**:
  - Aggregated non-admin metrics (total active accounts, logged drinking sessions, average volume).
  - User-specific audit logs showing timestamped intervals and amounts.
  - In-line daily target editing and account deletion with self-deletion guards.

---

## Setup and installation steps

### 1. Prerequisites
- **Node.js** (v18.x or later): [Download & Install Node.js](https://nodejs.org/)
- **MongoDB**: Ensure a local instance is running (`mongodb://127.0.0.1:27017`) or have a MongoDB Atlas connection URI ready.

### 2. Clone and Install Dependencies
Open your terminal (PowerShell, Command Prompt, or Bash) and run:
```bash
git clone [https://github.com/Aakarsh0519/water-intake-backend.git](https://github.com/Aakarsh0519/water-intake-backend.git)
cd water-intake-backend
npm install