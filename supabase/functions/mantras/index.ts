import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

serve(async (req) => {
  console.log('🔥 EDGE FUNCTION CALLED:', req.method, req.url)
  
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
    


    // GET /mantras/:id - Get single mantra by ID
    if (path.startsWith('/mantras/') && path !== '/mantras' && req.method === 'GET') {
      const mantraId = path.split('/')[2]
      
      // Validate that ID is a number
      if (!mantraId || isNaN(parseInt(mantraId))) {
        return new Response(
          JSON.stringify({ error: 'Invalid mantra ID' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }
      
      // Get single mantra
      const { data: mantra, error: mantraError } = await supabaseClient
        .from('mantras')
        .select('*')
        .eq('id', mantraId)
        .single()

      if (mantraError) {
        console.error('Mantra query error:', mantraError)
        return new Response(
          JSON.stringify({ error: mantraError.message }),
          {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      if (!mantra) {
        return new Response(
          JSON.stringify({ error: 'Mantra not found' }),
          {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      // Get all emotions using service role client
      const { data: emotions, error: emotionsError } = await supabaseServiceClient
        .from('emotions')
        .select('*')

      if (emotionsError) {
        console.error('Emotions query error:', emotionsError)
        return new Response(
          JSON.stringify({ error: emotionsError.message }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      // Create emotion lookup map
      const emotionMap = new Map()
      if (emotions) {
        emotions.forEach(emotion => {
          emotionMap.set(emotion.id, emotion)
        })
      }

      // Also create a case-insensitive lookup for robustness
      const emotionMapCaseInsensitive = new Map()
      if (emotions) {
        emotions.forEach(emotion => {
          emotionMapCaseInsensitive.set(emotion.id.toLowerCase(), emotion)
        })
      }

      // Transform mantra to include emotion data
      const emotionId = mantra.emotion_id
      let emotionData = emotionMap.get(emotionId)
      
      // If not found, try case-insensitive lookup
      if (!emotionData) {
        emotionData = emotionMapCaseInsensitive.get(emotionId?.toLowerCase())
      }
      
      // If still not found, log error but don't fail
      if (!emotionData) {
        console.error(`No emotion data found for mantra ${mantra.slug} with emotion_id: ${emotionId}`)
      }

      const transformedMantra = {
        ...mantra,
        emotion_mantra: emotionData ? [{
          emotion_id: emotionData.id,
          emotions: emotionData
        }] : []
      }

      return new Response(
        JSON.stringify({ data: transformedMantra }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // GET /mantras - Get all mantras with their emotions
    if (path === '/mantras' && req.method === 'GET') {
      const emotion = searchParams.get('emotion')


      // Get all mantras
      const { data: mantras, error: mantrasError } = await supabaseClient
        .from('mantras')
        .select('*')
        .order('created_at', { ascending: true })

      if (mantrasError) {
        console.log('Mantras query error:', mantrasError)
        return new Response(
          JSON.stringify({ error: mantrasError.message }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }


      if (!mantras || mantras.length === 0) {
        console.log('No mantras found, returning empty array')
        return new Response(
          JSON.stringify({ data: [] }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      // Get all emotions using service role client
      const { data: emotions, error: emotionsError } = await supabaseServiceClient
        .from('emotions')
        .select('*')

      if (emotionsError) {
        console.error('Emotions query error:', emotionsError)
        return new Response(
          JSON.stringify({ error: emotionsError.message }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      // Create emotion lookup map
      const emotionMap = new Map()
      if (emotions) {
        emotions.forEach(emotion => {
          emotionMap.set(emotion.id, emotion)
        })
      }

      // Also create a case-insensitive lookup for robustness
      const emotionMapCaseInsensitive = new Map()
      if (emotions) {
        emotions.forEach(emotion => {
          emotionMapCaseInsensitive.set(emotion.id.toLowerCase(), emotion)
        })
      }

      // Transform mantras to include emotion data
      const transformedMantras = mantras.map(mantra => {
        const emotionId = mantra.emotion_id
        let emotionData = emotionMap.get(emotionId)
        
        // If not found, try case-insensitive lookup
        if (!emotionData) {
          emotionData = emotionMapCaseInsensitive.get(emotionId?.toLowerCase())
        }
        
        // If still not found, log error but don't fail
        if (!emotionData) {
          console.error(`No emotion data found for mantra ${mantra.slug} with emotion_id: ${emotionId}`)
        }

        return {
          ...mantra,
          emotion_mantra: emotionData ? [{
            emotion_id: emotionData.id,
            emotions: emotionData
          }] : []
        }
      })

      // Filter by emotion if specified
      const filteredMantras = emotion 
        ? transformedMantras.filter(mantra => 
            mantra.emotion_mantra.some(rel => rel.emotion_id === emotion)
          )
        : transformedMantras

      console.log('Final mantras count:', filteredMantras.length)

      return new Response(
        JSON.stringify({ data: filteredMantras }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // GET /mantras/:id - Get specific mantra with its emotion
    if (path.startsWith('/mantras/') && req.method === 'GET') {
      const id = path.split('/')[2]
      
      if (!id || isNaN(Number(id))) {
        return new Response(
          JSON.stringify({ error: 'Invalid mantra ID' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      console.log('=== FETCHING MANTRA BY ID ===')
      console.log('Mantra ID:', id)

      // Get the mantra
      const { data: mantra, error: mantraError } = await supabaseClient
        .from('mantras')
        .select('*')
        .eq('id', Number(id))
        .single()

      if (mantraError) {
        console.log('Mantra query error:', mantraError)
        return new Response(
          JSON.stringify({ error: mantraError.message }),
          { 
            status: 404, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      console.log('Mantra found:', mantra)

      // Get the associated emotion
      let emotionData = null
      if (mantra.emotion_id) {
        const { data: emotion, error: emotionError } = await supabaseClient
          .from('emotions')
          .select('*')
          .eq('id', mantra.emotion_id)
          .single()

        if (!emotionError && emotion) {
          emotionData = emotion
          console.log('Associated emotion:', emotion)
        }
      }

      // Transform the data
      const transformedMantra = {
        ...mantra,
        emotion_mantra: emotionData ? [{
          emotion_id: emotionData.id,
          emotions: emotionData
        }] : []
      }

      console.log('Transformed mantra:', transformedMantra)

      return new Response(
        JSON.stringify({ data: transformedMantra }),
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