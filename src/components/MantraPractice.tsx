import { useState, useEffect, useRef } from 'react'
import { IoPlay, IoPause, IoRefresh, IoCheckmarkCircle, IoVolumeHigh, IoTimer, IoLeaf } from 'react-icons/io5'
import { FaBullseye } from 'react-icons/fa'
import { Mantra, Emotion, BreathingSession } from '../types'
import { BreathingGuide } from './BreathingGuide'
import { useTranslation } from 'react-i18next'

interface MantraPracticeProps {
  mantra: Mantra
  emotion: Emotion
  onComplete: (repetitions: number, duration: number, breathingSession?: BreathingSession) => void
  onBack: () => void
}

export function MantraPractice({ mantra, emotion, onComplete }: MantraPracticeProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [count, setCount] = useState(0)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [duration, setDuration] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [showBreathingGuide, setShowBreathingGuide] = useState(false)
  const [breathingSession, setBreathingSession] = useState<BreathingSession | null>(null)
  const { t } = useTranslation()
  
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
    onComplete(count, duration, breathingSession || undefined)
  }

  const handleBreathingSession = (session: BreathingSession) => {
    setBreathingSession(session)
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
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 dark:from-orange-400 dark:to-amber-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg border border-amber-400/30 dark:border-amber-500/40">
            {emotion.icon}
          </div>
          <div className="text-left">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-900 via-orange-800 to-yellow-800 dark:from-amber-300 dark:via-orange-300 dark:to-yellow-300 bg-clip-text text-transparent font-traditional">
              {t(`emotions.${emotion.id}.name`)}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{t(`emotions.${emotion.id}.description`)}</p>
          </div>
        </div>
      </div>

      {/* Enhanced mantra display */}
      <div className="card mb-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-amber-50/50 to-yellow-50/50 dark:from-orange-900/20 dark:via-amber-900/20 dark:to-yellow-900/20 opacity-50"></div>
        <div className="relative text-center p-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <IoVolumeHigh className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
              {t(`mantras.${mantra.slug}.transliteration`)}
            </h3>
          </div>
          
          <div className="mantra-text font-sanskrit text-center text-2xl mb-3">
            {mantra.devanagari}
          </div>
          
          <div className="meaning text-center max-w-2xl mx-auto text-sm">
{t(`mantras.${mantra.slug}.meaning`)}
          </div>

          {/* Enhanced audio controls */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              onClick={handlePlayPause}
              className={`group relative p-3 rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 ${
                isPlaying 
                  ? 'bg-gradient-to-br from-red-500 to-red-600 text-white' 
                  : 'bg-gradient-to-br from-orange-500 to-amber-600 text-white'
              }`}
            >
              {isPlaying ? <IoPause className="w-5 h-5" /> : <IoPlay className="w-5 h-5" />}
              <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            
            <button
              onClick={() => setShowBreathingGuide(!showBreathingGuide)}
              className={`group relative p-3 rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 ${
                showBreathingGuide
                  ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white'
                  : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl hover:bg-white dark:hover:bg-gray-700 border border-gray-200/60 dark:border-gray-600/60 hover:border-gray-300/80 dark:hover:border-gray-500/80 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
              }`}
            >
              <IoLeaf className="w-5 h-5" />
              <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                showBreathingGuide 
                  ? 'bg-white/20' 
                  : 'bg-gradient-to-br from-cyan-500/10 to-blue-500/10 dark:from-cyan-400/15 dark:to-blue-400/15'
              }`}></div>
            </button>
            
            <button
              onClick={handleReset}
              className="group relative p-3 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl hover:bg-white dark:hover:bg-gray-700 border border-gray-200/60 dark:border-gray-600/60 hover:border-gray-300/80 dark:hover:border-gray-500/80 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
            >
              <IoRefresh className="w-5 h-5" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500/10 to-amber-500/10 dark:from-orange-400/15 dark:to-amber-400/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
      </div>

      {/* Breathing Guide Section */}
      {showBreathingGuide && (
        <div className="mb-6">
          <BreathingGuide 
            isActive={showBreathingGuide}
            onToggle={() => setShowBreathingGuide(false)}
            onSessionComplete={handleBreathingSession}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Enhanced counter section */}
        <div className="card relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 via-orange-50/50 to-yellow-50/50 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-yellow-900/20 opacity-50"></div>
          <div className="relative text-center p-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <FaBullseye className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200">{t('mantraPractice.practiceCounter')}</h4>
            </div>

            <div className="mb-6">
              <div className="text-5xl font-bold bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent mb-2">
                {count}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                {mantra.suggested_rounds > 0 
                  ? t('mantraPractice.suggestedRounds', { count: mantra.suggested_rounds })
                  : t('mantraPractice.repetitions')
                }
              </p>
            </div>

            {/* Enhanced progress bar */}
            {mantra.suggested_rounds > 0 && (
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-6 shadow-inner">
                <div 
                  className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 dark:from-orange-400 dark:via-amber-400 dark:to-yellow-400 h-3 rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            )}

            {/* Enhanced mala counter */}
            <button
              onClick={handleCount}
              className="relative w-32 h-32 bg-gradient-to-br from-orange-500 via-amber-600 to-yellow-600 dark:from-orange-400 dark:via-amber-500 dark:to-yellow-500 rounded-full text-white font-bold text-sm shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300 mb-4 group overflow-hidden border border-amber-400/30 dark:border-amber-500/40"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex flex-col items-center justify-center">
                <FaBullseye className="w-6 h-6 mb-1" />
                <span>{t('mantraPractice.tapToCount')}</span>
              </div>
              <div className="absolute inset-0 rounded-full animate-ping bg-amber-500/30 opacity-0 group-active:opacity-100"></div>
            </button>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t('mantraPractice.tapToCountDescription')}
            </p>
          </div>
        </div>

        {/* Enhanced timer section */}
        <div className="card relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 via-emerald-50/50 to-teal-50/50 dark:from-green-900/20 dark:via-emerald-900/20 dark:to-teal-900/20 opacity-50"></div>
          <div className="relative text-center p-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <IoTimer className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200">{t('mantraPractice.sessionTimer')}</h4>
            </div>

            <div className="mb-6">
              <div className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                {formatTime(duration)}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                {t('mantraPractice.practiceDuration')}
              </p>
            </div>

            {/* Session stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-3 border border-white/40 dark:border-gray-700/40">
                <div className="text-xl font-bold text-orange-600 dark:text-orange-400">{count}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">{t('mantraPractice.repetitions')}</div>
              </div>
              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-3 border border-white/40 dark:border-gray-700/40">
                <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{formatTime(duration)}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">{t('mantraPractice.time')}</div>
              </div>
            </div>

            {startTime && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {t('mantraPractice.startedAt', { time: startTime.toLocaleTimeString() })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced complete button */}
      <div className="text-center">
        <button
          onClick={handleComplete}
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 hover:from-orange-700 hover:via-amber-700 hover:to-yellow-700 dark:from-orange-500 dark:via-amber-500 dark:to-yellow-500 dark:hover:from-orange-600 dark:hover:via-amber-600 dark:hover:to-yellow-600 text-white font-medium py-2.5 px-6 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 text-sm"
        >
          <IoCheckmarkCircle className="w-5 h-5" />
          <span>{t('mantraPractice.completePractice')}</span>
        </button>
      </div>
    </div>
  )
}
