#!/bin/bash

# Implement Professional Sanskrit Audio Files
# This script helps you upload and configure your audio files

echo "🎵 Implementing Professional Sanskrit Audio Files..."
echo "=================================================="

# Check if audio files exist
if [ ! -d "audio-files" ] && [ ! -d "audio-recording/final" ]; then
    echo "❌ No audio files found!"
    echo "Please place your audio files in one of these directories:"
    echo "  - audio-files/"
    echo "  - audio-recording/final/"
    echo ""
    echo "Expected file structure:"
    echo "  om-namah-shivaya.mp3"
    echo "  gayatri-mantra.mp3"
    echo "  mahamrityunjaya-mantra.mp3"
    echo "  so-ham.mp3"
    echo "  om-mani-padme-hum.mp3"
    echo "  ... (all your mantra files)"
    exit 1
fi

# Find audio files directory
AUDIO_DIR=""
if [ -d "audio-files" ]; then
    AUDIO_DIR="audio-files"
elif [ -d "audio-recording/final" ]; then
    AUDIO_DIR="audio-recording/final"
fi

echo "📁 Found audio files in: $AUDIO_DIR"
echo ""

# List audio files
echo "🎵 Audio files found:"
ls -la "$AUDIO_DIR"/*.mp3 2>/dev/null | while read line; do
    filename=$(basename "$line" | cut -d' ' -f9)
    size=$(echo "$line" | awk '{print $5}')
    echo "  - $filename ($size bytes)"
done

echo ""
echo "📋 Next steps:"
echo "1. Choose your CDN provider"
echo "2. Upload files to CDN"
echo "3. Update database with URLs"
echo "4. Test in application"
echo ""

# Create CDN upload options
echo "☁️ CDN Upload Options:"
echo ""
echo "Option 1: Vercel (Free)"
echo "  - Drag and drop files to Vercel dashboard"
echo "  - Files will be available at: https://your-app.vercel.app/audio/"
echo ""
echo "Option 2: AWS S3 + CloudFront"
echo "  - Upload to S3 bucket"
echo "  - Configure CloudFront distribution"
echo "  - Files available at: https://your-cloudfront-domain.com/audio/"
echo ""
echo "Option 3: Cloudflare R2"
echo "  - Upload to R2 bucket"
echo "  - Configure custom domain"
echo "  - Files available at: https://your-domain.com/audio/"
echo ""

# Create database update script
echo "🗄️ Creating database update script..."
cat > update-audio-database.sql << 'EOF'
-- Update mantras table with your audio URLs
-- Replace 'https://your-cdn.com' with your actual CDN URL

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

UPDATE mantras SET 
  audio_url = 'https://your-cdn.com/audio/ganesh-mantra.mp3',
  audio_duration = 45,
  audio_quality = 'premium',
  audio_source = 'recorded'
WHERE slug = 'ganesh-mantra';

UPDATE mantras SET 
  audio_url = 'https://your-cdn.com/audio/om-shanti.mp3',
  audio_duration = 40,
  audio_quality = 'premium',
  audio_source = 'recorded'
WHERE slug = 'om-shanti';

UPDATE mantras SET 
  audio_url = 'https://your-cdn.com/audio/lokah-samastah.mp3',
  audio_duration = 50,
  audio_quality = 'premium',
  audio_source = 'recorded'
WHERE slug = 'lokah-samastah';

UPDATE mantras SET 
  audio_url = 'https://your-cdn.com/audio/saraswati-mantra.mp3',
  audio_duration = 45,
  audio_quality = 'premium',
  audio_source = 'recorded'
WHERE slug = 'saraswati-mantra';

UPDATE mantras SET 
  audio_url = 'https://your-cdn.com/audio/aham-brahmasmi.mp3',
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
EOF

echo "✅ Database update script created: update-audio-database.sql"
echo ""

# Create testing script
echo "🧪 Creating audio testing script..."
cat > test-audio-implementation.js << 'EOF'
// Test Audio Implementation
// Run this in browser console to test your audio files

const testMantraAudio = async (mantraSlug, audioUrl) => {
  try {
    console.log(`Testing ${mantraSlug}...`);
    
    const audio = new Audio(audioUrl);
    
    // Test loading time
    const startTime = Date.now();
    await new Promise((resolve, reject) => {
      audio.oncanplaythrough = resolve;
      audio.onerror = reject;
      audio.load();
    });
    const loadTime = Date.now() - startTime;
    
    // Test file size
    const response = await fetch(audioUrl, { method: 'HEAD' });
    const fileSize = response.headers.get('content-length');
    
    console.log(`✅ ${mantraSlug}:`);
    console.log(`   - URL: ${audioUrl}`);
    console.log(`   - Load Time: ${loadTime}ms`);
    console.log(`   - File Size: ${fileSize} bytes`);
    console.log(`   - Quality: ${loadTime < 2000 ? 'Good' : 'Slow'}`);
    
    return { mantraSlug, loadTime, fileSize, quality: loadTime < 2000 ? 'good' : 'slow' };
  } catch (error) {
    console.error(`❌ ${mantraSlug} failed:`, error);
    return null;
  }
};

// Test all your audio files
const audioTests = [
  { slug: 'om-namah-shivaya', url: 'https://your-cdn.com/audio/om-namah-shivaya.mp3' },
  { slug: 'gayatri-mantra', url: 'https://your-cdn.com/audio/gayatri-mantra.mp3' },
  { slug: 'mahamrityunjaya-mantra', url: 'https://your-cdn.com/audio/mahamrityunjaya-mantra.mp3' },
  // Add more URLs...
];

console.log('🎵 Testing all mantra audio files...');
audioTests.forEach(test => testMantraAudio(test.slug, test.url));
EOF

echo "✅ Audio testing script created: test-audio-implementation.js"
echo ""

echo "🚀 Ready to implement your audio files!"
echo ""
echo "Next steps:"
echo "1. Upload your audio files to your chosen CDN"
echo "2. Update the URLs in update-audio-database.sql"
echo "3. Run the database update: supabase db push"
echo "4. Test in your application"
echo ""
echo "🎵 Your professional Sanskrit audio is ready to go!"
