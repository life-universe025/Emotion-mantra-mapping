import { UserStats } from '../types'
import { useTranslation } from 'react-i18next'
import { IoTrendingUp, IoTrendingDown, IoStatsChart } from 'react-icons/io5'

interface MoodAnalyticsProps {
  userStats: UserStats
  className?: string
}

export function MoodAnalytics({ userStats, className = '' }: MoodAnalyticsProps) {
  const { t } = useTranslation()

  // Don't show if no mood tracking data
  if (!userStats.sessions_with_mood_tracking || userStats.sessions_with_mood_tracking === 0) {
    return null
  }

  const averageImprovement = userStats.average_mood_improvement || 0
  const totalImprovements = userStats.total_mood_improvements || 0
  const sessionsWithMood = userStats.sessions_with_mood_tracking || 0

  const getImprovementIcon = () => {
    if (averageImprovement > 0) return <IoTrendingUp className="w-5 h-5 text-green-600" />
    if (averageImprovement < 0) return <IoTrendingDown className="w-5 h-5 text-red-600" />
    return <IoStatsChart className="w-5 h-5 text-gray-500" />
  }

  const getImprovementColor = () => {
    if (averageImprovement > 0) return 'text-green-600 dark:text-green-400'
    if (averageImprovement < 0) return 'text-red-600 dark:text-red-400'
    return 'text-gray-600 dark:text-gray-400'
  }

  const getImprovementText = () => {
    if (averageImprovement > 0) return t('moodAnalytics.improving')
    if (averageImprovement < 0) return t('moodAnalytics.declining')
    return t('moodAnalytics.stable')
  }

  return (
    <div className={`bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800 ${className}`}>
      <div className="flex items-center space-x-2 mb-3">
        <IoStatsChart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          {t('moodAnalytics.title')}
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Average Improvement */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            {getImprovementIcon()}
            <span className={`text-2xl font-bold ${getImprovementColor()}`}>
              {averageImprovement > 0 ? '+' : ''}{averageImprovement.toFixed(1)}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('moodAnalytics.averageImprovement')}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            {getImprovementText()}
          </p>
        </div>

        {/* Total Improvements */}
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
            {totalImprovements}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('moodAnalytics.totalImprovements')}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            {t('moodAnalytics.points')}
          </p>
        </div>

        {/* Sessions Tracked */}
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
            {sessionsWithMood}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('moodAnalytics.sessionsTracked')}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            {t('moodAnalytics.withMoodData')}
          </p>
        </div>
      </div>

      {/* Encouragement message */}
      {averageImprovement > 0 && (
        <div className="mt-4 text-center">
          <p className="text-sm text-green-700 dark:text-green-300 font-medium">
            {t('moodAnalytics.encouragement')}
          </p>
        </div>
      )}
    </div>
  )
}
