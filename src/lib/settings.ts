import type { AppSettings, Language } from '@/db'
import { db } from '@/db'
import { mirrorAppSettingsUpsert } from '@/lib/supabase/sync'

const DEFAULT_SETTINGS: AppSettings = {
  id: 'app',
  language: 'ru',
}

export async function getSettings(): Promise<AppSettings> {
  const settings = await db.settings.get('app')
  return settings ?? DEFAULT_SETTINGS
}

export async function saveLanguage(language: Language): Promise<AppSettings> {
  const settings: AppSettings = { id: 'app', language }
  await db.settings.put(settings)
  mirrorAppSettingsUpsert(settings)
  return settings
}
