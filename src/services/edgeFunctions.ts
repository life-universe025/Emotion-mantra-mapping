import { supabase } from '../lib/supabase'

const FUNCTIONS_URL =
  import.meta.env.VITE_FUNCTIONS_URL || `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`

export class EdgeFunctionService {
  // GET /mantras?emotion=ANXIETY
  static async getMantras(emotion?: string) {
    const url = emotion
      ? `${FUNCTIONS_URL}/mantras?emotion=${emotion}`
      : `${FUNCTIONS_URL}/mantras`

    // Attach JWT if available (function requires auth)
    const { data: { session } } = await supabase.auth.getSession()

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(session ? { 'Authorization': `Bearer ${session.access_token}` } : {}),
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  }

  // GET /mantras/:id
  static async getMantraById(id: number) {
    const { data: { session } } = await supabase.auth.getSession()

    const response = await fetch(`${FUNCTIONS_URL}/mantras/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(session ? { 'Authorization': `Bearer ${session.access_token}` } : {}),
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  }

  // POST /sessions
  static async createSession(sessionData: {
    mantra_id: number
    repetitions: number
    duration_seconds: number
    notes?: string
    breathing_pattern?: string
    breathing_cycles?: number
    breathing_duration_seconds?: number
    before_mood?: number
    after_mood?: number
    mood_improvement?: number
  }) {
    // Get the current session to include auth token
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      throw new Error('User not authenticated')
    }

    const response = await fetch(`${FUNCTIONS_URL}/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(sessionData),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  }

  // GET /users/:id/stats
  static async getUserStats(userId: string) {
    // Get the current session to include auth token
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      throw new Error('User not authenticated')
    }

    const response = await fetch(`${FUNCTIONS_URL}/user-stats/users/${userId}/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  }

  // GET /users/:id/analytics
  static async getProfileAnalytics(userId: string) {
    // Get the current session to include auth token
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      throw new Error('User not authenticated')
    }

    const response = await fetch(`${FUNCTIONS_URL}/profile-analytics/users/${userId}/analytics`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  }
}

// Usage examples:
/*
// Get all mantras
const mantras = await EdgeFunctionService.getMantras()

// Get mantras for anxiety
const anxietyMantras = await EdgeFunctionService.getMantras('ANXIETY')

// Get specific mantra
const mantra = await EdgeFunctionService.getMantraById(1)

// Create session
const session = await EdgeFunctionService.createSession({
  mantra_id: 1,
  repetitions: 108,
  duration_seconds: 1800,
  notes: 'Felt very peaceful'
})

// Get user stats
const stats = await EdgeFunctionService.getUserStats('user-id-here')
*/
