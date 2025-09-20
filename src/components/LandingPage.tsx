import { useState } from 'react'
import { IoPlay, IoHeart, IoStatsChart, IoPerson, IoMoon, IoFlower, IoBook, IoTime, IoCheckmarkCircle, IoMail, IoShield, IoArrowForward, IoSunny, IoLanguage } from 'react-icons/io5'
import { SupabaseService } from '../services/supabase'
import { useTheme } from '../contexts/ThemeContext'
import { useTranslation } from 'react-i18next'

interface LandingPageProps {
  onAuthSuccess: () => void
}

export function LandingPage({ onAuthSuccess: _onAuthSuccess }: LandingPageProps) {
  const [showAuth, setShowAuth] = useState(false)
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const { theme, toggleTheme } = useTheme()
  const { t, i18n } = useTranslation()

  const features = [
    {
      icon: <IoHeart className="w-8 h-8 text-orange-500" />,
      title: t('landing.features.emotionMantras.title'),
      description: t('landing.features.emotionMantras.description')
    },
    {
      icon: <IoStatsChart className="w-8 h-8 text-amber-500" />,
      title: t('landing.features.trackProgress.title'),
      description: t('landing.features.trackProgress.description')
    },
    {
      icon: <IoTime className="w-8 h-8 text-yellow-500" />,
      title: t('landing.features.guidedPractice.title'),
      description: t('landing.features.guidedPractice.description')
    },
    {
      icon: <IoBook className="w-8 h-8 text-orange-600" />,
      title: t('landing.features.sacredKnowledge.title'),
      description: t('landing.features.sacredKnowledge.description')
    },
    {
      icon: <IoFlower className="w-8 h-8 text-amber-600" />,
      title: t('landing.features.reflectionGrowth.title'),
      description: t('landing.features.reflectionGrowth.description')
    },
    {
      icon: <IoCheckmarkCircle className="w-8 h-8 text-yellow-600" />,
      title: t('landing.features.personalizedJourney.title'),
      description: t('landing.features.personalizedJourney.description')
    }
  ]

  const benefits = t('landing.benefits.list', { returnObjects: true }) as string[]

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'hi' : 'en'
    i18n.changeLanguage(newLang)
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      const { error } = await SupabaseService.signInWithEmail(email)
      
      if (error) {
        setMessage(t('landing.auth.errorSending'))
        console.error('Auth error:', error)
      } else {
        setMessage(t('landing.auth.checkEmail'))
      }
    } catch (error) {
      setMessage(t('landing.auth.somethingWrong'))
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
        setMessage(t('landing.auth.errorGoogle'))
        console.error('Google auth error:', error)
      }
      // Note: User will be redirected to Google OAuth, so we don't need to handle success here
    } catch (error) {
      setMessage(t('landing.auth.somethingWrong'))
      console.error('Google auth error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50/40 to-yellow-50/60 dark:from-gray-900 dark:via-slate-900/90 dark:to-gray-800 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-400/15 to-amber-400/15 dark:from-orange-400/10 dark:to-amber-400/10 rounded-full blur-3xl floating"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-yellow-400/15 to-orange-400/15 dark:from-yellow-400/10 dark:to-orange-400/10 rounded-full blur-3xl floating" style={{animationDelay: '3s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-amber-400/10 to-yellow-400/10 dark:from-amber-400/5 dark:to-yellow-400/5 rounded-full blur-3xl floating" style={{animationDelay: '1.5s'}}></div>
        
        {/* Spiritual Symbols */}
        <div className="absolute top-20 left-20 text-6xl text-amber-200/20 dark:text-amber-400/15 font-sanskrit select-none">ॐ</div>
        <div className="absolute bottom-32 right-32 text-5xl text-orange-200/20 dark:text-orange-400/15 font-sanskrit select-none">ॐ</div>
        <div className="absolute top-1/3 right-20 text-4xl text-yellow-200/20 dark:text-yellow-400/15 font-sanskrit select-none">🪷</div>
        <div className="absolute bottom-1/4 left-32 text-4xl text-amber-200/20 dark:text-amber-400/15 font-sanskrit select-none">🪷</div>
      </div>

      {/* Header */}
      <header className="relative z-10 px-4 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 via-amber-600 to-yellow-600 dark:from-orange-400 dark:via-amber-500 dark:to-yellow-500 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-2xl text-white">ॐ</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-amber-900 via-orange-800 to-yellow-800 dark:from-amber-300 dark:via-orange-300 dark:to-yellow-300 bg-clip-text text-transparent font-traditional leading-tight py-0.5">
              {t('app.title')}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={toggleLanguage}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400"
              title={`Switch to ${i18n.language === 'en' ? 'Hindi' : 'English'}`}
            >
              <IoLanguage className="w-4 h-4" />
              <span className="text-sm font-medium">
                {i18n.language === 'en' ? 'हिंदी' : 'English'}
              </span>
            </button>
            
            <button
              onClick={toggleTheme}
              className="inline-flex items-center gap-2 px-3 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400"
              title={theme === 'light' ? t('common.switchToDark') : t('common.switchToLight')}
            >
              {theme === 'light' ? (
                <IoMoon className="w-4 h-4" />
              ) : (
                <IoSunny className="w-4 h-4" />
              )}
            </button>
            
            <button
              onClick={() => setShowAuth(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 hover:from-orange-700 hover:via-amber-700 hover:to-yellow-700 dark:from-orange-500 dark:via-amber-500 dark:to-yellow-500 dark:hover:from-orange-600 dark:hover:via-amber-600 dark:hover:to-yellow-600 text-white font-medium py-2 px-4 rounded-md transition-all duration-200 shadow-sm hover:shadow-md text-sm"
            >
              <IoPerson className="w-4 h-4" />
              {t('landing.auth.signIn')}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="text-6xl">ॐ</span>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-amber-900 via-orange-800 to-yellow-800 dark:from-amber-300 dark:via-orange-300 dark:to-yellow-300 bg-clip-text text-transparent font-traditional leading-tight py-2">
                {t('landing.hero.title')}
              </h1>
              <span className="text-5xl">🪷</span>
            </div>
            
            <p className="text-xl md:text-2xl text-amber-700 dark:text-amber-200 max-w-4xl mx-auto leading-relaxed mb-6 font-traditional">
              {t('landing.hero.subtitle')}
            </p>
            
            <div className="text-lg text-amber-600 dark:text-amber-300 mb-8 italic font-traditional">
              {t('landing.hero.quote')}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button
                onClick={() => setShowAuth(true)}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 hover:from-orange-700 hover:via-amber-700 hover:to-yellow-700 dark:from-orange-500 dark:via-amber-500 dark:to-yellow-500 dark:hover:from-orange-600 dark:hover:via-amber-600 dark:hover:to-yellow-600 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl  text-lg"
              >
                <IoPlay className="w-5 h-5" />
                {t('landing.hero.beginJourney')}
              </button>
              
              <button
                onClick={() => {
                  const featuresSection = document.getElementById('features');
                  featuresSection?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-100 font-medium py-2 px-4 rounded-xl transition-all duration-200 hover:bg-amber-100/50 dark:hover:bg-amber-900/20"
              >
                {t('landing.hero.learnMore')}
                <IoMoon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Features Section */}
          <section id="features" className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-900 via-orange-800 to-yellow-800 dark:from-amber-300 dark:via-orange-300 dark:to-yellow-300 bg-clip-text text-transparent mb-4 font-traditional">
                {t('landing.features.title')}
              </h2>
              <p className="text-lg text-amber-700 dark:text-amber-200 max-w-2xl mx-auto">
                {t('landing.features.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="card p-6 text-center hover:scale-105 transition-all duration-200 hover:shadow-lg"
                >
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-amber-900 dark:text-amber-100 mb-3 font-traditional">
                    {feature.title}
                  </h3>
                  <p className="text-amber-700 dark:text-amber-200 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Benefits Section */}
          <section className="mb-20">
            <div className="card p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-900 via-orange-800 to-yellow-800 dark:from-amber-300 dark:via-orange-300 dark:to-yellow-300 bg-clip-text text-transparent mb-4 font-traditional">
                  {t('landing.benefits.title')}
                </h2>
                <p className="text-lg text-amber-700 dark:text-amber-200">
                  {t('landing.benefits.subtitle')}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <IoCheckmarkCircle className="w-6 h-6 text-orange-500 mt-0.5 flex-shrink-0" />
                    <p className="text-amber-700 dark:text-amber-200">{benefit}</p>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <button
                  onClick={() => setShowAuth(true)}
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 hover:from-orange-700 hover:via-amber-700 hover:to-yellow-700 dark:from-orange-500 dark:via-amber-500 dark:to-yellow-500 dark:hover:from-orange-600 dark:hover:via-amber-600 dark:hover:to-yellow-600 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl  text-lg"
                >
                  <IoFlower className="w-5 h-5" />
                  {t('landing.benefits.startPractice')}
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-4 py-8 border-t border-amber-200/30 dark:border-amber-700/30">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 via-amber-600 to-yellow-600 dark:from-orange-400 dark:via-amber-500 dark:to-yellow-500 rounded-xl flex items-center justify-center">
              <span className="text-lg text-white">ॐ</span>
            </div>
            <span className="text-lg font-semibold bg-gradient-to-r from-amber-900 via-orange-800 to-yellow-800 dark:from-amber-300 dark:via-orange-300 dark:to-yellow-300 bg-clip-text text-transparent font-traditional">
              {t('app.title')}
            </span>
          </div>
          <p className="text-amber-600 dark:text-amber-400 text-sm">
            {t('landing.footer.blessing')}
          </p>
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-md">
            <button
              onClick={() => setShowAuth(false)}
              className="absolute top-4 right-4 w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-200 z-10"
            >
              <span className="text-gray-600 dark:text-gray-300 text-xl">×</span>
            </button>
            <div className="text-center relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg p-8 shadow-xl border border-white/20 dark:border-gray-700/20">
              {/* Enhanced logo section */}
              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 via-amber-600 to-yellow-600 dark:from-orange-400 dark:via-amber-500 dark:to-yellow-500 rounded-lg flex items-center justify-center shadow-xl floating border border-amber-400/30 dark:border-amber-500/40">
                  <span className="text-3xl text-white">ॐ</span>
                </div>
                <span className="text-2xl text-amber-500 dark:text-amber-400 pulse-subtle">🪷</span>
              </div>
              
              <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-900 via-orange-800 to-yellow-800 dark:from-amber-300 dark:via-orange-300 dark:to-yellow-300 bg-clip-text text-transparent mb-2 font-traditional">
                {t('landing.auth.welcome', { appName: t('app.title') })}
              </h1>
              
              <p className="text-base text-amber-700 dark:text-amber-200 mb-8 leading-relaxed">
                {t('landing.auth.subtitle')}
              </p>

              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="text-left">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('landing.auth.emailLabel')}
                  </label>
                  <div className="relative">
                    <IoMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500 dark:text-amber-400 w-4 h-4" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('landing.auth.emailPlaceholder')}
                      className="w-full pl-10 pr-4 py-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-gray-200/60 dark:border-gray-600/60 rounded-xl focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 hover:from-orange-700 hover:via-amber-700 hover:to-yellow-700 dark:from-orange-500 dark:via-amber-500 dark:to-yellow-500 dark:hover:from-orange-600 dark:hover:via-amber-600 dark:hover:to-yellow-600 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg  text-sm"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <IoMail className="w-4 h-4" />
                  )}
                  <span>{isLoading ? t('landing.auth.sending') : t('landing.auth.sendMagicLink')}</span>
                  {!isLoading && <IoArrowForward className="w-4 h-4" />}
                </button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200/60 dark:border-gray-600/60" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-3 bg-transparent text-gray-500 dark:text-gray-400 font-medium">{t('landing.auth.orContinueWith')}</span>
                  </div>
                </div>

                <button
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="mt-4 w-full flex items-center justify-center px-4 py-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-gray-200/60 dark:border-gray-600/60 hover:border-gray-300/80 dark:hover:border-gray-500/80 rounded-xl shadow-md hover:shadow-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-200  disabled:opacity-50 disabled:cursor-not-allowed"
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
                  {t('landing.auth.continueWithGoogle')}
                </button>
              </div>

              {message && (
                <div className={`mt-4 p-3 rounded-xl text-xs font-medium ${
                  message === t('landing.auth.checkEmail')
                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-300 border border-green-200/60 dark:border-green-700/60' 
                    : 'bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/30 dark:to-rose-900/30 text-red-700 dark:text-red-300 border border-red-200/60 dark:border-red-700/60'
                }`}>
                  <div className="flex items-center gap-2">
                    {message === t('landing.auth.checkEmail') ? (
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
      )}
    </div>
  )
}
