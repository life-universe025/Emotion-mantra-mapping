import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { IoLanguage, IoChevronDown, IoCheckmark, IoSearch } from 'react-icons/io5'
import { supportedLanguages } from '../i18n'

interface LanguageSelectorProps {
  variant?: 'button' | 'dropdown'
  className?: string
}

// Simple alphabetical order - no grouping needed

export function LanguageSelector({ variant = 'button', className = '' }: LanguageSelectorProps) {
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const currentLanguage = supportedLanguages.find(lang => lang.code === i18n.language) || supportedLanguages[0]

  // Filter languages based on search query
  const filteredLanguages = useMemo(() => {
    if (!searchQuery.trim()) return supportedLanguages
    
    const query = searchQuery.toLowerCase()
    return supportedLanguages.filter(language => 
      language.name.toLowerCase().includes(query) ||
      language.nativeName.toLowerCase().includes(query) ||
      language.code.toLowerCase().includes(query)
    )
  }, [searchQuery])

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode)
    setIsOpen(false)
    setSearchQuery('') // Clear search when language is selected
  }

  const handleDropdownToggle = () => {
    setIsOpen(!isOpen)
    if (isOpen) {
      setSearchQuery('') // Clear search when closing dropdown
    }
  }


  if (variant === 'button') {
    // Simple toggle between first two languages (for backward compatibility)
    const toggleLanguage = () => {
      const currentIndex = supportedLanguages.findIndex(lang => lang.code === i18n.language)
      const nextIndex = (currentIndex + 1) % Math.min(2, supportedLanguages.length) // Only toggle between first 2 languages
      handleLanguageChange(supportedLanguages[nextIndex].code)
    }

    return (
      <button
        onClick={toggleLanguage}
        className={`inline-flex items-center gap-2 px-2.5 py-1.5 h-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 border border-gray-200/50 dark:border-gray-700/50 text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-all duration-200 rounded-md ${className}`}
        aria-label={`Switch to ${supportedLanguages.find(lang => lang.code !== i18n.language)?.name || 'other language'}`}
        title={`Switch to ${supportedLanguages.find(lang => lang.code !== i18n.language)?.name || 'other language'}`}
      >
        <IoLanguage className="w-4 h-4" />
        <span className="text-sm font-medium hidden sm:inline">
          {supportedLanguages.find(lang => lang.code !== i18n.language)?.nativeName || 'Other'}
        </span>
      </button>
    )
  }

  // Dropdown variant for multiple languages
  return (
    <div className={`relative ${className}`}>
      <button
        onClick={handleDropdownToggle}
        className="inline-flex items-center gap-2 px-3 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 border border-gray-200/50 dark:border-gray-700/50 text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-all duration-200 rounded-md shadow-sm hover:shadow-md"
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        <IoLanguage className="w-4 h-4" />
        <span className="text-sm font-medium">
          {currentLanguage.nativeName}
        </span>
        <IoChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 overflow-hidden max-h-72 flex flex-col">
            {/* Search Input */}
            <div className="p-1.5 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <IoSearch className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1 text-xs bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-transparent text-gray-700 dark:text-gray-300"
                  autoFocus
                />
              </div>
            </div>
            
            {/* Language List */}
            <div className="overflow-y-auto max-h-64">
              {filteredLanguages.length > 0 ? (
                filteredLanguages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => handleLanguageChange(language.code)}
                    className={`w-full px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 flex items-center justify-between ${
                      i18n.language === language.code 
                        ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300' 
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 flex-1">
                      <span className="font-medium text-sm">{language.nativeName}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">({language.name})</span>
                    </div>
                    {i18n.language === language.code && (
                      <IoCheckmark className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 ml-1" />
                    )}
                  </button>
                ))
              ) : (
                <div className="px-3 py-4 text-center text-gray-500 dark:text-gray-400 text-xs">
                  No languages found
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
