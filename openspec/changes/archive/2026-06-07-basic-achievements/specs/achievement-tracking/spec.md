## ADDED Requirements

### Requirement: User achievements are persisted

The application SHALL store unlocked achievements per user in IndexedDB table `userAchievements` with fields `id`, `userId`, `achievementId`, and `unlockedAt`.

#### Scenario: Achievement unlocks

- **WHEN** a user meets an achievement criterion for the first time
- **THEN** a row is written to `userAchievements` with the unlock timestamp

### Requirement: Achievements are evaluated on key events

The system SHALL re-check achievement criteria after workout completion, template creation, and weight entry save.

#### Scenario: Workout completion triggers check

- **WHEN** `completeWorkout` succeeds
- **THEN** the achievement engine runs for that user and unlocks any newly earned achievements

### Requirement: Retroactive backfill is supported

The system SHALL unlock achievements based on existing user data when the achievement check runs, without requiring new activity after the feature ships.

#### Scenario: Existing user opens achievements

- **WHEN** a user with 10+ workouts in history opens the achievements tab for the first time after the feature ships
- **THEN** previously earned achievements appear as unlocked

### Requirement: Supabase mirror for achievements

When Supabase is configured, unlocked achievements SHALL be mirrored to PostgreSQL and restored on login.

#### Scenario: Login restore

- **WHEN** a user signs in with Supabase configured
- **THEN** `user_achievements` rows are restored into IndexedDB along with other user data

### Requirement: Duplicate unlocks are prevented

The system SHALL NOT create duplicate unlock records for the same user and achievement ID.

#### Scenario: Repeated evaluation

- **WHEN** achievement check runs multiple times after criteria are already met
- **THEN** no additional rows are created for already-unlocked achievements
