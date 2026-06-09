# achievements-ui Specification

## Purpose
TBD - created by archiving change basic-achievements. Update Purpose after archive.
## Requirements
### Requirement: Achievements are visible on Profile

The Profile page SHALL include an Achievements tab displaying all catalog achievements with locked or unlocked state.

#### Scenario: User opens achievements tab

- **WHEN** the user navigates to Profile → Achievements
- **THEN** all catalog achievements are listed with icon, title, description, and locked/unlocked visual state

### Requirement: Unlocked achievements show unlock date

Unlocked achievement cards SHALL display the date the achievement was earned.

#### Scenario: View unlocked achievement

- **WHEN** an achievement is unlocked
- **THEN** the card shows the unlock date formatted per user language

### Requirement: Locked achievements are visually distinct

Locked achievements SHALL appear muted with a lock indicator and SHALL NOT show an unlock date.

#### Scenario: View locked achievement

- **WHEN** an achievement criterion is not yet met
- **THEN** the card uses muted styling and a lock icon

### Requirement: Session unlock feedback

When achievements unlock as a result of user action during the current session (not silent backfill), the app SHALL show brief visual feedback.

#### Scenario: Unlock on workout complete

- **WHEN** the user completes a workout and earns a new achievement
- **THEN** a toast or inline notification displays the achievement title

### Requirement: UI matches design system

Achievement cards SHALL use existing design tokens: `sport-card`, rounded corners, orange accent for unlocked state.

#### Scenario: Visual consistency

- **WHEN** viewing the achievements tab
- **THEN** cards follow the warm light theme and glass/card patterns used elsewhere in the app
