# NodeJS TypeScript Setup

A modern Node.js project setup with TypeScript, ESLint, Prettier, and Prisma ORM for database handling.  
This boilerplate provides a solid foundation for building scalable backend applications.

---

## Features

- **TypeScript** for static typing and maintainable code
- **Express.js** for handling HTTP requests
- **Zod** for schema validation
- **Prisma ORM** for database management
- **ESLint + Prettier** for linting and code formatting
- **Helmet + Rate Limiting** for basic security
- **Nodemailer** for sending emails
- **Morgan** for HTTP request logging
- **JWT + bcrypt** for authentication and password hashing

---

## Installation

Clone the repository and install dependencies:

```bash
git clone <repo-url>
cd node-setup
npm install
```

## Project Structure

```bash
src/
┣ config/       # Env & configs
┣ controllers/  # Request handlers
┣ middleware/   # Middlewares
┣ routes/       # Express routes
┣ services/     # Business logic
┣ persistance/  # DB access
┣ utils/        # Helpers
┣ validations/  # Zod schemas
┣ types/        # Shared types
┗ index.ts      # Entry point
```

## Environment Variables

1. Copy the provided example environment file:

```bash
cp example.env .env
```

2. Update the .env file with your own values (database credentials, JWT secret, email config, etc.).

## Database (Prisma ORM)

This project uses Prisma ORM for database handling.
After editing your Prisma schema `(prisma/schema.prisma)`:

```bash
# Run migrations
npx prisma migrate dev --name init

# Generate client
npx prisma generate
```

## Lint & Format

```bash
npm run lint
```
