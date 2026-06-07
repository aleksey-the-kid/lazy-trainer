import { Dumbbell } from 'lucide-react'
import { useEffect, useState } from 'react'

import { GoogleLoginButton } from '@/components/GoogleLoginButton'
import { useI18n } from '@/i18n/context'

interface LoginPageProps {
  onSuccess: (credential: string) => void
  missingClientId: boolean
}

export function LoginPage({ onSuccess, missingClientId }: LoginPageProps) {
  const { t } = useI18n()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setError(null)
  }, [missingClientId])

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-lg flex-col items-center justify-center gap-8 border-x border-border/50 bg-background/95 p-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/15 ring-1 ring-primary/30">
          <Dumbbell className="size-8 text-primary" strokeWidth={2.25} />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {t('login.title')}
          </h1>
          <p className="mt-2 max-w-xs text-muted-foreground">{t('login.subtitle')}</p>
        </div>
      </div>

      {missingClientId ? (
        <p className="text-center text-sm text-destructive">
          {t('login.missingClientId')}
        </p>
      ) : (
        <div className="sport-card flex w-full max-w-xs flex-col items-center gap-3 p-5">
          <GoogleLoginButton
            onSuccess={onSuccess}
            onError={() => setError(t('login.failed'))}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      )}
    </main>
  )
}
