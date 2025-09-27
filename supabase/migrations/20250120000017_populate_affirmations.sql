-- Insert affirmations data
INSERT INTO affirmations (slug, text, category, intensity, emotion_id) VALUES
-- Anxiety & Fear
('anxiety-1', 'I am safe and protected in this moment.', 'Safety', 'gentle', 'ANXIETY'),
('anxiety-2', 'I breathe in peace and exhale fear.', 'Calm', 'moderate', 'ANXIETY'),
('anxiety-3', 'I trust in my ability to handle whatever comes my way.', 'Trust', 'strong', 'ANXIETY'),

-- Stress & Mental Fog
('stress-1', 'My mind is clear and focused.', 'Clarity', 'gentle', 'STRESS'),
('stress-2', 'I release all tension and embrace peace.', 'Release', 'moderate', 'STRESS'),
('stress-3', 'I am capable of handling any challenge with grace.', 'Capability', 'strong', 'STRESS'),

-- Anger & Ego
('anger-1', 'I choose peace over conflict.', 'Peace', 'gentle', 'ANGER'),
('anger-2', 'I release anger and embrace compassion.', 'Compassion', 'moderate', 'ANGER'),
('anger-3', 'I am the master of my emotions, not their slave.', 'Mastery', 'strong', 'ANGER'),

-- Grounding & Calm
('grounding-1', 'I am rooted and stable like a tree.', 'Stability', 'gentle', 'GROUNDING'),
('grounding-2', 'I am centered and balanced in all aspects of my life.', 'Balance', 'moderate', 'GROUNDING'),
('grounding-3', 'I am unshakeable in my inner strength and peace.', 'Strength', 'strong', 'GROUNDING'),

-- Sadness & Compassion
('sadness-1', 'I allow myself to feel and heal.', 'Healing', 'gentle', 'SADNESS'),
('sadness-2', 'My heart is open to love and compassion.', 'Love', 'moderate', 'SADNESS'),
('sadness-3', 'I transform pain into wisdom and strength.', 'Transformation', 'strong', 'SADNESS'),

-- Confidence & New Start
('confidence-1', 'I am worthy of all good things.', 'Worth', 'gentle', 'CONFIDENCE'),
('confidence-2', 'I embrace new opportunities with courage.', 'Courage', 'moderate', 'CONFIDENCE'),
('confidence-3', 'I am unstoppable in pursuing my dreams.', 'Power', 'strong', 'CONFIDENCE'),

-- Peace & Sleep
('peace-1', 'I am at peace with myself and the world.', 'Peace', 'gentle', 'PEACE'),
('peace-2', 'My mind and body are relaxed and calm.', 'Relaxation', 'moderate', 'PEACE'),
('peace-3', 'I surrender to the flow of life with complete trust.', 'Surrender', 'strong', 'PEACE'),

-- Gratitude & Joy
('gratitude-1', 'I am grateful for all the blessings in my life.', 'Gratitude', 'gentle', 'GRATITUDE'),
('gratitude-2', 'Joy flows through me and radiates to others.', 'Joy', 'moderate', 'GRATITUDE'),
('gratitude-3', 'I am a magnet for abundance and happiness.', 'Abundance', 'strong', 'GRATITUDE'),

-- Focus & Study
('focus-1', 'My attention is sharp and unwavering.', 'Attention', 'gentle', 'FOCUS'),
('focus-2', 'I absorb knowledge with ease and clarity.', 'Learning', 'moderate', 'FOCUS'),
('focus-3', 'I am a master of concentration and focus.', 'Mastery', 'strong', 'FOCUS'),

-- Letting Go & Acceptance
('letting-go-1', 'I release what no longer serves me.', 'Release', 'gentle', 'LETTING_GO'),
('letting-go-2', 'I accept what is and flow with life.', 'Acceptance', 'moderate', 'LETTING_GO'),
('letting-go-3', 'I am free from all attachments and limitations.', 'Freedom', 'strong', 'LETTING_GO'),

-- Loneliness & Isolation
('loneliness-1', 'I am connected to all beings through love.', 'Connection', 'gentle', 'LONELINESS'),
('loneliness-2', 'I am never truly alone; I am one with the universe.', 'Unity', 'moderate', 'LONELINESS'),
('loneliness-3', 'I am complete and whole within myself.', 'Wholeness', 'strong', 'LONELINESS'),

