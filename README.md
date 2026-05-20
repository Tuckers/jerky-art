# Jerky Collection — Cloudflare Pages Edition

A personal Pokémon TCG collection checklist for cards illustrated by Jerky, with cross-device sync via Cloudflare Pages Functions + KV.

## What's in this folder

```
jerky-cloudflare/
├── index.html                          # The app (single self-contained file)
└── functions/
    └── api/
        ├── storage.js                  # /api/storage  (GET, POST, DELETE)
        └── storage/
            └── list.js                 # /api/storage/list  (GET)
```

The HTML auto-detects which storage backend to use:

1. **Claude artifact runtime** → uses `window.storage`
2. **Cloudflare Pages** → uses these Functions + KV
3. **Anywhere else** → falls back to `localStorage`

You'll see which backend is active in the footer (e.g. "CF KV").

## Deploy steps

### 1. Create a KV namespace

In the Cloudflare dashboard → **Workers & Pages → KV → Create namespace**. Name it whatever you like (e.g. `jerky-collection`). Copy the namespace ID.

### 2. Create the Pages project

**Option A — Drag and drop (fastest):**
1. Go to **Workers & Pages → Create application → Pages → Upload assets**
2. Name the project (e.g. `jerky-collection`)
3. Drag this entire folder onto the upload area
4. Deploy

**Option B — Git:**
1. Push this folder to a GitHub repo
2. **Pages → Connect to Git** → select the repo
3. Build settings: framework `None`, output directory left blank
4. Deploy

### 3. Bind KV + set the write token

Go to your new Pages project → **Settings → Functions**:

- **KV namespace bindings**: add a binding with variable name `STORAGE_KV` pointing at the namespace from step 1
- **Environment variables → Production**: add `WRITE_TOKEN` with a long random string of your choice (this is your edit password)

Trigger a redeploy so the binding takes effect (any of: push a commit, click "Retry deployment", or change a setting).

### 4. Use it

Open the deployed URL. Reads work without auth. The first time you toggle a card or edit anything, the app will prompt for your edit token — paste in the `WRITE_TOKEN` value. It's stored in your browser's localStorage so you won't be asked again on that device.

## Behavior notes

**Per-device token cache.** The edit token is stored locally per browser. To set it up on a new device or browser, just visit the site and make any change — you'll be prompted.

**Wrong token.** A 401 response clears the cached token automatically; you'll be re-prompted next time.

**Read access is public.** Anyone with the URL can see your collection. Writes require the token. If you want to lock down reads too, add the same `requireAuth` check inside `onRequestGet` in both function files.

**Artwork storage.** Uploaded images get stored as base64 in KV (which has a 25 MiB per-value limit, so individual 4 MB images are fine). For a leaner setup you could route artwork through Cloudflare R2 instead — happy to wire that up if it ever matters.

**KV is eventually consistent.** Reads can briefly return stale data right after a write. In practice for a personal checklist this is invisible, but worth knowing.

## Migrating existing data

If you've been using the Claude version or the localStorage version and want to bring that data over:

1. In the source version, click **`{ } Data`** → **Copy** to grab the JSON
2. Open the deployed Cloudflare version, click **`{ } Data`**, paste the JSON in
3. Click **Apply Changes** — you'll be prompted for your `WRITE_TOKEN`

Collection state (which cards you own) is stored separately and isn't included in the Data JSON. You can sync those manually, or once I add a "full backup" export I'll wire that in too.

## Resetting the auth token in your browser

If you ever want to force-clear the locally cached edit token (e.g. you typed the wrong one and want a clean re-prompt), open the browser devtools console on the site and run:

```js
localStorage.removeItem('jerky-auth-token')
```

Then refresh and make any edit to be prompted again.
