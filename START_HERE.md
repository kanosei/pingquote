# 🚀 START HERE - PingQuote Setup

Complete setup in 3 steps!

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Start PostgreSQL with Docker

```bash
docker-compose up -d
```

✅ Database credentials are **already configured** in `.env`

**Don't have Docker?** See alternatives below.

## Step 3: Initialize Database & Run App

```bash
# Run migrations
npx prisma migrate dev --name init
npx prisma generate

# Start the app
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## ✨ That's it! You're ready to go!

### Test the App

1. Sign up at [http://localhost:3000/signup](http://localhost:3000/signup)
2. Create a quote from the dashboard
3. Click "View" to see your quote
4. Notice the status changes to "Hot" 🔥

---

## 🐳 Docker Commands

```bash
# Start database
docker-compose up -d

# Stop database (keeps data)
docker-compose stop

# View logs
docker-compose logs -f

# Stop and remove (keeps data)
docker-compose down

# Nuclear option: Remove everything including data
docker-compose down -v
```

Full Docker guide: [DOCKER.md](DOCKER.md)

---

## 🗄️ Don't Have Docker?

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

Update `.env`:
```env
DATABASE_URL="postgresql://postgres:@localhost:5432/pingquote?schema=public"
```

### Option 2: Cloud Database (Free)

**Supabase** (recommended):
1. Sign up at [supabase.com](https://supabase.com)
2. Create new project
3. Get connection string from Settings → Database
4. Update `DATABASE_URL` in `.env`

**Neon** (serverless):
1. Sign up at [neon.tech](https://neon.tech)
2. Create project
3. Copy connection string
4. Update `DATABASE_URL` in `.env`

---

## 📚 Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - 5-minute setup guide
- **[README.md](README.md)** - Full documentation
- **[DOCKER.md](DOCKER.md)** - Docker setup details
- **[DEVELOPMENT.md](DEVELOPMENT.md)** - Development tips
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deploy to production
- **[COMMANDS.md](COMMANDS.md)** - Command reference

---

## 🆘 Troubleshooting

### "Port 5432 already in use"

**Option 1:** Stop other PostgreSQL
```bash
brew services stop postgresql@14
```

**Option 2:** Change Docker port

Edit `docker-compose.yml`:
```yaml
ports:
  - "5433:5432"
```

Update `.env`:
```env
DATABASE_URL="postgresql://pingquote:pingquote_dev_password@localhost:5433/pingquote?schema=public"
```

### "Prisma Client not found"

```bash
npx prisma generate
```

### Database connection fails

```bash
# Check Docker container is running
docker-compose ps

# View logs
docker-compose logs postgres
```

### Reset everything

```bash
# Stop and remove all data
docker-compose down -v

# Start fresh
docker-compose up -d
npx prisma migrate dev --name init
```

---

## 🎯 What's Included

✅ Complete authentication system
✅ Quote creation with line items
✅ View tracking (privacy-first)
✅ Smart status indicators
✅ Professional UI with shadcn/ui
✅ Ready to deploy to Vercel

---

## 📂 Project Structure

```
code/
├── app/              # Next.js routes
├── components/       # React components
├── lib/              # Utilities
├── prisma/           # Database schema
├── docker-compose.yml # PostgreSQL setup
└── .env              # Configuration (already set up!)
```

---

## 🌐 Deploy to Production

```bash
# Push to GitHub
git init && git add . && git commit -m "Initial commit"
git push origin main

# Import to Vercel at vercel.com/new
# Add Vercel Postgres or use external database
# Run: npx prisma migrate deploy
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete guide.

---

## ⚡ Quick Commands

```bash
# Development
npm run dev              # Start dev server
npx prisma studio        # Open database GUI

# Docker
docker-compose up -d     # Start database
docker-compose logs -f   # View logs
docker-compose down      # Stop database

# Database
npx prisma migrate dev   # Create migration
npx prisma generate      # Generate client
npx prisma migrate reset # Reset database
```

---

**Happy coding! 🎉**

Questions? Check the docs or create an issue.
