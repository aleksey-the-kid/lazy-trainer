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
  checkForUpdate: () => Promise<boolean>
  applyUpdate: () => Promise<void>
  reloadApp: () => void
}

const AppUpdateContext = createContext<AppUpdateContextValue | null>(null)

interface AppUpdateProviderProps {
  children: ReactNode
  currentPage: string
}

async function getRegistration(
  current?: ServiceWorkerRegistration,
): Promise<ServiceWorkerRegistration | undefined> {
  if (current) return current
  if (!('serviceWorker' in navigator)) return undefined
  return navigator.serviceWorker.getRegistration()
}

function watchInstallingWorker(registration: ServiceWorkerRegistration, onWaiting: () => void) {
  const worker = registration.installing
  if (!worker) return

  worker.addEventListener('statechange', () => {
    if (worker.state === 'installed' && navigator.serviceWorker.controller) {
      onWaiting()
    }
  })
}

export function AppUpdateProvider({
  children,
  currentPage,
}: AppUpdateProviderProps) {
  const { t } = useI18n()
  const registrationRef = useRef<ServiceWorkerRegistration | undefined>(undefined)
  const [toastDismissed, setToastDismissed] = useState(false)
  const [hasWaitingWorker, setHasWaitingWorker] = useState(false)

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    immediate: true,
    onRegistered(registration) {
      registrationRef.current = registration
      setHasWaitingWorker(Boolean(registration?.waiting))
      void registration?.update()
      if (registration) {
        registration.addEventListener('updatefound', () => {
          watchInstallingWorker(registration, () => {
            setHasWaitingWorker(true)
            setNeedRefresh(true)
          })
        })
      }
    },
    onNeedRefresh() {
      setToastDismissed(false)
      setHasWaitingWorker(true)
    },
  })

  const updateAvailable = needRefresh || hasWaitingWorker

  const syncWaitingState = useCallback(async () => {
    const registration = await getRegistration(registrationRef.current)
    if (!registration) return false

    registrationRef.current = registration
    const waiting = Boolean(registration.waiting)
    setHasWaitingWorker(waiting)
    if (waiting) setNeedRefresh(true)
    return waiting
  }, [setNeedRefresh])

  const checkForUpdate = useCallback(async () => {
    const registration = await getRegistration(registrationRef.current)
    if (!registration) return false

    registrationRef.current = registration
    await registration.update()
    return syncWaitingState()
  }, [syncWaitingState])

  const applyUpdate = useCallback(async () => {
    const registration = await getRegistration(registrationRef.current)
    registrationRef.current = registration

    if (registration?.waiting || needRefresh || hasWaitingWorker) {
      await updateServiceWorker(true)
      return
    }

    await registration?.update()
    if (registration?.waiting) {
      await updateServiceWorker(true)
      return
    }

    window.location.reload()
  }, [hasWaitingWorker, needRefresh, updateServiceWorker])

  const reloadApp = useCallback(() => {
    window.location.reload()
  }, [])

  useEffect(() => {
    void syncWaitingState()
  }, [syncWaitingState])

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

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    function onControllerChange() {
      window.location.reload()
    }

    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange)
    return () =>
      navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange)
  }, [])

  const toastVisible = updateAvailable && !toastDismissed && currentPage !== 'settings'

  return (
    <AppUpdateContext.Provider
      value={{
        updateAvailable,
        currentVersion: APP_VERSION,
        checkForUpdate,
        applyUpdate,
        reloadApp,
      }}
    >
      {children}
      {toastVisible && (
        <UpdateToast
          message={t('settings.updateToast')}
          onClick={() => {
            setToastDismissed(true)
            void applyUpdate()
          }}
        />
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
