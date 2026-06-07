## Why

The current UI reads as a functional stub: dark utilitarian theme, generic cards, sidebar navigation, and no visual personality. User-provided reference designs show the target quality — warm light palette, vibrant orange accents, glassmorphism, hero photography, floating pill navigation, and polished data visualization. A cohesive visual redesign will make Lazy Trainer feel like a premium fitness product without changing core functionality.

## What Changes

- Replace the dark-only theme with a warm light design system (beige/peach backgrounds, vibrant orange primary, magenta/pink chart accents).
- Introduce glassmorphism panels, large border radii (20–32px), soft diffused shadows, and generous spacing.
- Redesign app shell: welcome header with avatar, floating pill bottom navigation (replacing hamburger sidebar as primary nav).
- Upgrade Login page to hero-style layout with imagery and frosted-glass overlay (reference onboarding screen).
- Restyle Workouts, Profile, and Settings pages with photo-backed hero cards, filter chips, and premium list/card patterns.
- Restyle charts (weight history, exercise progress, calorie breakdown) with rounded bars, progress rings, and dual-color accents.
- Add curated fitness imagery assets (local WebP/PNG, optimized for PWA).
- Keep all existing features, data flows, and i18n — visual layer only.
- **BREAKING (visual):** Dark theme removed as default; `index.html` `class="dark"` dropped.

## Capabilities

### New Capabilities

- `visual-design-system`: Color tokens, typography scale, radii, shadows, glass effects, button/input/card primitives.
- `app-shell`: Layout chrome — header, floating bottom nav, page container, background gradients.
- `screen-experience`: Page-level visual patterns for Login, Workouts, Profile, Settings.
- `chart-styling`: Progress rings, bar charts, and stat cards matching reference quality.

### Modified Capabilities

<!-- No existing spec-level behavior changes — UI is visual-only -->

## Impact

- **CSS:** `src/index.css` — full token overhaul
- **Components:** `src/components/ui/*`, `src/components/layout/*`, all page and feature components
- **Assets:** new `public/images/` or `src/assets/` for reference-style photography
- **HTML:** `index.html` — theme class, PWA manifest colors
- **Docs:** `docs/PROJECT_CONTEXT.md` — update "dark theme only" gap after apply
- **No changes:** data layer, auth, Supabase, API, Dexie schema

## Design References

User-provided mockups (attached during propose):

1. **Onboarding / Home / Activity** — orange accent, glassmorphism, calendar strip, floating nav, dark activity panel on map
2. **Programs / Categories / Activity stats** — warm beige background, photo cards, filter chips, progress rings, stylized bar chart

Target vibe: premium, energetic, professional fitness app — not a generic shadcn stub.
