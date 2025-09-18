export interface Mantra {
  id: number;
  slug: string;
  sanskrit: string;
  devanagari: string;
  transliteration: string;
  meaning: string;
  audio_url?: string;
  suggested_rounds: number;
  emotions: string[];
}

export interface Session {
  id: number;
  user_id: string;
  mantra_id: number;
  repetitions: number;
  duration_seconds: number;
  notes?: string;
  created_at: string;
}

export interface UserStats {
  user_id: string;
  last_practice_date?: string;
  current_streak: number;
  total_repetitions: number;
}

export interface Emotion {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

export type EmotionType = 
  | 'ANXIETY'
  | 'STRESS'
  | 'ANGER'
  | 'GROUNDING'
  | 'SADNESS'
  | 'CONFIDENCE'
  | 'PEACE'
  | 'GRATITUDE'
  | 'FOCUS'
  | 'LETTING_GO';
