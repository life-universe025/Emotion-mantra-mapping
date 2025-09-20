import { useState, useEffect, useRef } from 'react'
import { IoLeaf, IoPlay, IoPause, IoSettings, IoRefresh } from 'react-icons/io5'
import { BreathingSession } from '../types'
import { useTranslation } from 'react-i18next'

export interface BreathingPattern {
  name: string
  description: string
  phases: {
    inhale: number
    hold?: number
    exhale: number
    pause?: number
  }
  cycles?: number
  color: string
}

export const breathingPatterns: BreathingPattern[] = [
  {
    name: '4-7-8 Relaxing',
    description: 'Calming breath for anxiety and stress',
    phases: { inhale: 4, hold: 7, exhale: 8 },
    cycles: 4,
    color: 'from-blue-500 to-indigo-600'
  },
  {
    name: 'Box Breathing',
    description: 'Balanced breathing for focus',
    phases: { inhale: 4, hold: 4, exhale: 4, pause: 4 },
    color: 'from-green-500 to-emerald-600'
  },
  {
    name: 'Simple Deep',
    description: 'Basic deep breathing',
    phases: { inhale: 6, exhale: 6 },
    color: 'from-purple-500 to-violet-600'
  },
  {
    name: 'Energizing',
    description: 'Quick breathing for energy',
    phases: { inhale: 3, hold: 1, exhale: 3 },
    color: 'from-orange-500 to-red-600'
  }
]

interface BreathingGuideProps {
  isActive?: boolean
  onToggle?: () => void
  className?: string
  onSessionComplete?: (session: BreathingSession) => void
}

