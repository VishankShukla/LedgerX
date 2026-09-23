# LedgerX

LedgerX is a backend-focused digital ledger / banking transaction system built with **Node.js, Express, MongoDB, and Mongoose**.

> **Current status:** Backend foundation is implemented. Frontend development is the next major step.

## Features currently implemented

- User registration and login
- Password hashing with bcrypt
- JWT-based authentication
- Cookie-based authentication
- Token blacklist on logout
- User account creation
- Account listing
- Account balance calculation from ledger entries
- Money transfer between accounts
- Transaction idempotency using `idempotencyKey`
- Transaction statuses: `PENDING`, `COMPLETED`, `FAILED`, `REVERSED`
- Double-entry style ledger records using `CREDIT` and `DEBIT`
- Immutable ledger entries
- System-user initial funds transaction
- Registration and transaction email notifications
- MongoDB integration with Mongoose

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Nodemailer

### Frontend
- **Planned / in development**

## Project Structure

```text
LedgerX/
├── Backend/
│   ├── src/
│   │   ├── Models/
│   │   │   ├── account.model.js
│   │   │   ├── blackList.model.js
│   │   │   ├── ledger.model.js
│   │   │   ├── transaction.model.js
│   │   │   └── user.model.js
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   ├── account.controller.js
│   │   │   ├── auth.controller.js
│   │   │   └── transaction.controller.js
│   │   ├── middleware/
│   │   │   └── auth.middleware.js
│   │   ├── routes/
│   │   │   ├── account.routes.js
│   │   │   ├── auth.routes.js
│   │   │   └── transaction.routes.js
│   │   ├── services/
│   │   │   └── email.service.js
│   │   └── app.js
│   ├── server.js
│   ├── package.json
│   └── .gitignore
└── README.md
```

## Backend Setup

### 1. Clone the repository

```bash
git clone https://github.com/VishankShukla/LedgerX.git
cd LedgerX/Backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env`

Create a `.env` file inside `Backend/`.

Example:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

EMAIL_USER=your_email
CLIENT_ID=your_google_oauth_client_id
CLIENT_SECRET=your_google_oauth_client_secret
REFRESH_TOKEN=your_google_oauth_refresh_token
```

**Never commit `.env` or API credentials to GitHub.**

### 4. Start the server

```bash
npm start
```

Server runs on:

```text
http://localhost:3000
```

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |

### Accounts

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/account/` | Create an account |
| GET | `/api/account/get` | Get logged-in user's accounts |
| GET | `/api/account/balance/:accountId` | Get account balance |

### Transactions

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/transactions/` | Transfer money |
| POST | `/api/transactions/system/initial-funds` | Add initial funds using system-user flow |

## Frontend Roadmap

The frontend will be added next. Planned screens/features:

- Login
- Register
- Dashboard
- Account creation
- Account balance
- Send money
- Transaction history
- Profile/logout
- Loading and error states
- Responsive UI
- API integration with the backend

## Important Next Backend Improvements

Before calling the project production-ready, the backend should also receive:

- Automated API/unit/integration tests
- Stronger request validation
- Better centralized error handling
- CORS configuration for the frontend
- Rate limiting and security headers
- Proper transaction ownership/authorization checks
- More transaction/account history APIs
- Better handling of transaction rollback/failure cases
- Production logging and monitoring

## Project Progress

This is a **development-stage project**.



