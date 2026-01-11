-- PingQuote Database Reset Script
-- WARNING: This will delete ALL data from your database!
-- Use with caution - this action cannot be undone.

-- Disable foreign key checks temporarily (if needed)
-- For PostgreSQL, we handle cascading deletes through the schema

-- Delete all data in reverse order of dependencies
-- (Child tables first, then parent tables)

-- Delete quote views
DELETE FROM quote_views;

-- Delete quote items
DELETE FROM quote_items;

-- Delete quotes
DELETE FROM quotes;

-- Delete organization invites
DELETE FROM organization_invites;

-- Delete organization members
DELETE FROM organization_members;

-- Delete organizations
DELETE FROM organizations;

-- Delete users (this will cascade delete any remaining related data)
DELETE FROM users;

-- Reset sequences (optional - uncomment if you want to reset ID counters)
-- ALTER SEQUENCE quote_views_id_seq RESTART WITH 1;
-- ALTER SEQUENCE quote_items_id_seq RESTART WITH 1;
-- ALTER SEQUENCE quotes_id_seq RESTART WITH 1;
-- ALTER SEQUENCE organization_invites_id_seq RESTART WITH 1;
-- ALTER SEQUENCE organization_members_id_seq RESTART WITH 1;
-- ALTER SEQUENCE organizations_id_seq RESTART WITH 1;
-- ALTER SEQUENCE users_id_seq RESTART WITH 1;

-- Verify the database is empty
SELECT 'Users:' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Organizations:', COUNT(*) FROM organizations
UNION ALL
SELECT 'Organization Members:', COUNT(*) FROM organization_members
UNION ALL
SELECT 'Organization Invites:', COUNT(*) FROM organization_invites
UNION ALL
SELECT 'Quotes:', COUNT(*) FROM quotes
UNION ALL
SELECT 'Quote Items:', COUNT(*) FROM quote_items
UNION ALL
SELECT 'Quote Views:', COUNT(*) FROM quote_views;

-- Success message
SELECT 'Database reset complete!' as status;
