import { useState } from 'react'
import { IoMail, IoShield, IoArrowForward } from 'react-icons/io5'
import { SupabaseService } from '../services/supabase'
import { useTranslation } from 'react-i18next'

interface AuthProps {
  onAuthSuccess: () => void
}

export function Auth({ onAuthSuccess: _onAuthSuccess }: AuthProps) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const { t } = useTranslation()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      const { error } = await SupabaseService.signInWithEmail(email)
      
      if (error) {
        setMessage('Error sending magic link. Please try again.')
        console.error('Auth error:', error)
      } else {
        setMessage('Check your email for the magic link!')
      }
    } catch (error) {
      setMessage('Something went wrong. Please try again.')
      console.error('Auth error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setMessage('')

    try {
      const { error } = await SupabaseService.signInWithGoogle()
      
      if (error) {
        setMessage('Error signing in with Google. Please try again.')
        console.error('Google auth error:', error)
      }
      // Note: User will be redirected to Google OAuth, so we don't need to handle success here
    } catch (error) {
      setMessage('Something went wrong. Please try again.')
      console.error('Google auth error:', error)
    } finally {
      setIsLoading(false)
    }
  }


  // const handleLogout = async () => {
  //   try {
  //     await SupabaseService.signOut()
  //     // The app will automatically redirect to auth screen
  //     window.location.reload()
  //   } catch (error) {
  //     console.error('Logout error:', error)
  //   }
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50/40 to-yellow-50/60 dark:from-gray-900 dark:via-slate-900/90 dark:to-gray-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-400/15 to-amber-400/15 dark:from-orange-400/10 dark:to-amber-400/10 rounded-full blur-3xl floating"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-yellow-400/15 to-orange-400/15 dark:from-yellow-400/10 dark:to-orange-400/10 rounded-full blur-3xl floating" style={{animationDelay: '3s'}}></div>
        
        {/* Subtle spiritual symbols */}
        <div className="absolute top-20 right-20 text-4xl text-amber-200/20 dark:text-amber-400/15 font-sanskrit select-none">ॐ</div>
        <div className="absolute bottom-32 left-32 text-3xl text-orange-200/20 dark:text-orange-400/15 font-sanskrit select-none">🪷</div>
      </div>

      <div className="relative z-10 max-w-md w-full">
        <div className="card text-center relative overflow-hidden">
          {/* Background gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-amber-50/50 to-yellow-50/50 dark:from-orange-900/20 dark:via-amber-900/20 dark:to-yellow-900/20 opacity-50"></div>
          
          <div className="relative p-6">
            {/* Enhanced logo section */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 via-amber-600 to-yellow-600 dark:from-orange-400 dark:via-amber-500 dark:to-yellow-500 rounded-lg flex items-center justify-center shadow-lg floating border border-amber-400/30 dark:border-amber-500/40">
                <span className="text-3xl text-white">ॐ</span>
              </div>
              <span className="text-2xl text-amber-500 dark:text-amber-400 pulse-subtle">🪷</span>
            </div>
            
            <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-900 via-orange-800 to-yellow-800 dark:from-amber-300 dark:via-orange-300 dark:to-yellow-300 bg-clip-text text-transparent mb-2 font-traditional">
              {t('auth.welcomeTitle')}
            </h1>
            
            <p className="text-base text-amber-700 dark:text-amber-200 mb-8 leading-relaxed">
              {t('auth.welcomeSubtitle')}
            </p>

            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="text-left">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <IoMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500 dark:text-amber-400 w-4 h-4" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full pl-10 pr-4 py-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-md focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 hover:from-orange-700 hover:via-amber-700 hover:to-yellow-700 dark:from-orange-500 dark:via-amber-500 dark:to-yellow-500 dark:hover:from-orange-600 dark:hover:via-amber-600 dark:hover:to-yellow-600 text-white font-medium py-3 px-6 rounded-md transition-all duration-200 shadow-sm hover:shadow-md text-sm"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <IoMail className="w-4 h-4" />
                )}
                <span>{isLoading ? 'Sending...' : 'Send Magic Link'}</span>
                {!isLoading && <IoArrowForward className="w-4 h-4" />}
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200/60 dark:border-gray-600/60" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-white/90 dark:bg-gray-800/90 text-gray-500 dark:text-gray-400 font-medium">Or continue with</span>
                </div>
              </div>

              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="mt-4 w-full flex items-center justify-center px-4 py-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:border-gray-300/60 dark:hover:border-gray-600/60 rounded-md shadow-sm hover:shadow-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </button>
            </div>

            {message && (
              <div className={`mt-4 p-3 rounded-md text-xs font-medium ${
                message.includes('Check your email') 
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-300 border border-green-200/60 dark:border-green-700/60' 
                  : 'bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/30 dark:to-rose-900/30 text-red-700 dark:text-red-300 border border-red-200/60 dark:border-red-700/60'
              }`}>
                <div className="flex items-center gap-2">
                  {message.includes('Check your email') ? (
                    <IoMail className="w-3 h-3" />
                  ) : (
                    <IoShield className="w-3 h-3" />
                  )}
                  {message}
                </div>
              </div>
            )}


          </div>
        </div>
      </div>
    </div>
  )
}
