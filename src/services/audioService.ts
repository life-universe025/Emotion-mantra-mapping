import { Mantra } from '../types'
import { pwaService } from './pwaService'

export interface AudioQuality {
  level: 'low' | 'medium' | 'high' | 'premium'
  source: 'tts' | 'ai' | 'recorded'
  description: string
}

export class MantraAudioService {
  private static instance: MantraAudioService
  private audioCache: Map<string, HTMLAudioElement> = new Map()
  private isPlaying: boolean = false
  private currentAudio: HTMLAudioElement | null = null

  private constructor() {}

  static getInstance(): MantraAudioService {
    if (!MantraAudioService.instance) {
      MantraAudioService.instance = new MantraAudioService()
    }
    return MantraAudioService.instance
  }

  /**
   * Play mantra audio with multiple fallback options
   */
  async playMantra(mantra: Mantra): Promise<AudioQuality> {
    try {
      // Stop any currently playing audio
      this.stopAudio()

      // Priority 1: Pre-recorded audio (best quality)
      if (mantra.audio_url) {
        const quality = await this.playPreRecordedAudio(mantra.audio_url)
        return quality
      }

      // Priority 2: AI TTS (good quality)
      if (this.isAITTSAvailable()) {
        const quality = await this.playAITTS(mantra.transliteration)
        return quality
      }

      // Priority 3: Enhanced browser TTS (fallback)
      const quality = await this.playEnhancedTTS(mantra.transliteration)
      return quality

    } catch (error) {
      throw new Error('Failed to play mantra audio')
    }
  }

  /**
   * Stop currently playing audio
   */
  stopAudio(): void {
    if (this.currentAudio) {
      this.currentAudio.pause()
      this.currentAudio.currentTime = 0
    }
    
    // Cancel any TTS
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel()
    }
    
    this.isPlaying = false
    this.currentAudio = null
  }

  /**
   * Check if audio is currently playing
   */
  isAudioPlaying(): boolean {
    return this.isPlaying
  }

  /**
   * Preload audio for better performance with PWA caching
   */
  async preloadMantra(mantra: Mantra): Promise<void> {
    if (mantra.audio_url && !this.audioCache.has(mantra.slug)) {
      try {
        const audio = new Audio(mantra.audio_url)
        audio.preload = 'auto'
        this.audioCache.set(mantra.slug, audio)
        
        // Cache audio for offline use via PWA service worker
        // await pwaService.cacheAudioFile(mantra.audio_url)
      } catch (error) {
      }
    }
  }

  /**
   * Preload all mantra audio for offline use
   */
  async preloadAllMantras(_mantras: Mantra[]): Promise<void> {
    
    // const audioUrls = mantras
    //   .filter(mantra => mantra.audio_url)
    //   .map(mantra => mantra.audio_url!)
    
    // Cache all audio files for offline use
    // await pwaService.preloadMantraAudio(audioUrls)
    
  }

  /**
   * Get audio quality information
   */
  getAudioQuality(mantra: Mantra): AudioQuality {
    if (mantra.audio_url) {
      return {
        level: 'premium',
        source: 'recorded',
        description: 'Professional Sanskrit recording'
      }
    }
    
    if (this.isAITTSAvailable()) {
      return {
        level: 'high',
        source: 'ai',
        description: 'AI-generated Sanskrit voice'
      }
    }
    
    return {
      level: 'medium',
      source: 'tts',
      description: 'Browser text-to-speech'
    }
  }

  /**
   * Play pre-recorded audio (highest quality) with offline support
   */
  private async playPreRecordedAudio(audioUrl: string): Promise<AudioQuality> {
    return new Promise((resolve, reject) => {
      const audio = new Audio(audioUrl)
      this.currentAudio = audio
      
      audio.onloadstart = () => {
        this.isPlaying = true
      }
      
      audio.oncanplaythrough = () => {
        audio.play().catch(reject)
      }
      
      audio.onended = () => {
        this.isPlaying = false
        this.currentAudio = null
        resolve({
          level: 'premium',
          source: 'recorded',
          description: 'Professional Sanskrit recording'
        })
      }
      
      audio.onerror = async (error) => {
        this.isPlaying = false
        this.currentAudio = null
        
        // If online, try to cache the audio for offline use
        if (!pwaService.isOffline()) {
          try {
            // await pwaService.cacheAudioFile(audioUrl)
          } catch (cacheError) {
          }
        }
        
        reject(error)
      }
    })
  }

  /**
   * Play AI-generated TTS (good quality)
   */
  private async playAITTS(text: string): Promise<AudioQuality> {
    try {
      // This would integrate with ElevenLabs, Azure, or Google Cloud TTS
      // For now, we'll use enhanced browser TTS as fallback
      return await this.playEnhancedTTS(text)
    } catch (error) {
      return await this.playEnhancedTTS(text)
    }
  }

  /**
   * Play enhanced browser TTS (improved quality)
   */
  private async playEnhancedTTS(text: string): Promise<AudioQuality> {
    return new Promise((resolve, reject) => {
      // Cancel any existing speech
      speechSynthesis.cancel()
      
      const utterance = new SpeechSynthesisUtterance(text)
      
      // Optimized settings for Sanskrit mantras
      utterance.rate = 0.6  // Slower for meditation
      utterance.pitch = 0.9  // Slightly lower pitch
      utterance.volume = 0.9
      
      // Find the best voice for Sanskrit/Indian languages
      const voices = speechSynthesis.getVoices()
      const preferredVoice = voices.find(voice => 
        voice.lang.includes('hi') || // Hindi (closest to Sanskrit)
        voice.lang.includes('en-IN') || // Indian English
        (voice.lang.includes('en') && voice.name.includes('Google')) ||
        voice.name.toLowerCase().includes('neural') // Neural voices are better
      )
      
      if (preferredVoice) {
        utterance.voice = preferredVoice
      }
      
      utterance.onstart = () => {
        this.isPlaying = true
      }
      
      utterance.onend = () => {
        this.isPlaying = false
        resolve({
          level: 'medium',
          source: 'tts',
          description: 'Enhanced browser text-to-speech'
        })
      }
      
      utterance.onerror = (event) => {
        this.isPlaying = false
        reject(new Error(`TTS Error: ${event.error}`))
      }
      
      speechSynthesis.speak(utterance)
    })
  }

  /**
   * Check if AI TTS is available
   */
  private isAITTSAvailable(): boolean {
    // Check if AI TTS service is configured
    // Use import.meta.env for Vite environment variables
    return import.meta.env.VITE_ELEVENLABS_API_KEY !== undefined ||
           import.meta.env.VITE_AZURE_SPEECH_KEY !== undefined
  }

  // AI TTS methods will be implemented when API keys are configured
  // private async generateElevenLabsAudio(text: string): Promise<Blob> {
  //   const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY
  //   // Implementation here...
  // }
  // private async generateAzureAudio(text: string): Promise<Blob> {
  //   const apiKey = import.meta.env.VITE_AZURE_SPEECH_KEY
  //   // Implementation here...
  // }
}

// Export singleton instance
export const mantraAudioService = MantraAudioService.getInstance()
