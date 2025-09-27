-- Simple migration to add emotion_id to mantras table
-- This avoids conflicts with existing schema

-- Add emotion_id column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'mantras' 
        AND column_name = 'emotion_id'
    ) THEN
        ALTER TABLE mantras ADD COLUMN emotion_id TEXT;
    END IF;
END $$;

-- Add foreign key constraint if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'mantras_emotion_id_fkey'
    ) THEN
        ALTER TABLE mantras ADD CONSTRAINT mantras_emotion_id_fkey 
        FOREIGN KEY (emotion_id) REFERENCES emotions(id);
    END IF;
END $$;

-- Create index if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_mantras_emotion_id ON mantras(emotion_id);
