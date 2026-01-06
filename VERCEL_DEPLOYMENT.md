# Deploy PingQuote to Vercel

Your code is now on GitHub: **https://github.com/kanosei/pingquote**

## Step 1: Import Project to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"**
3. Find and select **"kanosei/pingquote"** from your GitHub repositories
4. Click **"Import"**

## Step 2: Configure Environment Variables

Before deploying, you need to add your environment variables. Click **"Environment Variables"** and add these:

### Required Variables:

```
NEXTAUTH_SECRET=<generate-a-random-secret>
NEXTAUTH_URL=https://your-app-name.vercel.app
DATABASE_URL=<your-production-database-url>
RESEND_API_KEY=<your-resend-api-key>
RESEND_FROM_EMAIL=<your-verified-email>
NEXT_PUBLIC_BASE_URL=https://your-app-name.vercel.app
```

### How to Get These:

1. **NEXTAUTH_SECRET**: Run this command locally to generate one:
   ```bash
   openssl rand -base64 32
   ```

2. **NEXTAUTH_URL**: Will be `https://your-project-name.vercel.app` (you'll know this after deployment, you can update it later)

3. **DATABASE_URL**: You need a production PostgreSQL database. Options:
   - **Vercel Postgres** (easiest): Add from Vercel Storage tab
   - **Supabase** (free tier): https://supabase.com/
   - **Railway** (free tier): https://railway.app/
   - **Neon** (free tier): https://neon.tech/

4. **RESEND_API_KEY**: From your Resend dashboard at https://resend.com/api-keys

5. **RESEND_FROM_EMAIL**: Your verified sending email in Resend

6. **NEXT_PUBLIC_BASE_URL**: Same as NEXTAUTH_URL

## Step 3: Configure Build Settings

Vercel should auto-detect Next.js, but verify these settings:

- **Framework Preset**: Next.js
- **Build Command**: `pnpm build`
- **Output Directory**: `.next`
- **Install Command**: `pnpm install`
- **Node Version**: 18.x or higher

## Step 4: Deploy

1. Click **"Deploy"**
2. Wait for the build to complete (2-3 minutes)
3. Once deployed, you'll get a URL like `https://pingquote.vercel.app`

## Step 5: Update Environment Variables

After first deployment:

1. Go to your project settings in Vercel
2. Navigate to **"Environment Variables"**
3. Update `NEXTAUTH_URL` and `NEXT_PUBLIC_BASE_URL` with your actual Vercel URL
4. Click **"Redeploy"** to apply changes

## Step 6: Set Up Production Database

If using **Vercel Postgres**:

1. Go to your project in Vercel
2. Click **"Storage"** tab
3. Click **"Create Database"** → Choose Postgres
4. It will automatically add `DATABASE_URL` to your environment variables
5. Run migrations:
   ```bash
   # Install Vercel CLI locally
   pnpm add -g vercel

   # Pull environment variables
   vercel env pull .env.production

   # Run migrations
   DATABASE_URL=<your-vercel-postgres-url> pnpm prisma migrate deploy
   ```

## Step 7: Future Deployments

Every time you push to the `main` branch on GitHub, Vercel will automatically:
- Build your app
- Run tests (if configured)
- Deploy to production

For development branches:
- Push to any other branch creates a preview deployment
- Each PR gets its own preview URL

## Useful Vercel Commands

```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy from local (for testing)
vercel

# Deploy to production
vercel --prod

# Pull environment variables locally
vercel env pull

# View logs
vercel logs
```

## Troubleshooting

### Build Fails with "Prisma Client not generated"
- Make sure your `package.json` has the postinstall script:
  ```json
  "postinstall": "prisma generate"
  ```

### Database Connection Issues
- Verify `DATABASE_URL` is set correctly in Vercel environment variables
- Make sure your database allows connections from Vercel's IP range
- For Vercel Postgres, it should work automatically

### Email Not Sending
- Verify `RESEND_API_KEY` is correct
- Make sure your sending email is verified in Resend
- Check Resend dashboard for error logs

## Production Checklist

- [ ] All environment variables are set in Vercel
- [ ] Database is created and migrations are run
- [ ] NEXTAUTH_URL matches your Vercel domain
- [ ] Resend email is verified and working
- [ ] Test login/signup on production
- [ ] Create a test quote and send email
- [ ] Verify Open Graph preview works (share a quote link)

## Next Steps

Once deployed, you might want to:
- Add a custom domain in Vercel settings
- Set up analytics (Vercel Analytics is built-in)
- Configure error monitoring (Sentry, LogRocket, etc.)
- Add a staging environment (separate branch)
