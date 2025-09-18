import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { EmotionSelector } from './components/EmotionSelector'
import { MantraPractice } from './components/MantraPractice'
import { ReflectionModal } from './components/ReflectionModal'
import { Header } from './components/Header'
import { Auth } from './components/Auth'
import { UserStats } from './components/UserStats'
// import { UserProfile } from './components/UserProfile'
import { UserProfilePage } from './pages/UserProfilePage'
import { Emotion, Mantra } from './types'
import { SupabaseService } from './services/supabase'
import { emotions } from './data/emotions'
import { mantras } from './data/mantras'

type AppState = 'auth' | 'emotion-selector' | 'mantra-practice' | 'reflection' | 'profile'

function App({ initialRoute }: { initialRoute?: 'profile' | 'practice' } = {}) {
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

  // Check authentication status on mount
  useEffect(() => {
    checkAuth()
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
        } else {
          setCurrentState('emotion-selector')
        }
      } else {
        setIsAuthenticated(false)
        setCurrentState('auth')
      }
    } catch (error) {
      console.error('Auth check error:', error)
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
    // Reset to emotion selector for next practice
    setSelectedEmotion(null)
    setSelectedMantra(null)
    setSessionData(null)
    setCurrentState('emotion-selector')
  }

  const handleBackToEmotions = () => {
    setSelectedEmotion(null)
    setSelectedMantra(null)
    setSessionData(null)
    setCurrentState('emotion-selector')
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
  }

  // Show loading screen while checking authentication
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-blue-50/60 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading your mindful practice...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Auth onAuthSuccess={handleAuthSuccess} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-blue-50/60 relative overflow-hidden">
      {/* Ambient background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-violet-400/20 to-purple-400/20 rounded-full blur-3xl floating"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl floating" style={{animationDelay: '3s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl floating" style={{animationDelay: '1.5s'}}></div>
      </div>

      <Header 
        currentState={currentState}
        onBack={handleBackToEmotions}
        selectedEmotion={selectedEmotion}
        onProfileClick={handleProfileClick}
      />
      
      <main className="relative z-10 w-full px-4 py-6 pt-32">
        {currentState === 'emotion-selector' && (
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="text-center mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-violet-800 to-purple-800 bg-clip-text text-transparent mb-3">
                Welcome to Your Mindful Practice
              </h1>
              <p className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Choose how you're feeling today and discover the perfect mantra to guide your meditation journey
              </p>
            </div>

            {/* Stats Section - Compact and Optional */}
            {user && (
              <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-700" style={{animationDelay: '100ms'}}>
                <UserStats userId={user.id} onMantraSelect={handleFavoriteMantraSelect} />
              </div>
            )}

            {/* Main Emotion Selector */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700" style={{animationDelay: '200ms'}}>
              <EmotionSelector onEmotionSelect={handleEmotionSelect} />
            </div>
          </div>
        )}
        
        {currentState === 'mantra-practice' && selectedMantra && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-700">
            <MantraPractice
              mantra={selectedMantra}
              emotion={selectedEmotion!}
              onComplete={handlePracticeComplete}
              onBack={handleBackToEmotions}
            />
          </div>
        )}
        
        {currentState === 'reflection' && sessionData && selectedMantra && (
          <div className="animate-in fade-in zoom-in-95 duration-500">
            <ReflectionModal
              mantra={selectedMantra}
              emotion={selectedEmotion!}
              sessionData={sessionData}
              onComplete={handleReflectionComplete}
            />
          </div>
        )}

        {currentState === 'profile' && user && (
          <div className="animate-in fade-in slide-in-from-left-4 duration-700">
            <UserProfilePage user={user} onLogout={handleLogout} />
          </div>
        )}
      </main>

    </div>
  )
}

export default App
