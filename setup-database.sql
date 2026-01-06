-- PingQuote Database Setup Script
-- Run this script in your Aiven PostgreSQL database SQL editor
-- Database: postgres://avnadmin:xxxxx@kanoseiltd-postgress-kanoseiltd.c.aivencloud.com:24587/defaultdb

-- =====================================================
-- STEP 1: Create Tables
-- =====================================================

-- Create users table
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- Create quotes table
CREATE TABLE "quotes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "clientEmail" TEXT,
    "discountType" TEXT,
    "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "notes" TEXT,
    "linkCopied" INTEGER NOT NULL DEFAULT 0,
    "emailSent" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quotes_pkey" PRIMARY KEY ("id")
);

-- Create quote_items table
CREATE TABLE "quote_items" (
    "id" TEXT NOT NULL,
    "quoteId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "quote_items_pkey" PRIMARY KEY ("id")
);

-- Create quote_views table
CREATE TABLE "quote_views" (
    "id" TEXT NOT NULL,
    "quoteId" TEXT NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quote_views_pkey" PRIMARY KEY ("id")
);

-- =====================================================
-- STEP 2: Create Indexes
-- =====================================================

-- Unique constraint on user email
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- Performance indexes
CREATE INDEX "quotes_userId_idx" ON "quotes"("userId");
CREATE INDEX "quote_items_quoteId_idx" ON "quote_items"("quoteId");
CREATE INDEX "quote_views_quoteId_idx" ON "quote_views"("quoteId");
CREATE INDEX "quote_views_viewedAt_idx" ON "quote_views"("viewedAt");

-- =====================================================
-- STEP 3: Create Foreign Key Relationships
-- =====================================================

-- Link quotes to users
ALTER TABLE "quotes"
    ADD CONSTRAINT "quotes_userId_fkey"
    FOREIGN KEY ("userId")
    REFERENCES "users"("id")
    ON DELETE CASCADE
    ON UPDATE CASCADE;

-- Link quote items to quotes
ALTER TABLE "quote_items"
    ADD CONSTRAINT "quote_items_quoteId_fkey"
    FOREIGN KEY ("quoteId")
    REFERENCES "quotes"("id")
    ON DELETE CASCADE
    ON UPDATE CASCADE;

-- Link quote views to quotes
ALTER TABLE "quote_views"
    ADD CONSTRAINT "quote_views_quoteId_fkey"
    FOREIGN KEY ("quoteId")
    REFERENCES "quotes"("id")
    ON DELETE CASCADE
    ON UPDATE CASCADE;

-- =====================================================
-- STEP 4: Create Prisma Migrations Table (optional but recommended)
-- =====================================================

-- This table tracks which migrations have been applied
CREATE TABLE "_prisma_migrations" (
    "id" VARCHAR(36) NOT NULL PRIMARY KEY,
    "checksum" VARCHAR(64) NOT NULL,
    "finished_at" TIMESTAMP(3),
    "migration_name" VARCHAR(255) NOT NULL,
    "logs" TEXT,
    "rolled_back_at" TIMESTAMP(3),
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "applied_steps_count" INTEGER NOT NULL DEFAULT 0
);

-- Insert migration records to mark them as applied
INSERT INTO "_prisma_migrations" ("id", "checksum", "migration_name", "finished_at", "applied_steps_count")
VALUES
    ('20260104221318-init', '20260104221318', '20260104221318_init', CURRENT_TIMESTAMP, 1),
    ('20260105141559-initial-setup', '20260105141559', '20260105141559_initial_setup_with_client_email', CURRENT_TIMESTAMP, 1),
    ('20260105211900-add-counters', '20260105211900', '20260105211900_add_link_copied_and_email_sent_counters', CURRENT_TIMESTAMP, 1);

-- =====================================================
-- DONE!
-- =====================================================
-- Your database is now ready for PingQuote.
-- Update your Vercel environment variable:
-- DATABASE_URL=postgres://avnadmin:xxxxx@kanoseiltd-postgress-kanoseiltd.c.aivencloud.com:24587/defaultdb?sslmode=require
