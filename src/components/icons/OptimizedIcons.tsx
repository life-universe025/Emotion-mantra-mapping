// Optimized SVG icon components - lightweight replacements for React Icons

interface IconProps {
  className?: string
  size?: number
}

// Play Icon
export const PlayIcon = ({ className = "w-5 h-5", size }: IconProps) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    width={size}
    height={size}
  >
    <path d="M8 5v14l11-7z"/>
  </svg>
)

// Pause Icon
export const PauseIcon = ({ className = "w-5 h-5", size }: IconProps) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    width={size}
    height={size}
  >
    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
  </svg>
)

// Refresh Icon
export const RefreshIcon = ({ className = "w-5 h-5", size }: IconProps) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    width={size}
    height={size}
  >
    <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
  </svg>
)

// Checkmark Icon
export const CheckmarkIcon = ({ className = "w-5 h-5", size }: IconProps) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    width={size}
    height={size}
  >
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
  </svg>
)

// Volume Icon
export const VolumeIcon = ({ className = "w-5 h-5", size }: IconProps) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    width={size}
    height={size}
  >
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
  </svg>
)

// Settings Icon
export const SettingsIcon = ({ className = "w-5 h-5", size }: IconProps) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    width={size}
    height={size}
  >
    <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
  </svg>
)

// Close Icon
export const CloseIcon = ({ className = "w-5 h-5", size }: IconProps) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    width={size}
    height={size}
  >
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </svg>
)

// Heart Icon
export const HeartIcon = ({ className = "w-5 h-5", size }: IconProps) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    width={size}
    height={size}
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
)

// Bullseye Icon
export const BullseyeIcon = ({ className = "w-5 h-5", size }: IconProps) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    width={size}
    height={size}
  >
    <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z"/>
  </svg>
)

// Search Icon
export const SearchIcon = ({ className = "w-5 h-5", size }: IconProps) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    width={size}
    height={size}
  >
    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
  </svg>
)

// Sparkles Icon
export const SparklesIcon = ({ className = "w-5 h-5", size }: IconProps) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    width={size}
    height={size}
  >
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
)

// Person Icon
export const PersonIcon = ({ className = "w-5 h-5", size }: IconProps) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    width={size}
    height={size}
  >
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </svg>
)

// Calendar Icon
export const CalendarIcon = ({ className = "w-5 h-5", size }: IconProps) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    width={size}
    height={size}
  >
    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
  </svg>
)

// Flame Icon
export const FlameIcon = ({ className = "w-5 h-5", size }: IconProps) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    width={size}
    height={size}
  >
    <path d="M17.66 11.2C17.43 10.9 17.15 10.64 16.85 10.42C16.55 10.2 16.22 10.02 15.87 9.88C15.52 9.74 15.15 9.64 14.77 9.58C14.39 9.52 14 9.5 13.61 9.5C13.22 9.5 12.83 9.52 12.45 9.58C12.07 9.64 11.7 9.74 11.35 9.88C11 10.02 10.67 10.2 10.37 10.42C10.07 10.64 9.79 10.9 9.56 11.2C9.33 11.5 9.15 11.83 9.01 12.18C8.87 12.53 8.77 12.9 8.71 13.28C8.65 13.66 8.63 14.05 8.63 14.44C8.63 14.83 8.65 15.22 8.71 15.6C8.77 15.98 8.87 16.35 9.01 16.7C9.15 17.05 9.33 17.38 9.56 17.68C9.79 17.98 10.07 18.24 10.37 18.46C10.67 18.68 11 18.86 11.35 19C11.7 19.14 12.07 19.24 12.45 19.3C12.83 19.36 13.22 19.38 13.61 19.38C14 19.38 14.39 19.36 14.77 19.3C15.15 19.24 15.52 19.14 15.87 19C16.22 18.86 16.55 18.68 16.85 18.46C17.15 18.24 17.43 17.98 17.66 17.68C17.89 17.38 18.07 17.05 18.21 16.7C18.35 16.35 18.45 15.98 18.51 15.6C18.57 15.22 18.59 14.83 18.59 14.44C18.59 14.05 18.57 13.66 18.51 13.28C18.45 12.9 18.35 12.53 18.21 12.18C18.07 11.83 17.89 11.5 17.66 11.2Z"/>
  </svg>
)

// Trophy Icon
export const TrophyIcon = ({ className = "w-5 h-5", size }: IconProps) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    width={size}
    height={size}
  >
    <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V7C19 8.1 18.1 9 17 9H16V10H18C18.55 10 19 10.45 19 11S18.55 12 18 12H6C5.45 12 5 11.55 5 11S5.45 10 6 10H8V9H7C5.9 9 5 8.1 5 7V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V7C7 7.55 7.45 8 8 8H16C16.55 8 17 7.55 17 7V6H7ZM9 11H15V13H9V11Z"/>
  </svg>
)

// Time Icon
export const TimeIcon = ({ className = "w-5 h-5", size }: IconProps) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    width={size}
    height={size}
  >
    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
    <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
  </svg>
)

// Bar Chart Icon
export const BarChartIcon = ({ className = "w-5 h-5", size }: IconProps) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    width={size}
    height={size}
  >
    <path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z"/>
  </svg>
)

// Export all icons as a single object for easy access
export const OptimizedIcons = {
  Play: PlayIcon,
  Pause: PauseIcon,
  Refresh: RefreshIcon,
  Checkmark: CheckmarkIcon,
  Volume: VolumeIcon,
  Settings: SettingsIcon,
  Close: CloseIcon,
  Heart: HeartIcon,
  Bullseye: BullseyeIcon,
  Search: SearchIcon,
  Sparkles: SparklesIcon,
  Person: PersonIcon,
  Calendar: CalendarIcon,
  Flame: FlameIcon,
  Trophy: TrophyIcon,
  Time: TimeIcon,
  BarChart: BarChartIcon,
}
