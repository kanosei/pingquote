# Docker Setup for PingQuote

This guide explains how to use Docker Compose to run PostgreSQL locally for development.

## Quick Start

### 1. Start the Database

```bash
docker-compose up -d
```

This will:
- Download PostgreSQL 14 Alpine image (if not already downloaded)
- Create a container named `pingquote-db`
- Start PostgreSQL on port 5432
- Create a database named `pingquote`
- Create user `pingquote` with password `pingquote_dev_password`
- Create a persistent volume for data storage

### 2. Verify Database is Running

```bash
docker-compose ps
```

You should see:
```
NAME              IMAGE                 STATUS
pingquote-db      postgres:14-alpine    Up
```

### 3. Check Database Health

```bash
docker-compose logs postgres
```

Look for:
```
database system is ready to accept connections
```

### 4. Run Migrations

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Start Development

```bash
npm run dev
```

## Common Commands

### Database Management

```bash
# Start database
docker-compose up -d

# Stop database (keeps data)
docker-compose stop

# Stop and remove container (keeps data in volume)
docker-compose down

# Stop, remove container, and DELETE ALL DATA
docker-compose down -v

# View logs
docker-compose logs -f postgres

# Restart database
docker-compose restart
```

### Database Access

```bash
# Connect to PostgreSQL with psql
docker-compose exec postgres psql -U pingquote -d pingquote

# Or use connection string
psql "postgresql://pingquote:pingquote_dev_password@localhost:5432/pingquote"
```

Once connected, you can run SQL commands:
```sql
-- List all tables
\dt

-- Describe a table
\d users

-- Query data
SELECT * FROM users;

-- Exit psql
\q
```

### Backup & Restore

```bash
# Backup database
docker-compose exec postgres pg_dump -U pingquote pingquote > backup.sql

# Or using connection string
pg_dump "postgresql://pingquote:pingquote_dev_password@localhost:5432/pingquote" > backup.sql

# Restore database
docker-compose exec -T postgres psql -U pingquote pingquote < backup.sql

# Or using connection string
psql "postgresql://pingquote:pingquote_dev_password@localhost:5432/pingquote" < backup.sql
```

## Connection Details

The `.env` file has been configured with these connection details:

```env
DATABASE_URL="postgresql://pingquote:pingquote_dev_password@localhost:5432/pingquote?schema=public"
```

**Breakdown:**
- **User:** `pingquote`
- **Password:** `pingquote_dev_password`
- **Host:** `localhost`
- **Port:** `5432`
- **Database:** `pingquote`
- **Schema:** `public`

## Troubleshooting

### Port Already in Use

If port 5432 is already taken:

1. **Check what's using it:**
   ```bash
   lsof -i :5432
   ```

2. **Option 1: Stop other PostgreSQL**
   ```bash
   # If you have PostgreSQL installed via Homebrew
   brew services stop postgresql@14
   ```

3. **Option 2: Use different port**

   Edit `docker-compose.yml`:
   ```yaml
   ports:
     - "5433:5432"  # Use port 5433 instead
   ```

   Update `.env`:
   ```env
   DATABASE_URL="postgresql://pingquote:pingquote_dev_password@localhost:5433/pingquote?schema=public"
   ```

### Container Won't Start

```bash
# View detailed logs
docker-compose logs postgres

# Remove and recreate
docker-compose down
docker-compose up -d
```

### Connection Refused

```bash
# Check container is running
docker-compose ps

# Check container health
docker-compose exec postgres pg_isready -U pingquote

# Should output: "pingquote-db:5432 - accepting connections"
```

### Reset Everything

```bash
# Stop and remove everything (INCLUDING DATA)
docker-compose down -v

# Start fresh
docker-compose up -d

# Run migrations again
npx prisma migrate dev --name init
```

## Data Persistence

Data is stored in a Docker volume named `pingquote_postgres_data`. This means:

- ✅ Data persists when you stop the container
- ✅ Data persists when you remove the container
- ❌ Data is deleted when you run `docker-compose down -v`

### View Volume Info

```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect code_postgres_data
```

## Production Considerations

**Important:** This Docker setup is for **local development only**.

For production, use:
- Managed PostgreSQL (Vercel Postgres, Supabase, Neon, AWS RDS, etc.)
- Proper backups
- Connection pooling
- SSL/TLS encryption
- Strong passwords

## Prisma Studio with Docker

```bash
# Start Prisma Studio
npx prisma studio
```

Opens at `http://localhost:5555` - this works seamlessly with Docker PostgreSQL.

## Switching to Cloud Database

When you're ready to deploy, simply:

1. Create a cloud PostgreSQL database
2. Update `DATABASE_URL` in `.env` or Vercel environment variables
3. Run migrations: `npx prisma migrate deploy`

The same code works with both local and cloud databases!

## Docker Compose Configuration

The `docker-compose.yml` includes:

- **Health checks:** Ensures database is ready before accepting connections
- **Restart policy:** `unless-stopped` (auto-restart on system reboot)
- **Alpine image:** Smaller, faster image
- **Named volume:** Easy to identify and manage

## Uninstalling

To completely remove everything:

```bash
# Stop and remove container + volume
docker-compose down -v

# Remove Docker image (optional)
docker rmi postgres:14-alpine

# Remove Docker Compose file (optional)
rm docker-compose.yml
```

---

**You're all set!** Run `docker-compose up -d` to start your local database.
