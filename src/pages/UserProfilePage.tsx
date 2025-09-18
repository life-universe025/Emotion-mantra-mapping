import { User, Clock, Calendar } from 'lucide-react'
import { UserStats } from '../components/UserStats'
import { SupabaseService } from '../services/supabase'
import { useState, useEffect } from 'react'

interface UserProfilePageProps {
  user: any
  onLogout: () => void
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

export function UserProfilePage({ user, onLogout }: UserProfilePageProps) {
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [recentSessions, setRecentSessions] = useState<RecentSession[]>([])
  const [sessionsLoading, setSessionsLoading] = useState(true)

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
    loadRecentSessions()
  }, [user.id])

  const loadRecentSessions = async () => {
    try {
      const { data: sessions } = await SupabaseService.getUserSessions(user.id, 10)
      setRecentSessions(sessions || [])
    } catch (error) {
      console.error('Error loading recent sessions:', error)
    } finally {
      setSessionsLoading(false)
    }
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
    <div className="max-w-5xl mx-auto">

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="card">
            <div className="flex items-center gap-4">
              {user.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-16 h-16 rounded-full object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-primary-100 grid place-items-center">
                  <User className="w-8 h-8 text-primary-600" />
                </div>
              )}
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{displayName}</h2>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>


            <button
              onClick={handleLogout}
              disabled={isSigningOut}
              className="mt-6 w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-medium"
            >
              {isSigningOut ? 'Signing out...' : 'Sign out'}
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <UserStats userId={user.id} />
          
          {/* Recent Sessions */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Recent Sessions</h3>
                <p className="text-sm text-gray-500">Your meditation practice history</p>
              </div>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>

            {sessionsLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-48 mb-2" />
                        <div className="h-3 bg-gray-200 rounded w-32" />
                      </div>
                      <div className="h-3 bg-gray-200 rounded w-16" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentSessions.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">No Sessions Yet</h4>
                <p className="text-gray-500">Start your first meditation session to see your practice history here!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentSessions.map((session) => (
                  <div key={session.id} className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 mb-1">
                          {session.mantras?.transliteration || 'Unknown Mantra'}
                        </div>
                        <div className="text-sm font-sanskrit text-gray-600 mb-2">
                          {session.mantras?.devanagari}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{session.repetitions} repetitions</span>
                          <span>•</span>
                          <span>{formatDuration(session.duration_seconds)}</span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-400 ml-4">
                        {formatDate(session.created_at)}
                      </div>
                    </div>
                    {session.notes && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-200">
                        <p className="text-sm text-blue-800 italic">"{session.notes}"</p>
                      </div>
                    )}
                  </div>
                ))}
                
                {recentSessions.length >= 10 && (
                  <div className="text-center pt-4">
                    <p className="text-sm text-gray-500">
                      Showing last 10 sessions
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


