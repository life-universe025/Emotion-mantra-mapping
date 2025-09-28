import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Emotion, Mantra } from '../types'
import { IoSearch, IoSparkles } from 'react-icons/io5'
import { useTranslation } from 'react-i18next'
import { SupabaseService } from '../services/supabase'

interface EmotionSelectorProps {
  onEmotionSelect: (emotion: Emotion, mantra: Mantra) => void
}

export function EmotionSelector({ onEmotionSelect }: EmotionSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [mantras, setMantras] = useState<Mantra[]>([])
  const [emotions, setEmotions] = useState<Emotion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()


  // Load mantras from database on component mount
  useEffect(() => {
    const loadMantras = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch mantras with emotion relationships
        const result = await SupabaseService.getMantras()
        
        if (result.error) {
          setError('Failed to load mantras')
          return
        }
        
        setMantras(result.data || [])
        
        // Extract unique emotions from mantras - ONLY from emotion_mantra array
        const uniqueEmotions = new Map()
        result.data?.forEach((mantra: any) => {
          
          // ONLY handle new relationship structure (emotion_mantra)
          if (mantra.emotion_mantra && mantra.emotion_mantra.length > 0) {
            mantra.emotion_mantra.forEach((rel: any) => {
              if (rel.emotions && !uniqueEmotions.has(rel.emotions.id)) {
                uniqueEmotions.set(rel.emotions.id, rel.emotions)
              }
            })
          } else {
          }
        })
        
        setEmotions(Array.from(uniqueEmotions.values()))
      } catch (error) {
        setError('Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    loadMantras()
  }, [])

  const filteredEmotions = emotions.filter(emotion => {
    if (!searchQuery.trim()) return true
    
    const emotionName = t(`emotions.${emotion.id}.name`)
    const emotionDescription = t(`emotions.${emotion.id}.description`)
    const searchLower = searchQuery.toLowerCase()
    
    return emotionName.toLowerCase().includes(searchLower) ||
           emotionDescription.toLowerCase().includes(searchLower) ||
           emotion.id.toLowerCase().includes(searchLower)
  })

  const handleEmotionClick = (emotion: Emotion) => {
    // Find the first mantra that matches this emotion
    const matchingMantra = mantras.find(mantra => {
      // Check new relationship structure (emotion_mantra)
      if (mantra.emotion_mantra && mantra.emotion_mantra.length > 0) {
        return mantra.emotion_mantra.some((rel: any) => rel.emotion_id === emotion.id)
      }
      // Check old structure (emotions array)
      else if (mantra.emotions && mantra.emotions.length > 0) {
        return mantra.emotions.includes(emotion.id)
      }
      return false
    })

    if (matchingMantra) {
      onEmotionSelect(emotion, matchingMantra)
      
      // Scroll to top before navigating
      window.scrollTo({ top: 0, behavior: 'smooth' })
      
      navigate(`/practice/${emotion.id}`)
    }
  }


  // Show loading state
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-16">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-amber-600 dark:text-amber-400 font-medium">
            {t('emotionSelector.loading')}
          </p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-2xl">⚠️</span>
          </div>
          <h3 className="text-xl font-semibold text-red-700 dark:text-red-300 mb-3">
            {t('emotionSelector.error')}
          </h3>
          <p className="text-red-600 dark:text-red-400 mb-6">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-2.5 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
          >
            <IoSparkles className="w-4 h-4" />
            {t('emotionSelector.retry')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Simplified hero section - Focus on the core question */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-4 mb-6">
          <span className="text-6xl">ॐ</span>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-900 via-orange-800 to-yellow-800 dark:from-amber-300 dark:via-orange-300 dark:to-yellow-300 bg-clip-text text-transparent font-traditional leading-tight py-2">
            {t('emotionSelector.title')}
          </h1>
          <span className="text-5xl">🪷</span>
        </div>
        
        <p className="text-lg text-amber-700 dark:text-amber-200 mb-8 max-w-3xl mx-auto leading-relaxed">
          {t('emotionSelector.subtitle')}
        </p>
        
        {/* Enhanced controls with better design */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          {/* Enhanced search bar */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-amber-500/20 dark:from-orange-400/30 dark:to-amber-400/30 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <IoSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-500 dark:text-amber-400 w-5 h-5 transition-colors duration-200 group-focus-within:text-orange-500 dark:group-focus-within:text-orange-400" />
              <input
                type="text"
                placeholder={t('emotionSelector.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-80 sm:w-96 pl-12 pr-12 py-3.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-gray-200/60 dark:border-gray-600/60 rounded-2xl focus:ring-2 focus:ring-orange-500/50 dark:focus:ring-orange-400/50 focus:border-orange-400 dark:focus:border-orange-500 focus:outline-none transition-all duration-200 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 shadow-lg hover:shadow-xl focus:shadow-xl text-sm font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-full flex items-center justify-center transition-colors duration-200"
                >
                  <span className="text-gray-600 dark:text-gray-300 text-xs font-bold">×</span>
                </button>
              )}
            </div>
          </div>
          
          
        </div>
      </div>

      {/* Search results indicator */}
      {searchQuery && (
        <div className="text-center mb-6">
          <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">
            {filteredEmotions.length > 0 
              ? `${filteredEmotions.length} emotion${filteredEmotions.length === 1 ? '' : 's'} found for "${searchQuery}"`
              : `No emotions found for "${searchQuery}"`
            }
          </p>
        </div>
      )}

      {/* Enhanced emotion grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredEmotions.map((emotion, index) => (
          <div
            key={emotion.id}
            className="emotion-card group p-6 relative"
            style={{
              animationDelay: `${index * 30}ms`
            }}
          >
            <button
              onClick={() => handleEmotionClick(emotion)}
              className="w-full h-full"
            >
              <div className="relative z-10 text-center">
                <div className="flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  <div className="text-4xl">
                    {emotion.icon}
                  </div>
                </div>
                <h3 className="font-semibold text-base mb-2 text-amber-800 dark:text-amber-200 group-hover:text-amber-900 dark:group-hover:text-amber-100 transition-colors duration-300">
                  {t(`emotions.${emotion.id}.name`)}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-300 line-clamp-2">
                  {t(`emotions.${emotion.id}.description`)}
                </p>
              </div>
            </button>
            
          </div>
        ))}
      </div>

      {/* Enhanced empty state */}
      {filteredEmotions.length === 0 && !loading && (
        <div className="text-center py-16">
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-3xl flex items-center justify-center mx-auto shadow-lg">
              <IoSearch className="w-12 h-12 text-amber-500 dark:text-amber-400" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">?</span>
            </div>
          </div>
          
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3">
            {searchQuery ? t('emotionSelector.noResults') : 'No emotions loaded'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto leading-relaxed">
            {searchQuery ? t('emotionSelector.tryDifferent') : 'Unable to load emotions from the database. Please check your connection and try again.'}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium py-2.5 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
              >
                <IoSparkles className="w-4 h-4" />
                {t('emotionSelector.clearSearch')}
              </button>
            ) : (
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium py-2.5 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
              >
                <IoSparkles className="w-4 h-4" />
                Retry
              </button>
            )}
            
            <div className="text-sm text-gray-400 dark:text-gray-500">
              {t('emotionSelector.searchSuggestions', { 
                suggestions: i18n.language === 'hi' 
                  ? 'चिंता, तनाव, शांति, खुशी' 
                  : 'anxiety, stress, peace, joy' 
              })}
            </div>
          </div>
        </div>
      )}

      {/* Simple footer tip */}
      <div className="mt-12 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t('emotionSelector.footerTip')}
        </p>
      </div>
    </div>
  )
}
