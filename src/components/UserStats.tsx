import { useState, useEffect } from 'react'
import { Calendar, TrendingUp, Clock, Award, BarChart3, Activity, Sparkles, Flame } from 'lucide-react'
import { EdgeFunctionService } from '../services/edgeFunctions'
import { SupabaseService } from '../services/supabase'
import { UserStats as UserStatsType } from '../types'

interface UserStatsProps {
  userId: string
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


export function UserStats({ userId }: UserStatsProps) {
  const [stats, setStats] = useState<UserStatsType | null>(null)
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [userId])

  const loadStats = async () => {
    try {
      // Load basic stats
      try {
        const { data } = await EdgeFunctionService.getUserStats(userId)
        setStats(data)
      } catch (error) {
        console.error('Error loading stats:', error)
      }

      // Load analytics
      try {
        const analyticsData = await SupabaseService.getUserAnalytics(userId)
        // Type cast to match our interface
        setAnalytics({
          totalSessions: analyticsData.totalSessions,
          weeklySessions: analyticsData.weeklySessions,
          topMantras: analyticsData.topMantras.map((item: any) => ({
            mantraId: item.mantraId,
            count: item.count,
            mantra: item.mantra ? {
              transliteration: item.mantra.transliteration,
              devanagari: item.mantra.devanagari
            } : undefined
          }))
        })
      } catch (error) {
        console.error('Error loading analytics:', error)
      }

    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }


  const getStreakColor = (streak: number) => {
    if (streak >= 30) return 'text-purple-600 bg-purple-100'
    if (streak >= 14) return 'text-green-600 bg-green-100'
    if (streak >= 7) return 'text-blue-600 bg-blue-100'
    return 'text-primary-600 bg-primary-100'
  }

  const getStreakEmoji = (streak: number) => {
    if (streak >= 30) return '🏆'
    if (streak >= 14) return '🔥'
    if (streak >= 7) return '⭐'
    if (streak >= 3) return '🌟'
    return '💫'
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="card">
          <div className="animate-pulse">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-12 w-12 bg-gradient-to-br from-violet-200 to-purple-200 rounded-2xl" />
              <div>
                <div className="h-6 bg-gray-200 rounded w-48 mb-2" />
                <div className="h-4 bg-gray-100 rounded w-64" />
              </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl" />
              <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl" />
              <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl" />
              <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl" />
            </div>
            <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl mt-8" />
          </div>
        </div>
      </div>
    )
  }

  if (!stats && !analytics) {
    return (
      <div className="card text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 via-purple-50/50 to-blue-50/50 opacity-50"></div>
        <div className="relative py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Activity className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-violet-800 to-purple-800 bg-clip-text text-transparent mb-3">Start Your Journey</h3>
          <p className="text-lg text-gray-600 leading-relaxed">Complete your first meditation session to see your progress here!</p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Sparkles className="w-5 h-5 text-violet-500" />
            <span className="text-sm text-gray-500 font-medium">Your mindful adventure awaits</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Compact Main Stats Overview */}
      <div className="card relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50/30 via-purple-50/30 to-blue-50/30 opacity-50"></div>
        
        <div className="relative">
          {/* Compact header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 via-violet-800 to-purple-800 bg-clip-text text-transparent">Practice Stats</h3>
                <p className="text-sm text-gray-600">Your meditation journey</p>
              </div>
            </div>
            <div className="text-3xl">{stats ? getStreakEmoji(stats.current_streak) : '🧘‍♂️'}</div>
          </div>

          {/* Compact Key Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Current Streak */}
            <div className="stats-metric group">
              <div className="flex flex-col items-center text-center">
                <div className={`w-12 h-12 rounded-2xl grid place-items-center mb-3 ${
                  stats ? getStreakColor(stats.current_streak) : 'bg-violet-100 text-violet-600'
                } group-hover:scale-110 transition-transform duration-300`}>
                  <Flame className="w-6 h-6" />
                </div>
                <div className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-1">
                  {stats?.current_streak || 0}
                </div>
                <div className="text-xs text-gray-600 font-medium">Day Streak</div>
                {(stats?.current_streak || 0) >= 7 && (
                  <div className="flex items-center gap-1 mt-1">
                    <Sparkles className="w-3 h-3 text-violet-500" />
                    <span className="text-xs text-violet-600 font-medium">On Fire!</span>
                  </div>
                )}
              </div>
            </div>

            {/* Total Repetitions */}
            <div className="stats-metric group">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 grid place-items-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-1">
                  {stats?.total_repetitions?.toLocaleString() || 0}
                </div>
                <div className="text-xs text-gray-600 font-medium">Repetitions</div>
              </div>
            </div>

            {/* Total Sessions */}
            <div className="stats-metric group">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 grid place-items-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-1">
                  {analytics?.totalSessions || 0}
                </div>
                <div className="text-xs text-gray-600 font-medium">Sessions</div>
              </div>
            </div>

            {/* Weekly Sessions */}
            <div className="stats-metric group">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 grid place-items-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="w-6 h-6" />
                </div>
                <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
                  {analytics?.weeklySessions || 0}
                </div>
                <div className="text-xs text-gray-600 font-medium">This Week</div>
              </div>
            </div>
          </div>

          {/* Compact Last Practice Info */}
          {(stats?.last_practice_date || (stats?.current_streak && stats.current_streak >= 7)) && (
            <div className="pt-4 mt-4 border-t border-gray-200/60">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-2 text-violet-500" />
                  <span className="font-medium">
                    {stats?.last_practice_date
                      ? `Last: ${new Date(stats.last_practice_date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}`
                      : 'Start your first practice!'}
                  </span>
                </div>
                {stats?.current_streak && stats.current_streak >= 7 && (
                  <div className="flex items-center gap-1 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 px-2 py-1 rounded-xl text-xs font-semibold border border-green-200/60">
                    <Award className="w-3 h-3" />
                    Great streak!
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Favorite Mantras */}
      {analytics?.topMantras && analytics.topMantras.length > 0 && (
        <div className="card relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50/30 via-orange-50/30 to-yellow-50/30 opacity-50"></div>
          
          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900">Your Favorite Mantras</h4>
                <p className="text-sm text-gray-600">Most practiced sacred sounds</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {analytics.topMantras.slice(0, 3).map((item, index) => (
                <div key={item.mantraId} className="flex items-center justify-between p-5 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/40 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 group">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl grid place-items-center text-lg font-bold ${
                      index === 0 ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-white shadow-lg' :
                      index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white shadow-md' :
                      'bg-gradient-to-br from-orange-400 to-amber-600 text-white shadow-md'
                    } group-hover:scale-110 transition-transform duration-300`}>
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-lg">
                        {item.mantra?.transliteration || 'Unknown Mantra'}
                      </div>
                      <div className="text-base text-gray-600 font-sanskrit">
                        {item.mantra?.devanagari}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                      {item.count}
                    </div>
                    <div className="text-sm text-gray-500 font-medium">
                      session{item.count !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
