# Deployment Guide

This guide walks you through deploying PingQuote to Vercel with a PostgreSQL database.

## Option 1: Vercel with Vercel Postgres (Recommended)

This is the simplest option, using Vercel's built-in Postgres offering.

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Project"
3. Select your GitHub repository
4. Click "Import"

### Step 3: Add Vercel Postgres

1. In your Vercel project dashboard, go to the "Storage" tab
2. Click "Create Database"
3. Select "Postgres"
4. Choose a region (select closest to your users)
5. Click "Create"

Vercel will automatically set the `DATABASE_URL` environment variable.

### Step 4: Add Additional Environment Variables

1. Go to "Settings" → "Environment Variables"
2. Add:
   ```
   NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
   ```

Generate the secret:
```bash
openssl rand -base64 32
```

Note: `NEXTAUTH_URL` is automatically set by Vercel.

### Step 5: Deploy

1. Go to "Deployments" tab
2. Click "Redeploy" (or push to main branch)

### Step 6: Run Database Migrations

After deployment completes:

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Link your project:
   ```bash
   vercel link
   ```

3. Pull environment variables:
   ```bash
   vercel env pull .env.local
   ```

4. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```

Your app should now be live!

---

## Option 2: Vercel with External PostgreSQL (Supabase, Neon, etc.)

If you prefer to use an external PostgreSQL provider:

### Step 1: Create a PostgreSQL Database

**Using Supabase:**
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to "Settings" → "Database"
4. Copy the "Connection string" (URI format)

**Using Neon:**
1. Go to [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string

**Using Railway:**
1. Go to [railway.app](https://railway.app)
2. Create a new Postgres database
3. Copy the connection string

### Step 2: Deploy to Vercel

1. Import your GitHub repo to Vercel (same as Option 1)
2. Add environment variables:
   ```
   DATABASE_URL=<your-postgres-connection-string>
   NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
   ```

### Step 3: Run Migrations

Same as Option 1, Step 6.

---

## Option 3: Manual Setup (Any Hosting)

PingQuote can be deployed to any Node.js hosting platform.

### Requirements

- Node.js 18+
- PostgreSQL database
- Platform that supports Next.js

### Environment Variables

Set these on your hosting platform:

```env
DATABASE_URL=postgresql://user:password@host:5432/database
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=<random-secret>
```

### Build Commands

```bash
npm install
npx prisma generate
npx prisma migrate deploy
npm run build
```

### Start Command

```bash
npm start
```

---

## Post-Deployment Checklist

After deploying, verify:

- [ ] App loads at your domain
- [ ] Sign up creates a new user
- [ ] Log in works
- [ ] Can create a new quote
- [ ] Public quote URL works
- [ ] Quote view tracking increments
- [ ] Dashboard shows correct status (Hot/Warm/Cold)

---

## Common Deployment Issues

### Issue: "Prisma Client not found"

**Solution:** Run `npx prisma generate` in your build step.

In Vercel, this should happen automatically via the `postinstall` script in `package.json`.

### Issue: Database connection fails

**Solution:** Check your `DATABASE_URL` format:

```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
```

Ensure:
- Connection string includes `?schema=public`
- Password is URL-encoded if it contains special characters
- SSL is configured if required (add `?sslmode=require`)

### Issue: Authentication redirects fail

**Solution:** Ensure `NEXTAUTH_URL` matches your deployed domain exactly:

```env
# Production
NEXTAUTH_URL=https://your-app.vercel.app

# Not this:
NEXTAUTH_URL=http://your-app.vercel.app  # Wrong protocol
```

### Issue: NextAuth secret error

**Solution:** Generate a proper secret:

```bash
openssl rand -base64 32
```

Add it to environment variables and redeploy.

---

## Database Migrations

### Initial Migration (First Deployment)

```bash
npx prisma migrate deploy
```

### Future Schema Changes

1. Make changes to `prisma/schema.prisma`
2. Create migration locally:
   ```bash
   npx prisma migrate dev --name description_of_change
   ```
3. Commit the migration file to git
4. Push to GitHub
5. Vercel will auto-deploy
6. Run migration in production:
   ```bash
   npx prisma migrate deploy
   ```

### Migration Safety

**Always backup your production database before running migrations:**

```bash
# Backup Vercel Postgres
vercel env pull
# Use the connection string to create a backup with pg_dump

# Or use your database provider's backup tools
```

---

## Monitoring

### Vercel Logs

View logs in real-time:
```bash
vercel logs <deployment-url> --follow
```

Or view in the Vercel dashboard under "Deployments" → (select deployment) → "Logs"

### Database Monitoring

**Vercel Postgres:**
- View metrics in Vercel dashboard under "Storage"

**External providers:**
- Use their respective dashboards

---

## Scaling Considerations

### Vercel Hobby Tier Limits

- 100 GB bandwidth/month
- 1000 serverless function invocations/day
- 60 seconds max function duration

If you exceed these, consider:
- Upgrading to Vercel Pro
- Using incremental static regeneration for public pages
- Optimizing database queries

### Database Scaling

**Vercel Postgres (Hobby):**
- 256 MB storage
- 60 hours compute/month

If you need more:
- Upgrade to Pro tier
- Switch to external PostgreSQL provider (Supabase, Neon, etc.)

### Connection Pooling

For production apps with many users, enable connection pooling:

1. Use Prisma Data Proxy, or
2. Use external pooler (PgBouncer, Supabase's built-in pooling)

Update your `DATABASE_URL` to use the pooling connection string.

---

## Custom Domain

1. Go to Vercel project → "Settings" → "Domains"
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXTAUTH_URL` to your custom domain
5. Redeploy

---

## Security Best Practices

- [ ] Use strong `NEXTAUTH_SECRET` (32+ characters, random)
- [ ] Enable SSL for database connections
- [ ] Never commit `.env` files to git
- [ ] Rotate secrets periodically
- [ ] Use Vercel's environment variable encryption
- [ ] Monitor for suspicious activity
- [ ] Keep dependencies updated

---

## Updating After Deployment

1. Make changes locally
2. Test thoroughly
3. Commit and push to GitHub
4. Vercel auto-deploys
5. Run migrations if schema changed:
   ```bash
   npx prisma migrate deploy
   ```

---

## Rollback Plan

If a deployment breaks production:

1. **Immediate fix:** Revert to previous deployment in Vercel dashboard
2. **For database issues:** Restore from backup
3. **For code issues:** Revert git commit and push

Always test changes in a staging environment first!

---

## Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)

---

**You're ready to deploy! 🚀**
