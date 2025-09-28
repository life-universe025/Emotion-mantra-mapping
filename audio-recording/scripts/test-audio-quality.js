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
