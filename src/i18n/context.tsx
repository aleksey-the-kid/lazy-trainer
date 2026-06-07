import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import type { Language } from '@/db'
import { getSettings, saveLanguage } from '@/lib/settings'

import { translations, type TranslationKey } from './translations'

interface I18nContextValue {
  language: Language
  setLanguage: (language: Language) => Promise<void>
  t: (key: TranslationKey) => string
  ready: boolean
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ru')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  useEffect(() => {
    getSettings()
      .then((settings) => setLanguageState(settings.language))
      .finally(() => setReady(true))
  }, [])

  const setLanguage = useCallback(async (nextLanguage: Language) => {
    const settings = await saveLanguage(nextLanguage)
    setLanguageState(settings.language)
  }, [])

  const t = useCallback(
    (key: TranslationKey) => translations[language][key] ?? key,
    [language],
  )

  const value = useMemo(
    () => ({ language, setLanguage, t, ready }),
    [language, setLanguage, t, ready],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider')
  }
  return context
}
