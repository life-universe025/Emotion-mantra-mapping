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
  emotion_mantra?: Array<{
    emotion_id: string;
    emotions: Emotion;
  }>;
}

export interface Session {
  id: number;
  user_id: string;
  mantra_id: number;
  repetitions: number;
  duration_seconds: number;
  notes?: string;
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
  total_mood_improvements?: number;
  average_mood_improvement?: number;
  sessions_with_mood_tracking?: number;
  custom_repetition_goal?: number;
  goal_set_at?: string;
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
  | 'LETTING_GO'
  | 'LONELINESS'
  | 'RESTLESSNESS'
  | 'ENERGY'
  | 'CREATIVITY'
  | 'CLARITY'
  | 'PROTECTION'
  | 'MOTIVATION'
  | 'PATIENCE'
  | 'RENEWAL'
  | 'SELF_LOVE'
  | 'WISDOM'
  | 'HEALING';

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

export interface BreathingExercise {
  id: string;
  name: string;
  description: string;
  pattern: string; // e.g., "4-4-4-4" for inhale-hold-exhale-hold
  duration: number; // in seconds
  cycles: number;
  instructions: string[];
  benefits: string[];
  emotions: EmotionType[];
}

export interface Affirmation {
  id: string;
  text: string;
  category: string;
  emotions: EmotionType[];
  intensity: 'gentle' | 'moderate' | 'strong';
}
