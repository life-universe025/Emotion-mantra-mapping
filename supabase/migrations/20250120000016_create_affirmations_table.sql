-- Create affirmations table
CREATE TABLE affirmations (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  text TEXT NOT NULL,
  category TEXT NOT NULL,
  intensity TEXT NOT NULL CHECK (intensity IN ('gentle', 'moderate', 'strong')),
  emotion_id TEXT NOT NULL REFERENCES emotions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_affirmations_emotion_id ON affirmations(emotion_id);
CREATE INDEX idx_affirmations_intensity ON affirmations(intensity);
CREATE INDEX idx_affirmations_category ON affirmations(category);

-- Enable Row Level Security (RLS)
ALTER TABLE affirmations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies - affirmations are public (read-only for all users)
CREATE POLICY "Affirmations are viewable by everyone" ON affirmations
  FOR SELECT USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_affirmations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER trigger_update_affirmations_updated_at
  BEFORE UPDATE ON affirmations
  FOR EACH ROW
  EXECUTE FUNCTION update_affirmations_updated_at();
