-- Update mantras table with Supabase Storage URLs
-- Replace 'YOUR_SUPABASE_URL' with your actual Supabase project URL

-- Core mantras
UPDATE mantras SET 
  audio_url = 'YOUR_SUPABASE_URL/storage/v1/object/public/mantra-audio/mantras/om-namah-shivaya.mp3',
  audio_duration = 45,
  audio_quality = 'premium',
  audio_source = 'recorded'
WHERE slug = 'om-namah-shivaya';

UPDATE mantras SET 
  audio_url = 'YOUR_SUPABASE_URL/storage/v1/object/public/mantra-audio/mantras/gayatri-mantra.mp3',
  audio_duration = 60,
  audio_quality = 'premium',
  audio_source = 'recorded'
WHERE slug = 'gayatri';

UPDATE mantras SET 
  audio_url = 'YOUR_SUPABASE_URL/storage/v1/object/public/mantra-audio/mantras/mahamrityunjaya-mantra.mp3',
  audio_duration = 55,
  audio_quality = 'premium',
  audio_source = 'recorded'
WHERE slug = 'mahamrityunjaya';

UPDATE mantras SET 
  audio_url = 'YOUR_SUPABASE_URL/storage/v1/object/public/mantra-audio/mantras/so-ham.mp3',
  audio_duration = 35,
  audio_quality = 'premium',
  audio_source = 'recorded'
WHERE slug = 'so-ham';

UPDATE mantras SET 
  audio_url = 'YOUR_SUPABASE_URL/storage/v1/object/public/mantra-audio/mantras/om-mani-padme-hum.mp3',
  audio_duration = 40,
  audio_quality = 'premium',
  audio_source = 'recorded'
WHERE slug = 'om-mani-padme-hum';

UPDATE mantras SET 
  audio_url = 'YOUR_SUPABASE_URL/storage/v1/object/public/mantra-audio/mantras/ganesh-mantra.mp3',
  audio_duration = 45,
  audio_quality = 'premium',
  audio_source = 'recorded'
WHERE slug = 'ganesh-mantra';

UPDATE mantras SET 
  audio_url = 'YOUR_SUPABASE_URL/storage/v1/object/public/mantra-audio/mantras/om-shanti.mp3',
  audio_duration = 40,
  audio_quality = 'premium',
  audio_source = 'recorded'
WHERE slug = 'om-shanti';

UPDATE mantras SET 
  audio_url = 'YOUR_SUPABASE_URL/storage/v1/object/public/mantra-audio/mantras/lokah-samastah.mp3',
  audio_duration = 50,
  audio_quality = 'premium',
  audio_source = 'recorded'
WHERE slug = 'lokah-samastah';

UPDATE mantras SET 
  audio_url = 'YOUR_SUPABASE_URL/storage/v1/object/public/mantra-audio/mantras/saraswati-mantra.mp3',
  audio_duration = 45,
  audio_quality = 'premium',
  audio_source = 'recorded'
WHERE slug = 'saraswati-mantra';

UPDATE mantras SET 
  audio_url = 'YOUR_SUPABASE_URL/storage/v1/object/public/mantra-audio/mantras/aham-brahmasmi.mp3',
  audio_duration = 35,
  audio_quality = 'premium',
  audio_source = 'recorded'
WHERE slug = 'aham-brahmasmi';

-- Add more mantras as needed...
-- Repeat for all your audio files

-- Verify updates
SELECT slug, audio_url, audio_quality, audio_source 
FROM mantras 
WHERE audio_url IS NOT NULL;
