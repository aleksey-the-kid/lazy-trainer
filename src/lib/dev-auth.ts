import { db, type User } from '@/db'
import { ensureProfile } from '@/lib/profile'
import { isSupabaseConfigured } from '@/lib/supabase/client'
import { restoreUserFromSupabase } from '@/lib/supabase/restore'
import { mirrorUserUpsert } from '@/lib/supabase/sync'

export const DEV_TEST_USER_ID = 'dev-test-user'

function isLocalhost(): boolean {
  const host = window.location.hostname
  return host === 'localhost' || host === '127.0.0.1'
}

export function isDevTestLoginAvailable(): boolean {
  return import.meta.env.DEV && isLocalhost()
}

export async function saveDevTestUser(): Promise<User> {
  const user: User = {
    id: DEV_TEST_USER_ID,
    email: 'dev@localhost',
    name: 'Dev User',
    picture: '',
    loggedInAt: new Date(),
  }

  if (isSupabaseConfigured()) {
    try {
      await restoreUserFromSupabase(user.id)
    } catch (error) {
      console.warn('[supabase] restore failed:', error)
    }
  }

  await db.users.put(user)
  mirrorUserUpsert(user)
  await ensureProfile(user)
  return user
}
