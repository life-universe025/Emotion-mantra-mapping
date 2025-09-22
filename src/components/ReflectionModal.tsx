import { useState } from 'react'
import { IoSend, IoClose, IoCheckmarkCircle } from 'react-icons/io5'
import { Mantra, Emotion } from '../types'
import { EdgeFunctionService } from '../services/edgeFunctions'
import { useTranslation } from 'react-i18next'
import { MoodSelector } from './MoodSelector'
import { MoodComparison } from './MoodComparison'
import { useMoodTracking } from '../hooks/useMoodTracking'

interface ReflectionModalProps {
  mantra: Mantra
  emotion: Emotion
  sessionData: {
    repetitions: number
    duration: number
  }
  onComplete: () => void
  onClose?: () => void
  user?: any // Add user prop to avoid redundant API calls
}

export function ReflectionModal({ 
  mantra, 
  emotion, 
  sessionData, 
  onComplete,
  onClose,
  user
}: ReflectionModalProps) {
  const [reflection, setReflection] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { t } = useTranslation()
  
  // Mood tracking
  const { 
    beforeMood, 
    afterMood, 
    moodData, 
    setBeforeMood, 
    setAfterMood, 
    clearMoods 
  } = useMoodTracking()

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      // Use user from props instead of making API call
      if (!user) {
        console.error('User not authenticated')
        // For demo purposes, continue without saving
        onComplete()
        return
      }

      // Check if this is a valid session (either has practice data or mood data)
      const hasPracticeData = sessionData.repetitions > 0 || sessionData.duration > 0
      const hasMoodData = beforeMood || afterMood
      
      if (!hasPracticeData && !hasMoodData) {
        console.warn('No practice or mood data to save, skipping session creation')
        onComplete()
        return
      }

      // Save session via Edge Function (enforces auth + trigger updates stats)
      try {
        await EdgeFunctionService.createSession({
          mantra_id: mantra.id,
          repetitions: sessionData.repetitions,
          duration_seconds: sessionData.duration,
          notes: reflection.trim() || undefined,
          // Mood tracking data
          before_mood: beforeMood?.value,
          after_mood: afterMood?.value,
          mood_improvement: moodData.mood_improvement
        })
        console.log('Session saved successfully')
        
        // Show success state briefly before completing
        setIsSuccess(true)
        setTimeout(() => {
          onComplete()
        }, 800)
      } catch (e) {
        console.error('Error saving session via edge function:', e)
        // Still complete even if saving fails
        onComplete()
      }
    } catch (error) {
      console.error('Error saving reflection:', error)
      // Still complete the flow even if saving fails
      onComplete()
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    clearMoods()
    setIsSuccess(false)
    if (onClose) {
      onClose()
    } else {
      onComplete()
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 flex items-center justify-center p-4 pt-20 z-40">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full max-h-[calc(90vh-5rem)] overflow-y-auto overflow-x-hidden relative">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200 z-10"
          aria-label={t('reflectionModal.close')}
        >
          <IoClose className="w-5 h-5" />
        </button>
        <div className="p-6">
          {/* Header */}
          <div className="text-center mb-5">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1.5 tracking-tight">
              {sessionData.repetitions > 0 || sessionData.duration > 0 
                ? t('reflectionModal.practiceComplete')
                : 'Mood Check-in'
              }
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              {sessionData.repetitions > 0 || sessionData.duration > 0 
                ? t('reflectionModal.takeMoment')
                : 'Take a moment to check in with your current mood'
              }
            </p>
          </div>

          {/* Session summary */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-3 mb-5 border border-gray-200/50 dark:border-gray-600/50">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2.5 tracking-wide">{t('reflectionModal.yourPractice')}</h3>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400">{t('reflectionModal.mantra')}</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{t(`mantras.${mantra.slug}.transliteration`)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400">{t('reflectionModal.emotion')}</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{t(`emotions.${emotion.id}.name`)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400">{t('reflectionModal.repetitions')}</span>
                <span className={`font-medium ${sessionData.repetitions > 0 ? 'text-gray-800 dark:text-gray-200' : 'text-gray-400 dark:text-gray-500'}`}>
                  {sessionData.repetitions > 0 ? sessionData.repetitions : 'No practice'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400">{t('reflectionModal.duration')}</span>
                <span className={`font-medium ${sessionData.duration > 0 ? 'text-gray-800 dark:text-gray-200' : 'text-gray-400 dark:text-gray-500'}`}>
                  {sessionData.duration > 0 ? formatTime(sessionData.duration) : 'No practice'}
                </span>
              </div>
            </div>
          </div>

          {/* Clean Mood Tracking Section */}
          <div className="mb-5">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 text-center tracking-wide">
              {t('reflectionModal.moodTracking')}
            </h3>
            
            {/* Simple Side-by-Side Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-3">
              {/* Before Mood */}
              <div className="text-center">
                <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 tracking-wide">
                  {t('reflectionModal.beforeMood')}
                </h4>
                <MoodSelector
                  selectedMood={beforeMood}
                  onMoodSelect={setBeforeMood}
                  showLabels={false}
                  className=""
                />
              </div>

              {/* After Mood */}
              <div className="text-center">
                <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 tracking-wide">
                  {t('reflectionModal.afterMood')}
                </h4>
                <MoodSelector
                  selectedMood={afterMood}
                  onMoodSelect={setAfterMood}
                  showLabels={false}
                  className=""
                />
              </div>
            </div>

            {/* Mood Comparison */}
            {beforeMood && afterMood && (
              <MoodComparison moodData={moodData} className="mb-3" />
            )}
          </div>

          {/* Reflection form */}
          <div className="mb-5">
            <label htmlFor="reflection" className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 tracking-wide">
              {t('reflectionModal.howDoYouFeel')}
            </label>
            <textarea
              id="reflection"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder={t('reflectionModal.shareThoughts')}
              className="w-full p-2.5 border border-amber-200 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 text-sm leading-relaxed"
              rows={3}
            />
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {t('reflectionModal.optionalNote')}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex space-x-2">
            <button
              onClick={onComplete}
              className="flex-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl hover:bg-white dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100 font-medium py-2 px-3 rounded-lg border border-gray-200/60 dark:border-gray-600/60 hover:border-gray-300/80 dark:hover:border-gray-500/80 transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105 active:scale-95 text-sm"
              disabled={isSubmitting || isSuccess}
            >
              {t('reflectionModal.skipReflection')}
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || isSuccess}
              className={`flex-1 font-medium py-2 px-3 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105 active:scale-95 flex items-center justify-center space-x-1.5 text-sm ${
                isSuccess 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white cursor-default' 
                  : isSubmitting
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white cursor-not-allowed opacity-75'
                  : 'bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 hover:from-orange-700 hover:via-amber-700 hover:to-yellow-700 dark:from-orange-500 dark:via-amber-500 dark:to-yellow-500 dark:hover:from-orange-600 dark:hover:via-amber-600 dark:hover:to-yellow-600 text-white'
              }`}
            >
              {isSuccess ? (
                <>
                  <IoCheckmarkCircle className="w-3 h-3" />
                  <span>Saved!</span>
                </>
              ) : isSubmitting ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <IoSend className="w-3 h-3" />
                  <span>{t('reflectionModal.saveAndContinue')}</span>
                </>
              )}
            </button>
          </div>

          {/* Encouragement */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {t('reflectionModal.greatWork')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
