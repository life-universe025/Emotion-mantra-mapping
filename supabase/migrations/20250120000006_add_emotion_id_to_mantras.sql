-- Add emotion_id field to mantras table for 1:1 relationship
ALTER TABLE mantras ADD COLUMN emotion_id TEXT REFERENCES emotions(id);

-- Create index for better performance
CREATE INDEX idx_mantras_emotion_id ON mantras(emotion_id);

-- Update existing mantras with default emotion (PEACE) if they don't have one
UPDATE mantras 
SET emotion_id = 'PEACE' 
WHERE emotion_id IS NULL;
