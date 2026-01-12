import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Import translation files
import enCommon from '@/locales/en/common.json'
import enAuth from '@/locales/en/auth.json'
import enAdmin from '@/locales/en/admin.json'
import enDashboard from '@/locales/en/dashboard.json'
import enWorkspace from '@/locales/en/workspace.json'

import boCommon from '@/locales/bo/common.json'
import boAuth from '@/locales/bo/auth.json'
import boAdmin from '@/locales/bo/admin.json'
import boDashboard from '@/locales/bo/dashboard.json'
import boWorkspace from '@/locales/bo/workspace.json'

// Translation resources
const resources = {
  en: {
    common: enCommon,
    auth: enAuth,
    admin: enAdmin,
    dashboard: enDashboard,
    workspace: enWorkspace,
  },
  bo: {
    common: boCommon,
    auth: boAuth,
    admin: boAdmin,
    dashboard: boDashboard,
    workspace: boWorkspace,
  },
}

// Get initial language from localStorage or default to 'en'
const getInitialLanguage = (): string => {
  try {
    const stored = localStorage.getItem('ui-storage')
    if (stored) {
      const parsed = JSON.parse(stored)
      return parsed.state?.language ?? 'en'
    }
  } catch {
    // Ignore parse errors
  }
  return 'en'
}

i18n.use(initReactI18next).init({
  resources,
  lng: getInitialLanguage(),
  fallbackLng: 'en',
  defaultNS: 'common',
  ns: ['common', 'auth', 'admin', 'dashboard', 'workspace'],

  interpolation: {
    escapeValue: false, // React already escapes values
  },

  react: {
    useSuspense: false, // Disable suspense for simpler setup
  },
})

export default i18n

