import { EmotionType } from '../types'

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

export const breathingExercises: BreathingExercise[] = [
  {
    id: 'box-breathing',
    name: 'Box Breathing',
    description: 'Equal count breathing for grounding and calm',
    pattern: '4-4-4-4',
    duration: 240,
    cycles: 10,
    instructions: [
      'Sit comfortably with spine straight',
      'Inhale for 4 counts',
      'Hold breath for 4 counts',
      'Exhale for 4 counts',
      'Hold empty for 4 counts',
      'Repeat the cycle'
    ],
    benefits: ['Reduces stress', 'Improves focus', 'Calms nervous system'],
    emotions: ['ANXIETY', 'STRESS', 'GROUNDING', 'RESTLESSNESS']
  },
  {
    id: '4-7-8-breathing',
    name: '4-7-8 Breathing',
    description: 'Relaxing breath for anxiety and sleep',
    pattern: '4-7-8',
    duration: 180,
    cycles: 8,
    instructions: [
      'Place tongue tip behind upper teeth',
      'Exhale completely through mouth',
      'Inhale through nose for 4 counts',
      'Hold breath for 7 counts',
      'Exhale through mouth for 8 counts',
      'Repeat cycle'
    ],
    benefits: ['Reduces anxiety', 'Promotes sleep', 'Activates parasympathetic nervous system'],
    emotions: ['ANXIETY', 'PEACE', 'RESTLESSNESS']
  },
  {
    id: 'energizing-breath',
    name: 'Energizing Breath',
    description: 'Quick breathing to increase energy and alertness',
    pattern: '2-1-2-1',
    duration: 120,
    cycles: 20,
    instructions: [
      'Sit upright with shoulders back',
      'Quick inhale for 2 counts',
      'Brief hold for 1 count',
      'Quick exhale for 2 counts',
      'Brief pause for 1 count',
      'Maintain steady rhythm'
    ],
    benefits: ['Increases energy', 'Improves alertness', 'Boosts circulation'],
    emotions: ['ENERGY', 'MOTIVATION', 'FOCUS']
  },
  {
    id: 'heart-coherence',
    name: 'Heart Coherence Breathing',
    description: 'Rhythmic breathing for emotional balance',
    pattern: '6-6',
    duration: 300,
    cycles: 25,
    instructions: [
      'Focus on heart center',
      'Inhale for 6 counts',
      'Exhale for 6 counts',
      'Maintain smooth, even rhythm',
      'Visualize breathing through heart',
      'Feel gratitude and love'
    ],
    benefits: ['Emotional balance', 'Reduces stress', 'Improves heart rate variability'],
    emotions: ['SADNESS', 'SELF_LOVE', 'GRATITUDE', 'HEALING']
  },
  {
    id: 'alternate-nostril',
    name: 'Alternate Nostril Breathing',
    description: 'Balancing breath for mental clarity and focus',
    pattern: '4-4-4-4',
    duration: 360,
    cycles: 12,
    instructions: [
      'Sit in comfortable position',
      'Use right thumb to close right nostril',
      'Inhale through left nostril for 4 counts',
      'Close both nostrils, hold for 4 counts',
      'Release thumb, close left with ring finger',
      'Exhale through right nostril for 4 counts',
      'Inhale through right nostril for 4 counts',
      'Repeat cycle, alternating nostrils'
    ],
    benefits: ['Balances nervous system', 'Improves focus', 'Reduces mental fog'],
    emotions: ['FOCUS', 'CLARITY', 'STRESS', 'WISDOM']
  },
  {
    id: 'lion-breath',
    name: 'Lion Breath',
    description: 'Powerful breath for releasing tension and anger',
    pattern: '3-1-3',
    duration: 90,
    cycles: 5,
    instructions: [
      'Kneel or sit comfortably',
      'Inhale deeply through nose for 3 counts',
      'Hold breath for 1 count',
      'Open mouth wide, stick out tongue',
      'Exhale with "HA" sound for 3 counts',
      'Relax face and repeat'
    ],
    benefits: ['Releases tension', 'Reduces anger', 'Strengthens voice'],
    emotions: ['ANGER', 'RESTLESSNESS', 'MOTIVATION']
  },
  {
    id: 'ocean-breath',
    name: 'Ocean Breath (Ujjayi)',
    description: 'Soothing breath for sacred practice and peace',
    pattern: '5-5',
    duration: 300,
    cycles: 20,
    instructions: [
      'Sit in sacred practice posture',
      'Slightly constrict throat',
      'Inhale through nose for 5 counts',
      'Create soft ocean-like sound',
      'Exhale through nose for 5 counts',
      'Maintain steady rhythm'
    ],
    benefits: ['Calms mind', 'Improves concentration', 'Reduces stress'],
    emotions: ['PEACE', 'CLARITY', 'PATIENCE']
  },
  {
    id: 'cooling-breath',
    name: 'Cooling Breath (Sitali)',
    description: 'Cooling breath for emotional heat and agitation',
    pattern: '4-4-6',
    duration: 180,
    cycles: 10,
    instructions: [
      'Sit comfortably',
      'Curl tongue into tube shape',
      'Inhale through curled tongue for 4 counts',
      'Close mouth, hold for 4 counts',
      'Exhale through nose for 6 counts',
      'Feel cooling sensation'
    ],
    benefits: ['Cools body temperature', 'Reduces agitation', 'Calms emotions'],
    emotions: ['ANGER', 'RESTLESSNESS', 'ENERGY']
  },
  {
    id: 'victory-breath',
    name: 'Victory Breath (Ujjayi)',
    description: 'Strengthening breath for confidence and protection',
    pattern: '6-3-6',
    duration: 240,
    cycles: 15,
    instructions: [
      'Sit with spine erect',
      'Inhale through nose for 6 counts',
      'Hold breath for 3 counts',
      'Exhale through nose for 6 counts',
      'Create gentle throat constriction',
      'Feel inner strength building'
    ],
    benefits: ['Builds confidence', 'Increases inner strength', 'Improves focus'],
    emotions: ['CONFIDENCE', 'PROTECTION', 'MOTIVATION', 'ENERGY']
  },
  {
    id: 'compassion-breath',
    name: 'Compassion Breath',
    description: 'Loving breath for self-compassion and healing',
    pattern: '4-4-6-2',
    duration: 300,
    cycles: 12,
    instructions: [
      'Place hands on heart center',
      'Inhale love for 4 counts',
      'Hold love in heart for 4 counts',
      'Exhale compassion for 6 counts',
      'Rest in stillness for 2 counts',
      'Repeat with loving intention'
    ],
    benefits: ['Cultivates self-love', 'Promotes healing', 'Reduces loneliness'],
    emotions: ['SELF_LOVE', 'HEALING', 'LONELINESS', 'GRATITUDE']
  },
  {
    id: 'creative-breath',
    name: 'Creative Flow Breath',
    description: 'Inspiring breath for creativity and inspiration',
    pattern: '3-2-5-2',
    duration: 200,
    cycles: 15,
    instructions: [
      'Sit in comfortable position',
      'Inhale inspiration for 3 counts',
      'Hold creative energy for 2 counts',
      'Exhale expression for 5 counts',
      'Pause in creative space for 2 counts',
      'Allow ideas to flow freely'
    ],
    benefits: ['Stimulates creativity', 'Opens imagination', 'Enhances inspiration'],
    emotions: ['CREATIVITY', 'WISDOM']
  },
  {
    id: 'renewal-breath',
    name: 'Renewal Breath',
    description: 'Transforming breath for new beginnings',
    pattern: '5-4-7-3',
    duration: 360,
    cycles: 10,
    instructions: [
      'Stand or sit with arms open',
      'Inhale new possibilities for 5 counts',
      'Hold transformation for 4 counts',
      'Exhale old patterns for 7 counts',
      'Rest in renewal for 3 counts',
      'Feel fresh energy entering'
    ],
    benefits: ['Promotes renewal', 'Releases old patterns', 'Invites new beginnings'],
    emotions: ['RENEWAL', 'LETTING_GO', 'CONFIDENCE', 'HEALING']
  }
]
