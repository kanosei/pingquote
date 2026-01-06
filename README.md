# PingQuote

> Know when your quote is viewed.

PingQuote is a production-ready MicroSaaS that allows freelancers to create simple quotes, send them as shareable links, and see when those quotes are viewed.

## Features

- **Simple Quote Builder**: Create professional quotes with line items, discounts, and notes
- **Shareable Links**: Each quote gets a unique, shareable URL
- **View Tracking**: Privacy-first tracking (timestamp only, no IP or personal data)
- **Smart Status**: Automatic "heat" detection (Hot/Warm/Cold) based on view history
- **Dashboard**: Clean table view of all your quotes with real-time status
- **Secure Authentication**: Email/password auth with NextAuth.js
- **Stripe-Ready**: User model prepared for subscription integration

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL via Prisma ORM
- **Authentication**: NextAuth.js
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Deployment**: Vercel (Hobby tier compatible)

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (or Docker to run PostgreSQL locally)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd pingquote
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```

   Then edit `.env` with your values:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/pingquote?schema=public"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="<generate-with-openssl-rand-base64-32>"
   ```

   Generate a secure `NEXTAUTH_SECRET`:
   ```bash
   openssl rand -base64 32
   ```

   **Quick Setup with Docker:**
   If you have Docker installed, you can use the included Docker Compose setup:
   ```bash
   # Start PostgreSQL in Docker
   docker-compose up -d

   # The .env file is already configured for Docker!
   ```

   See [DOCKER.md](DOCKER.md) for detailed Docker instructions.

4. **Set up the database**
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

### User
- `id`: Unique identifier
- `email`: User email (unique)
- `name`: User's name
- `password`: Hashed password
- `createdAt`, `updatedAt`: Timestamps
- Stripe fields (commented out, ready for implementation)

### Quote
- `id`: Unique identifier
- `userId`: Foreign key to User
- `clientName`: Name of the client
- `discountType`: "percentage" | "fixed" | null
- `discount`: Discount value
- `notes`: Optional notes
- `createdAt`, `updatedAt`: Timestamps

### QuoteItem
- `id`: Unique identifier
- `quoteId`: Foreign key to Quote
- `description`: Item description
- `quantity`: Quantity (decimal)
- `price`: Unit price

### QuoteView
- `id`: Unique identifier
- `quoteId`: Foreign key to Quote
- `viewedAt`: Timestamp of view (privacy-first: no IP or personal data)

## Project Structure

```
├── app/                      # Next.js app directory
│   ├── actions/              # Server actions
│   │   ├── auth.ts           # Authentication actions
│   │   ├── quotes.ts         # Quote CRUD operations
│   │   └── public.ts         # Public quote viewing
│   ├── api/                  # API routes
│   │   └── auth/             # NextAuth.js endpoints
│   ├── dashboard/            # Authenticated dashboard
│   ├── login/                # Login page
│   ├── signup/               # Signup page
│   ├── quotes/               # Quote management
│   │   └── new/              # Create new quote
│   ├── q/[id]/               # Public quote view
│   └── page.tsx              # Landing page
├── components/               # React components
│   ├── ui/                   # shadcn/ui components
│   ├── dashboard-header.tsx  # Dashboard navigation
│   ├── logo.tsx              # PingQuote logo
│   ├── quotes-table.tsx      # Quotes listing table
│   └── quote-view-tracker.tsx # Client-side view tracker
├── lib/                      # Utilities and libraries
│   ├── auth.ts               # NextAuth configuration
│   ├── db.ts                 # Prisma client
│   ├── utils.ts              # General utilities
│   ├── quote-calculations.ts # Server-side quote math
│   └── quote-status.ts       # Heat/status logic
├── prisma/                   # Database schema
│   └── schema.prisma
└── types/                    # TypeScript type definitions
```

## Key Features Explained

### Quote Status Logic

Quotes are automatically categorized based on view history:

- **Hot** 🔥: Viewed in the last 48 hours OR viewed more than once
- **Warm** 😊: Viewed once in the last 7 days
- **Cold** ❄️: Not viewed in 7+ days
- **Unviewed** 👁️: Never opened

Implementation in [`lib/quote-status.ts`](lib/quote-status.ts:8)

### Privacy-First View Tracking

QuoteView records **only** the timestamp of when a quote is opened. No IP addresses, user agents, or personal data are collected. This ensures compliance with privacy regulations while still providing valuable insights.

Implementation in [`app/actions/public.ts`](app/actions/public.ts:22)

### Server-Side Calculations

All quote totals are calculated server-side to ensure accuracy and prevent client-side manipulation. See [`lib/quote-calculations.ts`](lib/quote-calculations.ts:14)

## Deployment to Vercel

### Prerequisites

- Vercel account
- PostgreSQL database (e.g., Vercel Postgres, Supabase, or Neon)

### Steps

1. **Push your code to GitHub**

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. **Configure Environment Variables**

   Add these in Vercel's project settings:
   ```env
   DATABASE_URL=<your-production-database-url>
   NEXTAUTH_SECRET=<your-secret>
   NEXTAUTH_URL=<auto-set-by-vercel>
   ```

4. **Run Database Migrations**

   After first deployment, run migrations:
   ```bash
   npx prisma migrate deploy
   ```

5. **Deploy**

   Vercel will automatically deploy on push to main branch.

### Using Vercel Postgres

Vercel offers a built-in Postgres database:

1. In your Vercel project, go to "Storage" tab
2. Create a new Postgres database
3. Vercel will automatically set `DATABASE_URL` environment variable
4. Redeploy your project

## Future Enhancements (Not Yet Implemented)

### Stripe Subscriptions

The User model is prepared for Stripe integration. Uncomment the Stripe fields in `prisma/schema.prisma` and implement:

- Subscription tiers (Free, Pro, etc.)
- Payment integration
- Usage limits
- Billing portal

### Additional Features

- Email notifications when quotes are viewed
- PDF export
- Custom branding
- Quote templates
- Analytics dashboard
- Client signatures/acceptance

## Development Tips

### Useful Commands

```bash
# Start development server
npm run dev

# Generate Prisma client after schema changes
npx prisma generate

# Create a new migration
npx prisma migrate dev --name <migration-name>

# Open Prisma Studio (database GUI)
npx prisma studio

# Run type checking
npm run build

# Format code
npx prettier --write .
```

### Testing User Flow

1. Sign up at `/signup`
2. Create a quote at `/quotes/new`
3. Copy the public quote URL from dashboard
4. Open it in an incognito window to simulate a client view
5. Return to dashboard to see updated "Hot" status

## Security Considerations

- Passwords are hashed with bcrypt (12 rounds)
- Authentication is server-side with NextAuth.js
- Public quote routes are read-only
- All user-owned data requires authentication
- No tracking scripts or cookies on public pages
- Server actions validate ownership before mutations

## Database Maintenance

### Backup

Always back up your production database before migrations:

```bash
# Using pg_dump
pg_dump $DATABASE_URL > backup.sql
```

### Reset Database (Development Only)

```bash
npx prisma migrate reset
```

## Support

For issues or questions:
- Check existing GitHub issues
- Review the code documentation
- Consult Next.js and Prisma docs

## License

MIT License - feel free to use this for your own projects.

---

**Built with ❤️ for indie makers and freelancers**
