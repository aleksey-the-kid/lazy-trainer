## ADDED Requirements

### Requirement: Dev test login is documented

`docs/DEVELOPER_WORKFLOW.md` SHALL document the dev test login: when it appears (dev mode + localhost), what test user identity is used, and that Google OAuth remains the path for production and LAN testing.

#### Scenario: Developer without Google credentials

- **WHEN** a developer runs `npm run dev` on localhost without `VITE_GOOGLE_CLIENT_ID`
- **THEN** the document explains they can use dev test login to exercise authenticated app logic locally
