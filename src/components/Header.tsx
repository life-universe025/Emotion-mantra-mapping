import { IoPersonOutline, IoLogOutOutline, IoSunny, IoMoon } from 'react-icons/io5'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Emotion } from '../types'
import { SupabaseService } from '../services/supabase'
import { useTheme } from '../contexts/ThemeContext'
import { useTranslation } from 'react-i18next'
import { LanguageSelector } from './LanguageSelector'

interface HeaderProps {
  selectedEmotion: Emotion | null
  onProfileClick: () => void
  onLogout?: () => void
  user?: any // Add user prop to avoid redundant API calls
}

export function Header({ selectedEmotion, onProfileClick, onLogout, user }: HeaderProps) {
  const [displayName, setDisplayName] = useState<string | null>(null)
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const { t } = useTranslation()

  useEffect(() => {
    if (user) {
      const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User'
      setDisplayName(name)
    } else {
      setDisplayName(null)
    }
  }, [user])

  const handleLogout = async () => {
    await SupabaseService.signOut()
    if (onLogout) {
      onLogout()
    } else {
      window.location.reload()
    }
  }


  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 dark:from-gray-900/40 via-transparent to-transparent backdrop-blur-3xl"></div>
      
      <div className="relative w-full px-2 sm:px-4 py-2">
        <div className="max-w-full mx-auto">
          {/* Main navigation container with modern glass morphism */}
          <div className="relative">
            {/* Subtle gradient border */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-amber-500/20 to-yellow-500/20 rounded-2xl sm:rounded-3xl blur-sm"></div>
            
            {/* Main glass container */}
            <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl supports-[backdrop-filter]:backdrop-blur-xl border border-white/40 dark:border-gray-700/40 rounded-xl sm:rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-500">
              <div className="px-2 sm:px-4 py-2">
                <div className="flex items-center justify-between gap-1 sm:gap-2">
                
                  {/* Left section - Logo */}
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div
                      className="group flex items-center gap-2 min-w-0 cursor-pointer select-none"
                      onClick={() => navigate('/')}
                      title={t('common.goToHome')}
                      aria-label={t('common.goToHome')}
                    >
                      {/* Modern logo with gradient and glow effect */}
                      <div className="relative flex-shrink-0">
                        <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-gradient-to-br from-orange-500 via-amber-600 to-yellow-600 text-white grid place-items-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 border border-amber-400/30">
                          <span className="text-sm sm:text-base font-sanskrit">ॐ</span>
                        </div>
                      </div>
                      
                      <div className="leading-tight truncate min-w-0">
                        <h1 className="text-xs sm:text-sm font-bold bg-gradient-to-r from-amber-900 via-orange-800 to-yellow-800 dark:from-amber-300 dark:via-orange-300 dark:to-yellow-300 bg-clip-text text-transparent truncate font-traditional">
                          {t('app.title')}
                        </h1>
                        <p className="text-[9px] sm:text-xs text-amber-700 dark:text-amber-300 flex items-center gap-1 truncate">
                          <span className="text-amber-500 flex-shrink-0">🪷</span>
                          <span className="truncate">{t('common.eternalWisdom')}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right section - Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {/* Selected emotion indicator - Mobile friendly */}
                    {selectedEmotion && (
                      <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/30 border border-amber-200/60 dark:border-amber-700/60">
                        <span className="text-sm leading-none">{selectedEmotion.icon}</span>
                        <span className="text-xs font-semibold text-gray-800 dark:text-amber-200 truncate max-w-[60px]">{t(`emotions.${selectedEmotion.id}.name`)}</span>
                      </div>
                    )}

                    {/* Language selector - Compact */}
                    <LanguageSelector variant="dropdown" />

                    {/* Theme toggle button - Compact */}
                    <button
                      onClick={toggleTheme}
                      className="inline-flex items-center justify-center p-1.5 h-8 w-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 border border-gray-200/50 dark:border-gray-700/50 text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-all duration-200 rounded-md"
                      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                    >
                      {theme === 'light' ? (
                        <IoMoon className="w-4 h-4" />
                      ) : (
                        <IoSunny className="w-4 h-4" />
                      )}
                    </button>

                    {/* User profile button - Compact */}
                    {displayName && (
                      <button
                        onClick={onProfileClick}
                        className="inline-flex items-center gap-1 px-2 py-1.5 h-8 rounded-md bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 border border-gray-200/50 dark:border-gray-700/50 hover:border-gray-300/60 dark:hover:border-gray-600/60 hover:shadow-md transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:focus-visible:ring-amber-400 group"
                        aria-label={t('common.openProfile')}
                        title={t('common.openProfile')}
                      >
                        <IoPersonOutline className="w-4 h-4 text-gray-600 dark:text-gray-300 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors" />
                        <span className="text-xs font-medium text-gray-800 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-gray-100 hidden sm:inline truncate max-w-[80px]">{displayName}</span>
                      </button>
                    )}

                    {/* Logout button - Compact */}
                    {displayName && (
                      <button
                        onClick={handleLogout}
                        className="inline-flex items-center gap-1 px-2 py-1.5 h-8 rounded-md bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 border border-gray-200/50 dark:border-gray-700/50 hover:border-gray-300/60 dark:hover:border-gray-600/60 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:shadow-md transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 group"
                        aria-label={t('common.signOut')}
                        title={t('common.signOut')}
                      >
                        <IoLogOutOutline className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200" />
                        <span className="text-xs font-medium hidden sm:inline">{t('common.signOut')}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
