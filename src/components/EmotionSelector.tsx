import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { emotions } from '../data/emotions'
import { mantras } from '../data/mantras'
import { Emotion, Mantra } from '../types'
import { IoSearch, IoSparkles, IoHappy, IoFlash } from 'react-icons/io5'
import { useTranslation } from 'react-i18next'

interface EmotionSelectorProps {
  onEmotionSelect: (emotion: Emotion, mantra: Mantra) => void
}

export function EmotionSelector({ onEmotionSelect }: EmotionSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showReactIcons, setShowReactIcons] = useState(false)
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()

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
    const matchingMantra = mantras.find(mantra => 
      mantra.emotions.includes(emotion.id)
    )

    if (matchingMantra) {
      // Convert to full Mantra object with ID
      const fullMantra: Mantra = {
        id: mantras.indexOf(matchingMantra) + 1,
        ...matchingMantra
      }
      onEmotionSelect(emotion, fullMantra)
      
      // Scroll to top before navigating
      window.scrollTo({ top: 0, behavior: 'smooth' })
      
      navigate(`/practice/${emotion.id}`)
    }
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
          
          {/* Enhanced icon style toggle */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 dark:from-amber-400/30 dark:to-orange-400/30 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-1.5 border border-gray-200/60 dark:border-gray-600/60 shadow-lg hover:shadow-xl transition-all duration-200">
              <button
                onClick={() => setShowReactIcons(false)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                  !showReactIcons 
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                }`}
              >
                <IoHappy className="w-4 h-4" />
                <span>{t('emotionSelector.emoji')}</span>
              </button>
              <button
                onClick={() => setShowReactIcons(true)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                  showReactIcons 
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                }`}
              >
                <IoFlash className="w-4 h-4" />
                <span>{t('emotionSelector.modern')}</span>
              </button>
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
                  {showReactIcons && emotion.reactIcon ? (
                    <div className="w-12 h-12 flex items-center justify-center">
                      <emotion.reactIcon className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                    </div>
                  ) : (
                    <div className="text-4xl">
                      {emotion.icon}
                    </div>
                  )}
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
      {filteredEmotions.length === 0 && searchQuery && (
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
            {t('emotionSelector.noResults')}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto leading-relaxed">
            {t('emotionSelector.tryDifferent')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <button
              onClick={() => setSearchQuery('')}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium py-2.5 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
            >
              <IoSparkles className="w-4 h-4" />
              {t('emotionSelector.clearSearch')}
            </button>
            
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
