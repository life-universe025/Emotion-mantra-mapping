import { useState, useEffect } from 'react'
import { User, LogOut, Calendar, Target, TrendingUp } from 'lucide-react'
import { SupabaseService } from '../services/supabase'
import { UserStats as UserStatsType } from '../types'

interface UserProfileProps {
  user: any
  onLogout: () => void
  onClose: () => void
}

export function UserProfile({ user, onLogout, onClose }: UserProfileProps) {
  const [stats, setStats] = useState<UserStatsType | null>(null)
  const [loading, setLoading] = useState(true)

  // Load user stats when component mounts
  useEffect(() => {
    loadUserStats()
  }, [user.id])

  const loadUserStats = async () => {
    try {
      const { data, error } = await SupabaseService.getUserStats(user.id)
      if (error) {
        console.error('Error loading stats:', error)
        return
      }
      setStats(data)
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await SupabaseService.signOut()
      onLogout()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const getUserDisplayName = () => {
    if (user.user_metadata?.full_name) {
      return user.user_metadata.full_name
    }
    if (user.user_metadata?.name) {
      return user.user_metadata.name
    }
    if (user.email) {
      return user.email.split('@')[0]
    }
    return 'User'
  }

  const getUserEmail = () => {
    return user.email || 'No email'
  }

  const getUserAvatar = () => {
    if (user.user_metadata?.avatar_url) {
      return user.user_metadata.avatar_url
    }
    if (user.user_metadata?.picture) {
      return user.user_metadata.picture
    }
    return null
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Profile</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* User Info */}
        <div className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            {getUserAvatar() ? (
              <img
                src={getUserAvatar()}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-primary-600" />
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {getUserDisplayName()}
              </h3>
              <p className="text-sm text-gray-600">{getUserEmail()}</p>
            </div>
          </div>

          {/* Stats */}
          {loading ? (
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-16 bg-gray-200 rounded"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            </div>
          ) : stats ? (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Practice Statistics</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary-100 rounded-full mx-auto mb-2">
                    <Target className="w-4 h-4 text-primary-600" />
                  </div>
                  <div className="text-lg font-bold text-gray-900">{stats.current_streak}</div>
                  <div className="text-xs text-gray-600">Day Streak</div>
                </div>

                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full mx-auto mb-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="text-lg font-bold text-gray-900">{stats.total_repetitions}</div>
                  <div className="text-xs text-gray-600">Total Repetitions</div>
                </div>
              </div>

              {stats.last_practice_date && (
                <div className="mt-3 flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  Last practice: {new Date(stats.last_practice_date).toLocaleDateString()}
                </div>
              )}
            </div>
          ) : (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-sm text-gray-500">No practice data yet</p>
              <p className="text-xs text-gray-400 mt-1">Start your first session to see stats!</p>
            </div>
          )}

          {/* Account Info */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Account Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">User ID:</span>
                <span className="text-gray-900 font-mono text-xs">{user.id.slice(0, 8)}...</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Provider:</span>
                <span className="text-gray-900 capitalize">
                  {user.app_metadata?.provider || 'Email'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Member since:</span>
                <span className="text-gray-900">
                  {new Date(user.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
