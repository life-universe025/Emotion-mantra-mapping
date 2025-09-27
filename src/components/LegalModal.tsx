import { useTranslation } from 'react-i18next'
import { IoClose, IoDocumentText, IoShieldCheckmark } from 'react-icons/io5'

interface LegalModalProps {
  type: 'terms' | 'privacy'
  isOpen: boolean
  onClose: () => void
}

export function LegalModal({ type, isOpen, onClose }: LegalModalProps) {
  const { t } = useTranslation()

  if (!isOpen) return null

  const isTerms = type === 'terms'
  const title = isTerms ? t('legal.termsAndConditions.title') : t('legal.privacyPolicy.title')
  const subtitle = isTerms ? t('legal.termsAndConditions.subtitle') : t('legal.privacyPolicy.subtitle')
  const Icon = isTerms ? IoDocumentText : IoShieldCheckmark

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-2xl border-2 border-amber-200/60 dark:border-amber-700/60 overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-b border-amber-200/30 dark:border-amber-700/30 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-900 via-orange-800 to-yellow-800 dark:from-amber-300 dark:via-orange-300 dark:to-yellow-300 bg-clip-text text-transparent font-traditional">
                  {title}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {subtitle}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/40 dark:border-gray-700/40 hover:bg-white/80 dark:hover:bg-gray-700/60 transition-colors"
            >
              <IoClose className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6">
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              {isTerms ? t('legal.termsAndConditions.lastUpdated') : t('legal.privacyPolicy.lastUpdated')}
            </div>

            {isTerms ? (
              <>
                <section className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 font-traditional">
                    {t('legal.termsAndConditions.acceptance.title')}
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {t('legal.termsAndConditions.acceptance.content')}
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 font-traditional">
                    {t('legal.termsAndConditions.serviceDescription.title')}
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    {t('legal.termsAndConditions.serviceDescription.content')}
                  </p>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                    <li>{t('legal.termsAndConditions.serviceDescription.features.mantras')}</li>
                    <li>{t('legal.termsAndConditions.serviceDescription.features.affirmations')}</li>
                    <li>{t('legal.termsAndConditions.serviceDescription.features.tracking')}</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 font-traditional">
                    {t('legal.termsAndConditions.userAccounts.title')}
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    {t('legal.termsAndConditions.userAccounts.content')}
                  </p>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                    <li>{t('legal.termsAndConditions.userAccounts.responsibilities.accuracy')}</li>
                    <li>{t('legal.termsAndConditions.userAccounts.responsibilities.security')}</li>
                    <li>{t('legal.termsAndConditions.userAccounts.responsibilities.notify')}</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 font-traditional">
                    {t('legal.termsAndConditions.privacy.title')}
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {t('legal.termsAndConditions.privacy.content')}
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 font-traditional">
                    {t('legal.termsAndConditions.disclaimers.title')}
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    {t('legal.termsAndConditions.disclaimers.content')}
                  </p>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                    <li>{t('legal.termsAndConditions.disclaimers.notMedical')}</li>
                    <li>{t('legal.termsAndConditions.disclaimers.noGuarantee')}</li>
                    <li>{t('legal.termsAndConditions.disclaimers.userResponsibility')}</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 font-traditional">
                    {t('legal.termsAndConditions.limitation.title')}
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {t('legal.termsAndConditions.limitation.content')}
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 font-traditional">
                    {t('legal.termsAndConditions.termination.title')}
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {t('legal.termsAndConditions.termination.content')}
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 font-traditional">
                    {t('legal.termsAndConditions.changes.title')}
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {t('legal.termsAndConditions.changes.content')}
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 font-traditional">
                    {t('legal.termsAndConditions.contact.title')}
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {t('legal.termsAndConditions.contact.content')}
                  </p>
                </section>
              </>
            ) : (
              <>
                <section className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 font-traditional">
                    {t('legal.privacyPolicy.introduction.title')}
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {t('legal.privacyPolicy.introduction.content')}
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 font-traditional">
                    {t('legal.privacyPolicy.informationWeCollect.title')}
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    {t('legal.privacyPolicy.informationWeCollect.content')}
                  </p>
                  
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 font-traditional">
                    {t('legal.privacyPolicy.informationWeCollect.personalInfo.title')}
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4 mb-4">
                    <li>{t('legal.privacyPolicy.informationWeCollect.personalInfo.email')}</li>
                    <li>{t('legal.privacyPolicy.informationWeCollect.personalInfo.name')}</li>
                    <li>{t('legal.privacyPolicy.informationWeCollect.personalInfo.avatar')}</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 font-traditional">
                    {t('legal.privacyPolicy.informationWeCollect.usageData.title')}
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4 mb-4">
                    <li>{t('legal.privacyPolicy.informationWeCollect.usageData.sessions')}</li>
                    <li>{t('legal.privacyPolicy.informationWeCollect.usageData.preferences')}</li>
                    <li>{t('legal.privacyPolicy.informationWeCollect.usageData.device')}</li>
                    <li>{t('legal.privacyPolicy.informationWeCollect.usageData.analytics')}</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 font-traditional">
                    {t('legal.privacyPolicy.howWeUse.title')}
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    {t('legal.privacyPolicy.howWeUse.content')}
                  </p>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                    <li>{t('legal.privacyPolicy.howWeUse.purposes.service')}</li>
                    <li>{t('legal.privacyPolicy.howWeUse.purposes.personalization')}</li>
                    <li>{t('legal.privacyPolicy.howWeUse.purposes.analytics')}</li>
                    <li>{t('legal.privacyPolicy.howWeUse.purposes.communication')}</li>
                    <li>{t('legal.privacyPolicy.howWeUse.purposes.improvement')}</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 font-traditional">
                    {t('legal.privacyPolicy.dataSharing.title')}
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    {t('legal.privacyPolicy.dataSharing.content')}
                  </p>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                    <li>{t('legal.privacyPolicy.dataSharing.scenarios.service')}</li>
                    <li>{t('legal.privacyPolicy.dataSharing.scenarios.legal')}</li>
                    <li>{t('legal.privacyPolicy.dataSharing.scenarios.consent')}</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 font-traditional">
                    {t('legal.privacyPolicy.dataSecurity.title')}
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    {t('legal.privacyPolicy.dataSecurity.content')}
                  </p>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                    <li>{t('legal.privacyPolicy.dataSecurity.measures.encryption')}</li>
                    <li>{t('legal.privacyPolicy.dataSecurity.measures.access')}</li>
                    <li>{t('legal.privacyPolicy.dataSecurity.measures.monitoring')}</li>
                    <li>{t('legal.privacyPolicy.dataSecurity.measures.backup')}</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 font-traditional">
                    {t('legal.privacyPolicy.yourRights.title')}
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    {t('legal.privacyPolicy.yourRights.content')}
                  </p>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                    <li>{t('legal.privacyPolicy.yourRights.rights.access')}</li>
                    <li>{t('legal.privacyPolicy.yourRights.rights.correction')}</li>
                    <li>{t('legal.privacyPolicy.yourRights.rights.deletion')}</li>
                    <li>{t('legal.privacyPolicy.yourRights.rights.portability')}</li>
                    <li>{t('legal.privacyPolicy.yourRights.rights.restriction')}</li>
                    <li>{t('legal.privacyPolicy.yourRights.rights.objection')}</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 font-traditional">
                    {t('legal.privacyPolicy.cookies.title')}
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {t('legal.privacyPolicy.cookies.content')}
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 font-traditional">
                    {t('legal.privacyPolicy.dataRetention.title')}
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {t('legal.privacyPolicy.dataRetention.content')}
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 font-traditional">
                    {t('legal.privacyPolicy.children.title')}
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {t('legal.privacyPolicy.children.content')}
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 font-traditional">
                    {t('legal.privacyPolicy.changes.title')}
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {t('legal.privacyPolicy.changes.content')}
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 font-traditional">
                    {t('legal.privacyPolicy.contact.title')}
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {t('legal.privacyPolicy.contact.content')}
                  </p>
                </section>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
