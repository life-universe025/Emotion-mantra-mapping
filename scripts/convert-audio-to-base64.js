// Convert Audio Files to Base64 for Embedding
// This script converts your MP3 files to base64 data URLs

const fs = require('fs');
const path = require('path');

// Directory containing your audio files
const AUDIO_DIR = './audio-files'; // Change this to your audio directory
const OUTPUT_FILE = './src/data/audioBase64.js';

function convertAudioToBase64() {
  console.log('🎵 Converting audio files to base64...');
  
  const audioFiles = fs.readdirSync(AUDIO_DIR).filter(file => file.endsWith('.mp3'));
  
  if (audioFiles.length === 0) {
    console.log('❌ No MP3 files found in', AUDIO_DIR);
    return;
  }
  
  const base64Audio = {};
  
  audioFiles.forEach(file => {
    const filePath = path.join(AUDIO_DIR, file);
    const fileBuffer = fs.readFileSync(filePath);
    const base64 = fileBuffer.toString('base64');
    const dataUrl = `data:audio/mpeg;base64,${base64}`;
    
    // Extract mantra name from filename
    const mantraName = file.replace('.mp3', '').replace(/-/g, '_');
    base64Audio[mantraName] = dataUrl;
    
    console.log(`✅ Converted: ${file} -> ${mantraName}`);
  });
  
  // Create JavaScript file with base64 data
  const jsContent = `// Base64 encoded audio files
// Generated automatically - do not edit manually

export const audioBase64 = ${JSON.stringify(base64Audio, null, 2)};

export const getAudioUrl = (mantraSlug) => {
  const key = mantraSlug.replace(/-/g, '_');
  return audioBase64[key] || null;
};
`;
  
  fs.writeFileSync(OUTPUT_FILE, jsContent);
  console.log(`✅ Base64 audio data saved to: ${OUTPUT_FILE}`);
  console.log(`📊 Converted ${audioFiles.length} audio files`);
}

// Run the conversion
convertAudioToBase64();
