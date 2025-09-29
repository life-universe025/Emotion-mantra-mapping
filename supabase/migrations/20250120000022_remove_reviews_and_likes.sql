-- Remove reviews and likes system from mantras
-- This migration drops the tables and views that were added for the review system

-- Drop the view first (it depends on the tables)
DROP VIEW IF EXISTS mantra_stats;

-- Drop the tables
DROP TABLE IF EXISTS mantra_likes;
DROP TABLE IF EXISTS mantra_reviews;

-- Note: The tables and view have been completely removed
-- This cleans up the database from the review system that was removed
