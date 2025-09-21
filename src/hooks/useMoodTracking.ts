import { useState, useCallback } from 'react'
import { MoodEntry, SessionMoodData } from '../types'

interface UseMoodTrackingReturn {
  beforeMood: MoodEntry | undefined
  afterMood: MoodEntry | undefined
  moodData: SessionMoodData
  setBeforeMood: (mood: MoodEntry) => void
  setAfterMood: (mood: MoodEntry) => void
  clearMoods: () => void
  calculateImprovement: () => number | null
}

export function useMoodTracking(): UseMoodTrackingReturn {
  const [beforeMood, setBeforeMood] = useState<MoodEntry | undefined>(undefined)
  const [afterMood, setAfterMood] = useState<MoodEntry | undefined>(undefined)

  const calculateImprovement = useCallback((): number | null => {
    if (!beforeMood || !afterMood) return null
    return afterMood.value - beforeMood.value
  }, [beforeMood, afterMood])

  const clearMoods = useCallback(() => {
    setBeforeMood(undefined)
    setAfterMood(undefined)
  }, [])

  const moodData: SessionMoodData = {
    before_mood: beforeMood || undefined,
    after_mood: afterMood || undefined,
    mood_improvement: calculateImprovement() || undefined
  }

  return {
    beforeMood,
    afterMood,
    moodData,
    setBeforeMood,
    setAfterMood,
    clearMoods,
    calculateImprovement
  }
}
