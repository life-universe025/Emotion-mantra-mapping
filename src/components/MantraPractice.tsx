import { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw, CheckCircle, Volume2, Timer, Target } from 'lucide-react'
import { Mantra, Emotion } from '../types'

interface MantraPracticeProps {
  mantra: Mantra
  emotion: Emotion
  onComplete: (repetitions: number, duration: number) => void
  onBack: () => void
}

export function MantraPractice({ mantra, emotion, onComplete }: MantraPracticeProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [count, setCount] = useState(0)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [duration, setDuration] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize audio
  useEffect(() => {
    if (mantra.audio_url) {
      audioRef.current = new Audio(mantra.audio_url)
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
      if (speechSynthesisRef.current) {
        speechSynthesis.cancel()
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [mantra.audio_url])

  // Update duration timer
  useEffect(() => {
    if (startTime && !isCompleted) {
      intervalRef.current = setInterval(() => {
        setDuration(Math.floor((Date.now() - startTime.getTime()) / 1000))
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [startTime, isCompleted])

  const playAudio = () => {
    if (audioRef.current && mantra.audio_url) {
      // Use pre-rendered audio
      audioRef.current.play()
    } else {
      // Fallback to TTS
      if (speechSynthesisRef.current) {
        speechSynthesis.cancel()
      }
      
      speechSynthesisRef.current = new SpeechSynthesisUtterance(mantra.transliteration)
      speechSynthesisRef.current.rate = 0.7
      speechSynthesisRef.current.pitch = 1
      speechSynthesisRef.current.volume = 0.8
      
      // Try to use a more appropriate voice if available
      const voices = speechSynthesis.getVoices()
      const preferredVoice = voices.find(voice => 
        voice.lang.includes('en') && voice.name.includes('Google')
      )
      if (preferredVoice) {
        speechSynthesisRef.current.voice = preferredVoice
      }
      
      speechSynthesis.speak(speechSynthesisRef.current)
    }
  }

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
    speechSynthesis.cancel()
  }

  const handlePlayPause = () => {
    if (isPlaying) {
      stopAudio()
      setIsPlaying(false)
    } else {
      playAudio()
      setIsPlaying(true)
      if (!startTime) {
        setStartTime(new Date())
      }
    }
  }

  const handleCount = () => {
    const newCount = count + 1
    setCount(newCount)
    
    // Auto-play audio for each count
    if (!isPlaying) {
      playAudio()
      setIsPlaying(true)
      setTimeout(() => {
        stopAudio()
        setIsPlaying(false)
      }, 3000) // Stop after 3 seconds
    }
  }

  const handleReset = () => {
    setCount(0)
    setStartTime(null)
    setDuration(0)
    setIsCompleted(false)
    stopAudio()
    setIsPlaying(false)
  }

  const handleComplete = () => {
    setIsCompleted(true)
    stopAudio()
    setIsPlaying(false)
    onComplete(count, duration)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progressPercentage = mantra.suggested_rounds > 0 
    ? Math.min((count / mantra.suggested_rounds) * 100, 100)
    : 0

  return (
    <div className="max-w-4xl mx-auto">
      {/* Enhanced emotion context header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-3xl flex items-center justify-center text-4xl shadow-lg floating">
            {emotion.icon}
          </div>
          <div className="text-left">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-violet-800 to-purple-800 bg-clip-text text-transparent">
              {emotion.name}
            </h2>
            <p className="text-lg text-gray-600 mt-1">{emotion.description}</p>
          </div>
        </div>
      </div>

      {/* Enhanced mantra display */}
      <div className="card mb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 via-purple-50/50 to-blue-50/50 opacity-50"></div>
        <div className="relative text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Volume2 className="w-5 h-5 text-violet-600" />
            <h3 className="text-2xl font-bold text-gray-800">
              {mantra.transliteration}
            </h3>
          </div>
          
          <div className="mantra-text font-sanskrit text-center">
            {mantra.devanagari}
          </div>
          
          <div className="meaning text-center max-w-2xl mx-auto">
            {mantra.meaning}
          </div>

          {/* Enhanced audio controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={handlePlayPause}
              className={`group relative p-5 rounded-3xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 ${
                isPlaying 
                  ? 'bg-gradient-to-br from-red-500 to-red-600 text-white' 
                  : 'bg-gradient-to-br from-violet-500 to-purple-600 text-white'
              }`}
            >
              {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7" />}
              <div className="absolute inset-0 rounded-3xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            
            <button
              onClick={handleReset}
              className="group relative p-4 rounded-3xl bg-white/80 backdrop-blur-xl hover:bg-white border border-gray-200/60 hover:border-gray-300/80 text-gray-600 hover:text-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
            >
              <RotateCcw className="w-6 h-6" />
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Enhanced counter section */}
        <div className="card relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-indigo-50/50 to-purple-50/50 opacity-50"></div>
          <div className="relative text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Target className="w-5 h-5 text-blue-600" />
              <h4 className="text-xl font-bold text-gray-800">Practice Counter</h4>
            </div>

            <div className="mb-8">
              <div className="text-7xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
                {count}
              </div>
              <p className="text-gray-600 font-medium">
                {mantra.suggested_rounds > 0 
                  ? `of ${mantra.suggested_rounds} suggested rounds`
                  : 'repetitions'
                }
              </p>
            </div>

            {/* Enhanced progress bar */}
            {mantra.suggested_rounds > 0 && (
              <div className="w-full bg-gray-200 rounded-full h-4 mb-8 shadow-inner">
                <div 
                  className="bg-gradient-to-r from-violet-500 via-purple-500 to-blue-500 h-4 rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            )}

            {/* Enhanced mala counter */}
            <button
              onClick={handleCount}
              className="relative w-40 h-40 bg-gradient-to-br from-violet-500 via-purple-600 to-blue-600 rounded-full text-white font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:scale-110 active:scale-95 transition-all duration-300 mb-6 group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex flex-col items-center justify-center">
                <Target className="w-8 h-8 mb-2" />
                <span>Tap to Count</span>
              </div>
              <div className="absolute inset-0 rounded-full animate-ping bg-violet-500/30 opacity-0 group-active:opacity-100"></div>
            </button>

            <p className="text-sm text-gray-500">
              Tap the circle above to count each repetition
            </p>
          </div>
        </div>

        {/* Enhanced timer section */}
        <div className="card relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 via-emerald-50/50 to-teal-50/50 opacity-50"></div>
          <div className="relative text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Timer className="w-5 h-5 text-emerald-600" />
              <h4 className="text-xl font-bold text-gray-800">Session Timer</h4>
            </div>

            <div className="mb-8">
              <div className="text-5xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-3">
                {formatTime(duration)}
              </div>
              <p className="text-gray-600 font-medium">
                Practice Duration
              </p>
            </div>

            {/* Session stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/40">
                <div className="text-2xl font-bold text-violet-600">{count}</div>
                <div className="text-sm text-gray-600">Repetitions</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/40">
                <div className="text-2xl font-bold text-emerald-600">{formatTime(duration)}</div>
                <div className="text-sm text-gray-600">Time</div>
              </div>
            </div>

            {startTime && (
              <div className="text-sm text-gray-500">
                Started at {startTime.toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced complete button */}
      <div className="text-center">
        <button
          onClick={handleComplete}
          className="btn-primary text-lg px-8 py-4 shadow-2xl hover:shadow-3xl"
        >
          <CheckCircle className="w-6 h-6" />
          <span>Complete Practice</span>
        </button>
      </div>
    </div>
  )
}
