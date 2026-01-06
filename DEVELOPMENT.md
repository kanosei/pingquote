# Development Guide

This guide helps you understand and extend PingQuote's codebase.

## Getting Started

Follow the setup instructions in [README.md](README.md) first.

## Project Architecture

### App Router Structure

PingQuote uses Next.js 14's App Router with the following structure:

```
app/
├── (public routes)
│   ├── page.tsx              # Landing page
│   ├── login/                # Authentication
│   └── signup/
├── (protected routes - via middleware)
│   ├── dashboard/            # Main app dashboard
│   └── quotes/new/           # Quote creation
└── (public data routes)
    └── q/[id]/               # Public quote view
```

### Data Flow

```
User Action → Server Action → Prisma → PostgreSQL
                ↓
            Revalidate Path
                ↓
            UI Updates
```

### Key Patterns

#### Server Actions

All mutations use Next.js Server Actions (not API routes). Benefits:
- Type-safe
- No need to write API routes
- Automatic revalidation
- Better DX

Example: [`app/actions/quotes.ts`](app/actions/quotes.ts)

#### Authentication

Using NextAuth.js with Credentials provider:
- Server-side session validation
- JWT-based sessions
- Middleware protection for routes

Configuration: [`lib/auth.ts`](lib/auth.ts)

## Database Schema Design

### Relationships

```
User (1) ──< (N) Quote (1) ──< (N) QuoteItem
                   │
                   └──< (N) QuoteView
```

### Cascade Deletes

When a user is deleted, all their quotes are deleted (cascade).
When a quote is deleted, all items and views are deleted (cascade).

### Indexing

Indexes are added for:
- Foreign keys (`userId`, `quoteId`)
- Frequently queried fields (`viewedAt`)

## Adding New Features

### Example: Add Quote Templates

1. **Create migration**
   ```prisma
   model QuoteTemplate {
     id     String @id @default(cuid())
     userId String
     name   String
     items  TemplateItem[]
     user   User @relation(fields: [userId], references: [id])
   }
   ```

2. **Generate migration**
   ```bash
   npx prisma migrate dev --name add_quote_templates
   ```

3. **Create server actions**
   ```typescript
   // app/actions/templates.ts
   export async function createTemplate(data) { ... }
   export async function getTemplates() { ... }
   ```

4. **Add UI**
   ```typescript
   // app/templates/page.tsx
   export default function TemplatesPage() { ... }
   ```

### Example: Add Email Notifications

1. **Choose email provider** (Resend, SendGrid, etc.)

2. **Install package**
   ```bash
   npm install resend
   ```

3. **Add to env**
   ```env
   RESEND_API_KEY=your_key
   ```

4. **Create email service**
   ```typescript
   // lib/email.ts
   import { Resend } from 'resend';

   const resend = new Resend(process.env.RESEND_API_KEY);

   export async function sendQuoteViewedEmail(quoteId: string) {
     // Implementation
   }
   ```

5. **Call in trackQuoteView**
   ```typescript
   // app/actions/public.ts
   export async function trackQuoteView(quoteId: string) {
     await prisma.quoteView.create({ data: { quoteId } });
     await sendQuoteViewedEmail(quoteId);
   }
   ```

## Testing

### Manual Testing Flow

1. **Sign up**
   - Visit `/signup`
   - Create account with email/password
   - Should redirect to `/dashboard`

2. **Create Quote**
   - Click "New Quote"
   - Add client name: "Test Client"
   - Add line items
   - Add optional discount
   - Submit

3. **View Quote**
   - Click "View" on quote row
   - Opens in new tab
   - Should see formatted quote

4. **Verify Tracking**
   - Close quote tab
   - Refresh dashboard
   - Status should show "Hot" 🔥
   - Last viewed should show "Today"

5. **Test Status Logic**
   - Manually update `viewedAt` in database to test statuses:
     ```sql
     -- Make quote "Warm"
     UPDATE quote_views SET viewed_at = NOW() - INTERVAL '3 days';

     -- Make quote "Cold"
     UPDATE quote_views SET viewed_at = NOW() - INTERVAL '10 days';
     ```

### Database Testing with Prisma Studio

```bash
npx prisma studio
```

Opens a GUI at `http://localhost:5555` to browse and edit data.

## Code Style

### TypeScript

- Enable strict mode
- Prefer explicit types for function parameters
- Use type inference for variables

### Components

- Use `"use client"` only when necessary
- Prefer server components by default
- Extract reusable UI into `components/`

### Naming Conventions

- Components: `PascalCase` (e.g., `QuotesTable`)
- Functions: `camelCase` (e.g., `getQuoteStatus`)
- Files: `kebab-case.tsx` (e.g., `quote-status.tsx`)
- Server Actions: `camelCase` (e.g., `createQuote`)

## Common Tasks

### Add a new UI component

```bash
# Use shadcn CLI
npx shadcn-ui@latest add [component-name]
```

### Add a new database field

1. Update `prisma/schema.prisma`
2. Create migration:
   ```bash
   npx prisma migrate dev --name description
   ```
3. Update TypeScript types (auto-generated)

### Update authentication logic

Edit [`lib/auth.ts`](lib/auth.ts)

### Change status/heat logic

Edit [`lib/quote-status.ts`](lib/quote-status.ts)

## Performance Optimization

### Current Optimizations

- Server components by default (no unnecessary JS)
- Prisma connection pooling
- Conditional view tracking (client-side only)

### Future Optimizations

- Add ISR for public quote pages
- Implement pagination for dashboard
- Add database indexes for large datasets
- Use Prisma query optimization

## Security Checklist

- [x] Passwords hashed with bcrypt
- [x] Server-side session validation
- [x] CSRF protection via NextAuth
- [x] SQL injection prevention via Prisma
- [x] XSS prevention via React
- [x] Ownership verification before mutations
- [ ] Rate limiting (not implemented - add if needed)
- [ ] Email verification (not implemented - add if needed)

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `NEXTAUTH_URL` | Yes (prod) | App URL (auto-set in Vercel) |
| `NEXTAUTH_SECRET` | Yes | Random secret for JWT signing |

## Debugging

### Enable Prisma Query Logging

In `lib/db.ts`, change:
```typescript
log: ["query", "error", "warn"]
```

### Enable NextAuth Debug Mode

Add to `.env`:
```env
NEXTAUTH_DEBUG=true
```

### Common Issues

**"Prisma Client is not generated"**
```bash
npx prisma generate
```

**"Invalid session"**
- Check `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your domain
- Clear browser cookies

**"Database connection failed"**
- Verify `DATABASE_URL` is correct
- Check database is running
- Verify network access

## Useful Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth.js Docs](https://next-auth.js.org)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

## Contributing

When adding features:

1. Follow existing patterns
2. Add TypeScript types
3. Document complex logic
4. Test manually before committing
5. Update README if adding major features

---

Happy coding! 🚀
