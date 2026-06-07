import { jwtDecode } from 'jwt-decode'

import { db, type User } from '@/db'
import { ensureProfile } from '@/lib/profile'
import { isSupabaseConfigured } from '@/lib/supabase/client'
import { restoreUserFromSupabase } from '@/lib/supabase/restore'
import { mirrorUserDelete, mirrorUserUpsert } from '@/lib/supabase/sync'

interface GoogleJwtPayload {
  sub: string
  email: string
  name: string
  picture: string
}

export async function saveGoogleUser(credential: string): Promise<User> {
  const payload = jwtDecode<GoogleJwtPayload>(credential)

  const user: User = {
    id: payload.sub,
    email: payload.email,
    name: payload.name,
    picture: payload.picture,
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

export async function getCurrentUser(): Promise<User | undefined> {
  const users = await db.users.orderBy('loggedInAt').reverse().toArray()
  return users[0]
}

export async function clearCurrentUser(): Promise<void> {
  const user = await getCurrentUser()
  if (!user) return

  await db.users.delete(user.id)
  mirrorUserDelete(user.id)
}
