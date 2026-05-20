# Jerky Collection

Personal Pokémon TCG checklist for cards illustrated by Jerky. SvelteKit app deployed as a single Cloudflare Worker with KV-backed cross-device sync.

## Stack

- **SvelteKit 2** + **Svelte 5** (runes only)
- **TypeScript** + **SCSS**
- **@sveltejs/adapter-cloudflare** → compiles into one Cloudflare Worker
- **Cloudflare KV** for persistence (`STORAGE_KV` binding)
- Bearer-token auth (`WRITE_TOKEN` secret) on every write

## Local development

```bash
npm install
npm run dev
```

Opens at <http://localhost:5173>. KV is emulated locally by Miniflare via Wrangler — your dev data lives in `.wrangler/state/` and does **not** touch production KV.

For dev writes you'll still be prompted for an edit token. Either set it in `.dev.vars`:

```
WRITE_TOKEN=anything-you-want-locally
```

or just paste the same string into the prompt — it's stored in localStorage per-browser.

## Cloudflare setup (one time)

### 1. Create the KV namespace

```bash
npx wrangler kv namespace create STORAGE_KV
```

Copy the printed `id` into `wrangler.toml`, replacing `REPLACE_WITH_YOUR_KV_NAMESPACE_ID`:

```toml
[[kv_namespaces]]
binding = "STORAGE_KV"
id = "abc123…"
```

Commit that change — the binding is now declarative.

### 2. Set the write token

```bash
npx wrangler secret put WRITE_TOKEN
```

You'll be prompted to paste a long random string. This is the edit password the app prompts for on first write.

### 3. Hook up GitHub auto-deploys

Two options:

**A. Cloudflare Workers Builds (recommended)** — `Workers & Pages → Create → Connect to Git`, pick this repo. Cloudflare auto-detects SvelteKit, runs `npm run build`, and deploys the Worker on every push to `main`. The KV binding from `wrangler.toml` is read on each build; you do **not** need to configure it in the dashboard.

**B. Deploy from your machine**

```bash
npm run deploy
```

This runs `vite build` and then `wrangler deploy` against the project named in `wrangler.toml`.

## Project layout

```
src/
├── app.html, app.scss, app.d.ts
├── lib/
│   ├── data/seed-cards.ts        # seed list + set codes + default orderings
│   ├── styles/colors.scss        # CSS custom properties, imported via $styles alias
│   ├── stores/AppState.svelte.ts # reactive state (cards, collection, artwork) using Svelte 5 runes
│   ├── variants.ts               # regular/RH/Poké Ball/Master Ball + custom:<name> helpers
│   ├── storage.ts                # thin client over /api/storage
│   ├── urls.ts                   # TCGplayer / Limitless / Art of PKM link builders
│   └── components/               # Header, Tabs, Toolbar, SetSection, CardTile, Modal, …
└── routes/
    ├── +layout.svelte
    ├── +page.svelte              # orchestrates the page
    └── api/storage/              # +server.ts handlers for GET/POST/DELETE/list
```

## How the storage flow works

All persistence calls go through `src/lib/storage.ts`, which hits the same-origin SvelteKit endpoints under `/api/storage`. Those endpoints, in turn, hit `platform.env.STORAGE_KV` — the binding configured in `wrangler.toml`.

- **Reads** (`GET /api/storage`, `GET /api/storage/list`) are public.
- **Writes** (`POST` / `DELETE`) require `Authorization: Bearer <WRITE_TOKEN>`.
- A 401 clears the cached token in the browser so the user is re-prompted on the next change.

KV value cap is 25 MiB; the endpoint rejects anything over 24 MiB with a 413.

## Custom variants

Each card supports a free-text `customVariants` array (set via the card detail modal as a comma-separated input). Built-in variants are `regular`, `reverse_holo`, `poke_ball`, `master_ball`; custom ones are encoded as `custom:<name>` everywhere they're referenced so they round-trip cleanly through tile IDs and PTCGL export suffixes.

## Migrating data from a previous deploy

Open the **`{ } Data`** modal, paste the JSON from your old deploy, click **Apply Changes**. Ownership state is stored separately under `jerky-collection-v3` — back it up via the browser console if needed:

```js
fetch('/api/storage?key=jerky-collection-v3').then(r => r.json()).then(console.log)
```

## Resetting the cached edit token

```js
localStorage.removeItem('jerky-auth-token')
```

Then make any edit to be re-prompted.
