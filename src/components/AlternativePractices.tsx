import { useState, useEffect } from 'react'
import { IoRefresh } from 'react-icons/io5'
import { Emotion, Affirmation } from '../types'
import { EdgeFunctionService } from '../services/edgeFunctions'
import { useTranslation } from 'react-i18next'

interface AlternativePracticesProps {
  emotion: Emotion
}

export function AlternativePractices({ emotion }: AlternativePracticesProps) {
  const { t } = useTranslation()
  const [affirmationIndex, setAffirmationIndex] = useState(0)
  const [relevantAffirmations, setRelevantAffirmations] = useState<Affirmation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch affirmations from API
  useEffect(() => {
    const fetchAffirmations = async () => {
      try {
        setLoading(true)
        const response = await EdgeFunctionService.getAffirmationsByEmotion(emotion.id)
        setRelevantAffirmations(response.data || [])
        setError(null)
      } catch (err) {
        setError('Failed to load affirmations')
        setRelevantAffirmations([])
      } finally {
        setLoading(false)
      }
    }

    fetchAffirmations()
  }, [emotion.id])

  const getNextAffirmation = () => {
    setAffirmationIndex((prev) => (prev + 1) % relevantAffirmations.length)
  }

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'gentle': return 'text-amber-700 bg-amber-100 border-amber-200 dark:text-amber-300 dark:bg-amber-900/30 dark:border-amber-700'
      case 'moderate': return 'text-orange-700 bg-orange-100 border-orange-200 dark:text-orange-300 dark:bg-orange-900/30 dark:border-orange-700'
      case 'strong': return 'text-yellow-700 bg-yellow-100 border-yellow-200 dark:text-yellow-300 dark:bg-yellow-900/30 dark:border-yellow-700'
      default: return 'text-amber-700 bg-amber-100 border-amber-200 dark:text-amber-300 dark:bg-amber-900/30 dark:border-amber-700'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50/40 to-yellow-50/60 dark:from-gray-900 dark:via-slate-900/90 dark:to-gray-800 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Affirmations Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold bg-gradient-to-r from-amber-900 via-orange-800 to-yellow-800 dark:from-amber-300 dark:via-orange-300 dark:to-yellow-300 bg-clip-text text-transparent font-traditional text-center">
              {t('alternativePractices.affirmations')}
            </h2>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="text-amber-600 dark:text-amber-300">
                  {t('alternativePractices.loading')}
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-600 dark:text-red-300">
                  {error}
                </div>
              </div>
            ) : relevantAffirmations.length > 0 ? (
              <div className="max-w-2xl mx-auto">
                <div className="card">
                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getIntensityColor(relevantAffirmations[affirmationIndex].intensity)}`}>
                        {t(`alternativePractices.intensity.${relevantAffirmations[affirmationIndex].intensity}`)}
                      </span>
                      <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-200 rounded-full text-sm">
                        {t(`alternativePractices.category.${relevantAffirmations[affirmationIndex].category}`)}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-amber-900 dark:text-amber-100 mb-4 font-traditional">
                      {relevantAffirmations[affirmationIndex].text}
                    </h3>
                    
                    <div className="text-sm text-amber-600 dark:text-amber-300">
                      {affirmationIndex + 1} {t('alternativePractices.of')} {relevantAffirmations.length}
                    </div>
                  </div>
                  
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={getNextAffirmation}
                      className="bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 hover:from-orange-700 hover:via-amber-700 hover:to-yellow-700 text-white font-medium py-2 px-6 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-[0_8px_32px_rgba(217,119,6,0.3)] hover:shadow-[0_16px_40px_rgba(217,119,6,0.4)]"
                    >
                      <IoRefresh className="w-4 h-4" />
                      {t('alternativePractices.nextAffirmation')}
                    </button>
                  </div>
                </div>
                
                <div className="grid gap-3 mt-6 md:grid-cols-2 lg:grid-cols-3">
                  {relevantAffirmations.map((affirmation, index) => (
                    <div
                      key={affirmation.id}
                      className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                        index === affirmationIndex
                          ? 'bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 border-amber-300 dark:border-amber-700'
                          : 'bg-white/60 dark:bg-gray-800/60 border-amber-200/60 dark:border-amber-700/60 hover:bg-white/80 dark:hover:bg-gray-800/80'
                      }`}
                      onClick={() => setAffirmationIndex(index)}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getIntensityColor(affirmation.intensity)}`}>
                          {t(`alternativePractices.intensity.${affirmation.intensity}`)}
                        </span>
                        <span className="text-xs text-amber-600 dark:text-amber-300">
                          {t(`alternativePractices.category.${affirmation.category}`)}
                        </span>
                      </div>
                      <p className="text-sm text-amber-800 dark:text-amber-200">
                        {affirmation.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-amber-600 dark:text-amber-300">
                  {t('alternativePractices.noAffirmationsAvailable')}
                </div>
              </div>
            )}
          </div>
      </div>
    </div>
  )
}
