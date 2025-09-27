import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
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
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''

    const supabaseClient = createClient(
      supabaseUrl,
      supabaseAnonKey,
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

    // Populate relationships
    const relationships = [
      { mantra_slug: 'mahamrityunjaya', emotion_id: 'ANXIETY' },
      { mantra_slug: 'gayatri', emotion_id: 'STRESS' },
      { mantra_slug: 'om-namah-shivaya', emotion_id: 'ANGER' },
      { mantra_slug: 'so-ham', emotion_id: 'GROUNDING' },
      { mantra_slug: 'om-mani-padme-hum', emotion_id: 'SADNESS' },
      { mantra_slug: 'ganesh-mantra', emotion_id: 'CONFIDENCE' },
      { mantra_slug: 'om-shanti', emotion_id: 'PEACE' },
      { mantra_slug: 'lokah-samastah', emotion_id: 'GRATITUDE' },
      { mantra_slug: 'saraswati-mantra', emotion_id: 'FOCUS' },
      { mantra_slug: 'aham-brahmasmi', emotion_id: 'LETTING_GO' }
    ]

    const results = []
    
    for (const rel of relationships) {
      // Get mantra ID by slug
      const { data: mantra, error: mantraError } = await supabaseClient
        .from('mantras')
        .select('id')
        .eq('slug', rel.mantra_slug)
        .single()

      if (mantraError || !mantra) {
        results.push({ mantra_slug: rel.mantra_slug, emotion_id: rel.emotion_id, error: 'Mantra not found' })
        continue
      }

      // Insert relationship
      const { data: relationship, error: relationshipError } = await supabaseClient
        .from('emotion_mantra')
        .insert({
          emotion_id: rel.emotion_id,
          mantra_id: mantra.id
        })
        .select()

      if (relationshipError) {
        results.push({ mantra_slug: rel.mantra_slug, emotion_id: rel.emotion_id, error: relationshipError.message })
      } else {
        results.push({ mantra_slug: rel.mantra_slug, emotion_id: rel.emotion_id, success: true })
      }
    }

    return new Response(
      JSON.stringify({ data: results }),
      {
        status: 200,
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
