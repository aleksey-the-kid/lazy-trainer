import { useEffect, useState } from 'react'

import { AppLayout } from '@/components/layout/AppLayout'
import type { AppPage } from '@/components/layout/AppSidebar'
import { useI18n } from '@/i18n/context'
import { AppUpdateProvider } from '@/lib/app-update'
import type { User } from '@/db'
import {
  clearCurrentUser,
  getCurrentUser,
  saveGoogleUser,
} from '@/lib/google-auth'
import { ConsoleLogsPage } from '@/pages/ConsoleLogsPage'
import { LoginPage } from '@/pages/LoginPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { SettingsPage } from '@/pages/SettingsPage'
import { WorkoutsPage } from '@/pages/WorkoutsPage'

function App() {
  const { t, ready: i18nReady } = useI18n()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState<AppPage>('workouts')

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

  useEffect(() => {
    getCurrentUser()
      .then((storedUser) => setUser(storedUser ?? null))
      .finally(() => setLoading(false))
  }, [])

  async function handleGoogleSuccess(credential: string) {
    const savedUser = await saveGoogleUser(credential)
    setUser(savedUser)
    setPage('workouts')
  }

  async function handleLogout() {
    await clearCurrentUser()
    setUser(null)
    setPage('workouts')
  }

  if (loading || !i18nReady) {
    return (
      <main className="flex min-h-svh items-center justify-center">
        <p className="text-muted-foreground">{t('common.loading')}</p>
      </main>
    )
  }

  if (!user) {
    return (
      <LoginPage
        onSuccess={handleGoogleSuccess}
        missingClientId={!googleClientId}
      />
    )
  }

  return (
    <AppUpdateProvider
      currentPage={page}
      onNavigateToSettings={() => setPage('settings')}
    >
      <AppLayout
        user={user}
        currentPage={page}
        onNavigate={setPage}
        onSignOut={handleLogout}
      >
        {page === 'profile' && <ProfilePage user={user} />}
        {page === 'workouts' && <WorkoutsPage user={user} />}
        {page === 'settings' && <SettingsPage user={user} />}
        {page === 'console' && <ConsoleLogsPage />}
      </AppLayout>
    </AppUpdateProvider>
  )
}

export default App
