import { GoogleLoginButton } from '@/components/GoogleLoginButton'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/i18n/context'
import { isDevTestLoginAvailable } from '@/lib/dev-auth'
import { UI_IMAGES } from '@/lib/ui-images'
import { useEffect, useState } from 'react'

interface LoginPageProps {
  onSuccess: (credential: string) => void
  onDevTestLogin: () => void | Promise<void>
  missingClientId: boolean
}

export function LoginPage({ onSuccess, onDevTestLogin, missingClientId }: LoginPageProps) {
  const { t } = useI18n()
  const [error, setError] = useState<string | null>(null)
  const devTestLoginAvailable = isDevTestLoginAvailable()

  useEffect(() => {
    setError(null)
  }, [missingClientId])

  return (
    <main className="relative mx-auto flex min-h-svh w-full max-w-lg flex-col overflow-hidden bg-background">
      <div className="absolute inset-0">
        <img
          src={UI_IMAGES.loginHero}
          alt=""
          className="size-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/50" />
      </div>

      <div className="relative mt-auto px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <div className="glass-panel rounded-3xl p-6 shadow-[0_16px_48px_-12px_oklch(0.28_0.02_260_/_0.35)]">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {t('login.title')}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">{t('login.subtitle')}</p>
          </div>

          <div className="flex flex-col items-center gap-3">
            {missingClientId && (
              <p className="text-center text-sm text-destructive">
                {t('login.missingClientId')}
              </p>
            )}

            {!missingClientId && (
              <GoogleLoginButton
                onSuccess={onSuccess}
                onError={() => setError(t('login.failed'))}
              />
            )}

            {devTestLoginAvailable && (
              <Button
                type="button"
                variant="ghost"
                className="text-muted-foreground"
                onClick={() => void onDevTestLogin()}
              >
                {t('login.devTestLogin')}
              </Button>
            )}

            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        </div>
      </div>
    </main>
  )
}
