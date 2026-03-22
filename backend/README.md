# College Event Management System Backend

This repository contains the production-ready RESTful backend API for the College Event Management System. It has been built using Node.js, Express, and Prisma ORM (SQLite).

## Features
- **RESTful Endpoints**: Full CRUD for Users and Events.
- **Relational Database**: Normalized SQLite database managed by Prisma.
- **Authentication**: JWT-based login, registration, and RBAC (Roles: student, faculty, admin).
- **Security & Validation**: Zod-based request validation, Helmet, Express-Rate-Limit.
- **Documentation**: Swagger UI integrated natively.

## Prerequisites
- Node.js (v18+)
- npm

## Setup & Running Locally

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   A default `.env` is provided. If you need to reconfigure, ensure these exist:
   ```env
   PORT=5001
   NODE_ENV=development
   JWT_SECRET=supersecretjwtkeythatislongenough
   DATABASE_URL="file:./dev.db"
   ```

3. **Run Database Migrations:**
   Generates the SQLite database (`dev.db`).
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Seed Database:**
   Populates lookup values and dummy developer data.
   ```bash
   npm run seed
   ```

5. **Start Server:**
   ```bash
   # Development mode (nodemon)
   npm run dev

   # Production mode
   npm start
   ```

## Testing
Comprehensive integration tests covering API endpoints run with Jest and Supertest.
```bash
npm test
```

## API Documentation
Once the server is running, visit the auto-generated Swagger UI at:
- `http://localhost:5001/api-docs`

The complete OpenAPI specification is also available in `openapi.yaml`.
