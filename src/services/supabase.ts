import { supabase } from '../lib/supabase'
import { Session, UserStats } from '../types'

export class SupabaseService {
  // Authentication
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

  // Mantras
  static async getMantras() {
    const { data, error } = await supabase
      .from('mantras')
      .select('*')
      .order('created_at', { ascending: true })
    
    return { data, error }
  }

  static async getMantrasByEmotion(emotion: string) {
    const { data, error } = await supabase
      .from('mantras')
      .select('*')
      .contains('emotions', [emotion])
    
    return { data, error }
  }

  static async getMantraById(id: number) {
    const { data, error } = await supabase
      .from('mantras')
      .select('*')
      .eq('id', id)
      .single()
    
    return { data, error }
  }

  // Sessions
  static async createSession(session: Omit<Session, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('sessions')
      .insert([session])
      .select()
      .single()
    
    return { data, error }
  }

  static async getUserSessions(userId: string, limit = 50) {
    const { data, error } = await supabase
      .from('sessions')
      .select(`
        *,
        mantras (
          transliteration,
          devanagari,
          meaning
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)
    
    return { data, error }
  }

  // User Stats
  static async getUserStats(userId: string) {
    const { data, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    return { data, error }
  }

  static async createUserStats(userStats: Omit<UserStats, 'user_id'>) {
    const { data, error } = await supabase
      .from('user_stats')
      .insert([userStats])
      .select()
      .single()
    
    return { data, error }
  }

  static async updateUserStats(userId: string, updates: Partial<UserStats>) {
    const { data, error } = await supabase
      .from('user_stats')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single()
    
    return { data, error }
  }

  // Analytics - Consolidated method to reduce API calls
  static async getUserAnalytics(userId: string) {
    // Single query to get all session data with mantra info
    const { data: sessions, error } = await supabase
      .from('sessions')
      .select(`
        created_at,
        mantra_id,
        mantras (
          transliteration,
          devanagari
        )
      `)
      .eq('user_id', userId)

    if (error) {
      console.error('Error fetching user analytics:', error)
      return {
        totalSessions: 0,
        weeklySessions: 0,
        topMantras: []
      }
    }

    const totalSessions = sessions?.length || 0

    // Calculate weekly sessions
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    const weeklySessions = sessions?.filter(session => 
      new Date(session.created_at) >= weekAgo
    ).length || 0

    // Count mantra usage
    const mantraCounts = sessions?.reduce((acc: any, session: any) => {
      const mantraId = session.mantra_id
      acc[mantraId] = (acc[mantraId] || 0) + 1
      return acc
    }, {})

    // Get top 5 mantras
    const topMantras = Object.entries(mantraCounts || {})
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([mantraId, count]) => ({
        mantraId: parseInt(mantraId),
        count: count as number,
        mantra: sessions?.find((s: any) => s.mantra_id === parseInt(mantraId))?.mantras
      }))

    return {
      totalSessions,
      weeklySessions,
      topMantras
    }
  }

  // Consolidated method to get all user data in one go (reduces API calls)
  static async getAllUserData(userId: string) {
    try {
      // Get user stats from user_stats table
      const { data: userStats, error: statsError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (statsError && statsError.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error fetching user stats:', statsError)
      }

      // Get all session data for analytics and charts (last 90 days for comprehensive data)
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - 90)
      
      const { data: sessions, error: sessionsError } = await supabase
        .from('sessions')
        .select(`
          id,
          created_at,
          repetitions,
          duration_seconds,
          mantra_id,
          mantras (
            transliteration,
            devanagari,
            meaning
          )
        `)
        .eq('user_id', userId)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false })

      if (sessionsError) {
        console.error('Error fetching sessions:', sessionsError)
        return {
          userStats: userStats || null,
          analytics: {
            totalSessions: 0,
            weeklySessions: 0,
            topMantras: []
          },
          recentSessions: [],
          chartData: {
            daily: [],
            weekly: []
          }
        }
      }

      // Calculate analytics from session data
      const totalSessions = sessions?.length || 0
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      const weeklySessions = sessions?.filter(session => 
        new Date(session.created_at) >= weekAgo
      ).length || 0

      // Count mantra usage
      const mantraCounts = sessions?.reduce((acc: any, session: any) => {
        const mantraId = session.mantra_id
        acc[mantraId] = (acc[mantraId] || 0) + 1
        return acc
      }, {})

      // Get top 5 mantras
      const topMantras = Object.entries(mantraCounts || {})
        .sort(([,a], [,b]) => (b as number) - (a as number))
        .slice(0, 5)
        .map(([mantraId, count]) => ({
          mantraId: parseInt(mantraId),
          count: count as number,
          mantra: sessions?.find((s: any) => s.mantra_id === parseInt(mantraId))?.mantras
        }))

      // Get recent sessions (first 10)
      const recentSessions = sessions?.slice(0, 10) || []

      // Generate chart data from the same session data
      const chartData = this.generateChartDataFromSessions(sessions || [])

      return {
        userStats: userStats || null,
        analytics: {
          totalSessions,
          weeklySessions,
          topMantras
        },
        recentSessions,
        chartData
      }
    } catch (error) {
      console.error('Error in getAllUserData:', error)
      return {
        userStats: null,
        analytics: {
          totalSessions: 0,
          weeklySessions: 0,
          topMantras: []
        },
        recentSessions: [],
        chartData: {
          daily: [],
          weekly: []
        }
      }
    }
  }

  // Helper method to generate chart data from session data
  private static generateChartDataFromSessions(sessions: any[]) {
    // Daily chart data (last 30 days)
    const dailyData: { [key: string]: { sessions: number, repetitions: number, duration: number } } = {}
    const days = 30
    
    // Initialize all dates with zero values
    for (let i = 0; i < days; i++) {
      const date = new Date()
      date.setDate(date.getDate() - days + i + 1)
      const dateKey = date.toISOString().split('T')[0]
      dailyData[dateKey] = { sessions: 0, repetitions: 0, duration: 0 }
    }

    // Populate with actual data
    sessions.forEach(session => {
      const dateKey = session.created_at.split('T')[0]
      if (dailyData[dateKey]) {
        dailyData[dateKey].sessions += 1
        dailyData[dateKey].repetitions += session.repetitions
        dailyData[dateKey].duration += session.duration_seconds
      }
    })

    // Convert to array format for charts
    const dailyChartData = Object.entries(dailyData).map(([date, stats]) => ({
      date,
      sessions: stats.sessions,
      repetitions: stats.repetitions,
      duration: Math.round(stats.duration / 60), // Convert to minutes
      dateLabel: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }))

    // Weekly chart data (last 12 weeks)
    const weeklyData: { [key: string]: { sessions: number, repetitions: number, duration: number } } = {}
    
    sessions.forEach(session => {
      const sessionDate = new Date(session.created_at)
      const weekStart = new Date(sessionDate)
      weekStart.setDate(sessionDate.getDate() - sessionDate.getDay()) // Start of week (Sunday)
      const weekKey = weekStart.toISOString().split('T')[0]
      
      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = { sessions: 0, repetitions: 0, duration: 0 }
      }
      
      weeklyData[weekKey].sessions += 1
      weeklyData[weekKey].repetitions += session.repetitions
      weeklyData[weekKey].duration += session.duration_seconds
    })

    // Convert to array format for charts
    const weeklyChartData = Object.entries(weeklyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([weekStart, stats]) => ({
        week: weekStart,
        sessions: stats.sessions,
        repetitions: stats.repetitions,
        duration: Math.round(stats.duration / 60), // Convert to minutes
        weekLabel: `Week of ${new Date(weekStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
      }))

    return {
      daily: dailyChartData,
      weekly: weeklyChartData
    }
  }

