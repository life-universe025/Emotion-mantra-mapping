import { ArrowLeft, Heart, User, LogOut, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Emotion } from '../types'
import { SupabaseService } from '../services/supabase'

interface HeaderProps {
  currentState: string
  onBack: () => void
  selectedEmotion: Emotion | null
  onProfileClick: () => void
}

export function Header({ currentState, onBack, selectedEmotion, onProfileClick }: HeaderProps) {
  const showBackButton = currentState !== 'emotion-selector' && currentState !== 'profile' && currentState !== 'mantra-practice'
  const [displayName, setDisplayName] = useState<string | null>(null)
  const navigate = useNavigate()

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
    window.location.reload()
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-transparent backdrop-blur-3xl"></div>
      
      <div className="relative w-full px-3 sm:px-4 py-3 sm:py-4">
        <div className="max-w-full mx-auto">
          {/* Main navigation container with modern glass morphism */}
          <div className="relative">
            {/* Subtle gradient border */}
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 via-blue-500/20 to-cyan-500/20 rounded-3xl blur-sm"></div>
            
            {/* Main glass container */}
            <div className="relative bg-white/90 backdrop-blur-xl supports-[backdrop-filter]:backdrop-blur-xl border border-white/40 rounded-2xl sm:rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all duration-500">
              <div className="px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3 lg:py-4">
                <div className="flex items-center justify-between gap-2 sm:gap-3 lg:gap-4">
                
                  {/* Left section - Back button and Logo */}
                  <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 min-w-0 flex-1">
                    {showBackButton && (
                      <button
                        onClick={onBack}
                        className="group relative p-2.5 rounded-2xl bg-gray-50/80 hover:bg-white border border-gray-200/60 hover:border-gray-300/80 transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                        aria-label="Go back"
                      >
                        <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-gray-800 transition-colors" />
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </button>
                    )}

                    <div
                      className="group flex items-center gap-2 sm:gap-3 lg:gap-4 min-w-0 cursor-pointer select-none flex-1"
                      onClick={() => navigate('/')}
                      title="Go to Home"
                      aria-label="Go to Home"
                    >
                      {/* Modern logo with gradient and glow effect */}
                      <div className="relative flex-shrink-0">
                        <div className="h-9 w-9 sm:h-10 sm:w-10 lg:h-11 lg:w-11 rounded-xl sm:rounded-2xl bg-gradient-to-br from-violet-500 via-purple-600 to-blue-600 text-white grid place-items-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                          <Heart className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                          <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-violet-400/40 to-blue-400/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        {/* Subtle glow effect */}
                        <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-violet-500/30 to-blue-500/30 blur-lg opacity-0 group-hover:opacity-60 transition-all duration-500 -z-10"></div>
                      </div>
                      
                      <div className="leading-tight truncate min-w-0">
                        <h1 className="text-sm sm:text-base lg:text-lg font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent truncate group-hover:from-violet-900 group-hover:via-purple-800 group-hover:to-blue-900 transition-all duration-300">
                          Mantra Practice
                        </h1>
                        <p className="text-xs sm:text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300 flex items-center gap-1 truncate">
                          <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-violet-500 flex-shrink-0" />
                          <span className="truncate">Find calm. Build streaks.</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right section - Status and actions */}
                  <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 flex-shrink-0">
                    {/* Selected emotion indicator */}
                    {selectedEmotion && (
                      <div className="hidden md:flex items-center gap-2 lg:gap-3 px-2 sm:px-3 lg:px-4 py-2 lg:py-2.5 rounded-xl lg:rounded-2xl bg-gradient-to-r from-violet-50 to-blue-50 border border-violet-200/60 shadow-sm">
                        <span className="text-lg lg:text-xl leading-none">{selectedEmotion.icon}</span>
                        <span className="text-xs sm:text-sm font-semibold text-gray-800 tracking-wide truncate max-w-[80px] lg:max-w-none">{selectedEmotion.name}</span>
                      </div>
                    )}

                    {/* User profile button */}
                    {displayName && (
                      <button
                        onClick={onProfileClick}
                        className="inline-flex items-center gap-1.5 sm:gap-2.5 px-2 sm:px-3 lg:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-gray-50/80 hover:bg-white border border-gray-200/60 hover:border-gray-300/80 hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 group"
                        aria-label="Open profile"
                        title="Open profile"
                      >
                        <User className="w-4 h-4 text-gray-600 group-hover:text-violet-600 transition-colors" />
                        <span className="text-sm font-medium text-gray-800 group-hover:text-gray-900 hidden sm:inline truncate max-w-[100px] md:max-w-none">{displayName}</span>
                      </button>
                    )}


                    {/* Logout button */}
                    {displayName && (
                      <button
                        onClick={handleLogout}
                        className="inline-flex items-center gap-1.5 sm:gap-2.5 px-2 sm:px-3 lg:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-red-50/80 hover:bg-red-100 border border-red-200/60 hover:border-red-300/80 text-red-600 hover:text-red-700 hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 group"
                        aria-label="Sign out"
                        title="Sign out"
                      >
                        <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                        <span className="text-sm font-medium hidden sm:inline">Sign out</span>
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
