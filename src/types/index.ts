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
  breathing_pattern?: string;
  breathing_cycles?: number;
  breathing_duration_seconds?: number;
  before_mood?: number;
  after_mood?: number;
  mood_improvement?: number;
  created_at: string;
}

export interface UserStats {
  user_id: string;
  last_practice_date?: string;
  current_streak: number;
  total_repetitions: number;
  total_breathing_sessions?: number;
  total_breathing_duration?: number;
  favorite_breathing_pattern?: string;
  total_mood_improvements?: number;
  average_mood_improvement?: number;
  sessions_with_mood_tracking?: number;
}

export interface Emotion {
  id: string;
  name: string;
  icon: string;
  reactIcon?: React.ComponentType<any>;
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

export interface BreathingSession {
  pattern: string;
  cycles: number;
  duration_seconds: number;
  started_at: Date;
  completed_at?: Date;
}

export interface MoodEntry {
  emoji: string;
  label: string;
  value: number; // 1-10 scale
  color: string;
}

export interface MoodLog {
  mood: MoodEntry;
  timestamp: Date;
  session_id?: number;
  notes?: string;
}

export interface SessionMoodData {
  before_mood?: MoodEntry;
  after_mood?: MoodEntry;
  mood_improvement?: number; // difference between before and after
}
