import { useState, useEffect } from 'react'
import { Calendar, TrendingUp, Award, BarChart3, Activity, Sparkles, Flame } from 'lucide-react'
import { EdgeFunctionService } from '../services/edgeFunctions'
import { SupabaseService } from '../services/supabase'
import { UserStats as UserStatsType } from '../types'

interface UserStatsProps {
  userId: string
  onMantraSelect?: (mantraId: number) => void
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


export function UserStats({ userId, onMantraSelect }: UserStatsProps) {
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Compact Stats Card */}
      <div className="lg:col-span-2 bg-white/60 backdrop-blur-sm border border-white/40 rounded-2xl p-4 shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50/20 via-purple-50/20 to-blue-50/20 opacity-50"></div>
        
        <div className="relative">
          {/* Header */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-3 h-3 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Practice Stats</h3>
              <p className="text-xs text-gray-600">Your meditation journey</p>
            </div>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Current Streak */}
            <div className="text-center">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center mb-1.5">
                  <Flame className="w-4 h-4" />
                </div>
                <div className="text-lg font-bold text-violet-600">{stats?.current_streak || 0}</div>
                <div className="text-xs text-gray-600">Day Streak</div>
                {(stats?.current_streak || 0) >= 7 && (
                  <div className="text-xs text-violet-600 font-medium mt-0.5">🔥</div>
                )}
              </div>
            </div>

            {/* Total Sessions */}
            <div className="text-center">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-1.5">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div className="text-lg font-bold text-blue-600">{analytics?.totalSessions || 0}</div>
                <div className="text-xs text-gray-600">Sessions</div>
              </div>
            </div>

            {/* Weekly Sessions */}
            <div className="text-center">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-1.5">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="text-lg font-bold text-purple-600">{analytics?.weeklySessions || 0}</div>
                <div className="text-xs text-gray-600">This Week</div>
              </div>
            </div>

            {/* Total Repetitions */}
            <div className="text-center">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mb-1.5">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div className="text-lg font-bold text-emerald-600">{(stats?.total_repetitions || 0) > 999 ? `${Math.floor((stats?.total_repetitions || 0) / 1000)}k` : (stats?.total_repetitions || 0)}</div>
                <div className="text-xs text-gray-600">Repetitions</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Side Mantras Section - Shows Top Mantras or Get Started */}
      <div className="lg:col-span-1 bg-white/60 backdrop-blur-sm border border-white/40 rounded-2xl p-4 shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/20 via-orange-50/20 to-yellow-50/20 opacity-50"></div>
        
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-5 h-5 text-amber-600" />
            <h4 className="text-sm font-bold text-gray-900">
              {analytics?.topMantras && analytics.topMantras.length > 0 ? 'Top Mantras' : 'Your Journey'}
            </h4>
          </div>
          
          {analytics?.topMantras && analytics.topMantras.length > 0 ? (
            /* Existing Top Mantras for users with data */
            <div className="space-y-2">
              {analytics.topMantras.slice(0, 2).map((item, index) => (
                <button
                  key={item.mantraId}
                  onClick={() => onMantraSelect?.(item.mantraId)}
                  className="flex items-center justify-between p-2 bg-white/50 hover:bg-white/80 rounded-lg border border-white/40 transition-all duration-200 hover:scale-[1.02] group text-left w-full"
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
                      <div className="font-medium text-gray-900 text-xs truncate">
                        {item.mantra?.transliteration || 'Unknown Mantra'}
                      </div>
                      <div className="text-xs text-gray-500">{item.count} sessions</div>
                    </div>
                  </div>
                  <div className="w-5 h-5 rounded-full bg-violet-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">
                    <span className="text-violet-600 text-xs">▶</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            /* New User Get Started Message */
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-100 to-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6 text-violet-600" />
              </div>
              <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                Start your first meditation session to see your favorite mantras here
              </p>
              <div className="flex items-center justify-center gap-1 text-xs text-violet-600 font-medium">
                <span>🧘‍♀️</span>
                <span>Begin your journey</span>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
