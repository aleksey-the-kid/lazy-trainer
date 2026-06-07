import { Download, RefreshCw, Upload } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { NativeSelect } from '@/components/ui/native-select'
import type { Language, User } from '@/db'
import { CHANGELOG } from '@/changelog'
import { useI18n } from '@/i18n/context'
import { useAppUpdate } from '@/lib/app-update'
import {
  downloadWorkoutExport,
  exportUserWorkoutData,
  importUserWorkoutData,
} from '@/lib/workout-import-export'
import {
  isSupabaseConfigured,
  pushLocalUserToSupabase,
} from '@/lib/supabase/sync'

interface SettingsPageProps {
  user: User
}

export function SettingsPage({ user }: SettingsPageProps) {
  const { t, language, setLanguage } = useI18n()
  const { updateAvailable, currentVersion, checkForUpdate, applyUpdate, reloadApp } =
    useAppUpdate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [exporting, setExporting] = useState(false)
  const [importing, setImporting] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [checkingUpdates, setCheckingUpdates] = useState(false)
  const [updateCheckMessage, setUpdateCheckMessage] = useState<string | null>(null)
  const [syncing, setSyncing] = useState(false)
  const [changelogOpen, setChangelogOpen] = useState(false)
  const [syncMessage, setSyncMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null,
  )
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null,
  )
  const supabaseEnabled = isSupabaseConfigured()

  useEffect(() => {
    void checkForUpdate()
  }, [checkForUpdate])

  async function handleExport() {
    setMessage(null)
    setExporting(true)
    try {
      const data = await exportUserWorkoutData(user.id)
      downloadWorkoutExport(data, user.id)
      setMessage({ type: 'success', text: t('settings.exportSuccess') })
    } catch {
      setMessage({ type: 'error', text: t('settings.exportError') })
    } finally {
      setExporting(false)
    }
  }

  async function handleImport(file: File) {
    if (!window.confirm(t('settings.importConfirm'))) return

    setMessage(null)
    setImporting(true)
    try {
      const { counts } = await importUserWorkoutData(user.id, file)
      const total =
        counts.workoutTemplates +
        counts.workoutHistory +
        counts.exerciseSetHistory
      setMessage({
        type: 'success',
        text: t('settings.importSuccess').replace('{count}', String(total)),
      })
    } catch (error) {
      const code = error instanceof Error ? error.message : ''
      if (code === 'INVALID_JSON' || code.startsWith('INVALID_')) {
        setMessage({ type: 'error', text: t('settings.importInvalid') })
      } else {
        setMessage({ type: 'error', text: t('settings.importError') })
      }
    } finally {
      setImporting(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  async function handleUpdate() {
    setUpdating(true)
    setUpdateCheckMessage(null)
    try {
      await applyUpdate()
    } finally {
      setUpdating(false)
    }
  }

  async function handleCheckForUpdates() {
    setUpdateCheckMessage(null)
    setCheckingUpdates(true)
    try {
      const found = await checkForUpdate()
      setUpdateCheckMessage(found ? t('settings.updateAvailable') : t('settings.upToDate'))
    } finally {
      setCheckingUpdates(false)
    }
  }

  async function handleSyncToDb() {
    setSyncMessage(null)
    setSyncing(true)
    try {
      await pushLocalUserToSupabase(user.id)
      setSyncMessage({ type: 'success', text: t('settings.syncSuccess') })
    } catch {
      setSyncMessage({ type: 'error', text: t('settings.syncError') })
    } finally {
      setSyncing(false)
    }
  }

  return (
    <div className="min-h-0 flex-1 space-y-4 overflow-y-auto">
      <div className="sport-card p-4">
        <div className="space-y-1.5">
          <Label className="text-muted-foreground">{t('settings.language')}</Label>
          <NativeSelect
            value={language}
            options={[
              { value: 'ru', label: t('settings.languageRu') },
              { value: 'en', label: t('settings.languageEn') },
            ]}
            onValueChange={(value) => void setLanguage(value as Language)}
          />
        </div>
      </div>

      <div className="sport-card space-y-3 p-4">
        <div>
          <Label className="text-muted-foreground">{t('settings.workoutData')}</Label>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('settings.workoutDataHint')}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            className="w-full"
            disabled={exporting || importing}
            onClick={() => void handleExport()}
          >
            <Download className="size-4" />
            {exporting ? t('settings.exporting') : t('settings.exportWorkouts')}
          </Button>
          <Button
            variant="outline"
            className="w-full"
            disabled={exporting || importing}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="size-4" />
            {importing ? t('settings.importing') : t('settings.importWorkouts')}
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (file) void handleImport(file)
          }}
        />

        {message && (
          <p
            className={
              message.type === 'success' ? 'text-sm text-primary' : 'text-sm text-destructive'
            }
          >
            {message.text}
          </p>
        )}
      </div>

      {supabaseEnabled && (
        <div className="sport-card space-y-3 p-4">
          <div>
            <Label className="text-muted-foreground">{t('settings.cloudSync')}</Label>
            <p className="mt-1 text-sm text-muted-foreground">
              {t('settings.cloudSyncHint')}
            </p>
          </div>

          <Button
            variant="outline"
            className="w-full"
            disabled={syncing || exporting || importing}
            onClick={() => void handleSyncToDb()}
          >
            <RefreshCw className="size-4" />
            {syncing ? t('settings.syncing') : t('settings.syncToDb')}
          </Button>

          {syncMessage && (
            <p
              className={
                syncMessage.type === 'success'
                  ? 'text-sm text-primary'
                  : 'text-sm text-destructive'
              }
            >
              {syncMessage.text}
            </p>
          )}
        </div>
      )}

      <div className="sport-card space-y-4 p-4">
        <div>
          <Label className="text-muted-foreground">{t('settings.appUpdates')}</Label>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('settings.appVersion').replace('{version}', currentVersion)}
          </p>
        </div>

        <div className="space-y-2">
          {updateAvailable && (
            <div className="space-y-2 rounded-lg border border-primary/30 bg-primary/5 p-3">
              <p className="text-sm text-foreground">{t('settings.updateAvailable')}</p>
              <Button className="w-full" disabled={updating} onClick={() => void handleUpdate()}>
                {updating ? t('common.loading') : t('settings.updateApp')}
              </Button>
            </div>
          )}

          <Button
            variant="outline"
            className="w-full"
            disabled={checkingUpdates || updating}
            onClick={() => void handleCheckForUpdates()}
          >
            <RefreshCw className={`size-4 ${checkingUpdates ? 'animate-spin' : ''}`} />
            {checkingUpdates ? t('common.loading') : t('settings.checkForUpdates')}
          </Button>

          <Button variant="outline" className="w-full" disabled={updating} onClick={reloadApp}>
            {t('settings.reloadApp')}
          </Button>

          {updateCheckMessage && (
            <p className="text-sm text-muted-foreground">{updateCheckMessage}</p>
          )}
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => setChangelogOpen((open) => !open)}
        >
          {changelogOpen ? t('settings.hideChangelog') : t('settings.showChangelog')}
        </Button>

        {changelogOpen && (
          <div className="space-y-3">
            <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
              {t('settings.changelog')}
            </p>
            <div className="space-y-4">
              {CHANGELOG.map((entry) => (
                <div key={entry.version} className="space-y-1.5">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground">v{entry.version}</p>
                    <p className="text-xs text-muted-foreground">{entry.date}</p>
                  </div>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {entry.changes[language].map((change) => (
                      <li key={change} className="flex gap-2">
                        <span className="text-primary">•</span>
                        <span>{change}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
