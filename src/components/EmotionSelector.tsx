import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { emotions } from '../data/emotions'
import { mantras } from '../data/mantras'
import { Emotion, Mantra } from '../types'
import { Search, Sparkles, Heart } from 'lucide-react'

interface EmotionSelectorProps {
  onEmotionSelect: (emotion: Emotion, mantra: Mantra) => void
}

export function EmotionSelector({ onEmotionSelect }: EmotionSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const filteredEmotions = emotions.filter(emotion =>
    emotion.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emotion.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
      {/* Hero section with modern design */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-violet-800 to-purple-800 bg-clip-text text-transparent">
            How are you feeling today?
          </h2>
          <Sparkles className="w-8 h-8 text-violet-500 pulse-subtle" />
        </div>
        
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Select your current emotion to discover the perfect mantra for your mindful practice
        </p>
        
        {/* Enhanced search bar */}
        <div className="search-container max-w-lg mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-violet-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search emotions or feelings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-modern pl-12 pr-4 text-center placeholder:text-center"
            />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-500/10 to-purple-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
        </div>
      </div>

      {/* Cleaner emotion grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredEmotions.map((emotion, index) => (
          <button
            key={emotion.id}
            onClick={() => handleEmotionClick(emotion)}
            className="emotion-card group p-6"
            style={{
              animationDelay: `${index * 30}ms`
            }}
          >
            <div className="relative z-10 text-center">
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                {emotion.icon}
              </div>
              <h3 className="font-semibold text-base mb-2 text-gray-800 group-hover:text-violet-800 transition-colors duration-300">
                {emotion.name}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed group-hover:text-gray-600 transition-colors duration-300 line-clamp-2">
                {emotion.description}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Enhanced empty state */}
      {filteredEmotions.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Search className="w-10 h-10 text-gray-400" />
          </div>
          <p className="text-gray-500 text-xl mb-2">
            No emotions found matching "{searchQuery}"
          </p>
          <p className="text-gray-400 mb-6">
            Try a different search term or browse all emotions
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="btn-secondary"
          >
            <Sparkles className="w-4 h-4" />
            Clear search
          </button>
        </div>
      )}

      {/* Simple footer tip */}
      <div className="mt-12 text-center">
        <p className="text-sm text-gray-500">
          💡 Can't find your exact feeling? Choose the closest emotion to begin your practice
        </p>
      </div>
    </div>
  )
}
