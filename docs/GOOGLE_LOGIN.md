# Google Sign-In Setup

This app uses [Google Identity Services](https://developers.google.com/identity/gsi/web) via `@react-oauth/google` for client-side authentication. User profile data is stored locally in IndexedDB through Dexie.

## Prerequisites

- A Google account
- Access to [Google Cloud Console](https://console.cloud.google.com/)

## 1. Create a Google Cloud project

1. Open [Google Cloud Console](https://console.cloud.google.com/).
2. Click the project selector in the top bar and choose **New Project**.
3. Enter a project name (for example, `lazy-trainer`) and click **Create**.
4. Make sure the new project is selected.

## 2. Configure the OAuth consent screen

1. Go to **APIs & Services → OAuth consent screen**.
2. Choose **External** (unless you use Google Workspace and want internal-only access).
3. Fill in the required fields:
   - **App name**: Lazy Trainer
   - **User support email**: your email
   - **Developer contact email**: your email
4. Click **Save and Continue** through the scopes step (default scopes are enough for sign-in).
5. Add yourself as a **Test user** while the app is in testing mode.
6. Finish the wizard.

## 3. Create OAuth 2.0 credentials

1. Go to **APIs & Services → Credentials**.
2. Click **Create Credentials → OAuth client ID**.
3. Select **Web application** as the application type.
4. Set a name (for example, `Lazy Trainer Web`).
5. Under **Authorized JavaScript origins**, add:
   - `http://localhost:5173` (Vite dev server)
   - Your production URL when you deploy (for example, `https://your-domain.com`)
6. You do **not** need to add redirect URIs for the Google Sign-In button used in this app.
7. Click **Create** and copy the **Client ID**.

## 4. Configure the app

1. Copy the example env file:

   ```bash
   cp .env.example .env
   ```

2. Paste your Client ID into `.env`:

   ```env
   VITE_GOOGLE_CLIENT_ID=123456789-abcdef.apps.googleusercontent.com
   ```

3. Restart the dev server if it is already running:

   ```bash
   npm run dev
   ```

4. Open `http://localhost:5173` and click **Sign in with Google**.

## 5. Verify it works

After a successful sign-in you should see:

- Your Google profile name and email on the page
- A user record stored in IndexedDB (`LazyTrainerDB → users`)

To inspect local storage in Chrome:

1. Open DevTools → **Application**
2. Expand **IndexedDB → LazyTrainerDB → users**

## Troubleshooting

### "Missing VITE_GOOGLE_CLIENT_ID"

The `.env` file is missing or the variable name is wrong. It must start with `VITE_` so Vite exposes it to the browser.

### "Error 400: redirect_uri_mismatch"

This usually means the origin is not listed in **Authorized JavaScript origins**. Add the exact URL shown in the browser address bar (scheme + host + port).

### "This app isn't verified"

While testing, keep the OAuth consent screen in **Testing** mode and add your Google account under **Test users**.

### Sign-in popup blocked

Allow popups for `localhost` in your browser, or try again after disabling popup blockers.

### Button does nothing in production

Make sure your production domain is added to **Authorized JavaScript origins** in Google Cloud Console.

## Security notes

- The Client ID is public and safe to embed in frontend code.
- Never put a Client Secret in a Vite frontend app.
- The JWT credential from Google is decoded on the client to read profile fields. For production apps that need trusted identity, validate the token on a backend server.

## Useful links

- [Google Identity Services documentation](https://developers.google.com/identity/gsi/web/guides/overview)
- [@react-oauth/google](https://www.npmjs.com/package/@react-oauth/google)
- [Dexie.js](https://dexie.org/)
