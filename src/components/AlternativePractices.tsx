import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { IoLeaf, IoHeart, IoPlay, IoPause, IoRefresh, IoTimer } from 'react-icons/io5'
import { Emotion, BreathingExercise } from '../types'
import { breathingExercises } from '../data/breathingExercises'
import { affirmations } from '../data/affirmations'
import { useTranslation } from 'react-i18next'

interface AlternativePracticesProps {
  emotion: Emotion
}

export function AlternativePractices({ emotion }: AlternativePracticesProps) {
  const { t } = useTranslation()
  const params = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'breathing' | 'affirmations'>('breathing')
  const [selectedBreathing, setSelectedBreathing] = useState<BreathingExercise | null>(null)
  const [isBreathingActive, setIsBreathingActive] = useState(false)
  const [breathingCount, setBreathingCount] = useState(0)
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale')
  const [affirmationIndex, setAffirmationIndex] = useState(0)
  const [phaseProgress, setPhaseProgress] = useState(0)
  const [phaseTimeRemaining, setPhaseTimeRemaining] = useState(0)
  
  const breathingIntervalRef = useRef<number | null>(null)
  const phaseTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isActiveRef = useRef<boolean>(false)

  // Get relevant breathing exercises for this emotion
  const relevantBreathing = breathingExercises.filter(exercise => 
    exercise.emotions.includes(emotion.id as any)
  )

  // Get relevant affirmations for this emotion
  const relevantAffirmations = affirmations.filter(affirmation => 
    affirmation.emotions.includes(emotion.id as any)
  )

  const startBreathingExercise = (exercise: BreathingExercise) => {
    setSelectedBreathing(exercise)
    setIsBreathingActive(true)
    isActiveRef.current = true
    setBreathingCount(0)
    setBreathingPhase('inhale')
    setPhaseProgress(0)
    setPhaseTimeRemaining(0)
    startBreathingCycle(exercise)
  }

  const stopBreathingExercise = () => {
    isActiveRef.current = false
    stopBreathingCycle()
    setIsBreathingActive(false)
    setSelectedBreathing(null)
    setBreathingCount(0)
    setBreathingPhase('inhale')
    setPhaseProgress(0)
    setPhaseTimeRemaining(0)
  }

  const getNextAffirmation = () => {
    setAffirmationIndex((prev) => (prev + 1) % relevantAffirmations.length)
  }

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'gentle': return 'text-amber-700 bg-amber-100 border-amber-200 dark:text-amber-300 dark:bg-amber-900/30 dark:border-amber-700'
      case 'moderate': return 'text-orange-700 bg-orange-100 border-orange-200 dark:text-orange-300 dark:bg-orange-900/30 dark:border-orange-700'
      case 'strong': return 'text-yellow-700 bg-yellow-100 border-yellow-200 dark:text-yellow-300 dark:bg-yellow-900/30 dark:border-yellow-700'
      default: return 'text-amber-700 bg-amber-100 border-amber-200 dark:text-amber-300 dark:bg-amber-900/30 dark:border-amber-700'
    }
  }

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'inhale': return 'bg-orange-500'
      case 'hold': return 'bg-amber-500'
      case 'exhale': return 'bg-yellow-500'
      case 'pause': return 'bg-amber-400'
      default: return 'bg-amber-400'
    }
  }

  const getPhaseTextColor = (phase: string) => {
    switch (phase) {
      case 'inhale': return 'text-orange-500'
      case 'hold': return 'text-amber-500'
      case 'exhale': return 'text-yellow-500'
      case 'pause': return 'text-amber-400'
      default: return 'text-amber-400'
    }
  }

  // Breathing cycle logic
  const startBreathingCycle = (exercise: BreathingExercise) => {
    if (!exercise) return
    
    const pattern = exercise.pattern.split('-').map(Number) // e.g., [4, 4, 4, 4]
    const [inhaleTime, holdTime, exhaleTime, pauseTime] = pattern
    
    let currentCycle = 0
    let currentPhase = 0
    const phases = ['inhale', 'hold', 'exhale', 'pause'] as const
    const times = [inhaleTime, holdTime, exhaleTime, pauseTime]
    
    const runCycle = () => {
      if (currentCycle >= exercise.cycles) {
        // Exercise complete
        isActiveRef.current = false
        stopBreathingCycle()
        setIsBreathingActive(false)
        setBreathingCount(0)
        setBreathingPhase('inhale')
        setPhaseProgress(0)
        setPhaseTimeRemaining(0)
        return
      }
      
      const phase = phases[currentPhase]
      const time = times[currentPhase] * 1000 // Convert to milliseconds
      
      setBreathingPhase(phase)
      setBreathingCount(currentCycle)
      setPhaseTimeRemaining(times[currentPhase])
      setPhaseProgress(0)
      
      // Start progress animation
      const startTime = Date.now()
      const updateProgress = () => {
        if (!isActiveRef.current) return // Stop if exercise was stopped
        
        const elapsed = Date.now() - startTime
        const progress = Math.min((elapsed / time) * 100, 100)
        const remaining = Math.max(times[currentPhase] - Math.floor(elapsed / 1000), 0)
        
        setPhaseProgress(progress)
        setPhaseTimeRemaining(remaining)
        
        if (progress < 100 && isActiveRef.current) {
          breathingIntervalRef.current = requestAnimationFrame(updateProgress)
        }
      }
      
      updateProgress()
      
      phaseTimeoutRef.current = setTimeout(() => {
        if (!isActiveRef.current) return // Stop if exercise was stopped
        
        currentPhase++
        
        if (currentPhase >= phases.length) {
          // Cycle complete
          currentPhase = 0
          currentCycle++
        }
        
        runCycle()
      }, time)
    }
    
    runCycle()
  }

  const stopBreathingCycle = () => {
    if (breathingIntervalRef.current) {
      cancelAnimationFrame(breathingIntervalRef.current)
      breathingIntervalRef.current = null
    }
    if (phaseTimeoutRef.current) {
      clearTimeout(phaseTimeoutRef.current)
      phaseTimeoutRef.current = null
    }
  }

  // Handle URL-based tab switching
  useEffect(() => {
    if (params.tab === 'breathing' || params.tab === 'affirmations') {
      setActiveTab(params.tab)
      
      // Only stop breathing exercise when switching to affirmations (not when switching back)
      if (params.tab === 'affirmations' && isBreathingActive) {
        // Stop any running breathing exercise when switching to affirmations
        stopBreathingExercise()
      }
    }
  }, [params.tab, isBreathingActive])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopBreathingCycle()
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50/40 to-yellow-50/60 dark:from-gray-900 dark:via-slate-900/90 dark:to-gray-800 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${emotion.color}`}>
              <span className="text-2xl">{emotion.icon}</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-900 via-orange-800 to-yellow-800 dark:from-amber-300 dark:via-orange-300 dark:to-yellow-300 bg-clip-text text-transparent font-traditional">
                {emotion.name}
              </h1>
              <p className="text-amber-700 dark:text-amber-200">{emotion.description}</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-1 border border-white/40 dark:border-gray-700/40 shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] flex">
            <button
              onClick={() => navigate(`/alternatives/${emotion.id}/breathing`)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === 'breathing'
                  ? 'bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 text-white shadow-[0_8px_32px_rgba(217,119,6,0.3)] dark:shadow-[0_8px_32px_rgba(217,119,6,0.4)]'
                  : 'text-amber-700 dark:text-amber-200 hover:text-amber-900 dark:hover:text-amber-100'
              }`}
            >
              <IoLeaf className="inline w-4 h-4 mr-2" />
              {t('alternativePractices.breathingExercises')}
            </button>
            <button
              onClick={() => navigate(`/alternatives/${emotion.id}/affirmations`)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === 'affirmations'
                  ? 'bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 text-white shadow-[0_8px_32px_rgba(217,119,6,0.3)] dark:shadow-[0_8px_32px_rgba(217,119,6,0.4)]'
                  : 'text-amber-700 dark:text-amber-200 hover:text-amber-900 dark:hover:text-amber-100'
              }`}
            >
              <IoHeart className="inline w-4 h-4 mr-2" />
              {t('alternativePractices.affirmations')}
            </button>
          </div>
        </div>

        {/* Breathing Exercises Tab */}
        {activeTab === 'breathing' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold bg-gradient-to-r from-amber-900 via-orange-800 to-yellow-800 dark:from-amber-300 dark:via-orange-300 dark:to-yellow-300 bg-clip-text text-transparent font-traditional text-center">
              {t('alternativePractices.breathingExercisesFor', { emotion: emotion.name })}
            </h2>
            
            {!selectedBreathing ? (
              <div className="flex justify-center px-4">
                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 max-w-6xl w-full">
                  {relevantBreathing.map((exercise) => (
                  <div
                    key={exercise.id}
                    className="card cursor-pointer hover:scale-105 hover:-translate-y-1"
                    onClick={() => startBreathingExercise(exercise)}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
                        <IoLeaf className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-bold text-amber-900 dark:text-amber-100">{t(`breathingExercises.${exercise.id}.name`)}</h3>
                    </div>
                    
                    <p className="text-amber-700 dark:text-amber-200 text-sm mb-4">
                      {t(`breathingExercises.${exercise.id}.description`)}
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <IoTimer className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        <span className="text-amber-700 dark:text-amber-200">
                          {Math.floor(exercise.duration / 60)} {t('alternativePractices.min')} • {exercise.cycles} {t('alternativePractices.cycles')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-amber-700 dark:text-amber-200">{t('alternativePractices.pattern')}</span>
                        <span className="font-mono bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 px-2 py-1 rounded text-xs">
                          {exercise.pattern}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {exercise.benefits.slice(0, 2).map((_, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs rounded-full"
                        >
                          {t(`breathingExercises.${exercise.id}.benefits.${index}`)}
                        </span>
                      ))}
                    </div>
                    
                    <button className="w-full bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 hover:from-orange-700 hover:via-amber-700 hover:to-yellow-700 text-white font-medium py-2 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_8px_32px_rgba(217,119,6,0.3)] hover:shadow-[0_16px_40px_rgba(217,119,6,0.4)]">
                      <IoPlay className="w-4 h-4" />
                      {t('alternativePractices.startExercise')}
                    </button>
                  </div>
                ))}
                </div>
              </div>
            ) : (
              <div className="max-w-md mx-auto">
                <div className="card text-center">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-900 via-orange-800 to-yellow-800 dark:from-amber-300 dark:via-orange-300 dark:to-yellow-300 bg-clip-text text-transparent font-traditional mb-2">
                      {selectedBreathing.name}
                    </h3>
                    <p className="text-amber-700 dark:text-amber-200">
                      {selectedBreathing.description}
                    </p>
                  </div>
                  
                  {isBreathingActive && (
                    <div className="mb-6">
                      {/* Circular Progress Bar */}
                      <div className="relative w-40 h-40 mx-auto mb-4">
                        {/* Background Circle */}
                        <div className="absolute inset-0 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                        
                        {/* Progress Circle */}
                        <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="8"
                            strokeLinecap="round"
                            className={`${getPhaseTextColor(breathingPhase)} opacity-30`}
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 45}`}
                            strokeDashoffset={`${2 * Math.PI * 45 * (1 - phaseProgress / 100)}`}
                            className={`${getPhaseTextColor(breathingPhase)} transition-all duration-100 ease-linear`}
                          />
                        </svg>
                        
                        {/* Center Content */}
                        <div className={`absolute inset-0 rounded-full flex flex-col items-center justify-center text-white ${getPhaseColor(breathingPhase)}`}>
                          <div className="text-2xl font-bold">
                            {t(`alternativePractices.${breathingPhase}`)}
                          </div>
                          <div className="text-sm font-medium">
                            {phaseTimeRemaining}s
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-3xl font-bold text-amber-900 dark:text-amber-100 mb-2">
                        {breathingCount + 1} / {selectedBreathing.cycles}
                      </div>
                      <div className="text-amber-700 dark:text-amber-200">
                        {t('alternativePractices.pattern')} {selectedBreathing.pattern}
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    {!isBreathingActive ? (
                      <button
                        onClick={() => startBreathingExercise(selectedBreathing)}
                        className="w-full bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 hover:from-orange-700 hover:via-amber-700 hover:to-yellow-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_8px_32px_rgba(217,119,6,0.3)] hover:shadow-[0_16px_40px_rgba(217,119,6,0.4)]"
                      >
                        <IoPlay className="w-5 h-5" />
                        {t('alternativePractices.startBreathing')}
                      </button>
                    ) : (
                      <button
                        onClick={stopBreathingExercise}
                        className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <IoPause className="w-5 h-5" />
                        {t('alternativePractices.stopExercise')}
                      </button>
                    )}
                    
                    <button
                      onClick={() => setSelectedBreathing(null)}
                      className="w-full bg-amber-100 dark:bg-amber-900/30 hover:bg-amber-200 dark:hover:bg-amber-900/50 text-amber-800 dark:text-amber-200 font-medium py-2 px-4 rounded-xl transition-all duration-300"
                    >
                      {t('alternativePractices.backToExercises')}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Affirmations Tab */}
        {activeTab === 'affirmations' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold bg-gradient-to-r from-amber-900 via-orange-800 to-yellow-800 dark:from-amber-300 dark:via-orange-300 dark:to-yellow-300 bg-clip-text text-transparent font-traditional text-center">
              {t('alternativePractices.affirmationsFor', { emotion: emotion.name })}
            </h2>
            
            {relevantAffirmations.length > 0 ? (
              <div className="max-w-2xl mx-auto">
                <div className="card">
                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getIntensityColor(relevantAffirmations[affirmationIndex].intensity)}`}>
                        {t(`alternativePractices.intensity.${relevantAffirmations[affirmationIndex].intensity}`)}
                      </span>
                      <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-200 rounded-full text-sm">
                        {t(`alternativePractices.category.${relevantAffirmations[affirmationIndex].category}`)}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-amber-900 dark:text-amber-100 mb-4 font-traditional">
                      {t(`affirmations.${relevantAffirmations[affirmationIndex].id}.text`)}
                    </h3>
                    
                    <div className="text-sm text-amber-600 dark:text-amber-300">
                      {affirmationIndex + 1} {t('alternativePractices.of')} {relevantAffirmations.length}
                    </div>
                  </div>
                  
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={getNextAffirmation}
                      className="bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 hover:from-orange-700 hover:via-amber-700 hover:to-yellow-700 text-white font-medium py-2 px-6 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-[0_8px_32px_rgba(217,119,6,0.3)] hover:shadow-[0_16px_40px_rgba(217,119,6,0.4)]"
                    >
                      <IoRefresh className="w-4 h-4" />
                      {t('alternativePractices.nextAffirmation')}
                    </button>
                  </div>
                </div>
                
                <div className="grid gap-3 mt-6 md:grid-cols-2 lg:grid-cols-3">
                  {relevantAffirmations.map((affirmation, index) => (
                    <div
                      key={affirmation.id}
                      className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                        index === affirmationIndex
                          ? 'bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 border-amber-300 dark:border-amber-700'
                          : 'bg-white/60 dark:bg-gray-800/60 border-amber-200/60 dark:border-amber-700/60 hover:bg-white/80 dark:hover:bg-gray-800/80'
                      }`}
                      onClick={() => setAffirmationIndex(index)}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getIntensityColor(affirmation.intensity)}`}>
                          {t(`alternativePractices.intensity.${affirmation.intensity}`)}
                        </span>
                        <span className="text-xs text-amber-600 dark:text-amber-300">
                          {t(`alternativePractices.category.${affirmation.category}`)}
                        </span>
                      </div>
                      <p className="text-sm text-amber-800 dark:text-amber-200">
                        {t(`affirmations.${affirmation.id}.text`)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-amber-600 dark:text-amber-300">
                  {t('alternativePractices.noAffirmationsAvailable')}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
