import { createContext, useContext, useState, ReactNode } from 'react'

interface ProfileCustomizationState {
  theme: 'light' | 'dark' | 'auto'
  layout: 'compact' | 'comfortable' | 'spacious'
  notifications: {
    achievements: boolean
    reminders: boolean
    insights: boolean
  }
}

interface ProfileCustomizationContextType {
  customization: ProfileCustomizationState
  updateTheme: (theme: ProfileCustomizationState['theme']) => void
  updateLayout: (layout: ProfileCustomizationState['layout']) => void
  updateNotifications: (notifications: Partial<ProfileCustomizationState['notifications']>) => void
  resetToDefaults: () => void
}

const defaultState: ProfileCustomizationState = {
  theme: 'auto',
  layout: 'comfortable',
  notifications: {
    achievements: true,
    reminders: true,
    insights: true,
  },
}

const ProfileCustomizationContext = createContext<ProfileCustomizationContextType | undefined>(undefined)

interface ProfileCustomizationProviderProps {
  children: ReactNode
}

export function ProfileCustomizationProvider({ children }: ProfileCustomizationProviderProps) {
  const [customization, setCustomization] = useState<ProfileCustomizationState>(defaultState)

  const updateTheme = (theme: ProfileCustomizationState['theme']) => {
    setCustomization(prev => ({ ...prev, theme }))
  }

  const updateLayout = (layout: ProfileCustomizationState['layout']) => {
    setCustomization(prev => ({ ...prev, layout }))
  }

  const updateNotifications = (notifications: Partial<ProfileCustomizationState['notifications']>) => {
    setCustomization(prev => ({
      ...prev,
      notifications: { ...prev.notifications, ...notifications }
    }))
  }

  const resetToDefaults = () => {
    setCustomization(defaultState)
  }

  const value: ProfileCustomizationContextType = {
    customization,
    updateTheme,
    updateLayout,
    updateNotifications,
    resetToDefaults,
  }

  return (
    <ProfileCustomizationContext.Provider value={value}>
      {children}
    </ProfileCustomizationContext.Provider>
  )
}

export function useProfileCustomization() {
  const context = useContext(ProfileCustomizationContext)
  if (context === undefined) {
    throw new Error('useProfileCustomization must be used within a ProfileCustomizationProvider')
  }
  return context
}
