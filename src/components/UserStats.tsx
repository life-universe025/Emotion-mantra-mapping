import { useState, useEffect } from 'react'
import { IoCalendar, IoBarChart, IoFlame, IoTime, IoTrophy } from 'react-icons/io5'
import { FaBullseye, FaChartLine, FaAward } from 'react-icons/fa'
import { SupabaseService } from '../services/supabase'
import { UserStats as UserStatsType } from '../types'
import { PracticeChart } from './PracticeChart'
import { StreakAnimation } from './StreakAnimation'
import { MoodAnalytics } from './MoodAnalytics'
import { useTranslation } from 'react-i18next'

interface UserStatsProps {
  userId: string
  onMantraSelect?: (mantraId: number) => void
  compact?: boolean // For main page vs full profile view
  onRecentSessionsLoaded?: (sessions: any[]) => void // Callback to pass recent sessions to parent
}

interface UserAnalytics {
  totalSessions: number
  weeklySessions: number
  topMantras: Array<{
    mantraId: number
    count: number
    mantra?: {
      transliteration: string
      devanagari: string
    }
  }>
}

interface ChartData {
  date?: string
  week?: string
  dateLabel?: string
  weekLabel?: string
  sessions: number
  repetitions: number
  duration: number
}

type TimeFrame = 'daily' | 'weekly'
type ChartMetric = 'sessions' | 'repetitions' | 'duration'


