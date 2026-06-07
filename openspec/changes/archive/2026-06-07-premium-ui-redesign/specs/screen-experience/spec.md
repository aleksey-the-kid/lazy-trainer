## ADDED Requirements

### Requirement: Login hero layout

The login page SHALL use a full-width hero image with a frosted-glass overlay panel at the bottom containing the app title and Google Sign-In button.

#### Scenario: Unauthenticated user opens app

- **WHEN** the login page renders
- **THEN** a fitness hero image fills the upper area and sign-in controls sit on a blurred glass panel

### Requirement: Photo-backed feature cards

Workout template and category list items SHALL support photo-backed card layouts with text overlay, matching the reference Programs/Categories screens.

#### Scenario: User browses workout templates

- **WHEN** the templates list is displayed
- **THEN** cards use imagery (photo or type-specific placeholder) with rounded corners and text overlay

### Requirement: Filter chips on list views

List views with categories or tabs (e.g. workout templates, history) SHALL use horizontal pill-shaped filter chips with orange active state.

#### Scenario: User filters workout templates

- **WHEN** the user taps a filter chip
- **THEN** the active chip is highlighted in orange and the list updates accordingly

### Requirement: Premium empty and loading states

Empty states and loading indicators SHALL use styled containers consistent with the new design system, not plain text on bare background.

#### Scenario: User has no workout history

- **WHEN** the history tab is empty
- **THEN** an illustrated or styled empty state is shown instead of unstyled placeholder text

### Requirement: Active workout contrast panel

The active workout session view SHALL use a high-contrast dark panel for primary stats (timer, progress) similar to the reference activity tracking screen.

#### Scenario: User starts a workout session

- **WHEN** an active session is in progress
- **THEN** key stats are displayed on a dark contrast panel at the bottom of the screen

### Requirement: Settings page visual consistency

The settings page SHALL use the same card-based layout, spacing, and button styles as other redesigned pages.

#### Scenario: User opens settings

- **WHEN** the settings page renders
- **THEN** its sections use rounded cards, orange primary buttons, and consistent spacing with workouts/profile pages
