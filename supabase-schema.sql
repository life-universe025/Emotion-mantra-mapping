-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create mantras table
CREATE TABLE mantras (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  sanskrit TEXT NOT NULL,
  devanagari TEXT NOT NULL,
  transliteration TEXT NOT NULL,
  meaning TEXT NOT NULL,
  audio_url TEXT,
  suggested_rounds INTEGER DEFAULT 108,
  emotions TEXT[] NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create sessions table
CREATE TABLE sessions (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mantra_id INTEGER NOT NULL REFERENCES mantras(id),
  repetitions INTEGER NOT NULL,
  duration_seconds INTEGER NOT NULL,
  notes TEXT,
  before_mood INTEGER CHECK (before_mood >= 1 AND before_mood <= 10),
  after_mood INTEGER CHECK (after_mood >= 1 AND after_mood <= 10),
  mood_improvement INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_stats table
CREATE TABLE user_stats (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  last_practice_date DATE,
  current_streak INTEGER DEFAULT 0,
  total_repetitions INTEGER DEFAULT 0,
  total_mood_improvements INTEGER DEFAULT 0,
  average_mood_improvement DECIMAL(3,2) DEFAULT 0.00,
  sessions_with_mood_tracking INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_created_at ON sessions(created_at);
CREATE INDEX idx_sessions_mantra_id ON sessions(mantra_id);
CREATE INDEX idx_mantras_emotions ON mantras USING GIN(emotions);

-- Mood tracking indexes
CREATE INDEX idx_sessions_mood_improvement ON sessions(mood_improvement) WHERE mood_improvement IS NOT NULL;
CREATE INDEX idx_sessions_before_mood ON sessions(before_mood) WHERE before_mood IS NOT NULL;
CREATE INDEX idx_sessions_after_mood ON sessions(after_mood) WHERE after_mood IS NOT NULL;

-- Create function to update user stats
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
DECLARE
  user_stats_record user_stats%ROWTYPE;
  today_date DATE := CURRENT_DATE;
  yesterday_date DATE := CURRENT_DATE - INTERVAL '1 day';
BEGIN
  -- Get or create user stats
  SELECT * INTO user_stats_record 
  FROM user_stats 
  WHERE user_id = NEW.user_id;
  
  IF NOT FOUND THEN
    -- Create new user stats record
    INSERT INTO user_stats (user_id, last_practice_date, current_streak, total_repetitions)
    VALUES (NEW.user_id, today_date, 1, NEW.repetitions);
  ELSE
    -- Update existing stats
    IF user_stats_record.last_practice_date = yesterday_date THEN
      -- Consecutive day, increment streak
      UPDATE user_stats 
      SET 
        current_streak = current_streak + 1,
        last_practice_date = today_date,
        total_repetitions = total_repetitions + NEW.repetitions,
        updated_at = NOW()
      WHERE user_id = NEW.user_id;
    ELSIF user_stats_record.last_practice_date = today_date THEN
      -- Same day, just add repetitions
      UPDATE user_stats 
      SET 
        total_repetitions = total_repetitions + NEW.repetitions,
        updated_at = NOW()
      WHERE user_id = NEW.user_id;
    ELSE
      -- Gap in practice, reset streak
      UPDATE user_stats 
      SET 
        current_streak = 1,
        last_practice_date = today_date,
        total_repetitions = total_repetitions + NEW.repetitions,
        updated_at = NOW()
      WHERE user_id = NEW.user_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function to update mood analytics in user stats
CREATE OR REPLACE FUNCTION update_mood_analytics()
RETURNS TRIGGER AS $$
DECLARE
  user_stats_record user_stats%ROWTYPE;
  mood_improvement INTEGER;
BEGIN
  -- Only process if mood data is present
  IF NEW.before_mood IS NOT NULL AND NEW.after_mood IS NOT NULL THEN
    mood_improvement := NEW.after_mood - NEW.before_mood;
    
    -- Get current user stats
    SELECT * INTO user_stats_record 
    FROM user_stats 
    WHERE user_id = NEW.user_id;
    
    IF FOUND THEN
      -- Update mood analytics
      UPDATE user_stats 
      SET 
        total_mood_improvements = total_mood_improvements + GREATEST(0, mood_improvement),
        sessions_with_mood_tracking = sessions_with_mood_tracking + 1,
        average_mood_improvement = CASE 
          WHEN sessions_with_mood_tracking + 1 > 0 THEN
            (total_mood_improvements + GREATEST(0, mood_improvement))::DECIMAL / (sessions_with_mood_tracking + 1)
          ELSE 0
        END,
        updated_at = NOW()
      WHERE user_id = NEW.user_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update user stats
CREATE TRIGGER trigger_update_user_stats
  AFTER INSERT ON sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_user_stats();

-- Create trigger to update mood analytics
CREATE TRIGGER trigger_update_mood_analytics
  AFTER INSERT ON sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_mood_analytics();

-- Enable Row Level Security (RLS)
ALTER TABLE mantras ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Mantras are private (read-only for authenticated users)
CREATE POLICY "Authenticated users can view mantras" ON mantras
  FOR SELECT USING (auth.role() = 'authenticated');

-- Sessions are private to each user
CREATE POLICY "Users can view their own sessions" ON sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sessions" ON sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User stats are private to each user
CREATE POLICY "Users can view their own stats" ON user_stats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats" ON user_stats
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stats" ON user_stats
  FOR INSERT WITH CHECK (auth.uid() = user_id);
