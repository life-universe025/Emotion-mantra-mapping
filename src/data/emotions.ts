import { Emotion } from '../types'
import { 
  IoThunderstorm, IoFlame, IoLeaf, IoHeart, 
  IoSparkles, IoBed, IoHappy, IoWater, IoPerson,
  IoFlash, IoFitness, IoMusicalNotes,
  IoEye, IoShield, IoRocket, IoTime, IoRefresh
} from 'react-icons/io5'
import { FaBrain, FaBullseye, FaHeart, FaLightbulb, FaLeaf } from 'react-icons/fa'

export const emotions: Emotion[] = [
  {
    id: 'ANXIETY',
    name: 'Anxiety / Fear',
    icon: '😰',
    reactIcon: IoThunderstorm,
    description: 'Feeling worried, nervous, or afraid',
    color: 'bg-red-100 text-red-700 border-red-200'
  },
  {
    id: 'STRESS',
    name: 'Stress / Mental Fog',
    icon: '🧠',
    reactIcon: FaBrain,
    description: 'Overwhelmed, scattered, or unclear',
    color: 'bg-orange-100 text-orange-700 border-orange-200'
  },
  {
    id: 'ANGER',
    name: 'Anger / Ego',
    icon: '😤',
    reactIcon: IoFlame,
    description: 'Frustrated, irritated, or prideful',
    color: 'bg-red-100 text-red-700 border-red-200'
  },
  {
    id: 'GROUNDING',
    name: 'Grounding / Calm',
    icon: '🌱',
    reactIcon: IoLeaf,
    description: 'Need to center and find stability',
    color: 'bg-amber-100 text-amber-700 border-amber-200'
  },
  {
    id: 'SADNESS',
    name: 'Sadness / Compassion',
    icon: '💙',
    reactIcon: IoHeart,
    description: 'Feeling down or need more empathy',
    color: 'bg-amber-100 text-amber-700 border-amber-200'
  },
  {
    id: 'CONFIDENCE',
    name: 'Confidence / New Start',
    icon: '✨',
    reactIcon: IoSparkles,
    description: 'Ready for change or new beginnings',
    color: 'bg-orange-100 text-orange-700 border-orange-200'
  },
  {
    id: 'PEACE',
    name: 'Peace / Sleep / Soothing',
    icon: '🕊️',
    reactIcon: IoBed,
    description: 'Seeking tranquility and rest',
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200'
  },
  {
    id: 'GRATITUDE',
    name: 'Gratitude / Joy',
    icon: '🙏',
    reactIcon: IoHappy,
    description: 'Feeling thankful and joyful',
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200'
  },
  {
    id: 'FOCUS',
    name: 'Focus / Study',
    icon: '🎯',
    reactIcon: FaBullseye,
    description: 'Need clarity and concentration',
    color: 'bg-orange-100 text-orange-700 border-orange-200'
  },
  {
    id: 'LETTING_GO',
    name: 'Letting Go / Acceptance',
    icon: '🍃',
    reactIcon: IoWater,
    description: 'Release and surrender',
    color: 'bg-amber-100 text-amber-700 border-amber-200'
  },
  {
    id: 'LONELINESS',
    name: 'Loneliness / Isolation',
    icon: '🏠',
    reactIcon: IoPerson,
    description: 'Feeling disconnected or alone',
    color: 'bg-orange-100 text-orange-700 border-orange-200'
  },
  {
    id: 'RESTLESSNESS',
    name: 'Restlessness / Agitation',
    icon: '⚡',
    reactIcon: IoFlash,
    description: 'Unable to settle or find calm',
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200'
  },
  {
    id: 'ENERGY',
    name: 'Energy / Vitality',
    icon: '💪',
    reactIcon: IoFitness,
    description: 'Need for physical or mental energy',
    color: 'bg-orange-100 text-orange-700 border-orange-200'
  },
  {
    id: 'CREATIVITY',
    name: 'Creativity / Inspiration',
    icon: '🎨',
    reactIcon: IoMusicalNotes,
    description: 'Seeking creative flow and inspiration',
    color: 'bg-orange-100 text-orange-700 border-orange-200'
  },
  {
    id: 'CLARITY',
    name: 'Clarity / Insight',
    icon: '👁️',
    reactIcon: IoEye,
    description: 'Need for clear vision and understanding',
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200'
  },
  {
    id: 'PROTECTION',
    name: 'Protection / Safety',
    icon: '🛡️',
    reactIcon: IoShield,
    description: 'Seeking security and protection',
    color: 'bg-amber-100 text-amber-700 border-amber-200'
  },
  {
    id: 'MOTIVATION',
    name: 'Motivation / Drive',
    icon: '🚀',
    reactIcon: IoRocket,
    description: 'Need for motivation and forward momentum',
    color: 'bg-red-100 text-red-700 border-red-200'
  },
  {
    id: 'PATIENCE',
    name: 'Patience / Timing',
    icon: '⏰',
    reactIcon: IoTime,
    description: 'Learning to wait and trust the process',
    color: 'bg-amber-100 text-amber-700 border-amber-200'
  },
  {
    id: 'RENEWAL',
    name: 'Renewal / Rebirth',
    icon: '🔄',
    reactIcon: IoRefresh,
    description: 'Seeking fresh start and transformation',
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200'
  },
  {
    id: 'SELF_LOVE',
    name: 'Self-Love / Worth',
    icon: '💖',
    reactIcon: FaHeart,
    description: 'Cultivating self-compassion and worth',
    color: 'bg-orange-100 text-orange-700 border-orange-200'
  },
  {
    id: 'WISDOM',
    name: 'Wisdom / Understanding',
    icon: '💡',
    reactIcon: FaLightbulb,
    description: 'Seeking deeper knowledge and insight',
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200'
  },
  {
    id: 'HEALING',
    name: 'Healing / Recovery',
    icon: '🌿',
    reactIcon: FaLeaf,
    description: 'Physical, emotional, or spiritual healing',
    color: 'bg-amber-100 text-amber-700 border-amber-200'
  }
]
