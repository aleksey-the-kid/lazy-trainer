## Context

Current state (`src/index.css`, `index.html`):
- Dark-only theme: oklch blue-gray backgrounds, green primary (`oklch(0.78 0.19 145)`)
- `--radius: 0.75rem` (12px) — too small for reference designs
- Navigation via hamburger → sheet sidebar (`AppSidebar.tsx`)
- Login: centered icon + text, no imagery
- Charts: basic/default styling in profile/workout components
- Utility class `.sport-card` exists but underused

Reference designs establish:
- **Light warm base:** `#F5F0E8` range, peach-to-white gradients
- **Primary:** vibrant orange (`#FF6B2C` / similar) for CTAs and active states
- **Secondary chart accent:** magenta/berry pink
- **Contrast panels:** deep charcoal for activity overlays (optional, for active workout)
- **Glass:** `backdrop-filter: blur(16–24px)` + semi-transparent white
- **Radius:** 20–32px on cards, pill (`9999px`) on buttons and nav
- **Imagery:** full-bleed photos on hero/feature cards

## Goals / Non-Goals

**Goals:**

- Establish a token-based design system reusable across all screens
- Match reference quality: spacing, photography, glass, orange accent
- Replace sidebar-first nav with floating bottom tab bar (sidebar retained for account/sign-out only, or merged into profile)
- Upgrade all four main pages + login without feature regression
- Optimize images for mobile PWA (WebP, lazy load, aspect-ratio placeholders)

**Non-Goals:**

- New features (meal tracking, maps, social "people were here", AI search from reference)
- Light/dark theme toggle (light only for now)
- React Router or URL-based navigation
- Third-party UI kit migration (stay on Tailwind 4 + `@base-ui/react`)
- Custom illustration library — use photography + Lucide icons

## Decisions

### 1. Light-only theme via CSS variables

Replace `:root` / `.dark` tokens in `src/index.css` with a single warm light palette. Remove `class="dark"` from `index.html`.

**Alternative:** Support both themes. Rejected — reference is light-only; halves design effort.

### 2. Orange primary, pink chart secondary

| Token | Value (starting point) | Usage |
|-------|------------------------|-------|
| `--background` | warm off-white `oklch(0.97 0.01 80)` | page bg |
| `--primary` | vibrant orange `oklch(0.68 0.19 45)` | buttons, active nav |
| `--chart-2` | magenta `oklch(0.55 0.22 350)` | secondary data series |
| `--foreground` | dark gray `oklch(0.25 0.02 260)` | text |
| `--card` | white `oklch(1 0 0)` | card surfaces |

Fine-tune during implementation against reference screenshots.

### 3. Floating bottom navigation

New `BottomNav.tsx` with 4 tabs: Workouts, Profile, Settings (+ Console hidden or in Settings for dev). Matches reference pill nav with frosted glass.

Hamburger menu demoted or removed; sign-out moves to Settings or profile avatar menu.

**Alternative:** Keep sidebar. Rejected — reference clearly uses bottom nav as primary pattern.

### 4. Curated stock imagery

Add 4–6 optimized images under `public/images/ui/`:
- Login hero (athlete/training)
- Workout template placeholders by type (strength, cardio)
- Optional category-style backgrounds

Use royalty-free sources (Unsplash/Pexels) with documented URLs in a comment or `public/images/ui/ATTRIBUTION.md`.

**Alternative:** CSS gradients only. Rejected — reference relies heavily on photography.

### 5. Component upgrade order

1. Tokens + base styles (`index.css`)
2. Primitives (`button`, `input`, new `card` variants)
3. App shell (`AppLayout`, header, bottom nav)
4. Login → Workouts → Profile → Settings
5. Charts last (WeightChart, ExerciseCharts, CalorieBreakdown)

### 6. Glass utility classes

Add Tailwind-compatible utilities in `index.css`:

```css
.glass-panel {
  background: oklch(1 0 0 / 0.65);
  backdrop-filter: blur(20px);
}
```

Use on nav bar, login overlay, floating cards.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Larger bundle from images | WebP, max 800px width, lazy loading |
| Glass blur performance on low-end phones | Reduce blur on `@media (prefers-reduced-motion)` / optional fallback solid bg |
| Scope creep copying reference features | Spec limits changes to visual layer; no new domains (meals, maps) |
| i18n layout breaks with new typography | Test ru/en on all screens; keep flexible containers |
| PWA manifest colors outdated | Update `vite.config.ts` manifest `theme_color` / `background_color` to orange/warm |

## Migration Plan

Phased rollout in one PR or sequential page PRs:
1. Tokens + shell (app usable but mixed old/new)
2. All pages restyled
3. Remove dead sidebar code if fully replaced
4. Update `docs/PROJECT_CONTEXT.md` known gaps section

No data migration. Users see new UI on next deploy/PWA refresh.

## Open Questions

- Hide Console page from bottom nav (keep in Settings for dev) or expose as 5th tab?
- Use real user photo everywhere vs. stock hero images on list cards?
- Active workout screen: adopt reference dark overlay panel for in-session view?
