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

interface Milestone {
  id: string
  title: string
  description: string
  achieved: boolean
  date?: string
  icon: string
  color: string
  bgColor: string
}

interface Insight {
  type: 'positive' | 'neutral' | 'encouraging'
  title: string
  message: string
  icon: string
}

interface GoalProgress {
  daily: {
    current: number
    goal: number
    percentage: number
  }
  weekly: {
    current: number
    goal: number
    percentage: number
  }
}

interface Challenge {
  id: string
  title: string
  description: string
  target: number
  current: number
  reward: string
  icon: string
  color: string
  progress: number
  isCompleted: boolean
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

      // Calculate milestones
      const milestones = calculateMilestones(sessions || [], allSessions || [])

      // Calculate insights
      const insights = calculateInsights(sessions || [])

      // Calculate goal progress
      const goalProgress = calculateGoalProgress(sessions || [])

      // Calculate challenges
      const challenges = calculateChallenges(stats, allSessions || [])

      return new Response(
        JSON.stringify({
          data: {
            milestones,
            insights,
            goalProgress,
            challenges,
            totalSessions: allSessions?.length || 0,
            totalRepetitions: allSessions?.reduce((sum, s) => sum + s.repetitions, 0) || 0,
            totalDuration: allSessions?.reduce((sum, s) => sum + s.duration_seconds, 0) || 0
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

function calculateMilestones(recentSessions: Session[], allSessions: any[]): Milestone[] {
  const milestones: Milestone[] = []
  const totalSessions = allSessions.length
  const totalRepetitions = allSessions.reduce((sum, session) => sum + session.repetitions, 0)
  const totalDuration = allSessions.reduce((sum, session) => sum + session.duration_seconds, 0)

  // Session milestones
  if (totalSessions >= 1) {
    milestones.push({
      id: 'first_session',
      title: 'First Steps',
      description: 'Completed your first meditation session',
      icon: '❤️',
      color: 'text-pink-500',
      bgColor: 'bg-pink-100 dark:bg-pink-900/30',
      achieved: true,
      date: allSessions[allSessions.length - 1]?.created_at
    })
  }

  if (totalSessions >= 10) {
    milestones.push({
      id: 'ten_sessions',
      title: 'Dedicated Practitioner',
      description: 'Completed 10 meditation sessions',
      icon: '🏅',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
      achieved: true,
      date: allSessions[Math.max(0, allSessions.length - 10)]?.created_at
    })
  }

  if (totalSessions >= 50) {
    milestones.push({
      id: 'fifty_sessions',
      title: 'Meditation Master',
      description: 'Completed 50 meditation sessions',
      icon: '🏆',
      color: 'text-purple-500',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      achieved: true,
      date: allSessions[Math.max(0, allSessions.length - 50)]?.created_at
    })
  }

  if (totalSessions >= 100) {
    milestones.push({
      id: 'century_club',
      title: 'Century Club',
      description: 'Completed 100 meditation sessions',
      icon: '💯',
      color: 'text-blue-500',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      achieved: true,
      date: allSessions[Math.max(0, allSessions.length - 100)]?.created_at
    })
  }

  // Repetition milestones
  if (totalRepetitions >= 1000) {
    milestones.push({
      id: 'thousand_reps',
      title: 'Thousand Repetitions',
      description: 'Completed 1,000 mantra repetitions',
      icon: '🎯',
      color: 'text-orange-500',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
      achieved: true,
      date: findMilestoneDate(allSessions, 1000, 'repetitions')
    })
  }

  if (totalRepetitions >= 10000) {
    milestones.push({
      id: 'ten_thousand_reps',
      title: 'Repetition Master',
      description: 'Completed 10,000 mantra repetitions',
      icon: '👑',
      color: 'text-red-500',
      bgColor: 'bg-red-100 dark:bg-red-900/30',
      achieved: true,
      date: findMilestoneDate(allSessions, 10000, 'repetitions')
    })
  }

  // Duration milestones
  const totalMinutes = Math.floor(totalDuration / 60)
  if (totalMinutes >= 60) {
    milestones.push({
      id: 'hour_meditation',
      title: 'Hour of Peace',
      description: 'Meditated for over 1 hour total',
      icon: '⏰',
      color: 'text-blue-500',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      achieved: true,
      date: findMilestoneDate(allSessions, 3600, 'duration_seconds')
    })
  }

  if (totalMinutes >= 600) { // 10 hours
    milestones.push({
      id: 'ten_hours',
      title: 'Deep Practitioner',
      description: 'Meditated for over 10 hours total',
      icon: '🧘‍♀️',
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
      achieved: true,
      date: findMilestoneDate(allSessions, 36000, 'duration_seconds')
    })
  }

  return milestones.sort((a, b) => new Date(b.date || '').getTime() - new Date(a.date || '').getTime())
}

function calculateInsights(sessions: Session[]): Insight[] {
  if (sessions.length === 0) return []

  const insights: Insight[] = []
  const totalSessions = sessions.length
  const totalDuration = sessions.reduce((sum, session) => sum + session.duration_seconds, 0)
  const avgDuration = totalDuration / totalSessions / 60 // in minutes

  // Duration insights
  if (avgDuration >= 20) {
    insights.push({
      type: 'positive',
      title: 'Deep Practice',
      message: `Your average session is ${Math.round(avgDuration)} minutes - you're developing deep focus!`,
      icon: '🧘‍♀️'
    })
  } else if (avgDuration >= 10) {
    insights.push({
      type: 'positive',
      title: 'Consistent Practice',
      message: `Your ${Math.round(avgDuration)}-minute sessions show great consistency.`,
      icon: '✨'
    })
  }

  // Frequency insights
  const daysWithSessions = new Set(sessions.map(s => new Date(s.created_at).toDateString())).size
  if (daysWithSessions >= 7) {
    insights.push({
      type: 'positive',
      title: 'Daily Dedication',
      message: `You've meditated on ${daysWithSessions} different days - excellent commitment!`,
      icon: '🌟'
    })
  }

  // Recent activity
  const lastSession = sessions[0]
  const daysSinceLastSession = Math.floor((Date.now() - new Date(lastSession.created_at).getTime()) / (1000 * 60 * 60 * 24))

  if (daysSinceLastSession === 0) {
    insights.push({
      type: 'positive',
      title: 'Today\'s Practice',
      message: 'You meditated today - keep the momentum going!',
      icon: '🎯'
    })
  } else if (daysSinceLastSession === 1) {
    insights.push({
      type: 'neutral',
      title: 'Yesterday\'s Practice',
      message: 'You meditated yesterday. Ready for today\'s session?',
      icon: '⏰'
    })
  } else if (daysSinceLastSession > 3) {
    insights.push({
      type: 'encouraging',
      title: 'Welcome Back',
      message: `It's been ${daysSinceLastSession} days since your last session. Your practice is waiting for you!`,
      icon: '🤗'
    })
  }

  return insights
}

function calculateGoalProgress(sessions: Session[]): GoalProgress {
  const today = new Date().toDateString()
  const todaySessions = sessions.filter(session => 
    new Date(session.created_at).toDateString() === today
  )
  const todayMinutes = Math.floor(todaySessions.reduce((sum, session) => sum + session.duration_seconds, 0) / 60)

  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - weekStart.getDay())
  const weekSessions = sessions.filter(session => 
    new Date(session.created_at) >= weekStart
  )
  const weekMinutes = Math.floor(weekSessions.reduce((sum, session) => sum + session.duration_seconds, 0) / 60)

  // Default goals (these should come from user preferences in a real app)
  const dailyGoal = 10
  const weeklyGoal = 70

  return {
    daily: {
      current: todayMinutes,
      goal: dailyGoal,
      percentage: Math.min((todayMinutes / dailyGoal) * 100, 100)
    },
    weekly: {
      current: weekMinutes,
      goal: weeklyGoal,
      percentage: Math.min((weekMinutes / weeklyGoal) * 100, 100)
    }
  }
}

function calculateChallenges(stats: any, allSessions: any[]): Challenge[] {
  const challenges: Challenge[] = [
    {
      id: '7_day_streak',
      title: 'Week Warrior',
      description: 'Meditate for 7 consecutive days',
      target: 7,
      current: stats?.current_streak || 0,
      reward: 'Unlock the "Week Warrior" badge',
      icon: '🔥',
      color: 'from-orange-500 to-red-500',
      progress: Math.min(((stats?.current_streak || 0) / 7) * 100, 100),
      isCompleted: (stats?.current_streak || 0) >= 7
    },
    {
      id: '30_day_streak',
      title: 'Monthly Master',
      description: 'Meditate for 30 consecutive days',
      target: 30,
      current: stats?.current_streak || 0,
      reward: 'Unlock the "Monthly Master" badge',
      icon: '👑',
      color: 'from-purple-500 to-pink-500',
      progress: Math.min(((stats?.current_streak || 0) / 30) * 100, 100),
      isCompleted: (stats?.current_streak || 0) >= 30
    },
    {
      id: '100_sessions',
      title: 'Century Club',
      description: 'Complete 100 meditation sessions',
      target: 100,
      current: allSessions.length,
      reward: 'Unlock the "Century Club" badge',
      icon: '💯',
      color: 'from-blue-500 to-cyan-500',
      progress: Math.min((allSessions.length / 100) * 100, 100),
      isCompleted: allSessions.length >= 100
    }
  ]

  return challenges
}

function findMilestoneDate(sessions: any[], target: number, field: string): string {
  let cumulative = 0
  for (let i = sessions.length - 1; i >= 0; i--) {
    cumulative += sessions[i][field]
    if (cumulative >= target) {
      return sessions[i].created_at
    }
  }
  return sessions[0]?.created_at || new Date().toISOString()
}
