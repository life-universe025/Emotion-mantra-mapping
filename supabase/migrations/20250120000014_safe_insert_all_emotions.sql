-- Safely insert all emotions from emotions.ts file
-- This migration will insert emotions without deleting existing ones

-- Insert all 22 emotions with ON CONFLICT to handle duplicates
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
('RESTLESSNESS', 'Restlessness / Agitation', '⚡', 'Unable to settle or find calm', 'bg-yellow-100 text-yellow-700 border-yellow-200'),
('ENERGY', 'Energy / Vitality', '💪', 'Need for physical or mental energy', 'bg-orange-100 text-orange-700 border-orange-200'),
('CREATIVITY', 'Creativity / Inspiration', '🎨', 'Seeking creative flow and inspiration', 'bg-orange-100 text-orange-700 border-orange-200'),
('CLARITY', 'Clarity / Insight', '👁️', 'Need for clear vision and understanding', 'bg-yellow-100 text-yellow-700 border-yellow-200'),
('PROTECTION', 'Protection / Safety', '🛡️', 'Seeking security and protection', 'bg-amber-100 text-amber-700 border-amber-200'),
('MOTIVATION', 'Motivation / Drive', '🚀', 'Need for motivation and forward momentum', 'bg-red-100 text-red-700 border-red-200'),
('PATIENCE', 'Patience / Timing', '⏰', 'Learning to wait and trust the process', 'bg-amber-100 text-amber-700 border-amber-200'),
('RENEWAL', 'Renewal / Rebirth', '🔄', 'Seeking fresh start and transformation', 'bg-yellow-100 text-yellow-700 border-yellow-200'),
('SELF_LOVE', 'Self-Love / Worth', '💖', 'Cultivating self-compassion and worth', 'bg-orange-100 text-orange-700 border-orange-200'),
('WISDOM', 'Wisdom / Understanding', '💡', 'Seeking deeper knowledge and insight', 'bg-yellow-100 text-yellow-700 border-yellow-200'),
('HEALING', 'Healing / Recovery', '🌿', 'Physical, emotional, or spiritual healing', 'bg-amber-100 text-amber-700 border-amber-200')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  icon = EXCLUDED.icon,
  description = EXCLUDED.description,
  color = EXCLUDED.color;

-- Verify all emotions were inserted
SELECT COUNT(*) as total_emotions FROM emotions;
SELECT id, name, icon FROM emotions ORDER BY id;
