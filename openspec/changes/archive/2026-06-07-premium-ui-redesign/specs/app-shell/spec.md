## ADDED Requirements

### Requirement: Floating pill bottom navigation

The application SHALL provide a floating pill-shaped bottom navigation bar as the primary navigation method, replacing the hamburger sidebar as the main way to switch pages.

#### Scenario: User switches between pages

- **WHEN** the user taps a bottom nav icon
- **THEN** the app navigates to the corresponding page and the active icon is highlighted in orange

### Requirement: Welcome header with user avatar

The app header SHALL display a user avatar and greeting (e.g. "Welcome Back" + name) instead of a plain page title with hamburger menu.

#### Scenario: Logged-in user opens home/workouts page

- **WHEN** the main app shell renders
- **THEN** the header shows the user's avatar and a personalized greeting

### Requirement: Page background gradient

The app shell SHALL apply a subtle warm gradient (peach-to-white) at the top of the page background.

#### Scenario: User scrolls page content

- **WHEN** viewing any main page
- **THEN** a soft warm gradient is visible at the top of the viewport

### Requirement: Account actions accessible without sidebar

Sign-out and account-related actions SHALL remain accessible after sidebar demotion (via Settings page or avatar menu).

#### Scenario: User wants to sign out

- **WHEN** the user looks for sign-out
- **THEN** it is reachable from Settings or profile area without the old hamburger sidebar

### Requirement: Content area respects bottom nav

Page content SHALL include bottom padding to avoid overlap with the floating bottom navigation bar.

#### Scenario: User scrolls to bottom of a list

- **WHEN** the last item in a scrollable list is reached
- **THEN** it is fully visible above the bottom nav bar
