import { useState, useEffect, Suspense, lazy } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { EmotionSelector } from './components/EmotionSelector'
import { Header } from './components/Header'
// Lazy load LandingPage
const LandingPage = lazy(() => import('./components/LandingPage').then(module => ({ default: module.LandingPage })))
// Lazy load UserStats
const UserStats = lazy(() => import('./components/UserStats').then(module => ({ default: module.UserStats })))
import { Footer } from './components/Footer'
import { PWAInstallPrompt } from './components/PWAInstallPrompt'
import { perfMonitor } from './utils/performance'

// Lazy load heavy components
const MantraPractice = lazy(() => import('./components/MantraPractice').then(module => ({ default: module.MantraPractice })))
const ReflectionModal = lazy(() => import('./components/ReflectionModal').then(module => ({ default: module.ReflectionModal })))
const AlternativePractices = lazy(() => import('./components/AlternativePractices').then(module => ({ default: module.AlternativePractices })))
const UserProfilePage = lazy(() => import('./pages/UserProfilePage').then(module => ({ default: module.UserProfilePage })))
import { Emotion, Mantra } from './types'
import { SupabaseService } from './services/supabase'
import { pwaService } from './services/pwaService'
import { mantraAudioService } from './services/audioService'
import { emotions } from './data/emotions'
import { mantras } from './data/mantras'
import { useTranslation } from 'react-i18next'

type AppState = 'auth' | 'emotion-selector' | 'mantra-practice' | 'reflection' | 'profile' | 'alternative-practices'

