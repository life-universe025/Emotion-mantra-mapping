import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

serve(async (req) => {
  console.log('🔥 AFFIRMATIONS EDGE FUNCTION CALLED:', req.method, req.url)
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

    const supabaseClient = createClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        global: {
          headers: req.headers.get('Authorization') ? { Authorization: req.headers.get('Authorization')! } : {},
        },
      }
    )

    // Create service role client for accessing emotions table
    const supabaseServiceClient = createClient(
      supabaseUrl,
      supabaseServiceKey
    )

    const url = new URL(req.url)
    const path = url.pathname
    const searchParams = url.searchParams

    // GET /affirmations/:id - Get single affirmation by ID
    if (path.startsWith('/affirmations/') && path !== '/affirmations' && req.method === 'GET') {
      const affirmationId = path.split('/')[2]
      
      // Validate that ID is a number
      if (!affirmationId || isNaN(parseInt(affirmationId))) {
        return new Response(
          JSON.stringify({ error: 'Invalid affirmation ID' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }
      
      // Get single affirmation with emotion data
      const { data: affirmation, error: affirmationError } = await supabaseClient
        .from('affirmations')
        .select(`
          *,
          emotions:emotion_id (
            id,
            name,
            icon,
            description,
            color
          )
        `)
        .eq('id', affirmationId)
        .single()

      if (affirmationError) {
        console.error('Affirmation query error:', affirmationError)
        return new Response(
          JSON.stringify({ error: affirmationError.message }),
          {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      if (!affirmation) {
        return new Response(
          JSON.stringify({ error: 'Affirmation not found' }),
          {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      return new Response(
        JSON.stringify({ data: affirmation }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // GET /affirmations - Get all affirmations with their emotions
    if (path === '/affirmations' && req.method === 'GET') {
      const emotion = searchParams.get('emotion')
      const intensity = searchParams.get('intensity')
      const category = searchParams.get('category')

      // Build query
      let query = supabaseClient
        .from('affirmations')
        .select(`
          *,
          emotions:emotion_id (
            id,
            name,
            icon,
            description,
            color
          )
        `)
        .order('created_at', { ascending: true })

      // Apply filters
      if (emotion) {
        query = query.eq('emotion_id', emotion)
      }
      if (intensity) {
        query = query.eq('intensity', intensity)
      }
      if (category) {
        query = query.eq('category', category)
      }

      const { data: affirmations, error: affirmationsError } = await query

      if (affirmationsError) {
        console.log('Affirmations query error:', affirmationsError)
        return new Response(
          JSON.stringify({ error: affirmationsError.message }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      if (!affirmations || affirmations.length === 0) {
        console.log('No affirmations found, returning empty array')
        return new Response(
          JSON.stringify({ data: [] }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      console.log('Final affirmations count:', affirmations.length)

      return new Response(
        JSON.stringify({ data: affirmations }),
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
    console.log('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
