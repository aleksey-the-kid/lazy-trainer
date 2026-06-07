# Workout data model (Lazy Trainer)

This document describes **only workout-related** IndexedDB tables in `LazyTrainerDB`. Use it to map external data (notebook, Excel, CSV, another app) into the app format.

Database engine: **Dexie** (IndexedDB in the browser).

---

## Overview: what exists in the app

```
WorkoutTemplate     → reusable plan ("Push day", "Morning cardio")
WorkoutSession      → one started workout (active or completed)
WorkoutHistoryEntry → summary after finishing a session
ExerciseSetHistory  → each completed strength set (for exercise charts)
KnownExercise       → dictionary of exercise names user ever created
```

Typical flow:

1. User creates a **template**
2. User **starts** workout → **session** is created from template
3. User marks sets done (strength) or checkbox (cardio)
4. User **finishes** → **WorkoutHistoryEntry** + **ExerciseSetHistory** rows are written

For **importing old notebook logs**, you usually write directly to:

- `workoutTemplates` — if you want reusable routines
- `workoutHistory` + `exerciseSetHistory` — if you only have past completed workouts
- `knownExercises` — so exercises appear in the Exercises tab

You do **not** need `workoutSessions` unless you import an in-progress workout.

---

## Shared enums

### `WorkoutType`

| Value | Meaning |
|-------|---------|
| `strength` | Exercises with sets (weight + reps) |
| `cardio` | Duration + equipment only |

### `CardioEquipment` (only when `type = cardio`)

| Value | UI (RU) | UI (EN) |
|-------|---------|---------|
| `bike` | Велосипед | Exercise bike |
| `treadmill` | Беговая дорожка | Treadmill |
| `elliptical` | Эллипс | Elliptical |

---

## IDs and dates

| Rule | Format / example |
|------|------------------|
| New record id | UUID v4, e.g. `crypto.randomUUID()` |
| `userId` | Google `sub` from login (same on all user tables) |
| Calendar date | `YYYY-MM-DD`, e.g. `2026-03-15` |
| Date-time | JavaScript `Date` (ISO in IndexedDB) |
| Exercise name key | Trimmed string; `"  Bench Press  "` → `"Bench Press"` |
| `KnownExercise.id` | `{userId}_{exerciseName}` |
| `sessionId` in history | Must match the session UUID you reference |

---

## 1. `workoutTemplates`

Reusable workout plans shown on the Workouts tab.

