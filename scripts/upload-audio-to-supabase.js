// Upload Audio Files to Supabase Storage
// Run this script to upload your audio files to Supabase Storage

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Supabase configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Configuration
const AUDIO_DIR = './audio-files' // Change this to your audio directory
const BUCKET_NAME = 'mantra-audio'

async function uploadAudioFiles() {
  console.log('🎵 Uploading audio files to Supabase Storage...')
  console.log(`📁 Source directory: ${AUDIO_DIR}`)
  console.log(`🗄️ Bucket: ${BUCKET_NAME}`)
  console.log('')

  // Check if audio directory exists
  if (!fs.existsSync(AUDIO_DIR)) {
    console.error(`❌ Audio directory not found: ${AUDIO_DIR}`)
    console.error('Please place your audio files in the audio-files directory')
    process.exit(1)
  }

  // Get list of MP3 files
  const audioFiles = fs.readdirSync(AUDIO_DIR).filter(file => file.endsWith('.mp3'))
  
  if (audioFiles.length === 0) {
    console.error('❌ No MP3 files found in', AUDIO_DIR)
    process.exit(1)
  }

  console.log(`📊 Found ${audioFiles.length} audio files to upload`)
  console.log('')

  const uploadResults = []

  for (const file of audioFiles) {
    try {
      console.log(`📤 Uploading: ${file}`)
      
      const filePath = path.join(AUDIO_DIR, file)
      const fileBuffer = fs.readFileSync(filePath)
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(`mantras/${file}`, fileBuffer, {
          contentType: 'audio/mpeg',
          cacheControl: '3600',
          upsert: true
        })

      if (error) {
        console.error(`❌ Failed to upload ${file}:`, error.message)
        uploadResults.push({ file, success: false, error: error.message })
      } else {
        console.log(`✅ Uploaded: ${file}`)
        uploadResults.push({ 
          file, 
          success: true, 
          path: data.path,
          url: `${supabaseUrl}/storage/v1/object/public/${BUCKET_NAME}/${data.path}`
        })
      }
    } catch (error) {
      console.error(`❌ Error uploading ${file}:`, error.message)
      uploadResults.push({ file, success: false, error: error.message })
    }
  }

  console.log('')
  console.log('📊 Upload Summary:')
  console.log('==================')
  
  const successful = uploadResults.filter(r => r.success)
  const failed = uploadResults.filter(r => !r.success)
  
  console.log(`✅ Successful: ${successful.length}`)
  console.log(`❌ Failed: ${failed.length}`)
  
  if (successful.length > 0) {
    console.log('')
    console.log('🎵 Uploaded files:')
    successful.forEach(result => {
      console.log(`  - ${result.file} -> ${result.url}`)
    })
  }
  
  if (failed.length > 0) {
    console.log('')
    console.log('❌ Failed uploads:')
    failed.forEach(result => {
      console.log(`  - ${result.file}: ${result.error}`)
    })
  }

  // Generate database update SQL
  if (successful.length > 0) {
    console.log('')
    console.log('🗄️ Database Update SQL:')
    console.log('========================')
    
    successful.forEach(result => {
      const mantraSlug = result.file.replace('.mp3', '').replace(/-/g, '-')
      console.log(`UPDATE mantras SET audio_url = '${result.url}' WHERE slug = '${mantraSlug}';`)
    })
  }

  console.log('')
  console.log('🎉 Upload complete!')
  console.log('Next step: Update your database with the URLs above')
}

// Run the upload
uploadAudioFiles().catch(console.error)