-- Restlessness & Agitation
('restlessness-1', 'I find peace in the present moment.', 'Present', 'gentle', 'RESTLESSNESS'),
('restlessness-2', 'I am calm and centered despite external chaos.', 'Calm', 'moderate', 'RESTLESSNESS'),
('restlessness-3', 'I am the eye of the storm, peaceful and still.', 'Stillness', 'strong', 'RESTLESSNESS'),

-- Energy & Vitality
('energy-1', 'I am filled with vibrant, positive energy.', 'Vitality', 'gentle', 'ENERGY'),
('energy-2', 'My energy flows freely and powerfully.', 'Flow', 'moderate', 'ENERGY'),
('energy-3', 'I am an unstoppable force of positive energy.', 'Power', 'strong', 'ENERGY'),

-- Creativity & Inspiration
('creativity-1', 'I am a channel for divine creativity.', 'Channel', 'gentle', 'CREATIVITY'),
('creativity-2', 'Inspiration flows through me effortlessly.', 'Inspiration', 'moderate', 'CREATIVITY'),
('creativity-3', 'I am a limitless source of creative expression.', 'Expression', 'strong', 'CREATIVITY'),

-- Clarity & Insight
('clarity-1', 'My vision is clear and my path is illuminated.', 'Vision', 'gentle', 'CLARITY'),
('clarity-2', 'I see through all illusions to the truth.', 'Truth', 'moderate', 'CLARITY'),
('clarity-3', 'I am a beacon of clarity and wisdom.', 'Wisdom', 'strong', 'CLARITY'),

-- Protection & Safety
('protection-1', 'I am surrounded by divine protection.', 'Divine', 'gentle', 'PROTECTION'),
('protection-2', 'I am safe and secure in all situations.', 'Security', 'moderate', 'PROTECTION'),
('protection-3', 'I am an impenetrable fortress of light and love.', 'Fortress', 'strong', 'PROTECTION'),

-- Motivation & Drive
('motivation-1', 'I am motivated by my highest purpose.', 'Purpose', 'gentle', 'MOTIVATION'),
('motivation-2', 'I move forward with determination and passion.', 'Determination', 'moderate', 'MOTIVATION'),
('motivation-3', 'I am an unstoppable force of positive action.', 'Action', 'strong', 'MOTIVATION'),

-- Patience & Timing
('patience-1', 'I trust in divine timing.', 'Timing', 'gentle', 'PATIENCE'),
('patience-2', 'I am patient with myself and the process.', 'Process', 'moderate', 'PATIENCE'),
('patience-3', 'I am the master of patience and divine timing.', 'Mastery', 'strong', 'PATIENCE'),

-- Renewal & Rebirth
('renewal-1', 'I am reborn with each new day.', 'Rebirth', 'gentle', 'RENEWAL'),
('renewal-2', 'I embrace transformation and renewal.', 'Transformation', 'moderate', 'RENEWAL'),
('renewal-3', 'I am a phoenix rising from the ashes of the old.', 'Phoenix', 'strong', 'RENEWAL'),

-- Self-Love & Worth
('self-love-1', 'I love and accept myself completely.', 'Acceptance', 'gentle', 'SELF_LOVE'),
('self-love-2', 'I am worthy of love, respect, and happiness.', 'Worth', 'moderate', 'SELF_LOVE'),
('self-love-3', 'I am a magnificent being of infinite worth.', 'Magnificence', 'strong', 'SELF_LOVE'),

-- Wisdom & Understanding
('wisdom-1', 'I am open to receiving divine wisdom.', 'Reception', 'gentle', 'WISDOM'),
('wisdom-2', 'I understand the deeper meaning of all experiences.', 'Understanding', 'moderate', 'WISDOM'),
('wisdom-3', 'I am a vessel of infinite wisdom and knowledge.', 'Vessel', 'strong', 'WISDOM'),

-- Healing & Recovery
('healing-1', 'I am healing on all levels of my being.', 'Healing', 'gentle', 'HEALING'),
('healing-2', 'My body, mind, and spirit are in perfect harmony.', 'Harmony', 'moderate', 'HEALING'),
('healing-3', 'I am a powerful force of healing and restoration.', 'Restoration', 'strong', 'HEALING');
