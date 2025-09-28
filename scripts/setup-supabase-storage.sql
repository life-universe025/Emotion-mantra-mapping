-- Set up Supabase Storage for Sanskrit Mantra Audio
-- Run this in your Supabase SQL Editor

-- Create storage bucket for audio files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'mantra-audio',
  'mantra-audio',
  true,
  52428800, -- 50MB limit per file
  ARRAY['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg']
);

-- Create storage policies for public access
CREATE POLICY "Public Access for Mantra Audio" ON storage.objects
FOR SELECT USING (bucket_id = 'mantra-audio');

-- Allow authenticated users to upload audio files
CREATE POLICY "Authenticated users can upload audio" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'mantra-audio' 
  AND auth.role() = 'authenticated'
);

-- Allow service role to manage all audio files
CREATE POLICY "Service role can manage audio files" ON storage.objects
FOR ALL USING (
  bucket_id = 'mantra-audio' 
  AND auth.role() = 'service_role'
);

-- Verify bucket was created
SELECT * FROM storage.buckets WHERE id = 'mantra-audio';
