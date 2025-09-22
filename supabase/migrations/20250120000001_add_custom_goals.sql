-- Add custom repetition goals to user_stats table
ALTER TABLE user_stats 
ADD COLUMN custom_repetition_goal INTEGER DEFAULT NULL,
ADD COLUMN goal_set_at TIMESTAMPTZ DEFAULT NULL;

-- Add index for custom goals
CREATE INDEX idx_user_stats_custom_goal ON user_stats(custom_repetition_goal) WHERE custom_repetition_goal IS NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN user_stats.custom_repetition_goal IS 'User-defined repetition goal for mantra practice sessions';
COMMENT ON COLUMN user_stats.goal_set_at IS 'Timestamp when the custom goal was last set';
