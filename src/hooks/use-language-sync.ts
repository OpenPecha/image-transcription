import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useUIStore } from '@/store/use-ui-store'

/**
 * Hook to sync i18next language with Zustand store.
 * Also updates HTML lang attribute for accessibility.
 */
export function useLanguageSync() {
  const { i18n } = useTranslation()
  const language = useUIStore((state) => state.language)

  useEffect(() => {
    // Change i18n language when Zustand store changes
    if (i18n.language !== language) {
      i18n.changeLanguage(language)
    }

    // Update HTML lang attribute
    document.documentElement.lang = language
  }, [language, i18n])
}

