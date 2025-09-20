import { useState, useEffect } from 'react'
import { IoFlame, IoStar, IoSparkles } from 'react-icons/io5'

interface StreakAnimationProps {
  streak: number
  onAnimationComplete?: () => void
}

const getStreakMilestone = (streak: number) => {
  if (streak >= 100) return { level: 'legendary', emoji: '🏆', title: 'Century Master!', color: 'from-purple-500 to-pink-500' }
  if (streak >= 50) return { level: 'master', emoji: '👑', title: 'Streak Master!', color: 'from-yellow-400 to-orange-500' }
  if (streak >= 30) return { level: 'champion', emoji: '🥇', title: 'Champion!', color: 'from-blue-400 to-purple-500' }
  if (streak >= 21) return { level: 'warrior', emoji: '⚡', title: '3-Week Warrior!', color: 'from-green-400 to-blue-500' }
  if (streak >= 14) return { level: 'dedicated', emoji: '💪', title: '2-Week Dedication!', color: 'from-orange-400 to-red-500' }
  if (streak >= 7) return { level: 'committed', emoji: '🔥', title: 'Week Warrior!', color: 'from-red-400 to-orange-500' }
  if (streak >= 3) return { level: 'building', emoji: '🌱', title: 'Building Momentum!', color: 'from-green-400 to-teal-500' }
  return { level: 'start', emoji: '✨', title: 'Great Start!', color: 'from-amber-400 to-orange-500' }
}

export function StreakAnimation({ streak, onAnimationComplete }: StreakAnimationProps) {
  const [showAnimation, setShowAnimation] = useState(false)
  const [particles, setParticles] = useState<Array<{ id: number, x: number, y: number, delay: number }>>([])

  const milestone = getStreakMilestone(streak)
  const shouldCelebrate = streak > 0 && (streak % 7 === 0 || streak === 3 || streak === 21 || streak === 30 || streak === 50 || streak === 100)

  useEffect(() => {
    if (shouldCelebrate) {
      setShowAnimation(true)
      
      // Create particles for animation
      const newParticles = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 0.5
      }))
      setParticles(newParticles)

      const timer = setTimeout(() => {
        setShowAnimation(false)
        onAnimationComplete?.()
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [streak, shouldCelebrate, onAnimationComplete])

  if (!showAnimation) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm animate-fade-in" />
      
      {/* Main celebration card */}
      <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-3xl p-8 max-w-sm mx-4 shadow-2xl animate-bounce-in">
        {/* Gradient border */}
        <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${milestone.color} p-0.5`}>
          <div className="w-full h-full bg-white/90 dark:bg-gray-800/90 rounded-3xl" />
        </div>
        
        {/* Content */}
        <div className="relative text-center">
          {/* Large emoji */}
          <div className="text-6xl mb-4 animate-pulse">
            {milestone.emoji}
          </div>
          
          {/* Streak number */}
          <div className={`text-4xl font-bold bg-gradient-to-r ${milestone.color} bg-clip-text text-transparent mb-2`}>
            {streak} Days!
          </div>
          
          {/* Title */}
          <div className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            {milestone.title}
          </div>
          
          {/* Subtitle */}
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Your dedication is inspiring! 🙏
          </div>
          
          {/* Flame icon for fire streaks */}
          {streak >= 7 && (
            <div className="mt-4">
              <IoFlame className="w-8 h-8 text-orange-500 mx-auto animate-bounce" />
            </div>
          )}
        </div>
      </div>
      
      {/* Floating particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-float-up"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`
          }}
        >
          {streak >= 21 ? (
            <IoStar className="w-4 h-4 text-yellow-400" />
          ) : streak >= 7 ? (
            <IoSparkles className="w-4 h-4 text-orange-400" />
          ) : (
            <div className="w-2 h-2 bg-amber-400 rounded-full" />
          )}
        </div>
      ))}
      
      {/* Confetti effect for major milestones */}
      {(streak === 21 || streak === 30 || streak === 50 || streak === 100) && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                backgroundColor: ['#f59e0b', '#ea580c', '#dc2626', '#7c3aed', '#059669'][Math.floor(Math.random() * 5)]
              }}
            >
              <div className="w-2 h-2 rotate-45" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Add custom animations to your CSS or Tailwind config
const styles = `
@keyframes bounce-in {
  0% {
    transform: scale(0.3) rotate(-15deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.05) rotate(5deg);
  }
  70% {
    transform: scale(0.95) rotate(-2deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

@keyframes float-up {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) rotate(360deg);
    opacity: 0;
  }
}

@keyframes confetti {
  0% {
    transform: translateY(-100vh) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-bounce-in {
  animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.animate-float-up {
  animation: float-up 3s linear;
}

.animate-confetti {
  animation: confetti 3s linear infinite;
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
`

// Inject styles (you might want to add these to your main CSS file instead)
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style')
  styleSheet.textContent = styles
  document.head.appendChild(styleSheet)
}
