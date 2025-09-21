import React from 'react'
import { MoodEntry } from '../types'
import { useTranslation } from 'react-i18next'

interface MoodSelectorProps {
  selectedMood?: MoodEntry
  onMoodSelect: (mood: MoodEntry) => void
  title?: string
  showLabels?: boolean
  className?: string
}

// Predefined mood scale with emojis and colors
const MOOD_SCALE: MoodEntry[] = [
  { emoji: '😢', label: 'Very Low', value: 1, color: 'bg-red-100 text-red-700 border-red-200' },
  { emoji: '😔', label: 'Low', value: 2, color: 'bg-red-100 text-red-600 border-red-200' },
  { emoji: '😕', label: 'Below Average', value: 3, color: 'bg-orange-100 text-orange-600 border-orange-200' },
  { emoji: '😐', label: 'Neutral', value: 4, color: 'bg-yellow-100 text-yellow-600 border-yellow-200' },
  { emoji: '🙂', label: 'Slightly Good', value: 5, color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  { emoji: '😊', label: 'Good', value: 6, color: 'bg-green-100 text-green-600 border-green-200' },
  { emoji: '😄', label: 'Very Good', value: 7, color: 'bg-green-100 text-green-700 border-green-200' },
  { emoji: '😁', label: 'Great', value: 8, color: 'bg-blue-100 text-blue-600 border-blue-200' },
  { emoji: '🤩', label: 'Excellent', value: 9, color: 'bg-purple-100 text-purple-600 border-purple-200' },
  { emoji: '🥰', label: 'Amazing', value: 10, color: 'bg-pink-100 text-pink-600 border-pink-200' }
]

export function MoodSelector({ 
  selectedMood, 
  onMoodSelect, 
  title,
  showLabels = true,
  className = '' 
}: MoodSelectorProps) {
  const { t } = useTranslation()

  return (
    <div className={`space-y-4 ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 text-center">
          {title}
        </h3>
      )}
      
      <div className="grid grid-cols-5 gap-2 sm:gap-3">
        {MOOD_SCALE.map((mood) => (
          <button
            key={mood.value}
            onClick={() => onMoodSelect(mood)}
            className={`
              relative group flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border-2 transition-all duration-200
              hover:scale-105 hover:shadow-md active:scale-95
              ${selectedMood?.value === mood.value 
                ? `${mood.color} border-current shadow-md scale-105` 
                : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }
            `}
            aria-label={`Mood ${mood.value}: ${mood.label}`}
          >
            <span className="text-2xl sm:text-3xl mb-1">{mood.emoji}</span>
            {showLabels && (
              <span className={`
                text-xs font-medium text-center leading-tight
                ${selectedMood?.value === mood.value 
                  ? 'text-current' 
                  : 'text-gray-600 dark:text-gray-400'
                }
              `}>
                {mood.label}
              </span>
            )}
            
            {/* Hover tooltip */}
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
              {mood.label} ({mood.value}/10)
            </div>
          </button>
        ))}
      </div>
      
      {selectedMood && (
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('moodSelector.selected')}: <span className="font-medium text-gray-800 dark:text-gray-200">
              {selectedMood.emoji} {selectedMood.label} ({selectedMood.value}/10)
            </span>
          </p>
        </div>
      )}
    </div>
  )
}
