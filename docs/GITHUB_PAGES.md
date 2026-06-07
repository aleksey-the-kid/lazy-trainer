# Deploy to GitHub Pages

This guide covers hosting Lazy Trainer on **GitHub Pages** with automatic deploys from the `master` branch.

Production URL for this repo:

**https://aleksey-the-kid.github.io/lazy-trainer/**

---

## How it works

1. Push to `master`.
2. GitHub Actions runs `npm run build` and uploads the `dist` folder.
3. GitHub Pages serves the static files.

The workflow lives in [`.github/workflows/deploy-pages.yml`](../.github/workflows/deploy-pages.yml).

GitHub Pages serves project sites from a **subpath** (`/lazy-trainer/`), not from the domain root. The build sets `VITE_BASE_PATH=/lazy-trainer/` so assets, the PWA manifest, and the service worker resolve correctly.

---

## One-time setup

### 1. Enable GitHub Pages

1. Open the repo on GitHub → **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions** (not “Deploy from a branch”).

After the first successful workflow run, the site URL appears on that page.

### 2. Add repository secrets

Go to **Settings → Secrets and variables → Actions → New repository secret**.

| Secret | Required | Purpose |
|--------|----------|---------|
| `VITE_GOOGLE_CLIENT_ID` | Yes | Google Sign-In |
| `VITE_SUPABASE_URL` | No | Cloud backup |
| `VITE_SUPABASE_ANON_KEY` | No | Cloud backup |

These are the same values as in your local `.env`. Vite embeds them at build time.

### 3. Update Google OAuth origins

In [Google Cloud Console](https://console.cloud.google.com/) → **APIs & Services → Credentials** → your Web client, add this **Authorized JavaScript origin**:

```
https://aleksey-the-kid.github.io
```

Keep `http://localhost:5173` for local development. See [GOOGLE_LOGIN.md](./GOOGLE_LOGIN.md) for the full Google setup.

If you use a **custom domain** on GitHub Pages, add that origin too (for example `https://lazy-trainer.example.com`).

### 4. Push the workflow

Make sure `.github/workflows/deploy-pages.yml` is on `master`. The next push triggers the first deploy.

---

## Deploy

```bash
git push origin master
```

Watch progress under **Actions** in the GitHub repo. A green run means the site is live (usually within 1–2 minutes).

You can also run the workflow manually: **Actions → Deploy to GitHub Pages → Run workflow**.

---

## Preview the GitHub Pages build locally

```bash
npm run build
# PowerShell
$env:VITE_BASE_PATH="/lazy-trainer/"; npm run build
npm run preview
```

Open the preview URL and append `/lazy-trainer/` to the path if needed.

---

## Custom domain (optional)

If you attach a custom domain in **Settings → Pages**, you can serve the app from `/` instead of `/lazy-trainer/`:

1. Set the custom domain in GitHub Pages settings.
2. In `.github/workflows/deploy-pages.yml`, change the build env to `VITE_BASE_PATH: /` (or remove the line).
3. Add the custom domain to Google OAuth **Authorized JavaScript origins**.

---

## GitHub Pages vs Cloudflare Pages

| | GitHub Pages | Cloudflare Pages |
|---|--------------|------------------|
| URL | `username.github.io/repo/` | `project.pages.dev` (root) |
| Base path | `/lazy-trainer/` | `/` |
| Env vars | GitHub Actions secrets | Cloudflare dashboard |
| Deploy | Push to `master` | Push or dashboard |

You can use either host. Default local and Cloudflare builds use `base: '/'`. GitHub Actions sets `VITE_BASE_PATH=/lazy-trainer/` automatically.

---

## Troubleshooting

### Blank page or 404 on assets

The site was probably built without the correct base path. Confirm the workflow passes `VITE_BASE_PATH: /lazy-trainer/` and redeploy.

### Google Sign-In fails

Check that `https://aleksey-the-kid.github.io` is listed under **Authorized JavaScript origins** (no trailing path, no `/lazy-trainer`).

### Stuck on an old version (PWA)

Open **Settings → Check for updates** or **Reload** in the app. If you still see an old build, clear site data for `aleksey-the-kid.github.io` in the browser and open the app again.

### Workflow fails on `npm ci`

Ensure `package-lock.json` is committed and in sync with `package.json`.
