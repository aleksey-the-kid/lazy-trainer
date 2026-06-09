## ADDED Requirements

### Requirement: Dev test login on login page

When dev test login is available, the login page SHALL show a secondary dev test login control below the Google Sign-In button on the existing frosted-glass panel, styled as a muted secondary action consistent with the design system.

#### Scenario: Developer on localhost in dev mode

- **WHEN** the login page renders in dev mode on localhost
- **THEN** both Google Sign-In (if client id is configured) and a dev test login control are visible on the glass panel

#### Scenario: Missing Google client id in dev

- **WHEN** `VITE_GOOGLE_CLIENT_ID` is unset and dev test login is available
- **THEN** the dev test login control is still shown so the developer can enter the app
