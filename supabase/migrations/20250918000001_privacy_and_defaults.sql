-- Migration: privacy and defaults alignment
-- 1) Align suggested_rounds default to 108
ALTER TABLE mantras
  ALTER COLUMN suggested_rounds SET DEFAULT 108;

-- 2) Enforce NOT NULL on sessions.user_id and sessions.mantra_id
ALTER TABLE sessions
  ALTER COLUMN user_id SET NOT NULL,
  ALTER COLUMN mantra_id SET NOT NULL;

-- 3) Replace mantras RLS public read with authenticated-only read
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'mantras' 
      AND policyname = 'Mantras are viewable by everyone'
  ) THEN
    DROP POLICY "Mantras are viewable by everyone" ON mantras;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'mantras' 
      AND policyname = 'Authenticated users can view mantras'
  ) THEN
    CREATE POLICY "Authenticated users can view mantras" ON mantras
      FOR SELECT USING (auth.role() = 'authenticated');
  END IF;
END $$;


