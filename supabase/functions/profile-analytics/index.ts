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