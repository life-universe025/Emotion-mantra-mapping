import { IoArrowBack, IoPersonOutline, IoLogOutOutline, IoSunny, IoMoon, IoLanguage } from 'react-icons/io5'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Emotion } from '../types'
import { SupabaseService } from '../services/supabase'
import { useTheme } from '../contexts/ThemeContext'
import { useTranslation } from 'react-i18next'

interface HeaderProps {
  currentState: string
  onBack: () => void
  selectedEmotion: Emotion | null
  onProfileClick: () => void
  onLogout?: () => void
}

export function Header({ currentState, onBack, selectedEmotion, onProfileClick, onLogout }: HeaderProps) {
  const showBackButton = currentState !== 'emotion-selector' && currentState !== 'profile' && currentState !== 'mantra-practice'
  const [displayName, setDisplayName] = useState<string | null>(null)
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const { i18n, t } = useTranslation()

  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await SupabaseService.getCurrentUser()
      if (user) {
        const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User'
        setDisplayName(name)
      } else {
        setDisplayName(null)
      }
    }
    loadUser()
  }, [])

  const handleLogout = async () => {
    await SupabaseService.signOut()
    if (onLogout) {
      onLogout()
    } else {
      window.location.reload()
    }
  }

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'hi' : 'en'
    i18n.changeLanguage(newLang)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 dark:from-gray-900/40 via-transparent to-transparent backdrop-blur-3xl"></div>
      
      <div className="relative w-full px-3 sm:px-4 py-2 sm:py-2.5">
        <div className="max-w-full mx-auto">
          {/* Main navigation container with modern glass morphism */}
          <div className="relative">
            {/* Subtle gradient border */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-amber-500/20 to-yellow-500/20 rounded-3xl blur-sm"></div>
            
            {/* Main glass container */}
            <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl supports-[backdrop-filter]:backdrop-blur-xl border border-white/40 dark:border-gray-700/40 rounded-2xl sm:rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)] transition-all duration-500">
              <div className="px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5">
                <div className="flex items-center justify-between gap-2 sm:gap-3 lg:gap-4">
                
                  {/* Left section - Back button and Logo */}
                  <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 min-w-0 flex-1">
                    {showBackButton && (
                      <button
                        onClick={onBack}
                        className="group relative p-2 rounded-xl bg-gray-50/80 dark:bg-gray-700/80 hover:bg-white dark:hover:bg-gray-600 border border-gray-200/60 dark:border-gray-600/60 hover:border-gray-300/80 dark:hover:border-gray-500/80 transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                        aria-label={t('common.goBack')}
                      >
                        <IoArrowBack className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-100 transition-colors" />
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/10 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </button>
                    )}

                    <div
                      className="group flex items-center gap-2 sm:gap-3 lg:gap-4 min-w-0 cursor-pointer select-none flex-1"
                      onClick={() => navigate('/')}
                      title={t('common.goToHome')}
                      aria-label={t('common.goToHome')}
                    >
                      {/* Modern logo with gradient and glow effect */}
                      <div className="relative flex-shrink-0">
                        <div className="h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-orange-500 via-amber-600 to-yellow-600 text-white grid place-items-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 border border-amber-400/30">
                          <span className="text-base sm:text-lg lg:text-xl font-sanskrit">ॐ</span>
                          <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-orange-400/40 to-yellow-400/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        {/* Subtle glow effect */}
                        <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-orange-500/30 to-amber-500/30 blur-lg opacity-0 group-hover:opacity-60 transition-all duration-500 -z-10"></div>
                      </div>
                      
                      <div className="leading-tight truncate min-w-0">
                        <h1 className="text-xs sm:text-sm lg:text-base font-bold bg-gradient-to-r from-amber-900 via-orange-800 to-yellow-800 dark:from-amber-300 dark:via-orange-300 dark:to-yellow-300 bg-clip-text text-transparent truncate group-hover:from-amber-800 group-hover:via-orange-700 group-hover:to-yellow-700 dark:group-hover:from-amber-400 dark:group-hover:via-orange-400 dark:group-hover:to-yellow-400 transition-all duration-300 font-traditional leading-tight">
                          {t('app.title')}
                        </h1>
                        <p className="text-[10px] sm:text-xs text-amber-700 dark:text-amber-300 group-hover:text-amber-800 dark:group-hover:text-amber-200 transition-colors duration-300 flex items-center gap-1 truncate">
                          <span className="text-amber-500 flex-shrink-0">🪷</span>
                          <span className="truncate">{t('common.eternalWisdom')}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right section - Status and actions */}
                  <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 flex-shrink-0">
                    {/* Selected emotion indicator */}
                    {selectedEmotion && (
                      <div className="hidden md:flex items-center gap-2 lg:gap-3 px-2 sm:px-3 py-1.5 lg:py-2 rounded-lg lg:rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/30 border border-amber-200/60 dark:border-amber-700/60 shadow-sm">
                        <span className="text-lg lg:text-xl leading-none">{selectedEmotion.icon}</span>
                        <span className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-amber-200 tracking-wide truncate max-w-[80px] lg:max-w-none">{t(`emotions.${selectedEmotion.id}.name`)}</span>
                      </div>
                    )}

                    {/* Language toggle button */}
                    <button
                      onClick={toggleLanguage}
                      className="inline-flex items-center gap-2 px-2.5 py-1.5 h-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 border border-gray-200/50 dark:border-gray-700/50 text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-all duration-200 rounded-md"
                      aria-label={`Switch to ${i18n.language === 'en' ? 'Hindi' : 'English'}`}
                      title={`Switch to ${i18n.language === 'en' ? 'Hindi' : 'English'}`}
                    >
                      <IoLanguage className="w-4 h-4" />
                      <span className="text-sm font-medium hidden sm:inline">
                        {i18n.language === 'en' ? 'हिंदी' : 'English'}
                      </span>
                    </button>

                    {/* Theme toggle button */}
                    <button
                      onClick={toggleTheme}
                      className="inline-flex items-center justify-center gap-2 px-2.5 py-1.5 h-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 border border-gray-200/50 dark:border-gray-700/50 text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-all duration-200 rounded-md"
                      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                    >
                      {theme === 'light' ? (
                        <IoMoon className="w-4 h-4" />
                      ) : (
                        <IoSunny className="w-4 h-4" />
                      )}
                    </button>

                    {/* User profile button */}
                    {displayName && (
                      <button
                        onClick={onProfileClick}
                        className="inline-flex items-center gap-2 px-2.5 py-1.5 h-8 rounded-md bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 border border-gray-200/50 dark:border-gray-700/50 hover:border-gray-300/60 dark:hover:border-gray-600/60 hover:shadow-md transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:focus-visible:ring-amber-400 group"
                        aria-label={t('common.openProfile')}
                        title={t('common.openProfile')}
                      >
                        <IoPersonOutline className="w-4 h-4 text-gray-600 dark:text-gray-300 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors" />
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-gray-100 hidden sm:inline truncate max-w-[100px] md:max-w-none">{displayName}</span>
                      </button>
                    )}


                    {/* Logout button */}
                    {displayName && (
                      <button
                        onClick={handleLogout}
                        className="inline-flex items-center gap-2 px-2.5 py-1.5 h-8 rounded-md bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 border border-gray-200/50 dark:border-gray-700/50 hover:border-gray-300/60 dark:hover:border-gray-600/60 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:shadow-md transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 group"
                        aria-label={t('common.signOut')}
                        title={t('common.signOut')}
                      >
                        <IoLogOutOutline className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200" />
                        <span className="text-sm font-medium hidden sm:inline">{t('common.signOut')}</span>
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
