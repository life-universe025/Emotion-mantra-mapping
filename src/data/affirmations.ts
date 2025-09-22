import { EmotionType } from '../types'

export interface Affirmation {
  id: string;
  text: string;
  category: string;
  emotions: EmotionType[];
  intensity: 'gentle' | 'moderate' | 'strong';
}

export const affirmations: Affirmation[] = [
  // Anxiety & Fear
  {
    id: 'anxiety-1',
    text: 'I am safe and protected in this moment.',
    category: 'Safety',
    emotions: ['ANXIETY'],
    intensity: 'gentle'
  },
  {
    id: 'anxiety-2',
    text: 'I breathe in peace and exhale fear.',
    category: 'Calm',
    emotions: ['ANXIETY'],
    intensity: 'moderate'
  },
  {
    id: 'anxiety-3',
    text: 'I trust in my ability to handle whatever comes my way.',
    category: 'Trust',
    emotions: ['ANXIETY'],
    intensity: 'strong'
  },

  // Stress & Mental Fog
  {
    id: 'stress-1',
    text: 'My mind is clear and focused.',
    category: 'Clarity',
    emotions: ['STRESS'],
    intensity: 'gentle'
  },
  {
    id: 'stress-2',
    text: 'I release all tension and embrace peace.',
    category: 'Release',
    emotions: ['STRESS'],
    intensity: 'moderate'
  },
  {
    id: 'stress-3',
    text: 'I am capable of handling any challenge with grace.',
    category: 'Capability',
    emotions: ['STRESS'],
    intensity: 'strong'
  },

  // Anger & Ego
  {
    id: 'anger-1',
    text: 'I choose peace over conflict.',
    category: 'Peace',
    emotions: ['ANGER'],
    intensity: 'gentle'
  },
  {
    id: 'anger-2',
    text: 'I release anger and embrace compassion.',
    category: 'Compassion',
    emotions: ['ANGER'],
    intensity: 'moderate'
  },
  {
    id: 'anger-3',
    text: 'I am the master of my emotions, not their slave.',
    category: 'Mastery',
    emotions: ['ANGER'],
    intensity: 'strong'
  },

  // Grounding & Calm
  {
    id: 'grounding-1',
    text: 'I am rooted and stable like a tree.',
    category: 'Stability',
    emotions: ['GROUNDING'],
    intensity: 'gentle'
  },
  {
    id: 'grounding-2',
    text: 'I am centered and balanced in all aspects of my life.',
    category: 'Balance',
    emotions: ['GROUNDING'],
    intensity: 'moderate'
  },
  {
    id: 'grounding-3',
    text: 'I am unshakeable in my inner strength and peace.',
    category: 'Strength',
    emotions: ['GROUNDING'],
    intensity: 'strong'
  },

  // Sadness & Compassion
  {
    id: 'sadness-1',
    text: 'I allow myself to feel and heal.',
    category: 'Healing',
    emotions: ['SADNESS'],
    intensity: 'gentle'
  },
  {
    id: 'sadness-2',
    text: 'My heart is open to love and compassion.',
    category: 'Love',
    emotions: ['SADNESS'],
    intensity: 'moderate'
  },
  {
    id: 'sadness-3',
    text: 'I transform pain into wisdom and strength.',
    category: 'Transformation',
    emotions: ['SADNESS'],
    intensity: 'strong'
  },

  // Confidence & New Start
  {
    id: 'confidence-1',
    text: 'I am worthy of all good things.',
    category: 'Worth',
    emotions: ['CONFIDENCE'],
    intensity: 'gentle'
  },
  {
    id: 'confidence-2',
    text: 'I embrace new opportunities with courage.',
    category: 'Courage',
    emotions: ['CONFIDENCE'],
    intensity: 'moderate'
  },
  {
    id: 'confidence-3',
    text: 'I am unstoppable in pursuing my dreams.',
    category: 'Power',
    emotions: ['CONFIDENCE'],
    intensity: 'strong'
  },

  // Peace & Sleep
  {
    id: 'peace-1',
    text: 'I am at peace with myself and the world.',
    category: 'Peace',
    emotions: ['PEACE'],
    intensity: 'gentle'
  },
  {
    id: 'peace-2',
    text: 'My mind and body are relaxed and calm.',
    category: 'Relaxation',
    emotions: ['PEACE'],
    intensity: 'moderate'
  },
  {
    id: 'peace-3',
    text: 'I surrender to the flow of life with complete trust.',
    category: 'Surrender',
    emotions: ['PEACE'],
    intensity: 'strong'
  },

  // Gratitude & Joy
  {
    id: 'gratitude-1',
    text: 'I am grateful for all the blessings in my life.',
    category: 'Gratitude',
    emotions: ['GRATITUDE'],
    intensity: 'gentle'
  },
  {
    id: 'gratitude-2',
    text: 'Joy flows through me and radiates to others.',
    category: 'Joy',
    emotions: ['GRATITUDE'],
    intensity: 'moderate'
  },
  {
    id: 'gratitude-3',
    text: 'I am a magnet for abundance and happiness.',
    category: 'Abundance',
    emotions: ['GRATITUDE'],
    intensity: 'strong'
  },

  // Focus & Study
  {
    id: 'focus-1',
    text: 'My attention is sharp and unwavering.',
    category: 'Attention',
    emotions: ['FOCUS'],
    intensity: 'gentle'
  },
  {
    id: 'focus-2',
    text: 'I absorb knowledge with ease and clarity.',
    category: 'Learning',
    emotions: ['FOCUS'],
    intensity: 'moderate'
  },
  {
    id: 'focus-3',
    text: 'I am a master of concentration and focus.',
    category: 'Mastery',
    emotions: ['FOCUS'],
    intensity: 'strong'
  },

  // Letting Go & Acceptance
  {
    id: 'letting-go-1',
    text: 'I release what no longer serves me.',
    category: 'Release',
    emotions: ['LETTING_GO'],
    intensity: 'gentle'
  },
  {
    id: 'letting-go-2',
    text: 'I accept what is and flow with life.',
    category: 'Acceptance',
    emotions: ['LETTING_GO'],
    intensity: 'moderate'
  },
  {
    id: 'letting-go-3',
    text: 'I am free from all attachments and limitations.',
    category: 'Freedom',
    emotions: ['LETTING_GO'],
    intensity: 'strong'
  },

  // Loneliness & Isolation
  {
    id: 'loneliness-1',
    text: 'I am connected to all beings through love.',
    category: 'Connection',
    emotions: ['LONELINESS'],
    intensity: 'gentle'
  },
  {
    id: 'loneliness-2',
    text: 'I am never truly alone; I am one with the universe.',
    category: 'Unity',
    emotions: ['LONELINESS'],
    intensity: 'moderate'
  },
  {
    id: 'loneliness-3',
    text: 'I am complete and whole within myself.',
    category: 'Wholeness',
    emotions: ['LONELINESS'],
    intensity: 'strong'
  },

  // Restlessness & Agitation
  {
    id: 'restlessness-1',
    text: 'I find peace in the present moment.',
    category: 'Present',
    emotions: ['RESTLESSNESS'],
    intensity: 'gentle'
  },
  {
    id: 'restlessness-2',
    text: 'I am calm and centered despite external chaos.',
    category: 'Calm',
    emotions: ['RESTLESSNESS'],
    intensity: 'moderate'
  },
  {
    id: 'restlessness-3',
    text: 'I am the eye of the storm, peaceful and still.',
    category: 'Stillness',
    emotions: ['RESTLESSNESS'],
    intensity: 'strong'
  },

  // Energy & Vitality
  {
    id: 'energy-1',
    text: 'I am filled with vibrant, positive energy.',
    category: 'Vitality',
    emotions: ['ENERGY'],
    intensity: 'gentle'
  },
  {
    id: 'energy-2',
    text: 'My energy flows freely and powerfully.',
    category: 'Flow',
    emotions: ['ENERGY'],
    intensity: 'moderate'
  },
  {
    id: 'energy-3',
    text: 'I am an unstoppable force of positive energy.',
    category: 'Power',
    emotions: ['ENERGY'],
    intensity: 'strong'
  },

  // Creativity & Inspiration
  {
    id: 'creativity-1',
    text: 'I am a channel for divine creativity.',
    category: 'Channel',
    emotions: ['CREATIVITY'],
    intensity: 'gentle'
  },
  {
    id: 'creativity-2',
    text: 'Inspiration flows through me effortlessly.',
    category: 'Inspiration',
    emotions: ['CREATIVITY'],
    intensity: 'moderate'
  },
  {
    id: 'creativity-3',
    text: 'I am a limitless source of creative expression.',
    category: 'Expression',
    emotions: ['CREATIVITY'],
    intensity: 'strong'
  },

  // Clarity & Insight
  {
    id: 'clarity-1',
    text: 'My vision is clear and my path is illuminated.',
    category: 'Vision',
    emotions: ['CLARITY'],
    intensity: 'gentle'
  },
  {
    id: 'clarity-2',
    text: 'I see through all illusions to the truth.',
    category: 'Truth',
    emotions: ['CLARITY'],
    intensity: 'moderate'
  },
  {
    id: 'clarity-3',
    text: 'I am a beacon of clarity and wisdom.',
    category: 'Wisdom',
    emotions: ['CLARITY'],
    intensity: 'strong'
  },

  // Protection & Safety
  {
    id: 'protection-1',
    text: 'I am surrounded by divine protection.',
    category: 'Divine',
    emotions: ['PROTECTION'],
    intensity: 'gentle'
  },
  {
    id: 'protection-2',
    text: 'I am safe and secure in all situations.',
    category: 'Security',
    emotions: ['PROTECTION'],
    intensity: 'moderate'
  },
  {
    id: 'protection-3',
    text: 'I am an impenetrable fortress of light and love.',
    category: 'Fortress',
    emotions: ['PROTECTION'],
    intensity: 'strong'
  },

  // Motivation & Drive
  {
    id: 'motivation-1',
    text: 'I am motivated by my highest purpose.',
    category: 'Purpose',
    emotions: ['MOTIVATION'],
    intensity: 'gentle'
  },
  {
    id: 'motivation-2',
    text: 'I move forward with determination and passion.',
    category: 'Determination',
    emotions: ['MOTIVATION'],
    intensity: 'moderate'
  },
  {
    id: 'motivation-3',
    text: 'I am an unstoppable force of positive action.',
    category: 'Action',
    emotions: ['MOTIVATION'],
    intensity: 'strong'
  },

  // Patience & Timing
  {
    id: 'patience-1',
    text: 'I trust in divine timing.',
    category: 'Timing',
    emotions: ['PATIENCE'],
    intensity: 'gentle'
  },
  {
    id: 'patience-2',
    text: 'I am patient with myself and the process.',
    category: 'Process',
    emotions: ['PATIENCE'],
    intensity: 'moderate'
  },
  {
    id: 'patience-3',
    text: 'I am the master of patience and divine timing.',
    category: 'Mastery',
    emotions: ['PATIENCE'],
    intensity: 'strong'
  },

  // Renewal & Rebirth
  {
    id: 'renewal-1',
    text: 'I am reborn with each new day.',
    category: 'Rebirth',
    emotions: ['RENEWAL'],
    intensity: 'gentle'
  },
  {
    id: 'renewal-2',
    text: 'I embrace transformation and renewal.',
    category: 'Transformation',
    emotions: ['RENEWAL'],
    intensity: 'moderate'
  },
  {
    id: 'renewal-3',
    text: 'I am a phoenix rising from the ashes of the old.',
    category: 'Phoenix',
    emotions: ['RENEWAL'],
    intensity: 'strong'
  },

  // Self-Love & Worth
  {
    id: 'self-love-1',
    text: 'I love and accept myself completely.',
    category: 'Acceptance',
    emotions: ['SELF_LOVE'],
    intensity: 'gentle'
  },
  {
    id: 'self-love-2',
    text: 'I am worthy of love, respect, and happiness.',
    category: 'Worth',
    emotions: ['SELF_LOVE'],
    intensity: 'moderate'
  },
  {
    id: 'self-love-3',
    text: 'I am a magnificent being of infinite worth.',
    category: 'Magnificence',
    emotions: ['SELF_LOVE'],
    intensity: 'strong'
  },

  // Wisdom & Understanding
  {
    id: 'wisdom-1',
    text: 'I am open to receiving divine wisdom.',
    category: 'Reception',
    emotions: ['WISDOM'],
    intensity: 'gentle'
  },
  {
    id: 'wisdom-2',
    text: 'I understand the deeper meaning of all experiences.',
    category: 'Understanding',
    emotions: ['WISDOM'],
    intensity: 'moderate'
  },
  {
    id: 'wisdom-3',
    text: 'I am a vessel of infinite wisdom and knowledge.',
    category: 'Vessel',
    emotions: ['WISDOM'],
    intensity: 'strong'
  },

  // Healing & Recovery
  {
    id: 'healing-1',
    text: 'I am healing on all levels of my being.',
    category: 'Healing',
    emotions: ['HEALING'],
    intensity: 'gentle'
  },
  {
    id: 'healing-2',
    text: 'My body, mind, and spirit are in perfect harmony.',
    category: 'Harmony',
    emotions: ['HEALING'],
    intensity: 'moderate'
  },
  {
    id: 'healing-3',
    text: 'I am a powerful force of healing and restoration.',
    category: 'Restoration',
    emotions: ['HEALING'],
    intensity: 'strong'
  }
]
