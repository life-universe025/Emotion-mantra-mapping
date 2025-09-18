import { useState } from 'react'
import { Mail, Heart, Sparkles, Shield, ArrowRight } from 'lucide-react'
import { SupabaseService } from '../services/supabase'

interface AuthProps {
  onAuthSuccess: () => void
}

export function Auth({ onAuthSuccess }: AuthProps) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

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

  const handleSkipAuth = () => {
    // For demo purposes, allow skipping authentication
    onAuthSuccess()
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-blue-50/60 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-violet-400/20 to-purple-400/20 rounded-full blur-3xl floating"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl floating" style={{animationDelay: '3s'}}></div>
      </div>

      <div className="relative z-10 max-w-lg w-full">
        <div className="card text-center relative overflow-hidden">
          {/* Background gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 via-purple-50/50 to-blue-50/50 opacity-50"></div>
          
          <div className="relative">
            {/* Enhanced logo section */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-violet-500 via-purple-600 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl floating">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <Sparkles className="w-8 h-8 text-violet-500 pulse-subtle" />
            </div>
            
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-violet-800 to-purple-800 bg-clip-text text-transparent mb-3">
              Welcome to Mantra Practice
            </h1>
            
            <p className="text-lg text-gray-600 mb-10 leading-relaxed">
              Sign in to track your practice and build your meditation streak
            </p>

            <form onSubmit={handleSignIn} className="space-y-6">
              <div className="text-left">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-violet-500 w-5 h-5" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="input-modern pl-12 pr-4"
                    required
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-500/10 to-purple-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary text-lg py-4 shadow-2xl hover:shadow-3xl"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Mail className="w-5 h-5" />
                )}
                <span>{isLoading ? 'Sending Magic Link...' : 'Send Magic Link'}</span>
                {!isLoading && <ArrowRight className="w-5 h-5" />}
              </button>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200/60" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white/90 text-gray-500 font-medium">Or continue with</span>
                </div>
              </div>

              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="mt-6 w-full flex items-center justify-center px-6 py-4 bg-white/90 backdrop-blur-xl border border-gray-200/60 hover:border-gray-300/80 rounded-2xl shadow-lg hover:shadow-xl text-lg font-semibold text-gray-700 hover:text-gray-900 transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
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
              <div className={`mt-6 p-4 rounded-2xl text-sm font-medium ${
                message.includes('Check your email') 
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-200/60' 
                  : 'bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border border-red-200/60'
              }`}>
                <div className="flex items-center gap-2">
                  {message.includes('Check your email') ? (
                    <Mail className="w-4 h-4" />
                  ) : (
                    <Shield className="w-4 h-4" />
                  )}
                  {message}
                </div>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-gray-200/60">
              <button
                onClick={handleSkipAuth}
                className="text-sm text-gray-500 hover:text-violet-600 font-medium transition-colors duration-300 underline decoration-dotted underline-offset-4"
              >
                Continue without signing in (demo mode)
              </button>
            </div>

            <div className="mt-8 text-xs text-gray-400 leading-relaxed">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Shield className="w-4 h-4" />
                <span className="font-medium">Your Privacy Matters</span>
              </div>
              <p>
                By continuing, you agree to our terms of service and privacy policy.
                Your practice data is private, secure, and encrypted.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
