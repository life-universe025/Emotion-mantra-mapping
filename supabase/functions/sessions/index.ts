import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const path = url.pathname
    const searchParams = url.searchParams

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the current user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // GET /sessions/users/:id/sessions
    if (path.startsWith('/sessions/users/') && path.endsWith('/sessions') && req.method === 'GET') {
      const userId = path.split('/')[3]
      
      if (!userId) {
        return new Response(
          JSON.stringify({ error: 'User ID is required' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // Verify user access
      if (user.id !== userId) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized' }),
          { 
            status: 401, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      const limit = parseInt(searchParams.get('limit') || '50')
      
      const { data: sessions, error: sessionsError } = await supabaseClient
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

      if (sessionsError) {
        return new Response(
          JSON.stringify({ error: sessionsError.message }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      return new Response(
        JSON.stringify({ data: sessions }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // POST /sessions
    if (req.method === 'POST') {
      const body = await req.json()
      const { 
        mantra_id, 
        repetitions, 
        duration_seconds, 
        notes, 
        before_mood,
        after_mood,
        mood_improvement
      } = body

      // Validate required fields
      if (!mantra_id) {
        return new Response(
          JSON.stringify({ error: 'Missing required field: mantra_id' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // Allow mood-only sessions (repetitions and duration can be 0 if mood data is provided)
      if (repetitions === undefined || duration_seconds === undefined) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields: repetitions, duration_seconds' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // If no mood data is provided, require at least some practice
      if (!before_mood && !after_mood && (repetitions === 0 && duration_seconds === 0)) {
        return new Response(
          JSON.stringify({ error: 'Either practice data (repetitions/duration) or mood data must be provided' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // Validate mood data if provided
      if (before_mood !== undefined && (before_mood < 1 || before_mood > 10)) {
        return new Response(
          JSON.stringify({ error: 'before_mood must be between 1 and 10' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      if (after_mood !== undefined && (after_mood < 1 || after_mood > 10)) {
        return new Response(
          JSON.stringify({ error: 'after_mood must be between 1 and 10' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // Create session
      const { data: session, error: sessionError } = await supabaseClient
        .from('sessions')
        .insert([{
          user_id: user.id,
          mantra_id,
          repetitions,
          duration_seconds,
          notes: notes || null,
          before_mood: before_mood || null,
          after_mood: after_mood || null,
          mood_improvement: mood_improvement || null
        }])
        .select()
        .single()

      if (sessionError) {
        return new Response(
          JSON.stringify({ error: sessionError.message }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // The trigger will automatically update user stats
      // Let's also fetch the updated stats to return
      const { data: stats } = await supabaseClient
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single()

      return new Response(
        JSON.stringify({ 
          data: session,
          stats: stats
        }),
        { 
          status: 201, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
