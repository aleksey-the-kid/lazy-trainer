# dev-test-login Specification

## Purpose
TBD - created by archiving change dev-test-login. Update Purpose after archive.
## Requirements
### Requirement: Dev test login creates a local user

When dev test login is triggered, the system SHALL create or update a fixed test user in IndexedDB and run the same post-login steps as Google sign-in (profile ensure, optional Supabase restore, user mirror).

#### Scenario: Dev test login on localhost

- **WHEN** the developer clicks the dev test login control in dev mode on localhost
- **THEN** a user with id `dev-test-user` is stored in IndexedDB and the app enters the authenticated state

#### Scenario: Post-login parity with Google

- **WHEN** dev test login completes successfully
- **THEN** `ensureProfile` runs and Supabase restore is attempted when Supabase is configured, matching Google sign-in behavior

### Requirement: Dev test login is dev-only

Dev test login code and UI SHALL only exist when `import.meta.env.DEV` is true. Production builds SHALL NOT include a dev test login control or executable path.

#### Scenario: Production build

- **WHEN** the app is built with `npm run build` and served
- **THEN** no dev test login button or handler is present in the bundle behavior

### Requirement: Dev test login is localhost-only

The dev test login control SHALL only render when the page hostname is `localhost` or `127.0.0.1`.

#### Scenario: Dev server on LAN IP

- **WHEN** the app runs in dev mode at a non-localhost hostname (e.g. `192.168.1.10`)
- **THEN** the dev test login control is not shown

### Requirement: Fixed test user identity

The dev test user SHALL use a stable identity: id `dev-test-user`, email `dev@localhost`, display name `Dev User`.

#### Scenario: Repeated dev logins

- **WHEN** the developer signs out and uses dev test login again
- **THEN** the same user id is used and prior local data for that id is retained

