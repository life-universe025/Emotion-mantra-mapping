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
  suggested_rounds INTEGER DEFAULT 9,
  emotions TEXT[] NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create sessions table
CREATE TABLE sessions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  mantra_id INTEGER REFERENCES mantras(id),
  repetitions INTEGER NOT NULL,
  duration_seconds INTEGER NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_stats table
CREATE TABLE user_stats (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  last_practice_date DATE,
  current_streak INTEGER DEFAULT 0,
  total_repetitions INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_created_at ON sessions(created_at);
CREATE INDEX idx_sessions_mantra_id ON sessions(mantra_id);
CREATE INDEX idx_mantras_emotions ON mantras USING GIN(emotions);

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

-- Create trigger to automatically update user stats
CREATE TRIGGER trigger_update_user_stats
  AFTER INSERT ON sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_user_stats();

-- Enable Row Level Security (RLS)
ALTER TABLE mantras ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Mantras are public (read-only for all users)
CREATE POLICY "Mantras are viewable by everyone" ON mantras
  FOR SELECT USING (true);

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
