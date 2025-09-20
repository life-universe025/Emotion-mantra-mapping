-- Add breathing guide data to sessions table
ALTER TABLE sessions 
ADD COLUMN breathing_pattern TEXT,
ADD COLUMN breathing_cycles INTEGER DEFAULT 0,
ADD COLUMN breathing_duration_seconds INTEGER DEFAULT 0;

-- Add breathing stats to user_stats table
ALTER TABLE user_stats
ADD COLUMN total_breathing_sessions INTEGER DEFAULT 0,
ADD COLUMN total_breathing_duration INTEGER DEFAULT 0,
ADD COLUMN favorite_breathing_pattern TEXT;

-- Update the trigger function to include breathing stats
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
    INSERT INTO user_stats (
      user_id, 
      last_practice_date, 
      current_streak, 
      total_repetitions,
      total_breathing_sessions,
      total_breathing_duration,
      favorite_breathing_pattern
    )
    VALUES (
      NEW.user_id, 
      today_date, 
      1, 
      NEW.repetitions,
      CASE WHEN NEW.breathing_pattern IS NOT NULL THEN 1 ELSE 0 END,
      COALESCE(NEW.breathing_duration_seconds, 0),
      NEW.breathing_pattern
    );
  ELSE
    -- Update existing stats
    IF user_stats_record.last_practice_date = yesterday_date THEN
      -- Consecutive day, increment streak
      UPDATE user_stats 
      SET 
        current_streak = current_streak + 1,
        last_practice_date = today_date,
        total_repetitions = total_repetitions + NEW.repetitions,
        total_breathing_sessions = total_breathing_sessions + CASE WHEN NEW.breathing_pattern IS NOT NULL THEN 1 ELSE 0 END,
        total_breathing_duration = total_breathing_duration + COALESCE(NEW.breathing_duration_seconds, 0),
        updated_at = NOW()
      WHERE user_id = NEW.user_id;
    ELSIF user_stats_record.last_practice_date = today_date THEN
      -- Same day, just add repetitions and breathing data
      UPDATE user_stats 
      SET 
        total_repetitions = total_repetitions + NEW.repetitions,
        total_breathing_sessions = total_breathing_sessions + CASE WHEN NEW.breathing_pattern IS NOT NULL THEN 1 ELSE 0 END,
        total_breathing_duration = total_breathing_duration + COALESCE(NEW.breathing_duration_seconds, 0),
        updated_at = NOW()
      WHERE user_id = NEW.user_id;
    ELSE
      -- Gap in practice, reset streak
      UPDATE user_stats 
      SET 
        current_streak = 1,
        last_practice_date = today_date,
        total_repetitions = total_repetitions + NEW.repetitions,
        total_breathing_sessions = total_breathing_sessions + CASE WHEN NEW.breathing_pattern IS NOT NULL THEN 1 ELSE 0 END,
        total_breathing_duration = total_breathing_duration + COALESCE(NEW.breathing_duration_seconds, 0),
        updated_at = NOW()
      WHERE user_id = NEW.user_id;
    END IF;
    
    -- Update favorite breathing pattern if this session used breathing
    IF NEW.breathing_pattern IS NOT NULL THEN
      -- Find the most used breathing pattern for this user
      WITH pattern_counts AS (
        SELECT breathing_pattern, COUNT(*) as usage_count
        FROM sessions 
        WHERE user_id = NEW.user_id AND breathing_pattern IS NOT NULL
        GROUP BY breathing_pattern
        ORDER BY usage_count DESC
        LIMIT 1
      )
      UPDATE user_stats 
      SET favorite_breathing_pattern = (SELECT breathing_pattern FROM pattern_counts)
      WHERE user_id = NEW.user_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
