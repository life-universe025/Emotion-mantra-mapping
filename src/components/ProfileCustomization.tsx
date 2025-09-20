import { IoColorPalette, IoSettings } from 'react-icons/io5'

interface ProfileCustomizationProps {
  className?: string
}

export function ProfileCustomization({ className = '' }: ProfileCustomizationProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Profile Customization</h4>
        <div className="space-y-2">
          <button className="w-full flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
            <div className="flex items-center space-x-2">
              <IoColorPalette className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Theme Preferences</span>
            </div>
            <span className="text-xs text-gray-500">Coming Soon</span>
          </button>
          
          <button className="w-full flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
            <div className="flex items-center space-x-2">
              <IoSettings className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Layout Options</span>
            </div>
            <span className="text-xs text-gray-500">Coming Soon</span>
          </button>
        </div>
      </div>
    </div>
  )
}
