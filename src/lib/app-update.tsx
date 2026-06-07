import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'

import { UpdateToast } from '@/components/app/UpdateToast'
import { useI18n } from '@/i18n/context'
import { APP_VERSION } from '@/version'

interface AppUpdateContextValue {
  updateAvailable: boolean
  currentVersion: string
  checkForUpdate: () => Promise<void>
  applyUpdate: () => Promise<void>
}

const AppUpdateContext = createContext<AppUpdateContextValue | null>(null)

interface AppUpdateProviderProps {
  children: ReactNode
  currentPage: string
  onNavigateToSettings: () => void
}

export function AppUpdateProvider({
  children,
  currentPage,
  onNavigateToSettings,
}: AppUpdateProviderProps) {
  const { t } = useI18n()
  const registrationRef = useRef<ServiceWorkerRegistration | undefined>(undefined)
  const [toastDismissed, setToastDismissed] = useState(false)

  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    immediate: true,
    onRegistered(registration) {
      registrationRef.current = registration
      void registration?.update()
    },
    onNeedRefresh() {
      setToastDismissed(false)
    },
  })

  const checkForUpdate = useCallback(async () => {
    await registrationRef.current?.update()
  }, [])

  const applyUpdate = useCallback(async () => {
    await updateServiceWorker(true)
  }, [updateServiceWorker])

  useEffect(() => {
    function onVisibilityChange() {
      if (document.visibilityState === 'visible') {
        void checkForUpdate()
      }
    }

    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => document.removeEventListener('visibilitychange', onVisibilityChange)
  }, [checkForUpdate])

  useEffect(() => {
    if (currentPage === 'settings') {
      void checkForUpdate()
    }
  }, [currentPage, checkForUpdate])

  const openSettingsForUpdate = useCallback(() => {
    setToastDismissed(true)
    onNavigateToSettings()
  }, [onNavigateToSettings])

  const toastVisible = needRefresh && !toastDismissed && currentPage !== 'settings'

  return (
    <AppUpdateContext.Provider
      value={{
        updateAvailable: needRefresh,
        currentVersion: APP_VERSION,
        checkForUpdate,
        applyUpdate,
      }}
    >
      {children}
      {toastVisible && (
        <UpdateToast message={t('settings.updateToast')} onClick={openSettingsForUpdate} />
      )}
    </AppUpdateContext.Provider>
  )
}

export function useAppUpdate() {
  const context = useContext(AppUpdateContext)
  if (!context) {
    throw new Error('useAppUpdate must be used within AppUpdateProvider')
  }
  return context
}
