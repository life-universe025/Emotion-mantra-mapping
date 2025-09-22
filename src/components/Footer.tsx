
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LegalModal } from './LegalModal'

export function Footer() {
  const currentYear = new Date().getFullYear()
  const { t } = useTranslation()
  const [showLegalModal, setShowLegalModal] = useState<'terms' | 'privacy' | null>(null)

  return (
    <footer className="relative mt-16 py-8 bg-gradient-to-r from-orange-50/80 via-amber-50/80 to-yellow-50/80 dark:from-gray-900/80 dark:via-slate-900/80 dark:to-gray-800/80 border-t border-amber-200/30 dark:border-gray-700/30">
      {/* Spiritual background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-4 left-8 text-2xl text-amber-200/20 dark:text-amber-400/10 font-sanskrit select-none">ॐ</div>
        <div className="absolute bottom-4 right-8 text-2xl text-orange-200/20 dark:text-orange-400/10 font-sanskrit select-none">🪷</div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <div className="text-center">
          {/* Main footer content */}
          <div className="mb-4">
            <p className="text-sm text-amber-700 dark:text-amber-200 font-traditional">
              {t('footer.madeWith')}
            </p>
          </div>

          {/* Sanskrit blessing */}
          <div className="mb-3">
            <p className="text-xs text-amber-600 dark:text-amber-300 italic font-sanskrit">
              "सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः"
            </p>
            <p className="text-xs text-amber-500 dark:text-amber-400 mt-1">
              {t('footer.blessingTranslation')}
            </p>
          </div>

          {/* Legal Links */}
          <div className="mb-4">
            <div className="flex justify-center gap-6 text-xs">
              <button
                onClick={() => setShowLegalModal('terms')}
                className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors underline decoration-amber-300 dark:decoration-amber-500 hover:decoration-amber-400 dark:hover:decoration-amber-400"
              >
                {t('footer.termsAndConditions')}
              </button>
              <button
                onClick={() => setShowLegalModal('privacy')}
                className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors underline decoration-amber-300 dark:decoration-amber-500 hover:decoration-amber-400 dark:hover:decoration-amber-400"
              >
                {t('footer.privacyPolicy')}
              </button>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-xs text-gray-500 dark:text-gray-400">
            <p>{t('footer.copyright', { year: currentYear })}</p>
            <p className="mt-1 opacity-75">{t('footer.sacredSpace')}</p>
          </div>
        </div>
      </div>

      {/* Legal Modal */}
      <LegalModal
        type={showLegalModal || 'terms'}
        isOpen={showLegalModal !== null}
        onClose={() => setShowLegalModal(null)}
      />
    </footer>
  )
}
