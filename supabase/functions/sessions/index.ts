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

    // POST /sessions
    if (req.method === 'POST') {
      const body = await req.json()
      const { mantra_id, repetitions, duration_seconds, notes } = body

      // Validate required fields
      if (!mantra_id || !repetitions || !duration_seconds) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields: mantra_id, repetitions, duration_seconds' }),
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
          notes: notes || null
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