function App({ initialRoute }: { initialRoute?: 'profile' | 'practice' | 'mantra' | 'alternatives' } = {}) {
  const [currentState, setCurrentState] = useState<AppState>('auth')
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null)
  const [selectedMantra, setSelectedMantra] = useState<Mantra | null>(null)
  const [sessionData, setSessionData] = useState<{
    repetitions: number
    duration: number
  } | null>(null)
  const [user, setUser] = useState<any>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  // const [showProfile, setShowProfile] = useState(false)

  const navigate = useNavigate()
  const params = useParams()
  const { t } = useTranslation()

  // Check authentication status on mount
  useEffect(() => {
    perfMonitor.mark('app-mount-start')
    checkAuth()
    perfMonitor.mark('app-mount-end')
    perfMonitor.measure('app-mount-duration', 'app-mount-start', 'app-mount-end')
  }, [])

  // Initialize PWA features
  useEffect(() => {
    const initializePWA = async () => {
      try {
        // Register service worker
        await pwaService.registerServiceWorker()
        
        // Request notification permission for practice reminders
        // await pwaService.requestNotificationPermission()
        
        // Schedule daily practice reminder at 9 AM
        // await pwaService.schedulePracticeReminder(9, 0)
        
        // Preload all mantra audio for offline use
        const fullMantras = mantras.map((mantra, index) => ({ id: index + 1, ...mantra }))
        await mantraAudioService.preloadAllMantras(fullMantras)
        
      } catch (error) {
      }
    }

    initializePWA()
  }, [])


  // Scroll to top when state changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentState])

  const checkAuth = async () => {
    try {
      const { data: { user }, error } = await SupabaseService.getCurrentUser()
      if (user && !error) {
        setUser(user)
        setIsAuthenticated(true)
        if (initialRoute === 'profile') {
          setCurrentState('profile')
        } else if (initialRoute === 'practice' && params.emotionId) {
          // Attempt to auto-open practice from URL
          const emotion = emotions.find(e => e.id === params.emotionId)
          if (emotion) {
            const matchingMantra = mantras.find(m => m.emotions.includes(emotion.id))
            if (matchingMantra) {
              const fullMantra: Mantra = { id: mantras.indexOf(matchingMantra) + 1, ...matchingMantra }
              setSelectedEmotion(emotion)
              setSelectedMantra(fullMantra)
              setCurrentState('mantra-practice')
            } else {
              setCurrentState('emotion-selector')
            }
          } else {
            setCurrentState('emotion-selector')
          }
        } else if (initialRoute === 'mantra' && params.mantraSlug) {
          // Direct mantra access from URL
          const mantraData = mantras.find(m => m.slug === params.mantraSlug)
          if (mantraData) {
            const fullMantra: Mantra = {
              id: mantras.indexOf(mantraData) + 1,
              ...mantraData
            }
            
            // Find the first emotion that matches this mantra
            const matchingEmotion = emotions.find(emotion => 
              mantraData.emotions.includes(emotion.id)
            )
            
            if (matchingEmotion) {
              setSelectedEmotion(matchingEmotion)
              setSelectedMantra(fullMantra)
              setCurrentState('mantra-practice')
            } else {
              setCurrentState('emotion-selector')
            }
          } else {
            setCurrentState('emotion-selector')
          }
        } else if (initialRoute === 'alternatives' && params.emotionId) {
          // Direct alternatives access from URL
          const emotion = emotions.find(e => e.id === params.emotionId)
          if (emotion) {
            setSelectedEmotion(emotion)
            setCurrentState('alternative-practices')
          } else {
            setCurrentState('emotion-selector')
          }
        } else {
          setCurrentState('emotion-selector')
        }
      } else {
        setIsAuthenticated(false)
        setCurrentState('auth')
      }
    } catch (error) {
      setIsAuthenticated(false)
      setCurrentState('auth')
    } finally {
      setIsAuthLoading(false)
    }
  }

  const handleAuthSuccess = () => {
    setIsAuthenticated(true)
    setIsAuthLoading(false)
    setCurrentState('emotion-selector')
  }

  const handleEmotionSelect = (emotion: Emotion, mantra: Mantra) => {
    setSelectedEmotion(emotion)
    setSelectedMantra(mantra)
    setCurrentState('mantra-practice')
  }

  const handleFavoriteMantraSelect = (mantraId: number) => {
    // Find the mantra by ID (mantras array is 0-indexed, but IDs are 1-indexed)
    const mantraData = mantras[mantraId - 1]
    if (mantraData) {
      const fullMantra: Mantra = { id: mantraId, ...mantraData }
      
      // Find the first emotion that matches this mantra
      const matchingEmotion = emotions.find(emotion => 
        mantraData.emotions.includes(emotion.id)
      )
      
      if (matchingEmotion) {
        setSelectedEmotion(matchingEmotion)
        setSelectedMantra(fullMantra)
        setCurrentState('mantra-practice')
        
        // Navigate to the proper mantra URL using the slug
        navigate(`/mantra/${mantraData.slug}`)
        
        // Scroll to top for better UX
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }

  const handlePracticeComplete = (repetitions: number, duration: number) => {
    setSessionData({ repetitions, duration })
    setCurrentState('reflection')
  }

  const handleReflectionComplete = () => {
    // Clear session data but stay on practice page
    setSessionData(null)
    setCurrentState('mantra-practice')
  }

  const handleReflectionClose = () => {
    // Just close the modal and go back to mantra practice
    setSessionData(null)
    setCurrentState('mantra-practice')
  }



  const handleAlternativePractices = (emotion: Emotion) => {
    navigate(`/alternatives/${emotion.id}`)
  }

  const handleProfileClick = () => {
    setCurrentState('profile')
    navigate('/profile')
  }

  // Removed modal profile close; routing handles navigation


  const handleLogout = () => {
    setUser(null)
    setIsAuthenticated(false)
    setCurrentState('auth')
    navigate('/')
  }

  // Show loading screen while checking authentication
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50/40 to-yellow-50/60 dark:from-gray-900 dark:via-slate-900/90 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 dark:from-orange-400 dark:to-amber-500 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-amber-400/30 dark:border-amber-500/40">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-amber-700 dark:text-amber-200 font-medium font-traditional">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div></div>}>
        <LandingPage onAuthSuccess={handleAuthSuccess} />
      </Suspense>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50/40 to-yellow-50/60 dark:from-gray-900 dark:via-slate-900/90 dark:to-gray-800 relative overflow-hidden">
      {/* Traditional spiritual background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-400/15 to-amber-400/15 dark:from-orange-400/10 dark:to-amber-400/10 rounded-full blur-3xl floating"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-yellow-400/15 to-orange-400/15 dark:from-yellow-400/10 dark:to-orange-400/10 rounded-full blur-3xl floating" style={{animationDelay: '3s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-amber-400/10 to-yellow-400/10 dark:from-amber-400/5 dark:to-yellow-400/5 rounded-full blur-3xl floating" style={{animationDelay: '1.5s'}}></div>
        
        {/* Subtle Om symbols in background */}
        <div className="absolute top-20 left-20 text-6xl text-amber-200/20 dark:text-amber-400/15 font-sanskrit select-none">ॐ</div>
        <div className="absolute bottom-32 right-32 text-5xl text-orange-200/20 dark:text-orange-400/15 font-sanskrit select-none">ॐ</div>
        <div className="absolute top-1/3 right-20 text-4xl text-yellow-200/20 dark:text-yellow-400/15 font-sanskrit select-none">🪷</div>
        <div className="absolute bottom-1/4 left-32 text-4xl text-amber-200/20 dark:text-amber-400/15 font-sanskrit select-none">🪷</div>
      </div>

      <Header 
        selectedEmotion={selectedEmotion}
        onProfileClick={handleProfileClick}
        onLogout={handleLogout}
        user={user}
      />
      
      <main className="relative z-10 w-full px-4 py-6 pt-20">
        {currentState === 'emotion-selector' && (
          <div className="max-w-7xl mx-auto">
            {/* Main Emotion Selector - Now the primary focus */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <EmotionSelector 
                onEmotionSelect={handleEmotionSelect} 
              />
            </div>

            {/* Stats Section - Moved below and made more subtle */}
            {user && (
              <div className="mt-12 animate-in fade-in slide-in-from-top-4 duration-700" style={{animationDelay: '300ms'}}>
                <Suspense fallback={<div className="flex items-center justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div></div>}>
                  <UserStats userId={user.id} onMantraSelect={handleFavoriteMantraSelect} compact={true} />
                </Suspense>
              </div>
            )}
          </div>
        )}
        
        {currentState === 'mantra-practice' && selectedMantra && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-700">
            <Suspense fallback={<div className="flex items-center justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div></div>}>
              <MantraPractice
                mantra={selectedMantra}
                emotion={selectedEmotion!}
                onComplete={handlePracticeComplete}
                onAlternativePractices={handleAlternativePractices}
                userId={user?.id}
              />
            </Suspense>
          </div>
        )}
        
        {currentState === 'reflection' && sessionData && selectedMantra && (
          <div className="animate-in fade-in zoom-in-95 duration-500">
            <Suspense fallback={<div className="flex items-center justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div></div>}>
              <ReflectionModal
                mantra={selectedMantra}
                emotion={selectedEmotion!}
                sessionData={sessionData}
                onComplete={handleReflectionComplete}
                onClose={handleReflectionClose}
                user={user}
              />
            </Suspense>
          </div>
        )}

        {currentState === 'profile' && user && (
          <div className="animate-in fade-in slide-in-from-left-4 duration-700">
            <Suspense fallback={<div className="flex items-center justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div></div>}>
              <UserProfilePage user={user} onMantraSelect={handleFavoriteMantraSelect} />
            </Suspense>
          </div>
        )}

        {currentState === 'alternative-practices' && selectedEmotion && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Suspense fallback={<div className="flex items-center justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div></div>}>
              <AlternativePractices
                emotion={selectedEmotion}
              />
            </Suspense>
          </div>
        )}


      </main>

      {/* Only show footer on main page (emotion selector) */}
      {currentState === 'emotion-selector' && <Footer />}
      
      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
    </div>
  )
}

export default App
