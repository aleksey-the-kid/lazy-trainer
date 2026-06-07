## 1. Design foundation

- [x] 1.1 Define new CSS tokens in `src/index.css` (warm bg, orange primary, magenta chart accent, radii ≥20px)
- [x] 1.2 Remove dark-only theme: update `index.html`, drop forced `class="dark"`
- [x] 1.3 Add glass-panel and gradient utility classes
- [x] 1.4 Update PWA manifest colors in `vite.config.ts` (theme_color, background_color)

## 2. UI primitives

- [x] 2.1 Restyle `Button` — pill shape for primary, orange fill
- [x] 2.2 Restyle `Input`, `Label`, `NativeSelect` to match warm theme
- [x] 2.3 Create or extend card variants (hero, glass, stat) in UI components
- [x] 2.4 Update `Separator`, `Sheet` styling for light theme

## 3. Assets

- [x] 3.1 Add curated fitness images to `public/images/ui/` (WebP, optimized)
- [x] 3.2 Add `public/images/ui/ATTRIBUTION.md` with image sources
- [x] 3.3 Create helper for type-based placeholder images (strength/cardio)

## 4. App shell

- [x] 4.1 Build `BottomNav` floating pill component with glass effect
- [x] 4.2 Redesign `PageHeader` — avatar + greeting, remove hamburger as primary nav
- [x] 4.3 Update `AppLayout` — gradient bg, bottom nav, content padding
- [x] 4.4 Move sign-out to Settings or avatar menu; demote/remove sidebar nav
- [x] 4.5 Wire bottom nav to existing `AppPage` state in `App.tsx`

## 5. Login

- [x] 5.1 Redesign `LoginPage` with hero image + frosted glass overlay panel
- [x] 5.2 Style Google Sign-In area to match pill button aesthetic

## 6. Workouts

- [x] 6.1 Restyle `WorkoutsPage` tabs as filter chips
- [x] 6.2 Upgrade `WorkoutTemplatesList` with photo-backed cards
- [x] 6.3 Restyle `WorkoutDetailView`, `WorkoutBuilderSheet`
- [x] 6.4 Redesign `ActiveWorkoutView` with dark contrast stats panel
- [x] 6.5 Restyle history and exercise tabs (`WorkoutHistoryTab`, `ExerciseHistoryTab`)
- [x] 6.6 Upgrade `ExerciseCharts` per chart-styling spec

## 7. Profile & Settings

- [x] 7.1 Restyle `ProfilePage` layout and tab bar
- [x] 7.2 Upgrade `WeightChart` — rounded bars, dual colors
- [x] 7.3 Upgrade `CalorieBreakdownSheet` — progress rings
- [x] 7.4 Restyle `ProfileMeasurementsTab`, `BodyFigure`
- [x] 7.5 Restyle `SettingsPage` with card sections and consistent buttons

## 8. Polish & verification

- [x] 8.1 Test all screens in en and ru — no layout overflow
- [x] 8.2 Verify PWA install appearance (manifest, splash colors)
- [x] 8.3 Test on mobile viewport (max-w-lg) — bottom nav, glass blur
- [x] 8.4 Update `docs/PROJECT_CONTEXT.md` — remove "dark theme only" gap, note new design
- [x] 8.5 Visual comparison against user reference images
