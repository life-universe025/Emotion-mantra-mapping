import { useState } from 'react'
import { Heart, Send } from 'lucide-react'
import { Mantra, Emotion } from '../types'
import { SupabaseService } from '../services/supabase'
import { EdgeFunctionService } from '../services/edgeFunctions'

interface ReflectionModalProps {
  mantra: Mantra
  emotion: Emotion
  sessionData: {
    repetitions: number
    duration: number
  }
  onComplete: () => void
}

export function ReflectionModal({ 
  mantra, 
  emotion, 
  sessionData, 
  onComplete 
}: ReflectionModalProps) {
  const [reflection, setReflection] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      // Get current user
      const { data: { user }, error: userError } = await SupabaseService.getCurrentUser()
      
      if (userError || !user) {
        console.error('User not authenticated:', userError)
        // For demo purposes, continue without saving
        onComplete()
        return
      }

      // Save session via Edge Function (enforces auth + trigger updates stats)
      try {
        await EdgeFunctionService.createSession({
          mantra_id: mantra.id,
          repetitions: sessionData.repetitions,
          duration_seconds: sessionData.duration,
          notes: reflection.trim() || undefined
        })
        console.log('Session saved successfully')
      } catch (e) {
        console.error('Error saving session via edge function:', e)
      }
      
      onComplete()
    } catch (error) {
      console.error('Error saving reflection:', error)
      // Still complete the flow even if saving fails
      onComplete()
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Practice Complete!
            </h2>
            <p className="text-gray-600">
              Take a moment to reflect on your experience
            </p>
          </div>

          {/* Session summary */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Your Practice</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Mantra:</span>
                <span className="font-medium">{mantra.transliteration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Emotion:</span>
                <span className="font-medium">{emotion.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Repetitions:</span>
                <span className="font-medium">{sessionData.repetitions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">{formatTime(sessionData.duration)}</span>
              </div>
            </div>
          </div>

          {/* Reflection form */}
          <div className="mb-6">
            <label htmlFor="reflection" className="block text-sm font-medium text-gray-700 mb-2">
              How do you feel now?
            </label>
            <textarea
              id="reflection"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="Share your thoughts, feelings, or insights from this practice..."
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              rows={4}
            />
            <p className="text-xs text-gray-500 mt-1">
              Optional: Your reflection is private and helps track your journey
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onComplete}
              className="flex-1 btn-secondary"
              disabled={isSubmitting}
            >
              Skip Reflection
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 btn-primary flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
              <span>Save & Continue</span>
            </button>
          </div>

          {/* Encouragement */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Great work! Every practice brings you closer to inner peace.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
