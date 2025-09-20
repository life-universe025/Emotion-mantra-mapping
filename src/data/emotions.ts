import { Emotion } from '../types'
import { 
  IoThunderstorm, IoFlame, IoLeaf, IoHeart, 
  IoSparkles, IoBed, IoHappy, IoWater 
} from 'react-icons/io5'
import { FaBrain, FaBullseye } from 'react-icons/fa'

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
    color: 'bg-green-100 text-green-700 border-green-200'
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
    color: 'bg-indigo-100 text-indigo-700 border-indigo-200'
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
    color: 'bg-teal-100 text-teal-700 border-teal-200'
  },
  {
    id: 'LETTING_GO',
    name: 'Letting Go / Acceptance',
    icon: '🍃',
    reactIcon: IoWater,
    description: 'Release and surrender',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200'
  }
]