  // Practice History for Charts
  static async getDailyPracticeHistory(userId: string, days = 30) {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    
    const { data, error } = await supabase
      .from('sessions')
      .select('created_at, repetitions, duration_seconds')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true })

    if (error) return { data: [], error }

    // Group sessions by date
    const dailyData: { [key: string]: { sessions: number, repetitions: number, duration: number } } = {}
    
    // Initialize all dates with zero values
    for (let i = 0; i < days; i++) {
      const date = new Date()
      date.setDate(date.getDate() - days + i + 1)
      const dateKey = date.toISOString().split('T')[0]
      dailyData[dateKey] = { sessions: 0, repetitions: 0, duration: 0 }
    }

    // Populate with actual data
    data?.forEach(session => {
      const dateKey = session.created_at.split('T')[0]
      if (dailyData[dateKey]) {
        dailyData[dateKey].sessions += 1
        dailyData[dateKey].repetitions += session.repetitions
        dailyData[dateKey].duration += session.duration_seconds
      }
    })

    // Convert to array format for charts
    const chartData = Object.entries(dailyData).map(([date, stats]) => ({
      date,
      sessions: stats.sessions,
      repetitions: stats.repetitions,
      duration: Math.round(stats.duration / 60), // Convert to minutes
      dateLabel: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }))

    return { data: chartData, error: null }
  }

  static async getWeeklyPracticeHistory(userId: string, weeks = 12) {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - (weeks * 7))
    
    const { data, error } = await supabase
      .from('sessions')
      .select('created_at, repetitions, duration_seconds')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true })

    if (error) return { data: [], error }

    // Group sessions by week
    const weeklyData: { [key: string]: { sessions: number, repetitions: number, duration: number } } = {}
    
    data?.forEach(session => {
      const sessionDate = new Date(session.created_at)
      const weekStart = new Date(sessionDate)
      weekStart.setDate(sessionDate.getDate() - sessionDate.getDay()) // Start of week (Sunday)
      const weekKey = weekStart.toISOString().split('T')[0]
      
      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = { sessions: 0, repetitions: 0, duration: 0 }
      }
      
      weeklyData[weekKey].sessions += 1
      weeklyData[weekKey].repetitions += session.repetitions
      weeklyData[weekKey].duration += session.duration_seconds
    })

    // Convert to array format for charts
    const chartData = Object.entries(weeklyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([weekStart, stats]) => ({
        week: weekStart,
        sessions: stats.sessions,
        repetitions: stats.repetitions,
        duration: Math.round(stats.duration / 60), // Convert to minutes
        weekLabel: `Week of ${new Date(weekStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
      }))

    return { data: chartData, error: null }
  }

  static async getStreakHistory(userId: string) {
    const { data, error } = await supabase
      .from('sessions')
      .select('created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })

    if (error) return { streaks: [], currentStreak: 0, longestStreak: 0, error }

    if (!data || data.length === 0) {
      return { streaks: [], currentStreak: 0, longestStreak: 0, error: null }
    }

    // Calculate streaks
    const practicedays = [...new Set(data.map(session => session.created_at.split('T')[0]))]
    practicedays.sort()

    let streaks = []
    let currentStreak = 1
    let longestStreak = 1
    let streakStart = practicedays[0]

    for (let i = 1; i < practicedays.length; i++) {
      const prevDate = new Date(practicedays[i - 1])
      const currDate = new Date(practicedays[i])
      const daysDiff = (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)

      if (daysDiff === 1) {
        // Consecutive day
        currentStreak++
      } else {
        // End of streak
        streaks.push({
          start: streakStart,
          end: practicedays[i - 1],
          length: currentStreak
        })
        longestStreak = Math.max(longestStreak, currentStreak)
        currentStreak = 1
        streakStart = practicedays[i]
      }
    }

    // Add the final streak
    streaks.push({
      start: streakStart,
      end: practicedays[practicedays.length - 1],
      length: currentStreak
    })
    longestStreak = Math.max(longestStreak, currentStreak)

    // Check if current streak is ongoing (practiced today or yesterday)
    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const lastPractice = practicedays[practicedays.length - 1]
    const isCurrentStreak = lastPractice === today || lastPractice === yesterday

    return {
      streaks,
      currentStreak: isCurrentStreak ? currentStreak : 0,
      longestStreak,
      error: null
    }
  }

  // Custom repetition goals
  static async setCustomRepetitionGoal(userId: string, goal: number) {
    try {
      const { data, error } = await supabase
        .from('user_stats')
        .upsert({
          user_id: userId,
          custom_repetition_goal: goal,
          goal_set_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        })
        .select()
        .single()

      if (error) {
        console.error('Error setting custom repetition goal:', error)
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      console.error('Error setting custom repetition goal:', error)
      return { success: false, error: 'Failed to set custom repetition goal' }
    }
  }

  static async getCustomRepetitionGoal(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_stats')
        .select('custom_repetition_goal, goal_set_at')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error fetching custom repetition goal:', error)
        return { success: false, error: error.message }
      }

      return { 
        success: true, 
        goal: data?.custom_repetition_goal || null,
        goalSetAt: data?.goal_set_at || null
      }
    } catch (error) {
      console.error('Error fetching custom repetition goal:', error)
      return { success: false, error: 'Failed to fetch custom repetition goal' }
    }
  }

  static async clearCustomRepetitionGoal(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_stats')
        .update({
          custom_repetition_goal: null,
          goal_set_at: null,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single()

      if (error) {
        console.error('Error clearing custom repetition goal:', error)
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      console.error('Error clearing custom repetition goal:', error)
      return { success: false, error: 'Failed to clear custom repetition goal' }
    }
  }
}
