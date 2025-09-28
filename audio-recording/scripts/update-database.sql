-- Update mantras table with audio URLs
-- Run this after uploading audio files to CDN

-- Core mantras
UPDATE mantras SET 
  audio_url = 'https://your-cdn.com/audio/om-namah-shivaya.mp3',
  audio_duration = 45,
  audio_quality = 'premium',
  audio_source = 'recorded'
WHERE slug = 'om-namah-shivaya';

UPDATE mantras SET 
  audio_url = 'https://your-cdn.com/audio/gayatri-mantra.mp3',
  audio_duration = 60,
  audio_quality = 'premium',
  audio_source = 'recorded'
WHERE slug = 'gayatri';

UPDATE mantras SET 
  audio_url = 'https://your-cdn.com/audio/mahamrityunjaya-mantra.mp3',
  audio_duration = 55,
  audio_quality = 'premium',
  audio_source = 'recorded'
WHERE slug = 'mahamrityunjaya';

UPDATE mantras SET 
  audio_url = 'https://your-cdn.com/audio/so-ham.mp3',
  audio_duration = 35,
  audio_quality = 'premium',
  audio_source = 'recorded'
WHERE slug = 'so-ham';

UPDATE mantras SET 
  audio_url = 'https://your-cdn.com/audio/om-mani-padme-hum.mp3',
  audio_duration = 40,
  audio_quality = 'premium',
  audio_source = 'recorded'
WHERE slug = 'om-mani-padme-hum';

-- Add more mantras as needed...
-- Repeat for all 20+ mantras

-- Verify updates
SELECT slug, audio_url, audio_quality, audio_source 
FROM mantras 
WHERE audio_url IS NOT NULL;
