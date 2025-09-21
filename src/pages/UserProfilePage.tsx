import { IoPersonOutline, IoTime, IoCalendar, IoRibbon, IoShareSocial } from 'react-icons/io5'
import { UserStats } from '../components/UserStats'
import { ProfileCustomization } from '../components/ProfileCustomization'
import { SupabaseService } from '../services/supabase'
import { EdgeFunctionService } from '../services/edgeFunctions'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface UserProfilePageProps {
  user: any
  onLogout: () => void
  onMantraSelect?: (mantraId: number) => void
}

interface RecentSession {
  id: number
  repetitions: number
  duration_seconds: number
  created_at: string
  notes?: string
  mantras: {
    transliteration: string
    devanagari: string
    meaning: string
  }
}

export function UserProfilePage({ user, onLogout, onMantraSelect }: UserProfilePageProps) {
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [recentSessions, setRecentSessions] = useState<RecentSession[]>([])
  const [sessionsLoading, setSessionsLoading] = useState(true)
  const [analyticsLoading, setAnalyticsLoading] = useState(true)
  const [profileAnalytics, setProfileAnalytics] = useState<any>(null)
  const [userGoals, setUserGoals] = useState({
    dailyGoal: 10, // minutes
    weeklyGoal: 70, // minutes
    streakGoal: 30, // days
    currentStreak: 0
  })
  const { t } = useTranslation()
  const [showGoalsModal, setShowGoalsModal] = useState(false)

  const handleLogout = async () => {
    setIsSigningOut(true)
    try {
      await SupabaseService.signOut()
      onLogout()
    } finally {
      setIsSigningOut(false)
    }
  }

  const displayName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User'

  useEffect(() => {
    loadData()
  }, [user.id])

  const loadData = async () => {
    try {
      // Load analytics from server (includes milestones, insights, challenges, etc.)
      // Note: Recent sessions data is now handled by UserStats component to avoid duplicate API calls
      const { data: analytics } = await EdgeFunctionService.getProfileAnalytics(user.id)
      setProfileAnalytics(analytics)
      setAnalyticsLoading(false)
    } catch (error) {
      console.error('Error loading profile data:', error)
      setAnalyticsLoading(false)
    }
  }

  const handleRecentSessionsLoaded = (sessions: any[]) => {
    // Transform sessions to match the expected interface
    const transformedSessions = sessions.map((session: any) => ({
      id: session.id,
      repetitions: session.repetitions,
      duration_seconds: session.duration_seconds,
      created_at: session.created_at,
      notes: session.notes,
      mantras: session.mantras
    }))
    setRecentSessions(transformedSessions)
    setSessionsLoading(false)
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    if (mins === 0) return `${secs}s`
    return `${mins}m ${secs}s`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Today'
    if (diffDays === 2) return 'Yesterday'
    if (diffDays <= 7) return `${diffDays - 1} days ago`
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    })
  }

  // Server-side data getters (no calculations needed)
  const getMeditationMilestones = () => profileAnalytics?.milestones || []
  const getGoalProgress = () => profileAnalytics?.goalProgress || { daily: { current: 0, goal: 10, percentage: 0 }, weekly: { current: 0, goal: 70, percentage: 0 } }
  const getMeditationInsights = () => profileAnalytics?.insights || []
  const getActiveChallenges = () => profileAnalytics?.challenges || []

  const shareAchievement = async (milestone: any) => {
    const shareText = `🏆 I just achieved "${milestone.title}" in my meditation practice! ${milestone.description} #MeditationJourney #Mindfulness`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Meditation Achievement',
          text: shareText,
          url: window.location.origin
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareText)
        alert('Achievement copied to clipboard!')
      } catch (error) {
        console.log('Error copying to clipboard:', error)
      }
    }
  }

  return (
    <div className="max-w-5xl mx-auto">

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="card">
            <div className="flex items-center gap-4">
              {user.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-16 h-16 rounded-full object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-800 grid place-items-center">
                  <IoPersonOutline className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                </div>
              )}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{displayName}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
              </div>
            </div>


            {/* Profile Customization */}
            <div className="mt-6">
              <ProfileCustomization />

              <button
                onClick={handleLogout}
                disabled={isSigningOut}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 font-medium transition-colors"
              >
                {isSigningOut ? 'Signing out...' : 'Sign out'}
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <UserStats userId={user.id} onMantraSelect={onMantraSelect} onRecentSessionsLoaded={handleRecentSessionsLoaded} />
          
          {/* Active Challenges */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Active Challenges</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Complete challenges to earn rewards</p>
              </div>
              <div className="text-2xl">🎯</div>
            </div>

            <div className="space-y-4">
              {analyticsLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-20 bg-gray-200 dark:bg-gray-600 rounded-xl"></div>
                    </div>
                  ))}
                </div>
              ) : (
                getActiveChallenges().map((challenge: any) => {
                  const progress = challenge.progress
                  const isCompleted = challenge.isCompleted
                
                return (
                  <div
                    key={challenge.id}
                    className={`p-4 rounded-xl border-2 ${
                      isCompleted 
                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-300 dark:border-green-600'
                        : 'bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{challenge.icon}</div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">{challenge.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{challenge.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                          {challenge.current}/{challenge.target}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {Math.round(progress)}% complete
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          isCompleted 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                            : `bg-gradient-to-r ${challenge.color}`
                        }`}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {isCompleted ? '✅ Completed! ' : ''}{challenge.reward}
                    </p>
                  </div>
                )
                })
              )}
            </div>
          </div>

          {/* Personal Goals */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Personal Goals</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Track your meditation progress</p>
              </div>
              <button
                onClick={() => setShowGoalsModal(true)}
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium"
              >
{t('userProfile.editGoals')}
              </button>
            </div>

            <div className="space-y-4">
              {/* Daily Goal */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Daily Goal</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {getGoalProgress().daily.current}/{userGoals.dailyGoal} min
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getGoalProgress().daily.percentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Weekly Goal */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Weekly Goal</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {getGoalProgress().weekly.current}/{userGoals.weeklyGoal} min
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-yellow-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getGoalProgress().weekly.percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Meditation Insights */}
          {!analyticsLoading && getMeditationInsights().length > 0 && (
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Insights & Encouragement</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Personalized insights about your practice</p>
                </div>
                <div className="text-2xl">💡</div>
              </div>

              <div className="space-y-3">
                {getMeditationInsights().map((insight: any, index: number) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border-l-4 ${
                      insight.type === 'positive' 
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-400' 
                        : insight.type === 'encouraging'
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-400'
                        : 'bg-amber-50 dark:bg-amber-900/20 border-amber-400'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="text-2xl">{insight.icon}</div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">{insight.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{insight.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Meditation Journey Timeline */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Meditation Journey</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Your spiritual milestones</p>
              </div>
              <IoRibbon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            </div>

            {analyticsLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-16 bg-gray-200 dark:bg-gray-600 rounded-xl"></div>
                  </div>
                ))}
              </div>
            ) : getMeditationMilestones().length > 0 ? (
              <div className="space-y-4">
                {getMeditationMilestones().map((milestone: any) => (
                  <div
                    key={milestone.id}
                    className={`flex items-center space-x-4 p-4 rounded-xl border-2 ${milestone.bgColor} border-current`}
                  >
                    <div className={`w-12 h-12 ${milestone.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}>
                      <span className="text-2xl">{milestone.icon}</span>
                    </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">{milestone.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{milestone.description}</p>
                        {milestone.date && (
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            Achieved on {new Date(milestone.date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => shareAchievement(milestone)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                          title="Share this achievement"
                        >
                          <IoShareSocial className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        </button>
                        <div className="text-2xl">🏆</div>
                      </div>
                    </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <IoRibbon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No milestones yet</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Start your meditation journey to unlock achievements!</p>
              </div>
            )}
          </div>
          
          {/* Recent Sessions */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Sessions</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Your meditation practice history</p>
              </div>
              <IoCalendar className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            </div>

            {sessionsLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-700 rounded-lg">
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-48 mb-2" />
                        <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-32" />
                      </div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-16" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentSessions.length === 0 ? (
              <div className="text-center py-12">
                <IoTime className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No Sessions Yet</h4>
                <p className="text-gray-500 dark:text-gray-400">Start your first meditation session to see your practice history here!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentSessions.map((session) => (
                  <div key={session.id} className="p-4 border border-gray-100 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                          {session.mantras?.transliteration || 'Unknown Mantra'}
                        </div>
                        <div className="text-sm font-sanskrit text-gray-600 dark:text-gray-400 mb-2">
                          {session.mantras?.devanagari}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <span>{session.repetitions} repetitions</span>
                          <span>•</span>
                          <span>{formatDuration(session.duration_seconds)}</span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-400 dark:text-gray-500 ml-4">
                        {formatDate(session.created_at)}
                      </div>
                    </div>
                    {session.notes && (
                      <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border-l-4 border-amber-200 dark:border-amber-700">
                        <p className="text-sm text-amber-800 dark:text-amber-300 italic">"{session.notes}"</p>
                      </div>
                    )}
                  </div>
                ))}
                
                {recentSessions.length >= 10 && (
                  <div className="text-center pt-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Showing last 10 sessions
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Goals Modal */}
      {showGoalsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Set Your Goals</h3>
                <button
                  onClick={() => setShowGoalsModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Daily Goal (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={userGoals.dailyGoal}
                  onChange={(e) => setUserGoals(prev => ({ ...prev, dailyGoal: parseInt(e.target.value) || 10 }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Weekly Goal (minutes)
                </label>
                <input
                  type="number"
                  min="7"
                  max="840"
                  value={userGoals.weeklyGoal}
                  onChange={(e) => setUserGoals(prev => ({ ...prev, weeklyGoal: parseInt(e.target.value) || 70 }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Streak Goal (days)
                </label>
                <input
                  type="number"
                  min="7"
                  max="365"
                  value={userGoals.streakGoal}
                  onChange={(e) => setUserGoals(prev => ({ ...prev, streakGoal: parseInt(e.target.value) || 30 }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowGoalsModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
{t('userProfile.cancel')}
                </button>
                <button
                  onClick={() => {
                    // In a real app, you'd save these to the database
                    setShowGoalsModal(false)
                    alert('Goals saved successfully!')
                  }}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
{t('userProfile.saveGoals')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


