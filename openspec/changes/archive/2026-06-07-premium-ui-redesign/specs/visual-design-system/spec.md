## ADDED Requirements

### Requirement: Warm light color palette

The application SHALL use a warm light color palette with off-white/beige backgrounds and vibrant orange as the primary accent color, replacing the current dark theme as the default.

#### Scenario: User opens any screen

- **WHEN** the app loads after redesign
- **THEN** the background uses a warm off-white tone and primary actions use vibrant orange

### Requirement: Large border radii on containers

All card, sheet, and panel containers SHALL use border radii of at least 20px. Primary buttons and navigation elements SHALL use pill-shaped (fully rounded) styling.

#### Scenario: User views a workout template card

- **WHEN** a card is rendered on any page
- **THEN** its corners are visibly rounded (≥20px) matching the reference design language

### Requirement: Glassmorphism on floating surfaces

Floating navigation and overlay panels SHALL use semi-transparent backgrounds with backdrop blur (glassmorphism effect).

#### Scenario: User sees bottom navigation

- **WHEN** the floating bottom nav is displayed
- **THEN** it has a frosted-glass appearance with blur over page content beneath

### Requirement: Soft diffused shadows

Cards and floating elements SHALL use soft, low-opacity shadows for depth instead of hard borders.

#### Scenario: User views a hero card

- **WHEN** a featured card is displayed
- **THEN** it has a subtle diffused shadow and no heavy border outline

### Requirement: Typography hierarchy

The design system SHALL define a clear type hierarchy: large bold headings, medium body text, and lighter secondary labels consistent across all pages.

#### Scenario: User reads page header and card content

- **WHEN** viewing any page
- **THEN** headings are bold and prominent while secondary text is smaller and muted

### Requirement: Chart accent colors

Data visualization SHALL use orange as the primary series color and magenta/pink as the secondary series color.

#### Scenario: User views a dual-series chart

- **WHEN** a chart displays two data series
- **THEN** the primary series is orange and the secondary is magenta/pink
