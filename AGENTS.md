# Repository Guidelines

## Project Structure & Module Organization

- `app/` contains Next.js App Router pages, layouts, and server actions.
- `components/` houses reusable UI components (including `components/ui/`).
- `lib/` contains auth, database, and shared utilities.
- `prisma/` holds the Prisma schema and migrations.
- `public/` stores static assets.
- `types/` includes shared TypeScript types.
- Root config files include `next.config.mjs`, `tailwind.config.ts`, `middleware.ts`.

## Build, Test, and Development Commands

- `npm install` installs dependencies (postinstall runs `prisma generate`).
- `npm run dev` starts the dev server.
- `npm run build` builds the production bundle.
- `npm start` runs the production server.
- `npm run lint` runs Next.js ESLint rules.
- `npx prisma migrate dev --name <name>` creates and applies a migration.
- `npx prisma studio` opens a local database GUI at `http://localhost:5555`.

## Coding Style & Naming Conventions

- TypeScript is used throughout; prefer explicit types for function params when helpful.
- Default to server components; add `"use client"` only when needed.
- Naming: components in `PascalCase`, functions in `camelCase`, files in `kebab-case.tsx`.
- Follow existing formatting and ESLint guidance (`npm run lint`).

## Testing Guidelines

- No automated test suite is configured; follow the manual flow in `DEVELOPMENT.md`.
- Basic manual check: sign up, create a quote, open the public quote, confirm status updates.
- Use Prisma Studio for spot checks on data when needed.

## Commit & Pull Request Guidelines

- Recent commits use short, imperative, sentence-case messages (e.g., “Add share functionality”).
- Keep commits focused; mention migrations or schema changes in the message when applicable.
- PRs should include a clear summary, test steps, and screenshots for UI changes.
- Call out required env var changes (`.env.example`) and database migrations.

## Configuration & Secrets

- Copy `.env.example` to `.env` and set `DATABASE_URL`, `NEXTAUTH_SECRET`, and `NEXTAUTH_URL`.
- Never commit real secrets; use the example file as the source of truth.
