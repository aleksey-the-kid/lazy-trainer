import { db, type User } from '@/db'
import { ensureProfile } from '@/lib/profile'
import { restoreRemoteUserIfConfigured } from '@/lib/supabase/restore'
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

  await restoreRemoteUserIfConfigured(user.id)

  await db.users.put(user)
  mirrorUserUpsert(user)
  await ensureProfile(user)
  return user
}
