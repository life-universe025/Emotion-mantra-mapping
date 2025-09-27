-- Check if mantras have emotion_id values
SELECT 
  slug, 
  emotion_id, 
  CASE 
    WHEN emotion_id IS NULL THEN 'NULL'
    WHEN emotion_id = '' THEN 'EMPTY'
    ELSE emotion_id
  END as emotion_id_status
FROM mantras 
LIMIT 10;

-- Count mantras with and without emotion_id
SELECT 
  'Mantras with emotion_id' as status,
  COUNT(*) as count
FROM mantras 
WHERE emotion_id IS NOT NULL AND emotion_id != '';

SELECT 
  'Mantras without emotion_id' as status,
  COUNT(*) as count
FROM mantras 
WHERE emotion_id IS NULL OR emotion_id = '';

-- Check if any mantras have emotion_id values
SELECT 
  'Total mantras' as status,
  COUNT(*) as count
FROM mantras;
