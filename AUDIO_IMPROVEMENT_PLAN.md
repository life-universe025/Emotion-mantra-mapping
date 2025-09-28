# Sanskrit Mantra Audio Improvement Plan

## Current Issue
The app currently uses browser TTS (Text-to-Speech) which produces robotic, non-authentic Sanskrit pronunciation. This doesn't provide the spiritual experience users expect from mantra practice.

## Recommended Solutions (Ranked by Quality)

### 1. **Pre-recorded Audio Files** ⭐⭐⭐⭐⭐ (Best Solution)

**Why this is the best:**
- Authentic Sanskrit pronunciation by trained practitioners
- Spiritual energy and proper intonation
- Consistent quality across all mantras
- Professional audio production

**Implementation Steps:**

1. **Record Audio Files:**
   ```bash
   # Create audio directory structure
   mkdir -p public/audio/mantras
   ```

2. **Database Schema Update:**
   ```sql
   -- Add audio_url column to mantras table
   ALTER TABLE mantras ADD COLUMN audio_url TEXT;
   
   -- Update existing mantras with audio URLs
   UPDATE mantras SET audio_url = 'https://your-cdn.com/audio/mahamrityunjaya.mp3' 
   WHERE slug = 'mahamrityunjaya';
   ```

3. **Audio File Requirements:**
   - Format: MP3 (web compatible)
   - Quality: 128kbps minimum, 320kbps preferred
   - Duration: 30-60 seconds per mantra
   - Sample Rate: 44.1kHz
   - Channels: Mono or Stereo

4. **Recording Guidelines:**
   - Use a trained Sanskrit scholar or practitioner
   - Record in a quiet, reverent environment
   - Maintain consistent pace and rhythm
   - Include proper pauses between repetitions
   - Use authentic Sanskrit pronunciation

### 2. **AI Voice Synthesis** ⭐⭐⭐⭐ (Good Alternative)

**Services to Consider:**

#### A. ElevenLabs (Recommended)
```typescript
// API integration example
const generateMantraAudio = async (mantraText: string) => {
  const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/VOICE_ID', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ELEVENLABS_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: mantraText,
      voice_settings: {
        stability: 0.8,
        similarity_boost: 0.9,
        style: 0.2
      }
    })
  })
  
  return response.blob()
}
```

#### B. Azure Cognitive Services
```typescript
const azureTTS = async (text: string) => {
  const response = await fetch('https://YOUR_REGION.tts.speech.microsoft.com/cognitiveservices/v1', {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': AZURE_KEY,
      'Content-Type': 'application/ssml+xml',
      'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3'
    },
    body: `<speak version='1.0' xml:lang='hi-IN'>
            <voice xml:lang='hi-IN' name='hi-IN-MadhurNeural'>
              ${text}
            </voice>
          </speak>`
  })
  
  return response.blob()
}
```

### 3. **Enhanced Browser TTS** ⭐⭐⭐ (Quick Fix - Already Implemented)

**Improvements Made:**
- Slower rate (0.6) for meditation pace
- Better voice selection (Hindi/Indian English)
- Enhanced error handling
- Proper event listeners

### 4. **Hybrid Approach** ⭐⭐⭐⭐ (Recommended Implementation)

**Combine multiple solutions:**

```typescript
const playMantraAudio = async (mantra: Mantra) => {
  // Priority 1: Pre-recorded audio
  if (mantra.audio_url) {
    return playPreRecordedAudio(mantra.audio_url)
  }
  
  // Priority 2: AI TTS (if available)
  if (AI_TTS_AVAILABLE) {
    return playAITTS(mantra.transliteration)
  }
  
  // Priority 3: Enhanced browser TTS
  return playEnhancedTTS(mantra.transliteration)
}
```

## Implementation Priority

### Phase 1: Quick Wins (1-2 weeks)
1. ✅ Enhanced browser TTS (already implemented)
2. Add audio loading states
3. Improve error handling
4. Add audio quality indicators

### Phase 2: Professional Audio (2-4 weeks)
1. Record high-quality audio files
2. Set up CDN for audio delivery
3. Update database with audio URLs
4. Implement audio caching

### Phase 3: AI Integration (4-6 weeks)
1. Integrate ElevenLabs or Azure TTS
2. Create voice training for Sanskrit
3. Implement fallback mechanisms
4. Add voice customization options

## Technical Implementation

### Audio Service Class
```typescript
class MantraAudioService {
  private static instance: MantraAudioService
  private audioCache: Map<string, HTMLAudioElement> = new Map()
  
  async playMantra(mantra: Mantra): Promise<void> {
    // Implementation with fallbacks
  }
  
  async preloadMantra(mantra: Mantra): Promise<void> {
    // Preload audio for better UX
  }
  
  private async generateAIAudio(text: string): Promise<Blob> {
    // AI TTS generation
  }
}
```

### Database Updates
```sql
-- Add audio metadata
ALTER TABLE mantras ADD COLUMN audio_duration INTEGER;
ALTER TABLE mantras ADD COLUMN audio_quality VARCHAR(20);
ALTER TABLE mantras ADD COLUMN audio_source VARCHAR(50);

-- Create audio files table
CREATE TABLE mantra_audio (
  id SERIAL PRIMARY KEY,
  mantra_id INTEGER REFERENCES mantras(id),
  audio_url TEXT NOT NULL,
  duration_seconds INTEGER,
  quality VARCHAR(20),
  source VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Cost Considerations

### Pre-recorded Audio
- **Recording**: $500-2000 (one-time)
- **Storage**: $5-20/month (CDN)
- **Bandwidth**: $10-50/month

### AI TTS
- **ElevenLabs**: $5-22/month (based on usage)
- **Azure**: $4-16/month (based on usage)
- **Google Cloud**: $4-20/month (based on usage)

### Browser TTS
- **Cost**: Free
- **Quality**: Limited
- **Reliability**: Variable

## Recommended Next Steps

1. **Immediate (This Week):**
   - Test the enhanced TTS implementation
   - Gather user feedback on audio quality
   - Research Sanskrit audio recording options

2. **Short Term (2-4 weeks):**
   - Record 3-5 most popular mantras professionally
   - Set up audio CDN (Cloudflare, AWS S3)
   - Implement audio caching

3. **Long Term (1-3 months):**
   - Record all 20+ mantras
   - Integrate AI TTS as fallback
   - Add voice customization options
   - Implement audio analytics

## Quality Metrics

- **Pronunciation Accuracy**: 95%+ for Sanskrit scholars
- **Audio Quality**: 128kbps minimum, 320kbps preferred
- **Loading Time**: <2 seconds for audio files
- **User Satisfaction**: Target 4.5+ stars for audio quality

This plan provides a comprehensive approach to improving the Sanskrit mantra audio experience while being practical and cost-effective.
