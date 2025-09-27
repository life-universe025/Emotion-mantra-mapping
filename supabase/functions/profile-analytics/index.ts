import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Session {
  id: number
  repetitions: number
  duration_seconds: number
  created_at: string
  notes?: string
  mantras: {
    transliteration: string
    devanagari: string
    meaning: string
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const url = new URL(req.url)
    const path = url.pathname

    // GET /profile-analytics/users/:id/analytics
    if (path.startsWith('/profile-analytics/users/') && path.endsWith('/analytics') && req.method === 'GET') {
      const userId = path.split('/')[3]
      
      if (!userId) {
        return new Response(
          JSON.stringify({ error: 'User ID is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Verify user access
      const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
      
      if (authError || !user || user.id !== userId) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Get user stats
      const { data: stats } = await supabaseClient
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .single()

      // Get recent sessions (last 50 for better calculations)
      const { data: sessions } = await supabaseClient
        .from('sessions')
        .select(`
          id,
          repetitions,
          duration_seconds,
          created_at,
          notes,
          mantras (
            transliteration,
            devanagari,
            meaning
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50)

      // Get all sessions for total counts
      const { data: allSessions } = await supabaseClient
        .from('sessions')
        .select('id, repetitions, duration_seconds, created_at')
        .eq('user_id', userId)

      return new Response(
        JSON.stringify({
          data: {
            totalSessions: allSessions?.length || 0,
            totalRepetitions: allSessions?.reduce((sum, s) => sum + s.repetitions, 0) || 0,
            totalDuration: allSessions?.reduce((sum, s) => sum + s.duration_seconds, 0) || 0
          }
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // GET /profile-analytics/users/:id/all-data
    if (path.startsWith('/profile-analytics/users/') && path.endsWith('/all-data') && req.method === 'GET') {
      const userId = path.split('/')[3]
      
      if (!userId) {
        return new Response(
          JSON.stringify({ error: 'User ID is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Verify user access
      const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
      
      if (authError || !user || user.id !== userId) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Get user stats
      const { data: userStats } = await supabaseClient
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .single()

      // Get all session data for analytics and charts (last 90 days)
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - 90)
      
      const { data: sessions } = await supabaseClient
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

      // Generate chart data
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
      sessions?.forEach(session => {
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
      
      sessions?.forEach(session => {
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

      return new Response(
        JSON.stringify({
          data: {
            userStats: userStats || null,
            analytics: {
              totalSessions,
              weeklySessions,
              topMantras
            },
            recentSessions,
            chartData: {
              daily: dailyChartData,
              weekly: weeklyChartData
            }
          }
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // GET /profile-analytics/users/:id/daily-history
    if (path.startsWith('/profile-analytics/users/') && path.endsWith('/daily-history') && req.method === 'GET') {
      const userId = path.split('/')[3]
      const days = parseInt(searchParams.get('days') || '30')
      
      if (!userId) {
        return new Response(
          JSON.stringify({ error: 'User ID is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Verify user access
      const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
      
      if (authError || !user || user.id !== userId) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)
      
      const { data: sessions } = await supabaseClient
        .from('sessions')
        .select('created_at, repetitions, duration_seconds')
        .eq('user_id', userId)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true })

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
      sessions?.forEach(session => {
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

      return new Response(
        JSON.stringify({ data: chartData }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // GET /profile-analytics/users/:id/weekly-history
    if (path.startsWith('/profile-analytics/users/') && path.endsWith('/weekly-history') && req.method === 'GET') {
      const userId = path.split('/')[3]
      const weeks = parseInt(searchParams.get('weeks') || '12')
      
      if (!userId) {
        return new Response(
          JSON.stringify({ error: 'User ID is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Verify user access
      const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
      
      if (authError || !user || user.id !== userId) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const startDate = new Date()
      startDate.setDate(startDate.getDate() - (weeks * 7))
      
      const { data: sessions } = await supabaseClient
        .from('sessions')
        .select('created_at, repetitions, duration_seconds')
        .eq('user_id', userId)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true })

      // Group sessions by week
      const weeklyData: { [key: string]: { sessions: number, repetitions: number, duration: number } } = {}
      
      sessions?.forEach(session => {
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

      return new Response(
        JSON.stringify({ data: chartData }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // GET /profile-analytics/users/:id/streak-history
    if (path.startsWith('/profile-analytics/users/') && path.endsWith('/streak-history') && req.method === 'GET') {
      const userId = path.split('/')[3]
      
      if (!userId) {
        return new Response(
          JSON.stringify({ error: 'User ID is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Verify user access
      const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
      
      if (authError || !user || user.id !== userId) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const { data: sessions } = await supabaseClient
        .from('sessions')
        .select('created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: true })

      if (!sessions || sessions.length === 0) {
        return new Response(
          JSON.stringify({ 
            data: { 
              streaks: [], 
              currentStreak: 0, 
              longestStreak: 0 
            } 
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Calculate streaks
      const practiceDays = [...new Set(sessions.map(session => session.created_at.split('T')[0]))]
      practiceDays.sort()

      let streaks = []
      let currentStreak = 1
      let longestStreak = 1
      let streakStart = practiceDays[0]

      for (let i = 1; i < practiceDays.length; i++) {
        const prevDate = new Date(practiceDays[i - 1])
        const currDate = new Date(practiceDays[i])
        const daysDiff = (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)

        if (daysDiff === 1) {
          // Consecutive day
          currentStreak++
        } else {
          // End of streak
          streaks.push({
            start: streakStart,
            end: practiceDays[i - 1],
            length: currentStreak
          })
          longestStreak = Math.max(longestStreak, currentStreak)
          currentStreak = 1
          streakStart = practiceDays[i]
        }
      }

      // Add the final streak
      streaks.push({
        start: streakStart,
        end: practiceDays[practiceDays.length - 1],
        length: currentStreak
      })
      longestStreak = Math.max(longestStreak, currentStreak)

      // Check if current streak is ongoing (practiced today or yesterday)
      const today = new Date().toISOString().split('T')[0]
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      const lastPractice = practiceDays[practiceDays.length - 1]
      const isCurrentStreak = lastPractice === today || lastPractice === yesterday

      return new Response(
        JSON.stringify({ 
          data: {
            streaks,
            currentStreak: isCurrentStreak ? currentStreak : 0,
            longestStreak
          }
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})