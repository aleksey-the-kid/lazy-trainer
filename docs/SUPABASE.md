# Supabase backup

The app keeps working offline with IndexedDB. When Supabase env vars are set, every local write is mirrored to Supabase in the background.

## Setup

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** and run [`supabase/schema.sql`](../supabase/schema.sql).
3. Copy **Project URL** and **anon public** key from **Project Settings → API**.
4. Add them to `.env`:

   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

5. Restart the dev server.

If the env vars are empty, Supabase sync is skipped — the app behaves as before.

## Login restore

When Supabase is configured, the app loads all data for the signed-in user from Supabase into IndexedDB (profile, workouts, history, settings, etc.) on **Google sign-in** and on **every app open** while a session exists. Local data for that user is replaced with the remote copy. After that, the app works offline as usual.

## Manual upload

Use **Sync to database** in Settings to wipe all remote data for the current account in Supabase and upload a fresh copy from local storage.

## Notes

- Reads always come from local IndexedDB.
- Supabase writes are fire-and-forget; failures are logged to the console and do not block the UI.
- The included RLS policies are open for a personal backup setup. Tighten them before exposing the anon key publicly.
