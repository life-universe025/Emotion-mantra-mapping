import { BreathingExercise } from '../types';

export const breathingExercises: BreathingExercise[] = [
  {
    id: 'calm_breathing',
    name: 'Calm Breathing',
    description: 'A gentle breathing exercise to reduce anxiety and promote relaxation',
    pattern: '4-4-4-4',
    duration: 240,
    cycles: 5,
    instructions: [
      'Find a comfortable seated position',
      'Close your eyes or soften your gaze',
      'Breathe in slowly for 4 counts',
      'Hold your breath for 4 counts',
      'Exhale slowly for 4 counts',
      'Pause for 4 counts before the next breath'
    ],
    benefits: [
      'Reduces anxiety',
      'Promotes relaxation',
      'Improves focus',
      'Calms the nervous system'
    ],
    emotions: ['ANXIETY', 'STRESS', 'RESTLESSNESS']
  },
  {
    id: 'grounding_breath',
    name: 'Grounding Breath',
    description: 'A powerful breathing technique to help you feel centered and grounded',
    pattern: '6-2-8-2',
    duration: 360,
    cycles: 4,
    instructions: [
      'Sit with your feet flat on the ground',
      'Place your hands on your knees',
      'Inhale deeply for 6 counts',
      'Hold for 2 counts',
      'Exhale slowly for 8 counts',
      'Pause for 2 counts'
    ],
    benefits: [
      'Increases grounding',
      'Reduces overwhelm',
      'Improves stability',
      'Enhances presence'
    ],
    emotions: ['GROUNDING', 'ANXIETY', 'RESTLESSNESS']
  },
  {
    id: 'energy_boost',
    name: 'Energy Boost',
    description: 'An invigorating breathing exercise to increase energy and alertness',
    pattern: '2-1-2-1',
    duration: 180,
    cycles: 6,
    instructions: [
      'Sit up straight with good posture',
      'Take quick, sharp inhales for 2 counts',
      'Hold briefly for 1 count',
      'Exhale quickly for 2 counts',
      'Pause for 1 count before next cycle'
    ],
    benefits: [
      'Increases energy',
      'Improves alertness',
      'Boosts motivation',
      'Enhances focus'
    ],
    emotions: ['ENERGY', 'MOTIVATION', 'FOCUS']
  },
  {
    id: 'anger_release',
    name: 'Anger Release',
    description: 'A cooling breathing exercise to help release anger and frustration',
    pattern: '4-0-8-0',
    duration: 300,
    cycles: 5,
    instructions: [
      'Sit comfortably with your spine straight',
      'Inhale slowly for 4 counts',
      'Exhale forcefully for 8 counts',
      'No holding or pausing',
      'Focus on releasing tension with each exhale'
    ],
    benefits: [
      'Releases anger',
      'Reduces tension',
      'Promotes calm',
      'Improves emotional regulation'
    ],
    emotions: ['ANGER', 'STRESS', 'RESTLESSNESS']
  },
  {
    id: 'peaceful_heart',
    name: 'Peaceful Heart',
    description: 'A gentle breathing exercise to cultivate peace and inner calm',
    pattern: '5-5-5-5',
    duration: 400,
    cycles: 4,
    instructions: [
      'Place your hand over your heart',
      'Breathe in slowly for 5 counts',
      'Hold the breath for 5 counts',
      'Exhale gently for 5 counts',
      'Rest for 5 counts before next breath'
    ],
    benefits: [
      'Cultivates peace',
      'Opens the heart',
      'Reduces stress',
      'Promotes self-love'
    ],
    emotions: ['PEACE', 'SELF_LOVE', 'GRATITUDE']
  },
  {
    id: 'focus_breath',
    name: 'Focus Breath',
    description: 'A concentration-enhancing breathing exercise for improved focus',
    pattern: '4-2-6-2',
    duration: 280,
    cycles: 5,
    instructions: [
      'Choose a focal point or close your eyes',
      'Inhale for 4 counts',
      'Hold for 2 counts',
      'Exhale for 6 counts',
      'Pause for 2 counts',
      'Maintain focus throughout'
    ],
    benefits: [
      'Improves concentration',
      'Enhances mental clarity',
      'Reduces distractions',
      'Boosts productivity'
    ],
    emotions: ['FOCUS', 'CLARITY', 'MOTIVATION']
  },
  {
    id: 'sadness_comfort',
    name: 'Comforting Breath',
    description: 'A gentle, nurturing breathing exercise for times of sadness',
    pattern: '3-3-6-3',
    duration: 300,
    cycles: 4,
    instructions: [
      'Wrap your arms around yourself',
      'Breathe in gently for 3 counts',
      'Hold with compassion for 3 counts',
      'Exhale slowly for 6 counts',
      'Rest for 3 counts'
    ],
    benefits: [
      'Provides comfort',
      'Reduces sadness',
      'Promotes self-compassion',
      'Encourages healing'
    ],
    emotions: ['SADNESS', 'HEALING', 'SELF_LOVE']
  },
  {
    id: 'confidence_boost',
    name: 'Confidence Breath',
    description: 'An empowering breathing exercise to build confidence and strength',
    pattern: '6-2-4-2',
    duration: 280,
    cycles: 5,
    instructions: [
      'Stand tall or sit with shoulders back',
      'Inhale deeply for 6 counts',
      'Hold with strength for 2 counts',
      'Exhale with power for 4 counts',
      'Pause for 2 counts'
    ],
    benefits: [
      'Builds confidence',
      'Increases strength',
      'Improves posture',
      'Enhances self-esteem'
    ],
    emotions: ['CONFIDENCE', 'MOTIVATION', 'ENERGY']
  },
  {
    id: 'letting_go',
    name: 'Letting Go Breath',
    description: 'A releasing breathing exercise to help let go of what no longer serves you',
    pattern: '4-0-8-4',
    duration: 320,
    cycles: 4,
    instructions: [
      'Sit comfortably with palms up',
      'Inhale for 4 counts',
      'Exhale slowly for 8 counts',
      'Pause for 4 counts',
      'Visualize releasing with each exhale'
    ],
    benefits: [
      'Promotes letting go',
      'Reduces attachment',
      'Increases acceptance',
      'Encourages renewal'
    ],
    emotions: ['LETTING_GO', 'RENEWAL', 'PEACE']
  },
  {
    id: 'gratitude_breath',
    name: 'Gratitude Breath',
    description: 'A heart-opening breathing exercise to cultivate gratitude and appreciation',
    pattern: '5-3-7-3',
    duration: 360,
    cycles: 4,
    instructions: [
      'Place your hands over your heart',
      'Inhale with gratitude for 5 counts',
      'Hold the feeling for 3 counts',
      'Exhale with appreciation for 7 counts',
      'Rest in gratitude for 3 counts'
    ],
    benefits: [
      'Cultivates gratitude',
      'Opens the heart',
      'Increases positivity',
      'Enhances well-being'
    ],
    emotions: ['GRATITUDE', 'PEACE', 'SELF_LOVE']
  }
];
