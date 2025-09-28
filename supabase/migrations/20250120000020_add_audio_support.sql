-- Add audio support to mantras table
-- This migration adds audio-related columns to support high-quality Sanskrit audio

-- Add audio URL column for pre-recorded audio files
ALTER TABLE mantras ADD COLUMN IF NOT EXISTS audio_url TEXT;

-- Add audio metadata columns
ALTER TABLE mantras ADD COLUMN IF NOT EXISTS audio_duration INTEGER;
ALTER TABLE mantras ADD COLUMN IF NOT EXISTS audio_quality VARCHAR(20);
ALTER TABLE mantras ADD COLUMN IF NOT EXISTS audio_source VARCHAR(50);

-- Add index for audio URL lookups
CREATE INDEX IF NOT EXISTS idx_mantras_audio_url ON mantras(audio_url) WHERE audio_url IS NOT NULL;

-- Create audio files table for managing multiple audio versions
CREATE TABLE IF NOT EXISTS mantra_audio (
  id SERIAL PRIMARY KEY,
  mantra_id INTEGER REFERENCES mantras(id) ON DELETE CASCADE,
  audio_url TEXT NOT NULL,
  duration_seconds INTEGER,
  quality VARCHAR(20) DEFAULT 'medium',
  source VARCHAR(50) DEFAULT 'recorded',
  language VARCHAR(10) DEFAULT 'sa', -- Sanskrit language code
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for audio files
CREATE INDEX IF NOT EXISTS idx_mantra_audio_mantra_id ON mantra_audio(mantra_id);
CREATE INDEX IF NOT EXISTS idx_mantra_audio_quality ON mantra_audio(quality);
CREATE INDEX IF NOT EXISTS idx_mantra_audio_source ON mantra_audio(source);

-- Add RLS policies for mantra_audio table
ALTER TABLE mantra_audio ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read audio files
CREATE POLICY "Allow authenticated users to read audio files" ON mantra_audio
  FOR SELECT TO authenticated
  USING (true);

-- Allow service role to manage audio files
CREATE POLICY "Allow service role to manage audio files" ON mantra_audio
  FOR ALL TO service_role
  USING (true);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_mantra_audio_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_mantra_audio_updated_at
  BEFORE UPDATE ON mantra_audio
  FOR EACH ROW
  EXECUTE FUNCTION update_mantra_audio_updated_at();

-- Add comments for documentation
COMMENT ON COLUMN mantras.audio_url IS 'URL to pre-recorded audio file for the mantra';
COMMENT ON COLUMN mantras.audio_duration IS 'Duration of the audio file in seconds';
COMMENT ON COLUMN mantras.audio_quality IS 'Quality level: low, medium, high, premium';
COMMENT ON COLUMN mantras.audio_source IS 'Source of audio: recorded, ai, tts';

COMMENT ON TABLE mantra_audio IS 'Multiple audio versions for mantras (different qualities, languages, etc.)';
COMMENT ON COLUMN mantra_audio.quality IS 'Audio quality level';
COMMENT ON COLUMN mantra_audio.source IS 'How the audio was generated';
COMMENT ON COLUMN mantra_audio.language IS 'Language code (sa for Sanskrit)';