export function BreathingGuide({ isActive = false, onToggle, className = '', onSessionComplete }: BreathingGuideProps) {
  const [selectedPattern, setSelectedPattern] = useState<BreathingPattern>(breathingPatterns[0])
  const [isRunning, setIsRunning] = useState(false)
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale')
  const [phaseProgress, setPhaseProgress] = useState(0)
  const [cycleCount, setCycleCount] = useState(0)
  const [showSettings, setShowSettings] = useState(false)
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null)
  const { t } = useTranslation()
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const animationRef = useRef<number | null>(null)

  // Get translated pattern name and description
  const getTranslatedPattern = (pattern: BreathingPattern) => {
    const patternKey = pattern.name.toLowerCase().replace(/[^a-z0-9]/g, '')
    let translationKey = ''
    
    if (patternKey.includes('478') || patternKey.includes('relaxing')) {
      translationKey = 'relaxing'
    } else if (patternKey.includes('box')) {
      translationKey = 'box'
    } else if (patternKey.includes('simple')) {
      translationKey = 'simple'
    } else if (patternKey.includes('energizing')) {
      translationKey = 'energizing'
    }
    
    return {
      name: t(`breathingGuide.patterns.${translationKey}.name`),
      description: t(`breathingGuide.patterns.${translationKey}.description`)
    }
  }

  // Get current phase duration
  const getCurrentPhaseDuration = () => {
    switch (currentPhase) {
      case 'inhale': return selectedPattern.phases.inhale
      case 'hold': return selectedPattern.phases.hold || 0
      case 'exhale': return selectedPattern.phases.exhale
      case 'pause': return selectedPattern.phases.pause || 0
      default: return 4
    }
  }

  // Get next phase
  const getNextPhase = (current: string): 'inhale' | 'hold' | 'exhale' | 'pause' => {
    const { hold, pause } = selectedPattern.phases
    
    switch (current) {
      case 'inhale':
        return hold ? 'hold' : 'exhale'
      case 'hold':
        return 'exhale'
      case 'exhale':
        return pause ? 'pause' : 'inhale'
      case 'pause':
        return 'inhale'
      default:
        return 'inhale'
    }
  }

  // Animation loop
  useEffect(() => {
    if (!isRunning || !isActive) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      return
    }

    const phaseDuration = getCurrentPhaseDuration() * 1000 // Convert to milliseconds
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / phaseDuration, 1)
      
      setPhaseProgress(progress)

      if (progress >= 1) {
        // Move to next phase
        const nextPhase = getNextPhase(currentPhase)
        setCurrentPhase(nextPhase)
        
        // If we're starting a new cycle (back to inhale), increment count
        if (nextPhase === 'inhale' && currentPhase !== 'inhale') {
          setCycleCount(prev => prev + 1)
        }
        
        // Check if we've completed the required cycles
        if (selectedPattern.cycles && cycleCount >= selectedPattern.cycles && nextPhase === 'inhale') {
          setIsRunning(false)
          
          // Create breathing session data
          if (sessionStartTime && onSessionComplete) {
            const session: BreathingSession = {
              pattern: selectedPattern.name,
              cycles: cycleCount,
              duration_seconds: Math.floor((Date.now() - sessionStartTime.getTime()) / 1000),
              started_at: sessionStartTime,
              completed_at: new Date()
            }
            onSessionComplete(session)
          }
          
          setCycleCount(0)
          setSessionStartTime(null)
          return
        }
      } else {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [isRunning, isActive, currentPhase, selectedPattern, cycleCount])

  const handleStart = () => {
    setIsRunning(true)
    setCycleCount(0)
    setCurrentPhase('inhale')
    setPhaseProgress(0)
    setSessionStartTime(new Date())
  }

  const handleStop = () => {
    // If we have a session in progress, record it
    if (sessionStartTime && cycleCount > 0 && onSessionComplete) {
      const session: BreathingSession = {
        pattern: selectedPattern.name,
        cycles: cycleCount,
        duration_seconds: Math.floor((Date.now() - sessionStartTime.getTime()) / 1000),
        started_at: sessionStartTime,
        completed_at: new Date()
      }
      onSessionComplete(session)
    }
    
    setIsRunning(false)
    setCurrentPhase('inhale')
    setPhaseProgress(0)
    setSessionStartTime(null)
  }

  const handleReset = () => {
    setIsRunning(false)
    setCurrentPhase('inhale')
    setPhaseProgress(0)
    setCycleCount(0)
    setSessionStartTime(null)
  }

  // Calculate circle scale based on phase and progress
  const getCircleScale = () => {
    let baseScale = 0.6
    let targetScale = 1.0

    if (currentPhase === 'inhale') {
      return baseScale + (targetScale - baseScale) * phaseProgress
    } else if (currentPhase === 'exhale') {
      return targetScale - (targetScale - baseScale) * phaseProgress
    } else {
      // Hold or pause phases maintain current size
      return currentPhase === 'hold' ? targetScale : baseScale
    }
  }

  // Get phase instruction text
  const getPhaseText = () => {
    switch (currentPhase) {
      case 'inhale': return t('breathingGuide.breatheIn')
      case 'hold': return t('breathingGuide.hold')
      case 'exhale': return t('breathingGuide.breatheOut')
      case 'pause': return t('breathingGuide.pause')
      default: return t('breathingGuide.breathe')
    }
  }

  // Get remaining time for current phase
  const getRemainingTime = () => {
    const duration = getCurrentPhaseDuration()
    const remaining = Math.ceil(duration * (1 - phaseProgress))
    return remaining > 0 ? remaining : duration
  }

  if (!isActive) return null

  return (
    <div className={`card relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/50 via-blue-50/50 to-indigo-50/50 dark:from-cyan-900/20 dark:via-blue-900/20 dark:to-indigo-900/20 opacity-50"></div>
      
      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <IoLeaf className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200">{t('breathingGuide.title')}</h4>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 border border-white/40 dark:border-gray-700/40 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-all duration-300"
            >
              <IoSettings className="w-4 h-4" />
            </button>
            {onToggle && (
              <button
                onClick={onToggle}
                className="p-2 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 border border-white/40 dark:border-gray-700/40 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-all duration-300"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Pattern Settings */}
        {showSettings && (
          <div className="mb-6 p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl border border-white/40 dark:border-gray-700/40">
            <h5 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">{t('breathingGuide.breathingPatterns')}</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {breathingPatterns.map((pattern) => (
                <button
                  key={pattern.name}
                  onClick={() => {
                    setSelectedPattern(pattern)
                    handleReset()
                  }}
                  className={`p-3 rounded-lg text-left transition-all duration-300 ${
                    selectedPattern.name === pattern.name
                      ? 'bg-gradient-to-r ' + pattern.color + ' text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200'
                  }`}
                >
                  <div className="font-medium text-sm">{getTranslatedPattern(pattern).name}</div>
                  <div className="text-xs opacity-80 mt-1">{getTranslatedPattern(pattern).description}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Breathing Circle */}
        <div className="text-center mb-6">
          <div className="relative w-48 h-48 mx-auto mb-4">
            <div 
              className={`absolute inset-0 rounded-full bg-gradient-to-br ${selectedPattern.color} opacity-20 transition-all duration-1000 ease-in-out`}
              style={{ 
                transform: `scale(${getCircleScale()})`,
                filter: 'blur(8px)'
              }}
            />
            <div 
              className={`absolute inset-4 rounded-full bg-gradient-to-br ${selectedPattern.color} shadow-2xl transition-all duration-1000 ease-in-out flex items-center justify-center`}
              style={{ transform: `scale(${getCircleScale()})` }}
            >
              <div className="text-center text-white">
                <div className="text-2xl font-bold mb-1">{getPhaseText()}</div>
                <div className="text-lg opacity-90">{getRemainingTime()}s</div>
              </div>
            </div>
          </div>

          {/* Phase Progress Bar */}
          <div className="w-full max-w-xs mx-auto bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
            <div 
              className={`bg-gradient-to-r ${selectedPattern.color} h-2 rounded-full transition-all duration-100`}
              style={{ width: `${phaseProgress * 100}%` }}
            />
          </div>

          {/* Pattern Info */}
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            <div>{getTranslatedPattern(selectedPattern).description}</div>
            {selectedPattern.cycles && (
              <div className="mt-1">{t('breathingGuide.cycleOf', { current: cycleCount + 1, total: selectedPattern.cycles })}</div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={isRunning ? handleStop : handleStart}
            className={`group relative p-4 rounded-3xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 ${
              isRunning 
                ? 'bg-gradient-to-br from-red-500 to-red-600 text-white' 
                : 'bg-gradient-to-br ' + selectedPattern.color + ' text-white'
            }`}
          >
            {isRunning ? <IoPause className="w-6 h-6" /> : <IoPlay className="w-6 h-6" />}
            <div className="absolute inset-0 rounded-3xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
          
          <button
            onClick={handleReset}
            className="group relative p-3 rounded-3xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl hover:bg-white dark:hover:bg-gray-700 border border-gray-200/60 dark:border-gray-600/60 hover:border-gray-300/80 dark:hover:border-gray-500/80 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
          >
            <IoRefresh className="w-5 h-5" />
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 dark:from-blue-400/15 dark:to-indigo-400/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>
    </div>
  )
}
