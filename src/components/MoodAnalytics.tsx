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
    if (averageImprovement > 0) return <IoTrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400" />
    if (averageImprovement < 0) return <IoTrendingDown className="w-5 h-5 text-orange-600 dark:text-orange-400" />
    return <IoStatsChart className="w-5 h-5 text-gray-500 dark:text-gray-400" />
  }

  const getImprovementColor = () => {
    if (averageImprovement > 0) return 'text-amber-600 dark:text-amber-400'
    if (averageImprovement < 0) return 'text-orange-600 dark:text-orange-400'
    return 'text-gray-600 dark:text-gray-400'
  }

  const getImprovementText = () => {
    if (averageImprovement > 0) return t('moodAnalytics.improving')
    if (averageImprovement < 0) return t('moodAnalytics.declining')
    return t('moodAnalytics.stable')
  }

  return (
    <div className={`bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/40 dark:border-gray-700/40 rounded-2xl p-6 shadow-sm relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/20 via-amber-50/20 to-yellow-50/20 dark:from-orange-900/10 dark:via-amber-900/10 dark:to-yellow-900/10 opacity-50"></div>
      
      <div className="relative">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center">
            <IoStatsChart className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold bg-gradient-to-r from-amber-900 via-orange-800 to-yellow-800 dark:from-amber-300 dark:via-orange-300 dark:to-yellow-300 bg-clip-text text-transparent font-traditional">
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
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">
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
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">
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
          <div className="mt-6 text-center">
            <p className="text-sm text-amber-700 dark:text-amber-300 font-medium">
              {t('moodAnalytics.encouragement')}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
