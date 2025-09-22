-- Remove breathing guide data from sessions table
ALTER TABLE sessions 
DROP COLUMN IF EXISTS breathing_pattern,
DROP COLUMN IF EXISTS breathing_cycles,
DROP COLUMN IF EXISTS breathing_duration_seconds;

-- Remove breathing stats from user_stats table
ALTER TABLE user_stats
DROP COLUMN IF EXISTS total_breathing_sessions,
DROP COLUMN IF EXISTS total_breathing_duration,
DROP COLUMN IF EXISTS favorite_breathing_pattern;

-- Update the trigger function to remove breathing stats
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
      total_repetitions
    )
    VALUES (
      NEW.user_id, 
      today_date, 
      1, 
      NEW.repetitions
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
