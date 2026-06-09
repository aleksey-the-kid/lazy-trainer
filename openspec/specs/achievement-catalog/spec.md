# achievement-catalog Specification

## Purpose
TBD - created by archiving change basic-achievements. Update Purpose after archive.
## Requirements
### Requirement: Achievement catalog exists

The application SHALL define a static catalog of basic achievements with unique IDs, Lucide icon names, and i18n translation keys for title and description.

#### Scenario: Developer adds achievement

- **WHEN** the catalog is loaded
- **THEN** each achievement has `id`, `icon`, `titleKey`, `descriptionKey`, and a evaluable criterion type

### Requirement: Starter achievements cover core milestones

The catalog SHALL include at minimum: first completed workout, 5 workouts, 10 workouts, first template, first weight log, and 3 distinct workout days.

#### Scenario: User completes first workout

- **WHEN** the user finishes their first workout
- **THEN** the `first-workout` achievement becomes eligible for unlock

#### Scenario: User logs weight

- **WHEN** the user saves their first weight entry
- **THEN** the `first-weight` achievement becomes eligible for unlock

### Requirement: Achievement metadata is bilingual

All achievement titles and descriptions SHALL be available in Russian and English via the i18n system.

#### Scenario: Russian user views achievements

- **WHEN** app language is `ru`
- **THEN** achievement titles and descriptions display in Russian
