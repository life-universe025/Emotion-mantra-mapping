import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Import translation files
import enTranslations from './locales/en.json'
import hiTranslations from './locales/hi.json'
import esTranslations from './locales/es.json'
import frTranslations from './locales/fr.json'
import ruTranslations from './locales/ru.json'
import deTranslations from './locales/de.json'
import neTranslations from './locales/ne.json'
import orTranslations from './locales/or.json'
import bnTranslations from './locales/bn.json'
import teTranslations from './locales/te.json'
import paTranslations from './locales/pa.json'
import mrTranslations from './locales/mr.json'
import asTranslations from './locales/as.json'
import guTranslations from './locales/gu.json'
import knTranslations from './locales/kn.json'
import jaTranslations from './locales/ja.json'

// Language configuration
export const supportedLanguages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' }
]

const resources = {
  en: {
    translation: enTranslations
  },
  hi: {
    translation: hiTranslations
  },
  es: {
    translation: esTranslations
  },
  fr: {
    translation: frTranslations
  },
  ru: {
    translation: ruTranslations
  },
  de: {
    translation: deTranslations
  },
  ne: {
    translation: neTranslations
  },
  or: {
    translation: orTranslations
  },
  bn: {
    translation: bnTranslations
  },
  te: {
    translation: teTranslations
  },
  pa: {
    translation: paTranslations
  },
  mr: {
    translation: mrTranslations
  },
  as: {
    translation: asTranslations
  },
  gu: {
    translation: guTranslations
  },
  kn: {
    translation: knTranslations
  },
  ja: {
    translation: jaTranslations
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false, // Set to false for production
    
    // Supported languages
    supportedLngs: supportedLanguages.map(lang => lang.code),
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    },

    interpolation: {
      escapeValue: false // React already does escaping
    }
  })

export default i18n
