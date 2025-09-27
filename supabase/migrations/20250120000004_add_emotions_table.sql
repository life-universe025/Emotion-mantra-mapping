-- Create emotions table
CREATE TABLE IF NOT EXISTS emotions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  description TEXT NOT NULL,
  color TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert emotion data
INSERT INTO emotions (id, name, icon, description, color) VALUES
('ANXIETY', 'Anxiety / Fear', '😰', 'Feeling worried, nervous, or afraid', 'bg-red-100 text-red-700 border-red-200'),
('STRESS', 'Stress / Mental Fog', '🧠', 'Overwhelmed, scattered, or unclear', 'bg-orange-100 text-orange-700 border-orange-200'),
('ANGER', 'Anger / Ego', '😤', 'Frustrated, irritated, or prideful', 'bg-red-100 text-red-700 border-red-200'),
('GROUNDING', 'Grounding / Calm', '🌱', 'Need to center and find stability', 'bg-amber-100 text-amber-700 border-amber-200'),
('SADNESS', 'Sadness / Compassion', '💙', 'Feeling down or need more empathy', 'bg-amber-100 text-amber-700 border-amber-200'),
('CONFIDENCE', 'Confidence / New Start', '✨', 'Ready for change or new beginnings', 'bg-orange-100 text-orange-700 border-orange-200'),
('PEACE', 'Peace / Sleep / Soothing', '🕊️', 'Seeking tranquility and rest', 'bg-yellow-100 text-yellow-700 border-yellow-200'),
('GRATITUDE', 'Gratitude / Joy', '🙏', 'Feeling thankful and joyful', 'bg-yellow-100 text-yellow-700 border-yellow-200'),
('FOCUS', 'Focus / Study', '🎯', 'Need clarity and concentration', 'bg-orange-100 text-orange-700 border-orange-200'),
('LETTING_GO', 'Letting Go / Acceptance', '🍃', 'Release and surrender', 'bg-amber-100 text-amber-700 border-amber-200'),
('LONELINESS', 'Loneliness / Isolation', '🏠', 'Feeling disconnected or alone', 'bg-orange-100 text-orange-700 border-orange-200'),
('RESTLESSNESS', 'Restlessness / Hyperactivity', '⚡', 'Feeling agitated or overstimulated', 'bg-yellow-100 text-yellow-700 border-yellow-200'),
('ENERGY', 'Energy / Vitality', '🔥', 'Need for motivation and strength', 'bg-red-100 text-red-700 border-red-200'),
('CREATIVITY', 'Creativity / Inspiration', '🎨', 'Seeking artistic expression or new ideas', 'bg-purple-100 text-purple-700 border-purple-200'),
('CLARITY', 'Clarity / Wisdom', '💡', 'Need for understanding and insight', 'bg-blue-100 text-blue-700 border-blue-200'),
('PROTECTION', 'Protection / Safety', '🛡️', 'Feeling vulnerable or seeking security', 'bg-gray-100 text-gray-700 border-gray-200'),
('MOTIVATION', 'Motivation / Drive', '🚀', 'Need for inspiration and action', 'bg-green-100 text-green-700 border-green-200'),
('PATIENCE', 'Patience / Acceptance', '⏰', 'Learning to wait and accept process', 'bg-indigo-100 text-indigo-700 border-indigo-200'),
('RENEWAL', 'Renewal / Fresh Start', '🌱', 'Ready for transformation and growth', 'bg-emerald-100 text-emerald-700 border-emerald-200'),
('SELF_LOVE', 'Self Love / Worth', '💖', 'Building self-esteem and self-care', 'bg-pink-100 text-pink-700 border-pink-200'),
('WISDOM', 'Wisdom / Understanding', '🧠', 'Seeking deeper knowledge and insight', 'bg-violet-100 text-violet-700 border-violet-200'),
('HEALING', 'Healing / Recovery', '💚', 'Physical, emotional, or spiritual healing', 'bg-teal-100 text-teal-700 border-teal-200');
