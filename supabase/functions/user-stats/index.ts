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

    const url = new URL(req.url)
    const path = url.pathname

    // POST /user-stats/users/:id/stats
    if (path.startsWith('/user-stats/users/') && path.endsWith('/stats') && req.method === 'POST') {
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

      const body = await req.json()
      const { last_practice_date, current_streak, total_repetitions, custom_repetition_goal, goal_set_at } = body

      const { data: stats, error: statsError } = await supabaseClient
        .from('user_stats')
        .upsert({
          user_id: userId,
          last_practice_date: last_practice_date || null,
          current_streak: current_streak || 0,
          total_repetitions: total_repetitions || 0,
          custom_repetition_goal: custom_repetition_goal || null,
          goal_set_at: goal_set_at || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        })
        .select()
        .single()

      if (statsError) {
        return new Response(
          JSON.stringify({ error: statsError.message }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      return new Response(
        JSON.stringify({ data: stats }),
        { 
          status: 201, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // PUT /user-stats/users/:id/stats
    if (path.startsWith('/user-stats/users/') && path.endsWith('/stats') && req.method === 'PUT') {
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

      const body = await req.json()
      const updates = {
        ...body,
        updated_at: new Date().toISOString()
      }

      const { data: stats, error: statsError } = await supabaseClient
        .from('user_stats')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single()

      if (statsError) {
        return new Response(
          JSON.stringify({ error: statsError.message }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      return new Response(
        JSON.stringify({ data: stats }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // GET /user-stats/users/:id/stats
    // Note: url.pathname includes the function name prefix ("/user-stats") when invoked via
    // https://<project>.supabase.co/functions/v1/user-stats/... so we must match that.
    if (path.startsWith('/user-stats/users/') && path.endsWith('/stats') && req.method === 'GET') {
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

      // Get the current user to verify access
      const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
      
      if (authError || !user || user.id !== userId) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized' }),
          { 
            status: 401, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // Get user stats
      const { data: stats, error: statsError } = await supabaseClient
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (statsError && statsError.code !== 'PGRST116') { // PGRST116 = no rows returned
        return new Response(
          JSON.stringify({ error: statsError.message }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // If no stats exist, return default values
      const defaultStats = {
        user_id: userId,
        last_practice_date: null,
        current_streak: 0,
        total_repetitions: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      return new Response(
        JSON.stringify({ 
          data: stats || defaultStats
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // POST /user-stats/users/:id/custom-goal
    if (path.startsWith('/user-stats/users/') && path.endsWith('/custom-goal') && req.method === 'POST') {
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

      // Get the current user to verify access
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

      const body = await req.json()
      const { goal } = body

      if (!goal || goal < 1) {
        return new Response(
          JSON.stringify({ error: 'Goal must be a positive number' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      const { data: stats, error: statsError } = await supabaseClient
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

      if (statsError) {
        return new Response(
          JSON.stringify({ error: statsError.message }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          data: stats 
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // GET /user-stats/users/:id/custom-goal
    if (path.startsWith('/user-stats/users/') && path.endsWith('/custom-goal') && req.method === 'GET') {
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

      // Get the current user to verify access
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

      const { data: stats, error: statsError } = await supabaseClient
        .from('user_stats')
        .select('custom_repetition_goal, goal_set_at')
        .eq('user_id', userId)
        .single()

      if (statsError && statsError.code !== 'PGRST116') { // PGRST116 = no rows returned
        return new Response(
          JSON.stringify({ error: statsError.message }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          goal: stats?.custom_repetition_goal || null,
          goalSetAt: stats?.goal_set_at || null
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // DELETE /user-stats/users/:id/custom-goal
    if (path.startsWith('/user-stats/users/') && path.endsWith('/custom-goal') && req.method === 'DELETE') {
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

      // Get the current user to verify access
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

      const { data: stats, error: statsError } = await supabaseClient
        .from('user_stats')
        .update({
          custom_repetition_goal: null,
          goal_set_at: null,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single()

      if (statsError) {
        return new Response(
          JSON.stringify({ error: statsError.message }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          data: stats 
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Not found' }),
      { 
        status: 404, 
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
