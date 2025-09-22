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


  return (
    <div className={`bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-indigo-900/20 rounded-xl p-3 border border-purple-200/50 dark:border-purple-800/50 shadow-md backdrop-blur-sm relative overflow-hidden ${className}`}>
      <div className="relative">
        {/* Compact header */}
        <div className="text-center mb-3">
          <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 tracking-wide">
            {t('moodComparison.moodJourney')}
          </h4>
        </div>
        
        <div className="flex items-center justify-between min-w-0">
          {/* Before Mood */}
          <div className="flex flex-col items-center space-y-2 flex-shrink-0">
            <div className={`
              p-2.5 rounded-xl border-2 ${moodData.before_mood.color}
              shadow-sm hover:shadow-md transition-all duration-200
              relative overflow-hidden
            `}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
              <span className="text-2xl relative z-10">{moodData.before_mood.emoji}</span>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 tracking-wide uppercase">
                {t('moodComparison.before')}
              </p>
              <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                {moodData.before_mood.value}/10
              </p>
            </div>
          </div>

          {/* Arrow and Improvement */}
          <div className="flex flex-col items-center space-y-2 px-1 flex-shrink-0">
            <div className="relative">
              <IoArrowForward className="w-4 h-4 text-purple-400 dark:text-purple-300" />
            </div>
            <div className={`
              flex items-center space-x-1 px-2 py-1 rounded-full text-[10px] font-medium whitespace-nowrap
              ${isImproved ? 'bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 text-green-700 dark:text-green-300' :
                isWorse ? 'bg-gradient-to-r from-red-100 to-rose-100 dark:from-red-900/40 dark:to-rose-900/40 text-red-700 dark:text-red-300' :
                'bg-gradient-to-r from-gray-100 to-slate-100 dark:from-gray-800 dark:to-slate-800 text-gray-600 dark:text-gray-400'
              }
            `}>
              {getImprovementIcon()}
              <span>{getImprovementText()}</span>
            </div>
            {improvement !== 0 && (
              <div className={`
                px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap
                ${isImproved ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                  'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                }
              `}>
                {improvement > 0 ? '+' : ''}{improvement}
              </div>
            )}
          </div>

          {/* After Mood */}
          <div className="flex flex-col items-center space-y-2 flex-shrink-0">
            <div className={`
              p-2.5 rounded-xl border-2 ${moodData.after_mood.color}
              shadow-sm hover:shadow-md transition-all duration-200
              relative overflow-hidden
            `}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
              <span className="text-2xl relative z-10">{moodData.after_mood.emoji}</span>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 tracking-wide uppercase">
                {t('moodComparison.after')}
              </p>
              <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                {moodData.after_mood.value}/10
              </p>
            </div>
          </div>
        </div>

        {/* Encouragement message */}
        {isImproved && (
          <div className="mt-2 text-center">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-2 border border-green-200/50 dark:border-green-700/50">
              <p className="text-xs text-green-700 dark:text-green-300 font-medium">
                {t('moodComparison.encouragement')}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
