#!/bin/bash

# Professional Sanskrit Audio Recording Setup Script
# This script helps you prepare for recording professional mantra audio

echo "🎵 Setting up Professional Sanskrit Audio Recording..."
echo "=================================================="

# Create directory structure
echo "📁 Creating directory structure..."
mkdir -p audio-recording/{raw,processed,final}
mkdir -p audio-recording/scripts
mkdir -p audio-recording/equipment

# Create recording checklist
echo "📋 Creating recording checklist..."
cat > audio-recording/RECORDING_CHECKLIST.md << 'EOF'
# Sanskrit Mantra Recording Checklist

## Pre-Recording Setup
- [ ] Sanskrit scholar identified and confirmed
- [ ] Recording environment prepared (quiet, acoustically treated)
- [ ] Equipment tested and working
- [ ] All mantras scripted and prepared
- [ ] Backup recording device ready

## Mantras to Record (20+ mantras)
- [ ] Om Namah Shivaya
- [ ] Gayatri Mantra  
- [ ] Mahamrityunjaya Mantra
- [ ] So Ham
- [ ] Om Mani Padme Hum
- [ ] Om Gam Ganapataye Namaha
- [ ] Om Shanti Shanti Shanti
- [ ] Lokah Samastah Sukhino Bhavantu
- [ ] Om Aim Saraswatyai Namah
- [ ] Aham Brahmasmi
- [ ] Om Surya Namaha
- [ ] Om Saraswati Namaha
- [ ] Om Aim Hrim Klim Chamundaye Viche
- [ ] Om Hanuman Namaha
- [ ] Om Kali Namaha
- [ ] Om Ram Ramaya Namaha
- [ ] Om Kamala Namaha
- [ ] Om Dhanvantre Namaha

## During Recording
- [ ] Audio levels proper (no clipping)
- [ ] Background noise minimal
- [ ] Pronunciation accurate
- [ ] Pace consistent (meditation speed)
- [ ] 3-5 repetitions per mantra
- [ ] Multiple takes recorded
- [ ] Quality monitored in real-time

## Post-Recording
- [ ] Audio edited and cleaned
- [ ] Volume normalized
- [ ] Files properly named
- [ ] Quality tested on multiple devices
- [ ] Sanskrit scholar validates pronunciation
- [ ] Files uploaded to CDN
- [ ] Database updated with URLs
EOF

# Create recording script template
echo "📝 Creating recording script template..."
cat > audio-recording/scripts/recording-script.md << 'EOF'
# Sanskrit Mantra Recording Script

## Recording Instructions for Scholar

### For Each Mantra:
1. **Announce the mantra name** (e.g., "Om Namah Shivaya")
2. **Pause 2 seconds**
3. **Chant the mantra clearly** (3-5 repetitions)
4. **Pause 2 seconds between repetitions**
5. **End with 3-second silence**

### Example Recording Flow:
```
"Om Namah Shivaya" (pause 2 seconds)
"Om Namah Shivaya" (pause 2 seconds)
"Om Namah Shivaya" (pause 2 seconds)
"Om Namah Shivaya" (pause 2 seconds)
"Om Namah Shivaya" (pause 2 seconds)
(pause 3 seconds)
```

### Quality Guidelines:
- **Pace**: Meditation speed, not rushed
- **Pronunciation**: Clear, accurate Sanskrit
- **Volume**: Consistent, not too loud/quiet
- **Spiritual Energy**: Reverent and authentic
- **Clarity**: Each syllable audible

## Technical Specifications:
- **Format**: WAV (recording) → MP3 (final)
- **Sample Rate**: 44.1kHz minimum
- **Bit Depth**: 16-bit minimum
- **Channels**: Mono
- **Duration**: 30-60 seconds per mantra
- **Quality**: 320kbps MP3 for web
EOF

# Create equipment checklist
echo "🎤 Creating equipment checklist..."
cat > audio-recording/equipment/EQUIPMENT_CHECKLIST.md << 'EOF'
# Recording Equipment Checklist

## Option 1: DIY Home Studio
### Required Equipment:
- [ ] **Microphone**: Audio-Technica AT2020 ($100) or Rode NT1-A ($200)
- [ ] **Audio Interface**: Focusrite Scarlett Solo ($100)
- [ ] **Headphones**: Audio-Technica ATH-M50x ($150)
- [ ] **Cables**: XLR cable, USB cable
- [ ] **Recording Software**: Audacity (free) or Pro Tools ($30/month)
- [ ] **Computer**: Mac/PC with USB port
- [ ] **Backup Device**: Phone with recording app

### Total Cost: $350-500

## Option 2: Professional Studio
### What to Look For:
- [ ] **Acoustically treated room**
- [ ] **Professional condenser microphone**
- [ ] **Audio interface and preamp**
- [ ] **Professional recording software**
- [ ] **Experienced audio engineer**
- [ ] **Backup recording capability**

### Cost: $50-100/hour (4-6 hours total)

## Option 3: Hybrid Approach
- [ ] **Scholar**: $500-1000
- [ ] **Home Studio Setup**: $200-300
- [ ] **Professional Editing**: $200-400
- [ ] **Total**: $900-1700

## Equipment Testing Checklist:
- [ ] Microphone working and positioned correctly
- [ ] Audio levels proper (no clipping)
- [ ] Background noise minimal
- [ ] Recording software configured
- [ ] Backup recording device ready
- [ ] All cables and connections secure
EOF

