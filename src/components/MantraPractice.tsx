import { useState, useEffect, useRef } from 'react'
import { IoPlay, IoPause, IoRefresh, IoCheckmarkCircle, IoVolumeHigh, IoTimer, IoSettings, IoClose, IoLeaf } from 'react-icons/io5'
import { FaBullseye } from 'react-icons/fa'
import { Mantra, Emotion } from '../types'
import { useTranslation } from 'react-i18next'
import { SupabaseService } from '../services/supabase'
import { mantraAudioService, AudioQuality } from '../services/audioService'

interface MantraPracticeProps {
  mantra: Mantra
  emotion: Emotion
  onComplete: (repetitions: number, duration: number) => void
  onAlternativePractices?: (emotion: Emotion) => void
  userId?: string
}

export function MantraPractice({ mantra, emotion, onComplete, onAlternativePractices, userId }: MantraPracticeProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [count, setCount] = useState(0)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [duration, setDuration] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [customGoal, setCustomGoal] = useState<number | null>(null)
  const [showGoalModal, setShowGoalModal] = useState(false)
  const [goalInput, setGoalInput] = useState('')
  const [isLoadingGoal, setIsLoadingGoal] = useState(false)
  const [mantraData, setMantraData] = useState<Mantra | null>(mantra)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [audioQuality, setAudioQuality] = useState<AudioQuality | null>(null)
  const { t } = useTranslation()
  
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Load mantra data from API on component mount
  useEffect(() => {
    const loadMantraData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch mantra data from API
        const result = await SupabaseService.getMantraById(mantra.id)
        
        if (result.error) {
          setError('Failed to load mantra data')
          console.error('Error loading mantra:', result.error)
        } else {
          setMantraData(result.data)
          
          // Preload audio for better performance
          if (result.data) {
            await mantraAudioService.preloadMantra(result.data)
            setAudioQuality(mantraAudioService.getAudioQuality(result.data))
          }
        }
      } catch (error) {
        setError('Failed to load mantra data')
        console.error('Error loading mantra:', error)
      } finally {
        setLoading(false)
      }
    }

    loadMantraData()
  }, [mantra.id])

  // Load custom goal on component mount
  useEffect(() => {
    if (userId) {
      loadCustomGoal()
    }
  }, [userId])

  // Initialize audio
  useEffect(() => {
    if (mantraData?.audio_url) {
      audioRef.current = new Audio(mantraData.audio_url)
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
  }, [mantraData?.audio_url])

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

  const playAudio = async () => {
    if (!mantraData) return
    
    try {
      setIsPlaying(true)
      const quality = await mantraAudioService.playMantra(mantraData)
      setAudioQuality(quality)
    } catch (error) {
      console.error('Error playing mantra audio:', error)
      setIsPlaying(false)
    }
  }

  const stopAudio = () => {
    mantraAudioService.stopAudio()
    setIsPlaying(false)
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

  // Goal management functions
  const loadCustomGoal = async () => {
    if (!userId) return
    
    try {
      const result = await SupabaseService.getCustomRepetitionGoal(userId)
      if (result.success && result.goal) {
        setCustomGoal(result.goal)
      }
    } catch (error) {
      console.error('Error loading custom goal:', error)
    }
  }

  const handleSetGoal = async () => {
    if (!userId || !goalInput.trim()) return
    
    const goal = parseInt(goalInput.trim())
    if (isNaN(goal) || goal <= 0) return
    
    setIsLoadingGoal(true)
    try {
      const result = await SupabaseService.setCustomRepetitionGoal(userId, goal)
      if (result.success) {
        setCustomGoal(goal)
        setShowGoalModal(false)
        setGoalInput('')
      }
    } catch (error) {
      console.error('Error setting custom goal:', error)
    } finally {
      setIsLoadingGoal(false)
    }
  }


  const handleUseSuggested = () => {
    setCustomGoal(null)
    setShowGoalModal(false)
    setGoalInput('')
  }

  // Show loading state
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-16">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-amber-600 dark:text-amber-400 font-medium">
            Loading mantra data...
          </p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error || !mantraData) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-2xl">⚠️</span>
          </div>
          <h3 className="text-xl font-semibold text-red-700 dark:text-red-300 mb-3">
            Failed to load mantra
          </h3>
          <p className="text-red-600 dark:text-red-400 mb-6">
            {error || 'Mantra data not available'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-2.5 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Determine which goal to use for progress calculation
  const currentGoal = customGoal || mantraData.suggested_rounds
  const progressPercentage = currentGoal > 0 
    ? Math.min((count / currentGoal) * 100, 100)
    : 0

  return (
    <div className="max-w-4xl mx-auto">
      {/* Enhanced emotion context header - Mobile optimized */}
      <div className="text-center mb-2 sm:mb-4">
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-1 sm:mb-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-200 dark:to-amber-200 rounded-xl sm:rounded-2xl flex items-center justify-center text-lg sm:text-xl shadow-sm border border-orange-200/50 dark:border-orange-300/50">
            {emotion.icon}
          </div>
          <div className="text-left">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-amber-900 via-orange-800 to-yellow-800 dark:from-amber-300 dark:via-orange-300 dark:to-yellow-300 bg-clip-text text-transparent font-traditional">
              {t(`emotions.${emotion.id}.name`)}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1">{t(`emotions.${emotion.id}.description`)}</p>
          </div>
        </div>
      </div>

      {/* Enhanced mantra display with spiritual elements - Mobile optimized */}
      <div className="card mb-2 sm:mb-4 relative overflow-hidden">
        {/* Sacred background patterns */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-amber-50/50 to-yellow-50/50 dark:from-orange-900/20 dark:via-amber-900/20 dark:to-yellow-900/20 opacity-50"></div>
        
        {/* Traditional Om symbols and lotus patterns - Smaller on mobile */}
        <div className="absolute top-2 left-2 sm:top-4 sm:left-4 text-xl sm:text-2xl lg:text-3xl text-amber-200/30 dark:text-amber-400/20 font-sanskrit select-none">ॐ</div>
        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 text-xl sm:text-2xl lg:text-3xl text-orange-200/30 dark:text-orange-400/20 font-sanskrit select-none">ॐ</div>
        <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 text-lg sm:text-xl lg:text-2xl text-yellow-200/30 dark:text-yellow-400/20 select-none">🪷</div>
        <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 text-lg sm:text-xl lg:text-2xl text-amber-200/30 dark:text-amber-400/20 select-none">🪷</div>
        
        {/* Sacred geometry patterns - Responsive */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 border border-amber-200/20 dark:border-amber-400/10 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 border border-orange-200/20 dark:border-orange-400/10 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 sm:w-16 sm:h-16 lg:w-16 lg:h-16 border border-yellow-200/20 dark:border-yellow-400/10 rounded-full"></div>
        
        <div className="relative text-center p-3 sm:p-4 lg:p-6">
          {/* Traditional Sanskrit header - Mobile optimized */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-800 dark:to-orange-800 rounded-full flex items-center justify-center shadow-lg border border-amber-200/50 dark:border-amber-600/50">
              <IoVolumeHigh className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="text-center">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-amber-800 via-orange-700 to-yellow-700 dark:from-amber-300 dark:via-orange-300 dark:to-yellow-300 bg-clip-text text-transparent font-traditional">
                {mantraData.transliteration}
              </h3>
            </div>
          </div>
          
          {/* Enhanced Devanagari display with traditional styling - Mobile optimized */}
          <div className="relative mb-3 sm:mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-100/30 via-orange-100/30 to-yellow-100/30 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-yellow-900/20 rounded-2xl blur-sm"></div>
            <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-3 sm:p-4 lg:p-6 border border-amber-200/50 dark:border-amber-600/50 shadow-lg">
              <div className="mantra-text font-sanskrit text-center text-2xl sm:text-3xl lg:text-4xl mb-2 sm:mb-3 leading-relaxed text-amber-800 dark:text-amber-200 font-bold tracking-wide">
                {mantraData.devanagari}
              </div>
              
              {/* Traditional Sanskrit ornamentation - Mobile optimized */}
              <div className="flex items-center justify-center gap-2 sm:gap-4 mb-2 sm:mb-3">
                <div className="w-6 sm:w-8 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
                <div className="text-amber-500 dark:text-amber-400 text-sm sm:text-base lg:text-lg">ॐ</div>
                <div className="w-6 sm:w-8 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
              </div>
              
              <div className="meaning text-center max-w-2xl mx-auto text-sm sm:text-base text-amber-700 dark:text-amber-300 font-medium leading-relaxed">
                {mantraData.meaning}
              </div>
            </div>
          </div>

          {/* Enhanced audio controls with proper UI - Mobile responsive */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 mt-4 sm:mt-6 px-4 sm:px-0">
            {/* Play/Pause Button */}
            <button
              onClick={handlePlayPause}
              className={`group relative flex items-center gap-2 px-3 sm:px-6 py-3 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 font-medium ${
                isPlaying 
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white border border-red-400/50' 
                  : 'bg-gradient-to-r from-orange-500 to-amber-600 text-white border border-orange-400/50'
              }`}
            >
              {isPlaying ? <IoPause className="w-5 h-5" /> : <IoPlay className="w-5 h-5" />}
              <span className="text-sm font-semibold hidden sm:inline">
                {isPlaying ? 'Pause' : 'Play'}
              </span>
              <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            {/* Reset Button */}
            <button
              onClick={handleReset}
              className="group relative flex items-center gap-2 px-3 sm:px-6 py-3 rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl hover:bg-white dark:hover:bg-gray-700 border border-gray-200/60 dark:border-gray-600/60 hover:border-gray-300/80 dark:hover:border-gray-500/80 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 font-medium"
            >
              <IoRefresh className="w-5 h-5" />
              <span className="text-sm font-semibold hidden sm:inline">Reset</span>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500/10 to-amber-500/10 dark:from-orange-400/15 dark:to-amber-400/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            {/* Alternative Practices Button */}
            {onAlternativePractices && (
              <button
                onClick={() => onAlternativePractices(emotion)}
                className="group relative flex items-center gap-2 px-3 sm:px-6 py-3 rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl hover:bg-white dark:hover:bg-gray-700 border border-gray-200/60 dark:border-gray-600/60 hover:border-gray-300/80 dark:hover:border-gray-500/80 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 font-medium"
                title="Alternative Practices"
              >
                <IoLeaf className="w-5 h-5" />
                <span className="text-sm font-semibold hidden sm:inline">Alternatives</span>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 dark:from-green-400/15 dark:to-emerald-400/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            )}
          </div>
        </div>
      </div>


      {/* Enhanced combined practice stats with spiritual design - Mobile optimized */}
      <div className="card relative overflow-hidden mb-6">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 via-orange-50/50 to-yellow-50/50 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-yellow-900/20 opacity-50"></div>
        
        {/* Sacred geometry background */}
        <div className="absolute top-4 right-4 text-2xl text-amber-200/20 dark:text-amber-400/10 font-sanskrit select-none">ॐ</div>
        <div className="absolute bottom-4 left-4 text-xl text-orange-200/20 dark:text-orange-400/10 select-none">🪷</div>
        
        <div className="relative p-3 sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-center gap-3 mb-4 sm:mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-800 dark:to-orange-800 rounded-full flex items-center justify-center shadow-lg border border-amber-200/50 dark:border-amber-600/50">
              <FaBullseye className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
            <h4 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-amber-800 via-orange-700 to-yellow-700 dark:from-amber-300 dark:via-orange-300 dark:to-yellow-300 bg-clip-text text-transparent font-traditional">
              {t('mantraPractice.practiceCounter')}
            </h4>
          </div>

          {/* Mobile-first layout: Just counter and timer on mobile */}
          <div className="grid grid-cols-2 gap-4 mb-3 sm:mb-4">
            {/* Counter */}
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent mb-1">
                {count}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                {t('mantraPractice.repetitions')}
              </div>
            </div>

            {/* Timer */}
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-1">
                {formatTime(duration)}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                {t('mantraPractice.time')}
              </div>
            </div>
          </div>

          {/* Goal info - Compact mobile layout */}
          <div className="text-center mb-3 sm:mb-4">
            <p className="text-xs text-gray-600 dark:text-gray-300 font-medium mb-1">
              {customGoal 
                ? t('mantraPractice.goalOf', { count: customGoal })
                : mantraData.suggested_rounds > 0 
                ? t('mantraPractice.suggestedRounds', { count: mantraData.suggested_rounds })
                : t('mantraPractice.repetitions')
              }
            </p>
            {userId && (
              <button
                onClick={() => setShowGoalModal(true)}
                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                title={t('mantraPractice.setCustomGoal')}
              >
                <IoSettings className="w-3 h-3 text-gray-500 dark:text-gray-400" />
              </button>
            )}
          </div>

          {/* Progress bar - Compact */}
          {currentGoal > 0 && (
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3 sm:mb-4 shadow-inner">
              <div 
                className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 dark:from-orange-400 dark:via-amber-400 dark:to-yellow-400 h-2 rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          )}

          {/* Goal reached indicator - Compact */}
          {count >= currentGoal && currentGoal > 0 && (
            <div className="text-xs font-medium text-green-600 dark:text-green-400 flex items-center justify-center gap-1 mb-3">
              <IoCheckmarkCircle className="w-3 h-3" />
              {t('mantraPractice.goalReached')}
            </div>
          )}

          {/* Enhanced 3D sphere counter - Compact mobile size */}
          <div className="flex justify-center mb-3 sm:mb-4">
            <button
              onClick={handleCount}
              className="relative w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full text-white font-bold text-xs transform hover:scale-105 active:scale-95 transition-all duration-300 group overflow-hidden"
              style={{
                background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2) 0%, rgba(249,115,22,0.95) 15%, rgba(234,88,12,1) 50%, rgba(194,65,12,1) 85%, rgba(154,52,18,1) 100%)',
                boxShadow: `
                  inset -6px -6px 12px rgba(0,0,0,0.2),
                  inset 4px 4px 8px rgba(255,255,255,0.08),
                  0 8px 16px rgba(234,88,12,0.2),
                  0 0 0 1px rgba(255,255,255,0.1)
                `,
                border: '1px solid rgba(255,255,255,0.15)'
              }}
            >
              {/* Subtle 3D highlight effect */}
              <div 
                className="absolute inset-0 rounded-full opacity-40"
                style={{
                  background: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 25%, transparent 50%)'
                }}
              ></div>
              
              {/* Main content */}
              <div className="relative flex flex-col items-center justify-center z-10">
                <FaBullseye className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 mb-1 drop-shadow-lg" />
                <span className="drop-shadow-md text-xs">Tap</span>
              </div>
              
              {/* Active state glow */}
              <div className="absolute inset-0 rounded-full animate-ping bg-orange-500/50 opacity-0 group-active:opacity-100"></div>
              
              {/* Hover state enhancement */}
              <div 
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2) 0%, transparent 40%)'
                }}
              ></div>
            </button>
          </div>

          {/* Session info */}
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              {t('mantraPractice.tapToCountDescription')}
            </p>
            {startTime && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {t('mantraPractice.startedAt', { time: startTime.toLocaleTimeString() })}
              </div>
            )}
          </div>
        </div>
      </div>


      {/* Enhanced Complete button with spiritual design */}
      <div className="text-center">
        <button
          onClick={handleComplete}
          className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 hover:from-orange-700 hover:via-amber-700 hover:to-yellow-700 dark:from-orange-500 dark:via-amber-500 dark:to-yellow-500 dark:hover:from-orange-600 dark:hover:via-amber-600 dark:hover:to-yellow-600 text-white font-medium py-4 px-8 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 text-base border border-white/20"
        >
          {/* Sacred Om symbol */}
          <span className="text-lg font-sanskrit">ॐ</span>
          <IoCheckmarkCircle className="w-6 h-6" />
          <span className="font-semibold">{t('mantraPractice.completePractice')}</span>
          
          {/* Spiritual energy glow */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/20 via-amber-500/20 to-yellow-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Sacred geometry border */}
          <div className="absolute inset-0 rounded-2xl border border-white/30 group-hover:border-white/50 transition-colors duration-300"></div>
        </button>
        
        {/* Spiritual guidance text */}
        <p className="text-sm text-amber-600 dark:text-amber-400 mt-3 font-medium">
          Complete your sacred practice and reflect on your journey
        </p>
      </div>

      {/* Goal Setting Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl p-4 w-full max-w-xs shadow-2xl border border-white/20 dark:border-gray-700/30">
            {/* Decorative background */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-amber-50/50 to-yellow-50/50 dark:from-orange-900/20 dark:via-amber-900/20 dark:to-yellow-900/20 rounded-2xl opacity-50"></div>
            
            <div className="relative">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-md">
                    <FaBullseye className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-bold bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 dark:from-orange-400 dark:via-amber-400 dark:to-yellow-400 bg-clip-text text-transparent">
                    {t('mantraPractice.setCustomGoal')}
                  </h3>
                </div>
                <button
                  onClick={() => setShowGoalModal(false)}
                  className="p-1.5 rounded-xl hover:bg-white/60 dark:hover:bg-gray-800/60 transition-all duration-300 group"
                >
                  <IoClose className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200" />
                </button>
              </div>
              
              {/* Input Section */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  {t('mantraPractice.enterGoal')}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={goalInput}
                    onChange={(e) => setGoalInput(e.target.value)}
                    placeholder={t('mantraPractice.goalPlaceholder')}
                    className="w-full px-3 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-orange-200/60 dark:border-orange-700/60 rounded-lg focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 dark:focus:border-orange-400 text-sm font-medium text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg"
                    min="1"
                    max="1000"
                  />
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-orange-500/5 to-amber-500/5 opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleSetGoal}
                  disabled={!goalInput.trim() || isLoadingGoal}
                  className="group relative bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 hover:from-orange-700 hover:via-amber-700 hover:to-yellow-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium py-2 px-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none"
                >
                  <div className="absolute inset-0 rounded-lg bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative flex items-center justify-center gap-1 whitespace-nowrap">
                    {isLoadingGoal ? (
                      <>
                        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span className="text-xs">Saving...</span>
                      </>
                    ) : (
                      <>
                        <IoCheckmarkCircle className="w-3.5 h-3.5" />
                        <span className="text-xs">Save Goal</span>
                      </>
                    )}
                  </span>
                </button>
                
                <button
                  onClick={handleUseSuggested}
                  className="group relative bg-gradient-to-r from-blue-100/80 to-cyan-100/80 dark:from-blue-900/30 dark:to-cyan-900/30 hover:from-blue-200/80 hover:to-cyan-200/80 dark:hover:from-blue-800/40 dark:hover:to-cyan-800/40 border border-blue-200/60 dark:border-blue-700/60 hover:border-blue-300/80 dark:hover:border-blue-600/80 text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 font-medium py-2 px-2 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative flex items-center justify-center gap-1 whitespace-nowrap">
                    <FaBullseye className="w-3.5 h-3.5" />
                    <span className="text-xs">Use Suggested</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
