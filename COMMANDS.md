# Useful Commands

Quick reference for common development tasks.

## Setup & Installation

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Generate NextAuth secret
openssl rand -base64 32

# Initialize database
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate
```

## Development

```bash
# Start development server
npm run dev

# Start on different port
npm run dev -- -p 3001

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Database

```bash
# Open Prisma Studio (database GUI)
npx prisma studio

# Create a new migration
npx prisma migrate dev --name your_migration_name

# Run migrations (production)
npx prisma migrate deploy

# Reset database (⚠️ DELETES ALL DATA)
npx prisma migrate reset

# Seed database (if you create a seed file)
npx prisma db seed

# Format schema file
npx prisma format

# Validate schema
npx prisma validate
```

## Git

```bash
# Initialize repo
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Add remote
git remote add origin <your-repo-url>

# Push to GitHub
git push -u origin main
```

## Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link project
vercel link

# Pull environment variables
vercel env pull .env.local

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View logs
vercel logs <deployment-url> --follow
```

## Testing & Debugging

```bash
# Check TypeScript types
npx tsc --noEmit

# Check for unused dependencies
npx depcheck

# Update all dependencies
npx npm-check-updates -u
npm install

# Clear Next.js cache
rm -rf .next

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Database Backup & Restore

```bash
# Backup database (using pg_dump)
pg_dump $DATABASE_URL > backup.sql

# Restore database
psql $DATABASE_URL < backup.sql

# Backup with timestamp
pg_dump $DATABASE_URL > "backup-$(date +%Y%m%d-%H%M%S).sql"
```

## Environment Variables

```bash
# Check current environment
echo $NODE_ENV

# Print environment variable
echo $DATABASE_URL

# Load .env file in terminal (bash)
export $(cat .env | xargs)
```

## Package Management

```bash
# Install a package
npm install <package-name>

# Install as dev dependency
npm install -D <package-name>

# Remove a package
npm uninstall <package-name>

# Update a specific package
npm update <package-name>

# Check for outdated packages
npm outdated

# Audit for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

## shadcn/ui

```bash
# Add a new component
npx shadcn-ui@latest add <component-name>

# Add multiple components
npx shadcn-ui@latest add button card dialog

# List available components
npx shadcn-ui@latest add
```

## Prisma Troubleshooting

```bash
# If Prisma Client is not found
npx prisma generate

# If migrations are out of sync
npx prisma migrate dev

# If database is in bad state
npx prisma migrate reset
npx prisma migrate dev

# If schema and database don't match
npx prisma db push
```

## Docker (Optional)

If you want to run PostgreSQL locally via Docker:

```bash
# Start PostgreSQL container
docker run --name pingquote-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=pingquote \
  -p 5432:5432 \
  -d postgres:14

# Stop container
docker stop pingquote-db

# Start container
docker start pingquote-db

# Remove container
docker rm -f pingquote-db
```

Connection string for Docker Postgres:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/pingquote?schema=public"
```

## Performance

```bash
# Analyze bundle size
npm run build
# Check .next/server/app/ for page sizes

# Analyze dependencies
npx webpack-bundle-analyzer .next/server/app/*.js
```

## Cleaning Up

```bash
# Remove all generated files
rm -rf node_modules .next dist

# Clean install
npm ci

# Clear npm cache
npm cache clean --force
```

## Production Checks

```bash
# Test production build locally
npm run build
npm start

# Check for errors
npm run build 2>&1 | grep -i error

# Check for warnings
npm run build 2>&1 | grep -i warn
```

## Quick Fixes

```bash
# If "port already in use"
lsof -ti:3000 | xargs kill

# If "module not found"
rm -rf node_modules package-lock.json
npm install

# If Prisma issues
npx prisma generate
npx prisma migrate dev

# If NextAuth issues
# Check .env has NEXTAUTH_SECRET and NEXTAUTH_URL
# Clear browser cookies for localhost:3000
```

## VS Code Tasks

Add to `.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "dev",
      "type": "npm",
      "script": "dev",
      "problemMatcher": [],
      "detail": "Start development server"
    },
    {
      "label": "prisma:studio",
      "type": "shell",
      "command": "npx prisma studio",
      "detail": "Open Prisma Studio"
    }
  ]
}
```

---

**Pro tip:** Add commonly used commands as npm scripts in `package.json` for easier access.