### Strength template

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "userId": "google-sub-123",
  "name": "Push",
  "type": "strength",
  "cardioDurationMinutes": null,
  "cardioEquipment": null,
  "exercises": [
    {
      "id": "ex-uuid-1",
      "name": "Bench press",
      "sets": [
        { "id": "set-uuid-1", "weightKg": 80, "reps": 8 },
        { "id": "set-uuid-2", "weightKg": 80, "reps": 6 }
      ]
    },
    {
      "id": "ex-uuid-2",
      "name": "Overhead press",
      "sets": [
        { "id": "set-uuid-3", "weightKg": 50, "reps": 10 }
      ]
    }
  ],
  "createdAt": "2026-01-10T12:00:00.000Z",
  "updatedAt": "2026-03-01T18:30:00.000Z"
}
```

### Cardio template

```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "userId": "google-sub-123",
  "name": "Morning cardio",
  "type": "cardio",
  "cardioDurationMinutes": 30,
  "cardioEquipment": "treadmill",
  "exercises": [],
  "createdAt": "2026-02-01T09:00:00.000Z",
  "updatedAt": "2026-02-01T09:00:00.000Z"
}
```

### Field reference

| Field | Strength | Cardio |
|-------|----------|--------|
| `name` | required | required |
| `type` | `"strength"` | `"cardio"` |
| `exercises` | ≥1 exercise, each ≥1 set | always `[]` |
| `exercises[].name` | exercise label | — |
| `exercises[].sets[].weightKg` | number (kg) | — |
| `exercises[].sets[].reps` | integer | — |
| `cardioDurationMinutes` | `null` | number > 0 |
| `cardioEquipment` | `null` | `bike` \| `treadmill` \| `elliptical` |

When saving a strength template, also upsert each exercise name into `knownExercises`.

---

## 2. `workoutSessions`

A single run of a workout. Usually created by the app on **Start**; import only if needed.

### Strength session (completed example)

```json
{
  "id": "session-uuid-1",
  "userId": "google-sub-123",
  "templateId": "550e8400-e29b-41d4-a716-446655440000",
  "templateName": "Push",
  "type": "strength",
  "cardioDurationMinutes": null,
  "cardioEquipment": null,
  "cardioCompleted": false,
  "status": "completed",
  "startedAt": "2026-03-15T17:00:00.000Z",
  "completedAt": "2026-03-15T18:05:00.000Z",
  "exercises": [
    {
      "id": "ex-sess-1",
      "name": "Bench press",
      "sets": [
        { "id": "set-sess-1", "weightKg": 80, "reps": 8, "completed": true },
        { "id": "set-sess-2", "weightKg": 80, "reps": 6, "completed": true }
      ]
    }
  ]
}
```

### Cardio session

```json
{
  "id": "session-uuid-2",
  "userId": "google-sub-123",
  "templateId": "660e8400-e29b-41d4-a716-446655440001",
  "templateName": "Morning cardio",
  "type": "cardio",
  "cardioDurationMinutes": 30,
  "cardioEquipment": "bike",
  "cardioCompleted": true,
  "status": "completed",
  "startedAt": "2026-03-16T07:00:00.000Z",
  "completedAt": "2026-03-16T07:32:00.000Z",
  "exercises": []
}
```

| Field | Notes |
|-------|--------|
| `status` | `"active"` (in progress) or `"completed"` |
| `completed` on sets | only strength; which sets were actually done |
| `cardioCompleted` | only cardio; user checked "done" |
| Active sessions | at most **one** per user with `status: "active"` |

---

## 3. `workoutHistory`

One row per **finished** workout. Shown on Workouts → History tab.

### Strength history row

```json
{
  "id": "history-uuid-1",
  "userId": "google-sub-123",
  "templateId": "550e8400-e29b-41d4-a716-446655440000",
  "templateName": "Push",
  "sessionId": "session-uuid-1",
  "workoutType": "strength",
  "completedAt": "2026-03-15T18:05:00.000Z",
  "totalVolumeKg": 1120,
  "cardioDurationMinutes": null,
  "cardioEquipment": null
}
```

**`totalVolumeKg`** = sum of `weightKg × reps` for all sets with `completed: true` in that session.

Example: 80×8 + 80×6 = 640 + 480 = **1120**.

### Cardio history row

```json
{
  "id": "history-uuid-2",
  "userId": "google-sub-123",
  "templateId": "660e8400-e29b-41d4-a716-446655440001",
  "templateName": "Morning cardio",
  "sessionId": "session-uuid-2",
  "workoutType": "cardio",
  "completedAt": "2026-03-16T07:32:00.000Z",
  "totalVolumeKg": null,
  "cardioDurationMinutes": 30,
  "cardioEquipment": "bike"
}
```

If you import history **without** a real template, you can:

- reuse an existing `templateId`, or
- create a dummy template with the same `id` and `templateName` as in the history row

---

## 4. `exerciseSetHistory`

One row per **completed strength set**. Powers Workouts → Exercises tab (weight/reps over time).

```json
{
  "id": "set-history-uuid-1",
  "userId": "google-sub-123",
  "exerciseName": "Bench press",
  "date": "2026-03-15",
  "weightKg": 80,
  "reps": 8,
  "sessionId": "session-uuid-1"
}
```

| Field | Notes |
|-------|--------|
| `exerciseName` | trimmed name; must match across imports for same exercise |
| `date` | `YYYY-MM-DD` (workout completion day, not separate per-set time) |
| `sessionId` | links sets from one workout |

Import rule: **one notebook line = one row** (if the line is one set).

Also add/update `knownExercises`:

```json
{
  "id": "google-sub-123_Bench press",
  "userId": "google-sub-123",
  "name": "Bench press"
}
```

---

## 5. `knownExercises`

Dictionary for the exercise picker. Not strictly required if you only import templates (app fills this on save), but **required** for Exercises tab if you import history only.

```json
{
  "id": "google-sub-123_Squat",
  "userId": "google-sub-123",
  "name": "Squat"
}
```

---

## Mapping notebook → database

### Example notebook (strength)

```
15.03.2026 — Push
Жим лёжа: 80×8, 80×6, 75×8
Жим стоя: 50×10, 50×8
```

**Minimal import (history only):**

1. Generate `sessionId = <uuid>`
2. One `workoutHistory` row:
   - `templateName`: `"Push"`
   - `workoutType`: `"strength"`
   - `completedAt`: `2026-03-15T20:00:00.000Z` (pick a time)
   - `totalVolumeKg`: 80×8 + 80×6 + 75×8 + 50×10 + 50×8 = **2860**
3. Five `exerciseSetHistory` rows (normalize names: `"Жим лёжа"` → pick one spelling and keep it consistent)
4. Two `knownExercises` rows for `"Жим лёжа"` and `"Жим стоя"`

Optional: create `workoutTemplates` entry `"Push"` with the same structure for future use.

### Example notebook (cardio)

```
16.03 — дорожка 35 мин
```

**Import:**

1. `workoutHistory`:
   - `workoutType`: `"cardio"`
   - `templateName`: `"Cardio"` (any label)
   - `cardioDurationMinutes`: 35
   - `cardioEquipment`: `"treadmill"`
   - `totalVolumeKg`: null

No `exerciseSetHistory` for cardio.

### Ambiguous notebook lines

| Notebook | Map to |
|----------|--------|
| `100kg 5` | one set: weight 100, reps 5 |
| `5×100` or `100×5` | weight 100, reps 5 (app shows weight first) |
| `3×8×60` | 3 sets of 60 kg × 8 reps → **3 history rows** |
| `подтягивания 12, 10, 8` | exercise `"Подтягивания"`, bodyweight → `weightKg: 0` or skip weight |
| `бег 40 мин в парке` | cardio, `treadmill` or pick closest equipment |

---

## Import checklist

**Past strength workout (notebook log):**

- [ ] `workoutHistory` (1 row)
- [ ] `exerciseSetHistory` (1 row per set)
- [ ] `knownExercises` (1 row per unique exercise name)
- [ ] optional `workoutTemplates` if you want a plan in the app
- [ ] optional `workoutSessions` with `status: "completed"` if you want full fidelity

**Past cardio workout:**

- [ ] `workoutHistory` (1 row, cardio fields filled)
- [ ] optional cardio `workoutTemplates`

**Reusable program only (no dates):**

- [ ] `workoutTemplates` only
- [ ] `knownExercises` auto-filled when template is saved via app; set manually on raw import

---

## Volume formula (strength)

```
totalVolumeKg = Σ (weightKg × reps)   for each completed set
```

Uncheck/skipped sets in a session are **not** included. When importing from a notebook, assume all written sets were completed.

---

## Dexie table names (for DevTools)

| Table | IndexedDB store name |
|-------|----------------------|
| Templates | `workoutTemplates` |
| Sessions | `workoutSessions` |
| Workout history | `workoutHistory` |
| Set history | `exerciseSetHistory` |
| Exercise names | `knownExercises` |

Inspect in Chrome: **DevTools → Application → IndexedDB → LazyTrainerDB**.

---

## JSON bundle example (import script friendly)

```json
{
  "workoutTemplates": [],
  "workoutHistory": [
    {
      "id": "h1",
      "userId": "YOUR_GOOGLE_SUB",
      "templateId": "t1",
      "templateName": "Push",
      "sessionId": "s1",
      "workoutType": "strength",
      "completedAt": "2026-03-15T18:00:00.000Z",
      "totalVolumeKg": 2860,
      "cardioDurationMinutes": null,
      "cardioEquipment": null
    }
  ],
  "exerciseSetHistory": [
    {
      "id": "esh1",
      "userId": "YOUR_GOOGLE_SUB",
      "exerciseName": "Bench press",
      "date": "2026-03-15",
      "weightKg": 80,
      "reps": 8,
      "sessionId": "s1"
    }
  ],
  "knownExercises": [
    {
      "id": "YOUR_GOOGLE_SUB_Bench press",
      "userId": "YOUR_GOOGLE_SUB",
      "name": "Bench press"
    }
  ]
}
```

Replace `YOUR_GOOGLE_SUB` with the `users.id` value after first Google login in the app.
