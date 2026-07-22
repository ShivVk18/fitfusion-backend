# FitFusion AI — Backend Database Server

This directory contains the Express REST API and Prisma database layer that serves FitFusion AI, handling authentication, analytics, profile logging, and Gemini AI fitness synthesizers.

---

## Technical Features

1. **Authentication Flow**:
   - Access & Refresh tokens generated via `jsonwebtoken`.
   - Both tokens are delivered to the client inside HTTP-Only, secure cookies to prevent XSS credential extraction.
   - Rotated Refresh Token system verifies request payloads against user records in the PostgreSQL database for revocation support.
2. **Database ORM**:
   - Prisma ORM utilizing `pg` native driver adapters for thread-safe database pooling and execution in serverless-ready contexts.
3. **Generative AI Agent**:
   - Integrates Gemini 2.5 Flash API with strict JSON schema parsing for workout day distributions and diet macro breakdown calculations.
4. **Middlewares**:
   - Global Error Handler mapping errors to standard format.
   - Schema Validate middleware parsing incoming payload schemas.
   - Loggers recording request statuses and response velocities.

---

## Directory Structure

```
├── prisma/
│   ├── generated/           # Auto-generated Prisma client classes
│   └── schema.prisma        # Database relational models definition
└── src/
    ├── app.js               # Express application initialization & middleware
    ├── index.js             # Server startup listener
    ├── controllers/         # Request handling and response formatting
    ├── services/            # Core business logic (auth, AI, logs, progress)
    ├── routes/              # Route controllers registration
    ├── middlewares/         # Authorization, validators, and error middleware
    └── utils/               # Loggers, token signs, and api wrappers
```

---

## Environment Configuration

Configure a `.env` file in this directory with the following variables:

```ini
# PostgreSQL Database URL
DATABASE_URL="postgresql://<username>:<password>@localhost:5432/FitBudgetAi"

# Express Server Port
PORT=8000

# JSON Web Token Secret Keys
ACCESS_TOKEN_SECRET="your_access_token_secret"
REFRESH_TOKEN_SECRET="your_refresh_token_secret"

# Token Expiration Intervals
ACCESS_TOKEN_EXPIRY="15m"
REFRESH_TOKEN_EXPIRY="7d"

# Gemini Generative AI Key
GEMINI_API_KEY="your_gemini_api_key"
```

---

## Database Schemas Overview

The Prisma schema defines the following PostgreSQL tables:
- `User`: Primary user records, physical metrics configuration status, hashed passwords, and active refresh token signatures.
- `Workout`: Training split plans (Hypertrophy, Strength, etc.).
- `WorkoutDay`: Day split distributions (e.g. Day 1 Chest & Biceps).
- `Exercise`: Prescribed sets, reps, and rest timers.
- `WorkoutLog`: User workout completions with duration and dates.
- `ExerciseLog`: Completed metrics (completed weights, sets, reps).
- `Progress`: Body weight tracker and circumference progress history.
- `Diet`: Prescribed daily calories, macros, and scheduled meal timings.
- `Recovery`: Sleep metrics, fatigue, soreness, and CNS readiness index calculations.
- `AIHistory`: AI prompt history logging.

---

## Setup & Running

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Generate database Client**:
   ```bash
   npx prisma generate
   ```
3. **Database Migrations (Optional)**:
   ```bash
   npx prisma db push
   ```
4. **Start Development Server**:
   ```bash
   npm run dev
   ```
   The backend server runs at `http://localhost:8000`.
