import { supabase } from '../lib/supabase'

const FUNCTIONS_URL =
  import.meta.env.VITE_FUNCTIONS_URL || `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`

export class EdgeFunctionService {
  // Authentication methods (keep using direct Supabase client for auth)
  static async signInWithEmail(email: string) {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    })
    return { data, error }
  }

  static async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    })
    return { data, error }
  }

  static async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  static getCurrentUser() {
    return supabase.auth.getUser()
  }


  // Mantra methods
  static async getMantras(emotion?: string) {
    // Add cache-busting parameter to force fresh API call
    const cacheBuster = `t=${Date.now()}`
    const baseUrl = emotion
      ? `${FUNCTIONS_URL}/mantras?emotion=${emotion}`
      : `${FUNCTIONS_URL}/mantras`
    const url = `${baseUrl}${emotion ? '&' : '?'}${cacheBuster}`

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

  static async getMantrasByEmotion(emotion: string) {
    return this.getMantras(emotion)
  }

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

  // Affirmations methods
  static async getAffirmations(emotion?: string, intensity?: string, category?: string) {
    // Add cache-busting parameter to force fresh API call
    const cacheBuster = `t=${Date.now()}`
    const params = new URLSearchParams()
    if (emotion) params.append('emotion', emotion)
    if (intensity) params.append('intensity', intensity)
    if (category) params.append('category', category)
    params.append('cache', cacheBuster)
    
    const url = `${FUNCTIONS_URL}/affirmations?${params.toString()}`

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

  static async getAffirmationsByEmotion(emotion: string) {
    return this.getAffirmations(emotion)
  }

  static async getAffirmationById(id: number) {
    const { data: { session } } = await supabase.auth.getSession()

    const response = await fetch(`${FUNCTIONS_URL}/affirmations/${id}`, {
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


  // Session methods
  static async createSession(sessionData: {
    mantra_id: number
    repetitions: number
    duration_seconds: number
    notes?: string
    before_mood?: number
    after_mood?: number
    mood_improvement?: number
  }) {
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

  // User stats methods
  static async getUserStats(userId: string) {
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

  // Analytics methods
  static async getProfileAnalytics(userId: string) {
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

  // Additional methods that need edge function implementations
  static async getUserSessions(userId: string, limit = 50) {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      throw new Error('User not authenticated')
    }

    const response = await fetch(`${FUNCTIONS_URL}/sessions/users/${userId}/sessions?limit=${limit}`, {
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

  static async createUserStats(userStats: any) {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      throw new Error('User not authenticated')
    }

    const response = await fetch(`${FUNCTIONS_URL}/user-stats/users/${session.user.id}/stats`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(userStats),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  }

  static async updateUserStats(userId: string, updates: any) {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      throw new Error('User not authenticated')
    }

    const response = await fetch(`${FUNCTIONS_URL}/user-stats/users/${userId}/stats`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(updates),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  }

  static async getUserAnalytics(userId: string) {
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

  static async getAllUserData(userId: string) {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      throw new Error('User not authenticated')
    }

    const response = await fetch(`${FUNCTIONS_URL}/profile-analytics/users/${userId}/all-data`, {
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

  static async getDailyPracticeHistory(userId: string, days = 30) {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      throw new Error('User not authenticated')
    }

    const response = await fetch(`${FUNCTIONS_URL}/profile-analytics/users/${userId}/daily-history?days=${days}`, {
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

  static async getWeeklyPracticeHistory(userId: string, weeks = 12) {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      throw new Error('User not authenticated')
    }

    const response = await fetch(`${FUNCTIONS_URL}/profile-analytics/users/${userId}/weekly-history?weeks=${weeks}`, {
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

  static async getStreakHistory(userId: string) {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      throw new Error('User not authenticated')
    }

    const response = await fetch(`${FUNCTIONS_URL}/profile-analytics/users/${userId}/streak-history`, {
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

  static async setCustomRepetitionGoal(userId: string, goal: number) {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      throw new Error('User not authenticated')
    }

    const response = await fetch(`${FUNCTIONS_URL}/user-stats/users/${userId}/custom-goal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ goal }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  }

  static async getCustomRepetitionGoal(userId: string) {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      throw new Error('User not authenticated')
    }

    const response = await fetch(`${FUNCTIONS_URL}/user-stats/users/${userId}/custom-goal`, {
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

  static async clearCustomRepetitionGoal(userId: string) {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      throw new Error('User not authenticated')
    }

    const response = await fetch(`${FUNCTIONS_URL}/user-stats/users/${userId}/custom-goal`, {
      method: 'DELETE',
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
