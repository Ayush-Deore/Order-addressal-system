 # Door Sales B2C Portal

A private B2C door catalog and quoting system built with Next.js 14+, Tailwind CSS, Prisma, and NextAuth.
Closing client with traditional ordering systems can be tacky, hectic and time-consuming, which is why, i came up with an integrated
sales solution, where door manufacturers will have an online catalog display where they can also take quotation requests that get
saved to the admin dashboard, where they can generate a professional email based quoatation amd send it to the buyer, and also download
a csv/excel file that holds the entire quotation/client requirement data, to ease the invoicing and book-keeping process and save time.

remember, in sales, it's always,
time saved -> more time on new prospects -> more deals closed -> HIGHER REVENUE.

## Features

- **Private Access**: Role-based authentication (Admin/Client).
- **Product Catalog**: Browse doors with filters (Category/Search).
- **Product Details**: Configure size, opening, finish, and notes.
- **Cart & Quote System**: Persistent cart, detailed requirement collection, request submission.
- **Admin Dashboard**: View and manage quote requests, update status.
- **Email Notifications**: Integration with Resend (or mock logging).

## Tech Stack

- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- Prisma ORM (PostgreSQL)
- NextAuth.js (v5 beta)
- Zustand (State Management)
- Lucide React (Icons)

## Setup Instructions

### 1. Database Setup
Ensure you have PostgreSQL installed and running. Create a database (e.g., `door_catalog`).

### 2. Environment Variables
Rename `.env.example` to `.env` (or create it) with the following:

```env
# Database Connection
DATABASE_URL="postgresql://postgres:password@localhost:5432/door_catalog"

# Next Auth Secret (Generate with `npx auth secret` or random string)
AUTH_SECRET="your-super-secret-key"

# Resend API Key (Optional, for emails)
RESEND_API_KEY="re_..."
```

### 3. Installation & Database Migration
Run the following commands:

```bash
# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Create Database tables
npx prisma migrate dev --name init

# Seed the database with initial Users and Products
npx prisma db seed
```

### 4. Run the Application

```bash
npm run dev
```

Visit `http://localhost:3000`.

## Default Credentials

### Admin User
- **Email**: `admin@doorcatalog.com`
- **Password**: `password` (Note: Seeds use a fixed hash for demo purposes. Ensure database seeding ran successfully.)

### Client User
- **Email**: `client@example.com`
- **Password**: `password`
