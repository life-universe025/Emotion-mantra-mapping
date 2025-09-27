-- Create emotion_mantra junction table for many-to-many relationship
CREATE TABLE IF NOT EXISTS emotion_mantra (
  id SERIAL PRIMARY KEY,
  emotion_id TEXT NOT NULL REFERENCES emotions(id) ON DELETE CASCADE,
  mantra_id INTEGER NOT NULL REFERENCES mantras(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(emotion_id, mantra_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_emotion_mantra_emotion_id ON emotion_mantra(emotion_id);
CREATE INDEX IF NOT EXISTS idx_emotion_mantra_mantra_id ON emotion_mantra(mantra_id);

-- Insert emotion-mantra relationships based on the existing mantras
-- First, let's create relationships for mantras that exist
INSERT INTO emotion_mantra (emotion_id, mantra_id) 
SELECT 
  CASE 
    WHEN m.slug = 'mahamrityunjaya' THEN 'ANXIETY'
    WHEN m.slug = 'gayatri' THEN 'STRESS'
    WHEN m.slug = 'om-namah-shivaya' THEN 'ANGER'
    WHEN m.slug = 'so-ham' THEN 'GROUNDING'
    WHEN m.slug = 'om-mani-padme-hum' THEN 'SADNESS'
    WHEN m.slug = 'ganesh-mantra' THEN 'CONFIDENCE'
    WHEN m.slug = 'om-shanti' THEN 'PEACE'
    WHEN m.slug = 'lokah-samastah' THEN 'GRATITUDE'
    WHEN m.slug = 'saraswati-mantra' THEN 'FOCUS'
    WHEN m.slug = 'aham-brahmasmi' THEN 'LETTING_GO'
    WHEN m.slug = 'om-namah-shivaya-loneliness' THEN 'LONELINESS'
    WHEN m.slug = 'om-shanti-restlessness' THEN 'RESTLESSNESS'
    WHEN m.slug = 'om-surya-namaha' THEN 'ENERGY'
    WHEN m.slug = 'om-saraswati-namaha' THEN 'CREATIVITY'
    WHEN m.slug = 'om-aim-hrim-klim-chamundaye-viche' THEN 'CLARITY'
    WHEN m.slug = 'om-hanuman-namaha' THEN 'PROTECTION'
    WHEN m.slug = 'om-gam-ganapataye-namaha' THEN 'MOTIVATION'
    WHEN m.slug = 'om-kali-namaha' THEN 'PATIENCE'
    WHEN m.slug = 'om-ram-ramaya-namaha' THEN 'RENEWAL'
    WHEN m.slug = 'om-kamala-namaha' THEN 'SELF_LOVE'
    WHEN m.slug = 'om-gayatri-wisdom' THEN 'WISDOM'
    WHEN m.slug = 'om-dhanvantre-namaha' THEN 'HEALING'
  END as emotion_id,
  m.id as mantra_id
FROM mantras m
WHERE m.slug IN (
  'mahamrityunjaya', 'gayatri', 'om-namah-shivaya', 'so-ham', 'om-mani-padme-hum',
  'ganesh-mantra', 'om-shanti', 'lokah-samastah', 'saraswati-mantra', 'aham-brahmasmi',
  'om-namah-shivaya-loneliness', 'om-shanti-restlessness', 'om-surya-namaha', 
  'om-saraswati-namaha', 'om-aim-hrim-klim-chamundaye-viche', 'om-hanuman-namaha',
  'om-gam-ganapataye-namaha', 'om-kali-namaha', 'om-ram-ramaya-namaha', 
  'om-kamala-namaha', 'om-gayatri-wisdom', 'om-dhanvantre-namaha'
)
AND CASE 
  WHEN m.slug = 'mahamrityunjaya' THEN 'ANXIETY'
  WHEN m.slug = 'gayatri' THEN 'STRESS'
  WHEN m.slug = 'om-namah-shivaya' THEN 'ANGER'
  WHEN m.slug = 'so-ham' THEN 'GROUNDING'
  WHEN m.slug = 'om-mani-padme-hum' THEN 'SADNESS'
  WHEN m.slug = 'ganesh-mantra' THEN 'CONFIDENCE'
  WHEN m.slug = 'om-shanti' THEN 'PEACE'
  WHEN m.slug = 'lokah-samastah' THEN 'GRATITUDE'
  WHEN m.slug = 'saraswati-mantra' THEN 'FOCUS'
  WHEN m.slug = 'aham-brahmasmi' THEN 'LETTING_GO'
  WHEN m.slug = 'om-namah-shivaya-loneliness' THEN 'LONELINESS'
  WHEN m.slug = 'om-shanti-restlessness' THEN 'RESTLESSNESS'
  WHEN m.slug = 'om-surya-namaha' THEN 'ENERGY'
  WHEN m.slug = 'om-saraswati-namaha' THEN 'CREATIVITY'
  WHEN m.slug = 'om-aim-hrim-klim-chamundaye-viche' THEN 'CLARITY'
  WHEN m.slug = 'om-hanuman-namaha' THEN 'PROTECTION'
  WHEN m.slug = 'om-gam-ganapataye-namaha' THEN 'MOTIVATION'
  WHEN m.slug = 'om-kali-namaha' THEN 'PATIENCE'
  WHEN m.slug = 'om-ram-ramaya-namaha' THEN 'RENEWAL'
  WHEN m.slug = 'om-kamala-namaha' THEN 'SELF_LOVE'
  WHEN m.slug = 'om-gayatri-wisdom' THEN 'WISDOM'
  WHEN m.slug = 'om-dhanvantre-namaha' THEN 'HEALING'
END IS NOT NULL;
