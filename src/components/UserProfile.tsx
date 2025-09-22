import { useState, useEffect, useRef } from 'react'
import { IoPersonOutline, IoLogOutOutline, IoCalendar, IoCamera, IoTrophy, IoStar, IoFlame, IoTime } from 'react-icons/io5'
import { FaBullseye, FaMedal, FaAward, FaCrown } from 'react-icons/fa'
import { SupabaseService } from '../services/supabase'
import { UserStats as UserStatsType } from '../types'
import { MoodAnalytics } from './MoodAnalytics'

interface UserProfileProps {
  user: any
  onLogout: () => void
  onClose: () => void
}

export function UserProfile({ user, onLogout, onClose }: UserProfileProps) {
  const [stats, setStats] = useState<UserStatsType | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'settings'>('overview')
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('File size must be less than 5MB')
      return
    }

    setUploadingAvatar(true)
    try {
      // In a real app, you'd upload to Supabase Storage here
      // For now, we'll just simulate the upload
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('Avatar upload feature coming soon!')
    } catch (error) {
      console.error('Error uploading avatar:', error)
      alert('Failed to upload avatar')
    } finally {
      setUploadingAvatar(false)
    }
  }

  const getAchievements = () => {
    if (!stats) return []
    
    const achievements = []
    
    // Streak achievements
    if (stats.current_streak >= 7) {
      achievements.push({
        id: 'week_streak',
        title: 'Week Warrior',
        description: '7-day mantra practice streak',
        icon: IoFlame,
        color: 'text-orange-500',
        bgColor: 'bg-orange-100 dark:bg-orange-900/30',
        earned: true
      })
    }
    
    if (stats.current_streak >= 30) {
      achievements.push({
        id: 'month_streak',
        title: 'Monthly Master',
        description: '30-day mantra practice streak',
        icon: FaCrown,
        color: 'text-purple-500',
        bgColor: 'bg-purple-100 dark:bg-purple-900/30',
        earned: true
      })
    }
    
    // Repetition achievements
    if (stats.total_repetitions >= 1000) {
      achievements.push({
        id: 'thousand_reps',
        title: 'Thousand Reps',
        description: '1,000 total repetitions',
        icon: FaMedal,
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
        earned: true
      })
    }
    
    if (stats.total_repetitions >= 10000) {
      achievements.push({
        id: 'ten_thousand_reps',
        title: 'Repetition Master',
        description: '10,000 total repetitions',
        icon: FaAward,
        color: 'text-red-500',
        bgColor: 'bg-red-100 dark:bg-red-900/30',
        earned: true
      })
    }
    
    // Breathing achievements - TODO: Add total_breathing_sessions to UserStats type
    // if (stats.total_breathing_sessions && stats.total_breathing_sessions >= 50) {
    //   achievements.push({
    //     id: 'breathing_master',
    //     title: 'Breathing Master',
    //     description: '50 breathing sessions',
    //     icon: IoTrophy,
    //     color: 'text-cyan-500',
    //     bgColor: 'bg-cyan-100 dark:bg-cyan-900/30',
    //     earned: true
    //   })
    // }
    
    return achievements
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Profile</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'overview'
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'achievements'
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Achievements
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'settings'
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Settings
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Enhanced User Info */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  {getUserAvatar() ? (
                    <img
                      src={getUserAvatar()}
                      alt="Profile"
                      className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-800 dark:to-primary-900 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-700 shadow-lg">
                      <IoPersonOutline className="w-10 h-10 text-primary-600 dark:text-primary-400" />
                    </div>
                  )}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingAvatar}
                    className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary-600 hover:bg-primary-700 text-white rounded-full flex items-center justify-center shadow-lg transition-colors disabled:opacity-50"
                  >
                    {uploadingAvatar ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <IoCamera className="w-4 h-4" />
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {getUserDisplayName()}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{getUserEmail()}</p>
                  <div className="flex items-center mt-1">
                    <IoStar className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Member since {new Date(user.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Enhanced Stats */}
              {loading ? (
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/4 mb-4"></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-20 bg-gray-200 dark:bg-gray-600 rounded-xl"></div>
                    <div className="h-20 bg-gray-200 dark:bg-gray-600 rounded-xl"></div>
                  </div>
                </div>
              ) : stats ? (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Practice Statistics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl border border-orange-200 dark:border-orange-700">
                      <div className="flex items-center justify-center w-10 h-10 bg-orange-100 dark:bg-orange-900/50 rounded-full mx-auto mb-2">
                        <IoFlame className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.current_streak}</div>
                      <div className="text-sm text-orange-700 dark:text-orange-300">Day Streak</div>
                    </div>

                    <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-xl border border-amber-200 dark:border-amber-700">
                      <div className="flex items-center justify-center w-10 h-10 bg-amber-100 dark:bg-amber-900/50 rounded-full mx-auto mb-2">
                        <FaBullseye className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.total_repetitions}</div>
                      <div className="text-sm text-amber-700 dark:text-amber-300">Total Repetitions</div>
                    </div>
                  </div>

                  {/* Mood Analytics */}
                  <MoodAnalytics userStats={stats} className="mt-6" />

                  {stats.last_practice_date && (
                    <div className="mt-4 flex items-center text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                      <IoCalendar className="w-4 h-4 mr-2" />
                      Last practice: {new Date(stats.last_practice_date).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl text-center border border-gray-200 dark:border-gray-600">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IoTime className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 font-medium">No practice data yet</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Start your first session to see stats!</p>
                </div>
              )}

              {/* Account Info */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Account Information</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <span className="text-gray-600 dark:text-gray-400">User ID:</span>
                    <span className="text-gray-900 dark:text-gray-100 font-mono text-xs">{user.id.slice(0, 8)}...</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <span className="text-gray-600 dark:text-gray-400">Provider:</span>
                    <span className="text-gray-900 dark:text-gray-100 capitalize">
                      {user.app_metadata?.provider || 'Email'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Your Achievements</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {getAchievements().length > 0 ? (
                    getAchievements().map((achievement) => {
                      const IconComponent = achievement.icon
                      return (
                        <div
                          key={achievement.id}
                          className={`p-4 rounded-xl border-2 ${achievement.bgColor} border-current`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-12 h-12 ${achievement.bgColor} rounded-full flex items-center justify-center`}>
                              <IconComponent className={`w-6 h-6 ${achievement.color}`} />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-gray-100">{achievement.title}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{achievement.description}</p>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="col-span-2 text-center py-8">
                      <IoTrophy className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">No achievements yet</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Keep practicing to earn your first badge!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Settings</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Notifications</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Manage your mantra practice reminders and updates</p>
                    <button className="mt-2 text-sm text-primary-600 dark:text-primary-400 hover:underline">
                      Configure notifications
                    </button>
                  </div>
                  
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Privacy</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Control your data and privacy settings</p>
                    <button className="mt-2 text-sm text-primary-600 dark:text-primary-400 hover:underline">
                      Privacy settings
                    </button>
                  </div>
                  
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Export Data</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Download your mantra practice data</p>
                    <button className="mt-2 text-sm text-primary-600 dark:text-primary-400 hover:underline">
                      Export my data
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
            >
              <IoLogOutOutline className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
