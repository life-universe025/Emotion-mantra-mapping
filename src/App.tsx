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
import { EdgeFunctionExample } from './components/EdgeFunctionExample'
import { Emotion, Mantra } from './types'
import { SupabaseService } from './services/supabase'
import { emotions } from './data/emotions'
import { mantras } from './data/mantras'

type AppState = 'auth' | 'emotion-selector' | 'mantra-practice' | 'reflection' | 'test-api' | 'profile'

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
  const [showApiTest, setShowApiTest] = useState(false)

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

  const handleApiTestClick = () => {
    setShowApiTest(true)
  }

  const handleApiTestClose = () => {
    setShowApiTest(false)
  }

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
        onApiTestClick={handleApiTestClick}
      />
      
      <main className="relative z-10 w-full px-4 py-6">
        {currentState === 'emotion-selector' && (
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="text-center mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-violet-800 to-purple-800 bg-clip-text text-transparent mb-3">
                Welcome to Your Mindful Practice
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Choose how you're feeling today and discover the perfect mantra to guide your meditation journey
              </p>
            </div>

            {/* Stats Section - Compact and Optional */}
            {user && (
              <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-700" style={{animationDelay: '100ms'}}>
                <UserStats userId={user.id} />
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

      {/* Enhanced API Test Modal */}
      {showApiTest && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-[0_20px_64px_rgba(0,0,0,0.15)] border border-white/40 animate-in zoom-in-95 slide-in-from-bottom-4 duration-500">
            <div className="p-6 border-b border-gray-200/60 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <span className="text-white text-lg">🧪</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900">API Test Panel</h2>
              </div>
              <button
                onClick={handleApiTestClose}
                className="w-10 h-10 rounded-2xl bg-gray-100/80 hover:bg-gray-200 transition-all duration-300 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:scale-105"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <EdgeFunctionExample />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
