import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      mantras: {
        Row: {
          id: number
          slug: string
          sanskrit: string
          devanagari: string
          transliteration: string
          meaning: string
          audio_url: string | null
          suggested_rounds: number
          emotions: string[]
          created_at: string
        }
        Insert: {
          id?: number
          slug: string
          sanskrit: string
          devanagari: string
          transliteration: string
          meaning: string
          audio_url?: string | null
          suggested_rounds?: number
          emotions: string[]
        }
        Update: {
          id?: number
          slug?: string
          sanskrit?: string
          devanagari?: string
          transliteration?: string
          meaning?: string
          audio_url?: string | null
          suggested_rounds?: number
          emotions?: string[]
        }
      }
      sessions: {
        Row: {
          id: number
          user_id: string
          mantra_id: number
          repetitions: number
          duration_seconds: number
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          mantra_id: number
          repetitions: number
          duration_seconds: number
          notes?: string | null
        }
        Update: {
          id?: number
          user_id?: string
          mantra_id?: number
          repetitions?: number
          duration_seconds?: number
          notes?: string | null
        }
      }
      user_stats: {
        Row: {
          user_id: string
          last_practice_date: string | null
          current_streak: number
          total_repetitions: number
        }
        Insert: {
          user_id: string
          last_practice_date?: string | null
          current_streak?: number
          total_repetitions?: number
        }
        Update: {
          user_id?: string
          last_practice_date?: string | null
          current_streak?: number
          total_repetitions?: number
        }
      }
    }
  }
}
