# Quick Start Guide

Get PingQuote running in 5 minutes.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- Terminal access

## Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
# Your PostgreSQL connection string
DATABASE_URL="postgresql://user:password@localhost:5432/pingquote?schema=public"

# Generate with: openssl rand -base64 32
NEXTAUTH_SECRET="paste-your-generated-secret-here"

# For local development
NEXTAUTH_URL="http://localhost:3000"
```

**Generate the secret:**
```bash
openssl rand -base64 32
```

### 3. Set Up Database

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Test It Out

1. **Sign up** at http://localhost:3000/signup
2. **Create a quote** from the dashboard
3. **Open the quote link** in an incognito window
4. **Check the dashboard** - status should be "Hot" 🔥

## Need a Database?

### Option 1: Local PostgreSQL

**macOS (Homebrew):**
```bash
brew install postgresql@14
brew services start postgresql@14
createdb pingquote
```

**Ubuntu/Debian:**
```bash
sudo apt install postgresql
sudo -u postgres createdb pingquote
```

Your connection string:
```
postgresql://postgres:@localhost:5432/pingquote?schema=public
```

### Option 2: Free Cloud Database

**Supabase** (easiest):
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get connection string from Settings → Database
4. Use it as your `DATABASE_URL`

**Neon** (serverless):
1. Go to [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string

## Troubleshooting

### "Prisma Client not found"
```bash
npx prisma generate
```

### "Invalid credentials" when logging in
Make sure you signed up first at `/signup`

### Database connection fails
- Check PostgreSQL is running
- Verify connection string format
- Ensure database exists

### Port 3000 already in use
```bash
# Use a different port
npm run dev -- -p 3001
```

## Next Steps

- Read [README.md](README.md) for full documentation
- Check [DEVELOPMENT.md](DEVELOPMENT.md) for development tips
- See [DEPLOYMENT.md](DEPLOYMENT.md) for deploying to production

## Project Structure

```
├── app/              # Routes and pages
│   ├── page.tsx      # Landing page
│   ├── login/        # Login page
│   ├── signup/       # Signup page
│   ├── dashboard/    # Main dashboard
│   ├── quotes/new/   # Create quote
│   └── q/[id]/       # Public quote view
├── components/       # React components
├── lib/              # Utilities
├── prisma/           # Database schema
└── README.md         # Full docs
```

## Key Files

- `prisma/schema.prisma` - Database schema
- `lib/auth.ts` - Authentication config
- `app/actions/` - Server actions (create, read, update, delete)
- `components/ui/` - UI components

## Common Commands

```bash
# Start dev server
npm run dev

# Open database GUI
npx prisma studio

# Create a migration
npx prisma migrate dev --name your_migration_name

# Reset database (⚠️ deletes all data)
npx prisma migrate reset
```

---

**You're ready to go! 🚀**

Need help? Check the other documentation files or open an issue.
