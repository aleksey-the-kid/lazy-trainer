# Lazy Trainer

**Train without the busywork.** Lazy Trainer is a lightweight fitness app that helps you plan workouts, log sets in seconds, and actually see your progress — without turning your phone into a spreadsheet.

Built as a **Progressive Web App**, it feels fast on mobile, works offline, and stays out of your way until you need it.

---

## Why Lazy Trainer?

Most gym apps want to be everything at once: social feeds, meal plans, subscription upsells, and a UI that takes ten taps to log one set.

Lazy Trainer goes the other way:

- **Open → start → check off sets → done.**
- Your data lives on your device first, so logging works even with bad gym Wi‑Fi.
- Charts and history appear when they matter — not as homework before every workout.

If you lift, run, or mix both, and you want a clean logbook that respects your time, this is for you.

---

## What you can do

### Plan workouts that match how you train

Create **strength** routines with exercises, sets, weight, and reps — or **cardio** sessions with duration and equipment. Reuse templates every week instead of rebuilding the same session from scratch.

When you add an exercise, pick from ones you've done before and **pull in your last sets automatically**. Less typing, more lifting.

### Run a session without friction

Start a template and tick off sets as you go. The app tracks volume in real time. Mark sets **to failure** when you didn't plan reps in advance — enter what you actually hit when you're done.

Add a **workout note** at the end ("felt heavy", "bad sleep", "PR day") and find it later in your history.

### See progress, not noise

- **Workout history** with full session details
- **Per-exercise charts** — weight, reps, volume over time
- **Profile tools** — weight log, body measurements, estimated daily calories

Support for **both-arm volume** (x2) on unilateral work, so your stats stay honest.

### Your data, your rules

Sign in with **Google**, keep everything in local storage, and optionally **back up to Supabase** when you want a cloud copy. **Import and export** your workout data as JSON — useful for migrations or peace of mind.

Available in **English** and **Russian**.

---

## How a typical session looks

1. Pick a template (or create one)
2. Tap **Start workout**
3. Check off sets — use **to failure** when needed
4. Hit **Finish**, add an optional note
5. History and exercise charts update automatically

That's it. No feed. No ads. Just training.

---

## Technical details

### Stack

| Layer | Tech |
|-------|------|
| UI | React 19, TypeScript, Tailwind CSS 4 |
| Build | Vite 8, PWA (`vite-plugin-pwa`) |
| Local DB | Dexie (IndexedDB) |
| Auth | Google OAuth (`@react-oauth/google`) |
| Cloud backup | Supabase (optional) |

### Getting started

```bash
npm install
cp .env.example .env   # fill in keys below
npm run dev
```

Open the dev server URL on your machine or LAN (see `vite.config.ts` — `host: true` is enabled for phone testing).

### Environment variables

| Variable | Purpose |
|----------|---------|
| `VITE_GOOGLE_CLIENT_ID` | Google Sign-In |
| `VITE_SUPABASE_URL` | Supabase project URL (optional backup) |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key (optional backup) |

See [docs/GOOGLE_LOGIN.md](docs/GOOGLE_LOGIN.md) and [docs/SUPABASE.md](docs/SUPABASE.md) for setup notes.

### Scripts

```bash
npm run dev      # development server
npm run build    # production build
npm run preview  # preview production build
npm run lint     # ESLint
```

### Docs

- [Workout data model](docs/DATABASE_WORKOUTS.md) — IndexedDB schema and import format
- [Deploy to GitHub Pages](docs/GITHUB_PAGES.md) — CI deploy and production URL
- [Supabase schema](supabase/schema.sql) — cloud backup tables

### License

Private project. All rights reserved unless stated otherwise.