export function UserStats({ userId, onMantraSelect, compact = false, onRecentSessionsLoaded }: UserStatsProps) {
  const [stats, setStats] = useState<UserStatsType | null>(null)
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [allChartData, setAllChartData] = useState<{ daily: ChartData[], weekly: ChartData[] }>({ daily: [], weekly: [] })
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('daily')
  const [selectedMetric, setSelectedMetric] = useState<ChartMetric>('sessions')
  const { t } = useTranslation()
  const [showStreakAnimation, setShowStreakAnimation] = useState(false)
  const [previousStreak, setPreviousStreak] = useState(0)

  useEffect(() => {
    loadStats()
  }, [userId])

  useEffect(() => {
    // Update chart data when timeFrame changes (no need for separate API call)
    if (stats && analytics) {
      updateChartData()
    }
  }, [timeFrame, stats, analytics])

  useEffect(() => {
    // Check for streak increase to trigger animation
    if (stats && stats.current_streak > previousStreak && previousStreak > 0) {
      const shouldCelebrate = stats.current_streak > 0 && 
        (stats.current_streak % 7 === 0 || stats.current_streak === 3 || 
         stats.current_streak === 21 || stats.current_streak === 30 || 
         stats.current_streak === 50 || stats.current_streak === 100)
      
      if (shouldCelebrate) {
        setShowStreakAnimation(true)
      }
    }
    if (stats) {
      setPreviousStreak(stats.current_streak)
    }
  }, [stats, previousStreak])

  const loadStats = async () => {
    try {
      // Use consolidated method to reduce API calls
      const { data: allData, error } = await SupabaseService.getAllUserData(userId)
      
      if (error) {
        console.error('Error loading stats:', error)
        return
      }
      
      if (!allData) {
        console.error('No data received')
        return
      }
      
      // Set user stats
      setStats(allData.userStats)
      
      // Set analytics
      setAnalytics({
        totalSessions: allData.analytics?.totalSessions || 0,
        weeklySessions: allData.analytics?.weeklySessions || 0,
        topMantras: (allData.analytics?.topMantras || []).map((item: any) => ({
          mantraId: item.mantraId,
          count: item.count,
          mantra: item.mantra ? {
            transliteration: item.mantra.transliteration,
            devanagari: item.mantra.devanagari
          } : undefined
        }))
      })

      // Store all chart data and set initial chart data
      if (allData.chartData) {
        setAllChartData(allData.chartData)
        setChartData(timeFrame === 'daily' ? allData.chartData.daily : allData.chartData.weekly)
      }

      // Pass recent sessions to parent component if callback provided
      if (onRecentSessionsLoaded && allData.recentSessions) {
        onRecentSessionsLoaded(allData.recentSessions)
      }
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateChartData = () => {
    // Update chart data when timeFrame changes using already loaded data
    if (timeFrame === 'daily') {
      setChartData(allChartData.daily)
    } else {
      setChartData(allChartData.weekly)
    }
  }



  if (loading) {
    return (
      <div className="space-y-8">
        <div className="card">
          <div className="animate-pulse">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-12 w-12 bg-gradient-to-br from-orange-200 to-amber-200 dark:from-orange-700 dark:to-amber-700 rounded-2xl" />
            <div>
              <div className="h-6 bg-amber-200 dark:bg-amber-700 rounded w-48 mb-2" />
              <div className="h-4 bg-amber-100 dark:bg-amber-800 rounded w-64" />
            </div>
          </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="h-32 bg-gradient-to-br from-amber-100 to-orange-200 dark:from-amber-800 dark:to-orange-700 rounded-3xl" />
              <div className="h-32 bg-gradient-to-br from-amber-100 to-orange-200 dark:from-amber-800 dark:to-orange-700 rounded-3xl" />
              <div className="h-32 bg-gradient-to-br from-amber-100 to-orange-200 dark:from-amber-800 dark:to-orange-700 rounded-3xl" />
              <div className="h-32 bg-gradient-to-br from-amber-100 to-orange-200 dark:from-amber-800 dark:to-orange-700 rounded-3xl" />
            </div>
            <div className="h-40 bg-gradient-to-br from-amber-100 to-orange-200 dark:from-amber-800 dark:to-orange-700 rounded-3xl mt-8" />
          </div>
        </div>
      </div>
    )
  }

  if (!stats && !analytics) {
    return (
      <div className="card text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-amber-50/50 to-yellow-50/50 dark:from-orange-900/20 dark:via-amber-900/20 dark:to-yellow-900/20 opacity-50"></div>
        <div className="relative py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-600 dark:from-orange-400 dark:to-amber-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl text-white">ॐ</span>
          </div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-900 via-orange-800 to-yellow-800 dark:from-amber-300 dark:via-orange-300 dark:to-yellow-300 bg-clip-text text-transparent mb-3 font-traditional">{t('userStats.beginSadhana')}</h3>
          <p className="text-lg text-amber-700 dark:text-amber-200 leading-relaxed">Complete your first mantra practice to see your spiritual progress here!</p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <span className="text-amber-500 dark:text-amber-400">🪷</span>
            <span className="text-sm text-amber-600 dark:text-amber-300 font-medium">Your sacred journey awaits</span>
          </div>
        </div>
      </div>
    )
  }

  // Compact version for main page
  if (compact) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Streak Animation */}
        {showStreakAnimation && stats && (
          <StreakAnimation 
            streak={stats.current_streak} 
            onAnimationComplete={() => setShowStreakAnimation(false)}
          />
        )}

        {/* Compact Stats Card */}
        <div className="lg:col-span-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/40 dark:border-gray-700/40 rounded-2xl p-4 shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50/20 via-amber-50/20 to-yellow-50/20 dark:from-orange-900/10 dark:via-amber-900/10 dark:to-yellow-900/10 opacity-50"></div>
          
          <div className="relative">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center">
                <span className="text-xs text-white">ॐ</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200 font-traditional">{t('userStats.sadhanaStats')}</h3>
                <p className="text-xs text-amber-700 dark:text-amber-300">{t('userStats.spiritualJourney')}</p>
              </div>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Current Streak */}
              <div className="text-center">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-1.5">
                    <IoFlame className="w-4 h-4" />
                  </div>
                  <div className="text-lg font-bold text-orange-600 dark:text-orange-400">{stats?.current_streak || 0}</div>
                  <div className="text-xs text-amber-700 dark:text-amber-300">{t('userStats.dayStreak')}</div>
                  {(stats?.current_streak || 0) >= 7 && (
                    <IoFlame className="w-3 h-3 text-orange-600 mt-0.5" />
                  )}
                </div>
              </div>

              {/* Total Sessions */}
              <div className="text-center">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-1.5">
                    <IoBarChart className="w-4 h-4" />
                  </div>
                  <div className="text-lg font-bold text-amber-600 dark:text-amber-400">{analytics?.totalSessions || 0}</div>
                  <div className="text-xs text-amber-700 dark:text-amber-300">{t('userStats.sessions')}</div>
                </div>
              </div>

              {/* Weekly Sessions */}
              <div className="text-center">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-lg bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400 flex items-center justify-center mb-1.5">
                    <IoCalendar className="w-4 h-4" />
                  </div>
                  <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{analytics?.weeklySessions || 0}</div>
                  <div className="text-xs text-amber-700 dark:text-amber-300">{t('userStats.thisWeek')}</div>
                </div>
              </div>

              {/* Total Repetitions */}
              <div className="text-center">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-1.5">
                    <FaBullseye className="w-4 h-4" />
                  </div>
                  <div className="text-lg font-bold text-orange-600 dark:text-orange-400">{(stats?.total_repetitions || 0) > 999 ? `${Math.floor((stats?.total_repetitions || 0) / 1000)}k` : (stats?.total_repetitions || 0)}</div>
                  <div className="text-xs text-amber-700 dark:text-amber-300">{t('userStats.repetitions')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Side Mantras Section - Shows Top Mantras or Get Started */}
        <div className="lg:col-span-1 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/40 dark:border-gray-700/40 rounded-2xl p-4 shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50/20 via-orange-50/20 to-yellow-50/20 dark:from-amber-900/10 dark:via-orange-900/10 dark:to-yellow-900/10 opacity-50"></div>
          
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <IoTrophy className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200 font-traditional">
                {analytics?.topMantras && analytics.topMantras.length > 0 ? t('userStats.favoriteMantras') : t('userStats.yourSadhana')}
              </h4>
            </div>
            
            {analytics?.topMantras && analytics.topMantras.length > 0 ? (
              /* Existing Top Mantras for users with data */
              <div className="space-y-2">
                {analytics.topMantras.slice(0, 2).map((item, index) => (
                  <button
                    key={item.mantraId}
                    onClick={() => onMantraSelect?.(item.mantraId)}
                    className="flex items-center justify-between p-2 bg-white/50 dark:bg-gray-800/50 hover:bg-white/80 dark:hover:bg-gray-700/80 rounded-lg border border-white/40 dark:border-gray-600/40 transition-all duration-200 hover:scale-[1.02] group text-left w-full"
                    title="Click to practice this mantra again"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <div className={`w-6 h-6 rounded-md grid place-items-center text-xs font-bold flex-shrink-0 ${
                        index === 0 ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-white' :
                        'bg-gradient-to-br from-gray-300 to-gray-400 text-white'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-gray-900 dark:text-gray-100 text-xs truncate">
                          {item.mantra?.transliteration || 'Unknown Mantra'}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{t('userStats.sessionsCount', { count: item.count })}</div>
                      </div>
                    </div>
                    <div className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">
                      <span className="text-amber-600 dark:text-amber-400 text-xs">▶</span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              /* New User Get Started Message */
              <div className="text-center py-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/50 dark:to-amber-900/50 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🪷</span>
                </div>
                <p className="text-xs text-amber-700 dark:text-amber-300 mb-3 leading-relaxed">
                  {t('userStats.startFirstPractice')}
                </p>
                <div className="flex items-center justify-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-medium">
                  <span>🧘‍♀️</span>
                  <span>{t('userStats.beginSadhanaShort')}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Full enhanced version for profile page
  return (
    <div className="space-y-6">
      {/* Streak Animation */}
      {showStreakAnimation && stats && (
        <StreakAnimation 
          streak={stats.current_streak} 
          onAnimationComplete={() => setShowStreakAnimation(false)}
        />
      )}

      {/* Top Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Current Streak */}
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/40 dark:border-gray-700/40 rounded-2xl p-4 shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50/20 via-amber-50/20 to-yellow-50/20 dark:from-orange-900/10 dark:via-amber-900/10 dark:to-yellow-900/10 opacity-50"></div>
          <div className="relative text-center">
            <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400 flex items-center justify-center mx-auto mb-2">
              <IoFlame className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats?.current_streak || 0}</div>
            <div className="text-sm text-amber-700 dark:text-amber-300">{t('userStats.dayStreak')}</div>
            {(stats?.current_streak || 0) >= 7 && (
              <IoFlame className="w-4 h-4 text-orange-600 mt-1" />
            )}
          </div>
        </div>

        {/* Total Sessions */}
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/40 dark:border-gray-700/40 rounded-2xl p-4 shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50/20 via-orange-50/20 to-yellow-50/20 dark:from-amber-900/10 dark:via-orange-900/10 dark:to-yellow-900/10 opacity-50"></div>
          <div className="relative text-center">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-2">
              <IoBarChart className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{analytics?.totalSessions || 0}</div>
            <div className="text-sm text-amber-700 dark:text-amber-300">{t('userStats.totalSessions')}</div>
          </div>
        </div>

        {/* Weekly Sessions */}
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/40 dark:border-gray-700/40 rounded-2xl p-4 shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/20 via-amber-50/20 to-orange-50/20 dark:from-yellow-900/10 dark:via-amber-900/10 dark:to-orange-900/10 opacity-50"></div>
          <div className="relative text-center">
            <div className="w-10 h-10 rounded-xl bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400 flex items-center justify-center mx-auto mb-2">
              <IoCalendar className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{analytics?.weeklySessions || 0}</div>
            <div className="text-sm text-amber-700 dark:text-amber-300">{t('userStats.weeklySessions')}</div>
          </div>
        </div>

        {/* Total Repetitions */}
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/40 dark:border-gray-700/40 rounded-2xl p-4 shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50/20 via-red-50/20 to-amber-50/20 dark:from-orange-900/10 dark:via-red-900/10 dark:to-amber-900/10 opacity-50"></div>
          <div className="relative text-center">
            <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400 flex items-center justify-center mx-auto mb-2">
              <FaBullseye className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {(stats?.total_repetitions || 0) > 999 ? `${Math.floor((stats?.total_repetitions || 0) / 1000)}k` : (stats?.total_repetitions || 0)}
            </div>
            <div className="text-sm text-amber-700 dark:text-amber-300">{t('userStats.repetitions')}</div>
          </div>
        </div>

      </div>

      {/* Practice Trends Chart */}
      <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/40 dark:border-gray-700/40 rounded-2xl p-6 shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/10 via-amber-50/10 to-yellow-50/10 dark:from-orange-900/5 dark:via-amber-900/5 dark:to-yellow-900/5 opacity-50"></div>
        
        <div className="relative">
          {/* Chart Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center">
                <FaChartLine className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-amber-900 dark:text-amber-200 font-traditional">Practice Trends</h3>
                <p className="text-sm text-amber-700 dark:text-amber-300">Your spiritual progress over time</p>
              </div>
            </div>
            
            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Time Frame Selector */}
              <div className="flex bg-amber-50 dark:bg-amber-900/20 rounded-xl p-1">
                <button
                  onClick={() => setTimeFrame('daily')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                    timeFrame === 'daily'
                      ? 'bg-white dark:bg-gray-700 text-amber-900 dark:text-amber-100 shadow-sm'
                      : 'text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-100'
                  }`}
                >
{t('userStats.daily')}
                </button>
                <button
                  onClick={() => setTimeFrame('weekly')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                    timeFrame === 'weekly'
                      ? 'bg-white dark:bg-gray-700 text-amber-900 dark:text-amber-100 shadow-sm'
                      : 'text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-100'
                  }`}
                >
{t('userStats.weekly')}
                </button>
              </div>

              {/* Metric Selector */}
              <div className="flex bg-orange-50 dark:bg-orange-900/20 rounded-xl p-1">
                <button
                  onClick={() => setSelectedMetric('sessions')}
                  className={`px-2 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    selectedMetric === 'sessions'
                      ? 'bg-white dark:bg-gray-700 text-orange-900 dark:text-orange-100 shadow-sm'
                      : 'text-orange-700 dark:text-orange-300 hover:text-orange-900 dark:hover:text-orange-100'
                  }`}
                >
{t('userStats.sessions')}
                </button>
                <button
                  onClick={() => setSelectedMetric('repetitions')}
                  className={`px-2 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    selectedMetric === 'repetitions'
                      ? 'bg-white dark:bg-gray-700 text-orange-900 dark:text-orange-100 shadow-sm'
                      : 'text-orange-700 dark:text-orange-300 hover:text-orange-900 dark:hover:text-orange-100'
                  }`}
                >
{t('userStats.repetitions')}
                </button>
                <button
                  onClick={() => setSelectedMetric('duration')}
                  className={`px-2 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    selectedMetric === 'duration'
                      ? 'bg-white dark:bg-gray-700 text-orange-900 dark:text-orange-100 shadow-sm'
                      : 'text-orange-700 dark:text-orange-300 hover:text-orange-900 dark:hover:text-orange-100'
                  }`}
                >
                  <IoTime className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Chart */}
          <PracticeChart
            data={chartData}
            type="area"
            metric={selectedMetric}
            timeframe={timeFrame}
            height={250}
          />
        </div>
      </div>

      {/* Mood Analytics Section */}
      {stats && (
        <MoodAnalytics userStats={stats} className="mb-6" />
      )}

      {/* Bottom Section: Favorite Mantras */}
      {analytics?.topMantras && analytics.topMantras.length > 0 && (
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/40 dark:border-gray-700/40 rounded-2xl p-6 shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50/10 via-orange-50/10 to-yellow-50/10 dark:from-amber-900/5 dark:via-orange-900/5 dark:to-yellow-900/5 opacity-50"></div>
          
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <IoTrophy className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              <div>
                <h3 className="text-lg font-bold text-amber-900 dark:text-amber-200 font-traditional">{t('userStats.favoriteMantras')}</h3>
                <p className="text-sm text-amber-700 dark:text-amber-300">{t('userStats.mostPracticedMantras')}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {analytics.topMantras.slice(0, 6).map((item, index) => (
                <button
                  key={item.mantraId}
                  onClick={() => onMantraSelect?.(item.mantraId)}
                  className="flex items-center gap-3 p-3 bg-white/50 dark:bg-gray-800/50 hover:bg-white/80 dark:hover:bg-gray-700/80 rounded-xl border border-white/40 dark:border-gray-600/40 transition-all duration-200 hover:scale-[1.02] group text-left"
                  title="Click to practice this mantra again"
                >
                  <div className={`w-8 h-8 rounded-lg grid place-items-center text-sm font-bold flex-shrink-0 ${
                    index === 0 ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-white' :
                    index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white' :
                    index === 2 ? 'bg-gradient-to-br from-orange-300 to-amber-400 text-white' :
                    'bg-gradient-to-br from-amber-200 to-orange-300 text-gray-700'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-gray-900 dark:text-gray-100 text-sm truncate">
                      {item.mantra?.transliteration || 'Unknown Mantra'}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{t('userStats.sessionsCount', { count: item.count })}</div>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">
                    <span className="text-amber-600 dark:text-amber-400 text-xs">▶</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}