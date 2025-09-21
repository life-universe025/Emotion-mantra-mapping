import { SessionMoodData } from '../types'
import { useTranslation } from 'react-i18next'
import { IoArrowForward, IoTrendingUp, IoTrendingDown, IoRemove } from 'react-icons/io5'

interface MoodComparisonProps {
  moodData: SessionMoodData
  className?: string
}

export function MoodComparison({ moodData, className = '' }: MoodComparisonProps) {
  const { t } = useTranslation()
  
  if (!moodData.before_mood || !moodData.after_mood) {
    return null
  }

  const improvement = moodData.mood_improvement || (moodData.after_mood.value - moodData.before_mood.value)
  const isImproved = improvement > 0
  const isWorse = improvement < 0

  const getImprovementIcon = () => {
    if (isImproved) return <IoTrendingUp className="w-4 h-4 text-green-600" />
    if (isWorse) return <IoTrendingDown className="w-4 h-4 text-red-600" />
    return <IoRemove className="w-4 h-4 text-gray-500" />
  }

  const getImprovementText = () => {
    if (isImproved) return t('moodComparison.improved')
    if (isWorse) return t('moodComparison.declined')
    return t('moodComparison.unchanged')
  }

  const getImprovementColor = () => {
    if (isImproved) return 'text-green-600 dark:text-green-400'
    if (isWorse) return 'text-red-600 dark:text-red-400'
    return 'text-gray-600 dark:text-gray-400'
  }

  return (
    <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800 ${className}`}>
      <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 text-center">
        {t('moodComparison.moodJourney')}
      </h4>
      
      <div className="flex items-center justify-between">
        {/* Before Mood */}
        <div className="flex flex-col items-center space-y-2">
          <div className={`
            p-3 rounded-xl border-2 ${moodData.before_mood.color}
            shadow-sm
          `}>
            <span className="text-2xl">{moodData.before_mood.emoji}</span>
          </div>
          <div className="text-center">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
              {t('moodComparison.before')}
            </p>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              {moodData.before_mood.label}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              {moodData.before_mood.value}/10
            </p>
          </div>
        </div>

        {/* Arrow and Improvement */}
        <div className="flex flex-col items-center space-y-2 px-4">
          <IoArrowForward className="w-6 h-6 text-gray-400" />
          <div className={`
            flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium
            ${isImproved ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
              isWorse ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' :
              'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
            }
          `}>
            {getImprovementIcon()}
            <span>{getImprovementText()}</span>
          </div>
          {improvement !== 0 && (
            <p className={`text-xs font-medium ${getImprovementColor()}`}>
              {improvement > 0 ? '+' : ''}{improvement} {t('moodComparison.points')}
            </p>
          )}
        </div>

        {/* After Mood */}
        <div className="flex flex-col items-center space-y-2">
          <div className={`
            p-3 rounded-xl border-2 ${moodData.after_mood.color}
            shadow-sm
          `}>
            <span className="text-2xl">{moodData.after_mood.emoji}</span>
          </div>
          <div className="text-center">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
              {t('moodComparison.after')}
            </p>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              {moodData.after_mood.label}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              {moodData.after_mood.value}/10
            </p>
          </div>
        </div>
      </div>

      {/* Encouragement message */}
      {isImproved && (
        <div className="mt-4 text-center">
          <p className="text-sm text-green-700 dark:text-green-300 font-medium">
            {t('moodComparison.encouragement')}
          </p>
        </div>
      )}
    </div>
  )
}