# Create file naming convention
echo "📁 Creating file naming convention..."
cat > audio-recording/FILE_NAMING_CONVENTION.md << 'EOF'
# Audio File Naming Convention

## File Structure:
```
audio-recording/
├── raw/                    # Original recordings
│   ├── om-namah-shivaya-raw.wav
│   ├── gayatri-mantra-raw.wav
│   └── ...
├── processed/              # Edited files
│   ├── om-namah-shivaya-processed.wav
│   ├── gayatri-mantra-processed.wav
│   └── ...
└── final/                  # Final MP3 files
    ├── om-namah-shivaya.mp3
    ├── gayatri-mantra.mp3
    └── ...
```

## Naming Convention:
- Use lowercase with hyphens
- Match mantra slug from database
- Include file type extension
- No spaces or special characters

## Database Mapping:
| Mantra Slug | File Name | Database URL |
|-------------|-----------|--------------|
| om-namah-shivaya | om-namah-shivaya.mp3 | https://cdn.example.com/audio/om-namah-shivaya.mp3 |
| gayatri-mantra | gayatri-mantra.mp3 | https://cdn.example.com/audio/gayatri-mantra.mp3 |
| mahamrityunjaya | mahamrityunjaya-mantra.mp3 | https://cdn.example.com/audio/mahamrityunjaya-mantra.mp3 |

## Quality Standards:
- **Format**: MP3 320kbps
- **Duration**: 30-60 seconds
- **File Size**: <2MB per file
- **Sample Rate**: 44.1kHz
- **Channels**: Mono
EOF

# Create database update script
echo "🗄️ Creating database update script..."
cat > audio-recording/scripts/update-database.sql << 'EOF'
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
EOF

# Create CDN upload script
echo "☁️ Creating CDN upload script..."
cat > audio-recording/scripts/upload-to-cdn.sh << 'EOF'
#!/bin/bash

# CDN Upload Script for Sanskrit Mantra Audio
# Configure your CDN settings below

# CDN Configuration
CDN_BUCKET="your-bucket-name"
CDN_REGION="us-east-1"
CDN_URL="https://your-cdn.com"

# AWS S3 Upload (example)
echo "Uploading audio files to CDN..."

# Upload all MP3 files
aws s3 cp final/ s3://$CDN_BUCKET/audio/ --recursive --acl public-read

# Set proper content type
aws s3 cp s3://$CDN_BUCKET/audio/ s3://$CDN_BUCKET/audio/ --recursive --metadata-directive REPLACE --content-type "audio/mpeg"

echo "Upload complete!"
echo "Audio files available at: $CDN_URL/audio/"

# Alternative: Cloudflare R2
# rclone copy final/ r2:your-bucket/audio/

# Alternative: Vercel/Netlify
# Just drag and drop the final/ folder to your hosting service
EOF

chmod +x audio-recording/scripts/upload-to-cdn.sh

# Create quality testing script
echo "🧪 Creating quality testing script..."
cat > audio-recording/scripts/test-audio-quality.js << 'EOF'
// Audio Quality Testing Script
// Run this in browser console to test audio quality

const testAudioQuality = async (audioUrl) => {
  try {
    const audio = new Audio(audioUrl);
    
    // Test loading time
    const startTime = Date.now();
    await new Promise((resolve, reject) => {
      audio.oncanplaythrough = resolve;
      audio.onerror = reject;
      audio.load();
    });
    const loadTime = Date.now() - startTime;
    
    // Test file size (approximate)
    const response = await fetch(audioUrl, { method: 'HEAD' });
    const fileSize = response.headers.get('content-length');
    
    console.log(`Audio Quality Test Results:`);
    console.log(`- URL: ${audioUrl}`);
    console.log(`- Load Time: ${loadTime}ms`);
    console.log(`- File Size: ${fileSize} bytes`);
    console.log(`- Quality: ${loadTime < 2000 ? 'Good' : 'Slow'}`);
    
    return {
      url: audioUrl,
      loadTime,
      fileSize,
      quality: loadTime < 2000 ? 'good' : 'slow'
    };
  } catch (error) {
    console.error('Audio test failed:', error);
    return null;
  }
};

// Test all mantra audio files
const mantraUrls = [
  'https://your-cdn.com/audio/om-namah-shivaya.mp3',
  'https://your-cdn.com/audio/gayatri-mantra.mp3',
  'https://your-cdn.com/audio/mahamrityunjaya-mantra.mp3',
  // Add more URLs...
];

console.log('Testing audio quality for all mantras...');
mantraUrls.forEach(url => testAudioQuality(url));
EOF

echo "✅ Professional Audio Recording Setup Complete!"
echo ""
echo "📁 Directory structure created:"
echo "   audio-recording/"
echo "   ├── raw/           # Original recordings"
echo "   ├── processed/     # Edited files"
echo "   ├── final/         # Final MP3 files"
echo "   ├── scripts/       # Helper scripts"
echo "   └── equipment/     # Equipment info"
echo ""
echo "📋 Next Steps:"
echo "1. Review RECORDING_CHECKLIST.md"
echo "2. Find a qualified Sanskrit scholar"
echo "3. Set up recording equipment"
echo "4. Follow the recording script"
echo "5. Process and upload audio files"
echo "6. Update database with URLs"
echo ""
echo "🎵 Happy Recording!"
