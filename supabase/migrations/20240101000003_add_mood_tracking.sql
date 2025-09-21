-- Add mood tracking columns to sessions table
ALTER TABLE sessions 
ADD COLUMN before_mood INTEGER CHECK (before_mood >= 1 AND before_mood <= 10),
ADD COLUMN after_mood INTEGER CHECK (after_mood >= 1 AND after_mood <= 10),
ADD COLUMN mood_improvement INTEGER;

-- Add comments for documentation
COMMENT ON COLUMN sessions.before_mood IS 'Mood rating before practice (1-10 scale)';
COMMENT ON COLUMN sessions.after_mood IS 'Mood rating after practice (1-10 scale)';
COMMENT ON COLUMN sessions.mood_improvement IS 'Mood improvement (after_mood - before_mood)';

-- Create index for mood queries (useful for analytics)
CREATE INDEX idx_sessions_mood_improvement ON sessions(mood_improvement) WHERE mood_improvement IS NOT NULL;
CREATE INDEX idx_sessions_before_mood ON sessions(before_mood) WHERE before_mood IS NOT NULL;
CREATE INDEX idx_sessions_after_mood ON sessions(after_mood) WHERE after_mood IS NOT NULL;

-- Update the user_stats table to include mood analytics
ALTER TABLE user_stats 
ADD COLUMN total_mood_improvements INTEGER DEFAULT 0,
ADD COLUMN average_mood_improvement DECIMAL(3,2) DEFAULT 0.00,
ADD COLUMN sessions_with_mood_tracking INTEGER DEFAULT 0;

-- Add comments for mood analytics
COMMENT ON COLUMN user_stats.total_mood_improvements IS 'Total positive mood improvements across all sessions';
COMMENT ON COLUMN user_stats.average_mood_improvement IS 'Average mood improvement per session';
COMMENT ON COLUMN user_stats.sessions_with_mood_tracking IS 'Number of sessions with mood tracking data';

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

-- Create trigger to update mood analytics
CREATE TRIGGER trigger_update_mood_analytics
  AFTER INSERT ON sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_mood_analytics();
