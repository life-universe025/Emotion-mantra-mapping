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

  // Analytics
  static async getUserAnalytics(userId: string) {
    // Get total sessions
    const { count: totalSessions } = await supabase
      .from('sessions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    // Get sessions this week
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    
    const { count: weeklySessions } = await supabase
      .from('sessions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', weekAgo.toISOString())

    // Get most used mantras
    const { data: mantraUsage } = await supabase
      .from('sessions')
      .select(`
        mantra_id,
        mantras (
          transliteration,
          devanagari
        )
      `)
      .eq('user_id', userId)

    // Count mantra usage
    const mantraCounts = mantraUsage?.reduce((acc: any, session: any) => {
      const mantraId = session.mantra_id
      acc[mantraId] = (acc[mantraId] || 0) + 1
      return acc
    }, {})

    const topMantras = Object.entries(mantraCounts || {})
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([mantraId, count]) => ({
        mantraId: parseInt(mantraId),
        count: count as number,
        mantra: mantraUsage?.find((s: any) => s.mantra_id === parseInt(mantraId))?.mantras
      }))

    return {
      totalSessions: totalSessions || 0,
      weeklySessions: weeklySessions || 0,
      topMantras
    }
  }
}
