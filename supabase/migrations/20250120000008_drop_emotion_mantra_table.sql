-- Drop the emotion_mantra junction table since we're using 1:1 mapping
-- with emotion_id field directly in mantras table

-- Drop the table if it exists
DROP TABLE IF EXISTS emotion_mantra;
