import { IoPersonOutline, IoTime, IoCalendar } from 'react-icons/io5'
import { UserStats } from '../components/UserStats'
import { ProfileCustomization } from '../components/ProfileCustomization'
import { useState } from 'react'

interface UserProfilePageProps {
  user: any
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

export function UserProfilePage({ user, onMantraSelect }: UserProfilePageProps) {
  const [recentSessions, setRecentSessions] = useState<RecentSession[]>([])
  const [sessionsLoading, setSessionsLoading] = useState(true)


  const displayName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User'

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

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/40 dark:border-gray-700/40 rounded-2xl p-6 shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50/20 via-amber-50/20 to-yellow-50/20 dark:from-orange-900/10 dark:via-amber-900/10 dark:to-yellow-900/10 opacity-50"></div>
          <div className="relative">
            <div className="flex items-center gap-4">
              {user.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-16 h-16 rounded-full object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/50 dark:to-amber-900/50 grid place-items-center">
                  <IoPersonOutline className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-900 via-orange-800 to-yellow-800 dark:from-amber-300 dark:via-orange-300 dark:to-yellow-300 bg-clip-text text-transparent font-traditional">{displayName}</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Profile Customization */}
        <div className="xl:col-span-1">
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/40 dark:border-gray-700/40 rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50/20 via-orange-50/20 to-yellow-50/20 dark:from-amber-900/10 dark:via-orange-900/10 dark:to-yellow-900/10 opacity-50"></div>
            <div className="relative">
              <ProfileCustomization />
            </div>
          </div>
        </div>

        {/* Right Columns - Stats and Sessions */}
        <div className="xl:col-span-2 space-y-6">
          {/* User Stats */}
          <UserStats userId={user.id} onMantraSelect={onMantraSelect} onRecentSessionsLoaded={handleRecentSessionsLoaded} />
          
          {/* Recent Sessions */}
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/40 dark:border-gray-700/40 rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50/20 via-amber-50/20 to-yellow-50/20 dark:from-orange-900/10 dark:via-amber-900/10 dark:to-yellow-900/10 opacity-50"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center">
                    <IoCalendar className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold bg-gradient-to-r from-amber-900 via-orange-800 to-yellow-800 dark:from-amber-300 dark:via-orange-300 dark:to-yellow-300 bg-clip-text text-transparent font-traditional">Recent Sessions</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Your mantra practice history</p>
                  </div>
                </div>
              </div>

              {sessionsLoading ? (
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm border border-white/40 dark:border-gray-700/40 rounded-xl p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="h-4 bg-gradient-to-r from-amber-200 to-orange-200 dark:from-amber-700 dark:to-orange-700 rounded w-40 mb-1" />
                            <div className="h-3 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-800 dark:to-orange-800 rounded w-28 mb-2" />
                            <div className="flex gap-3">
                              <div className="h-2 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-800 dark:to-orange-800 rounded w-16" />
                              <div className="h-2 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-800 dark:to-orange-800 rounded w-12" />
                            </div>
                          </div>
                          <div className="h-3 bg-gradient-to-r from-amber-200 to-orange-200 dark:from-amber-700 dark:to-orange-700 rounded w-12" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentSessions.length === 0 ? (
                <div className="text-center py-8 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-50/20 via-amber-50/20 to-yellow-50/20 dark:from-orange-900/10 dark:via-amber-900/10 dark:to-yellow-900/10 opacity-50"></div>
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/50 dark:to-amber-900/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <IoTime className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <h4 className="text-lg font-semibold bg-gradient-to-r from-amber-900 via-orange-800 to-yellow-800 dark:from-amber-300 dark:via-orange-300 dark:to-yellow-300 bg-clip-text text-transparent font-traditional mb-2">No Sessions Yet</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Start your first mantra practice session to see your practice history here!</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {recentSessions.map((session) => (
                    <div key={session.id} className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/40 dark:border-gray-700/40 rounded-lg p-2 shadow-sm relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/10 via-amber-50/10 to-yellow-50/10 dark:from-orange-900/5 dark:via-amber-900/5 dark:to-yellow-900/5 opacity-50"></div>
                      
                      <div className="relative">
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-900 dark:text-gray-100 mb-1 text-sm truncate">
                              {session.mantras?.transliteration || 'Unknown Mantra'}
                            </div>
                            <div className="text-xs font-sanskrit text-amber-700 dark:text-amber-300 truncate">
                              {session.mantras?.devanagari}
                            </div>
                          </div>
                          <div className="text-right ml-2 flex-shrink-0">
                            <div className="text-xs text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-gray-700/50 px-1.5 py-0.5 rounded-full border border-white/40 dark:border-gray-600/40">
                              {formatDate(session.created_at)}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {formatDuration(session.duration_seconds)} • {session.repetitions} repetition{session.repetitions !== 1 ? 's' : ''}
                            </div>
                          </div>
                        </div>
                        {session.notes && (
                          <div className="mt-1 p-1.5 bg-gradient-to-r from-amber-50/80 to-orange-50/80 dark:from-amber-900/20 dark:to-orange-900/20 rounded border-l-2 border-amber-300 dark:border-amber-600">
                            <p className="text-xs text-amber-800 dark:text-amber-200 italic truncate">"{session.notes}"</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {recentSessions.length >= 10 && (
                    <div className="text-center pt-3">
                      <div className="inline-flex items-center gap-1 px-3 py-1 bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm border border-white/40 dark:border-gray-700/40 rounded-full">
                        <div className="w-1.5 h-1.5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"></div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Showing last 10 sessions
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}