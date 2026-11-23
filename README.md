# 🌱 Wellspring

Wellspring is a Webflow App that adds advanced functionality to a site through attributes. You
select an element in the Designer, choose the behaviour you want, and Wellspring writes the
attributes that drive it — no custom code to paste and nothing to maintain by hand.

Wellspring ships with **Waterfall**, which builds and configures sliders, marquees, and
carousels.

## How it works

Two pieces work together:

- **Designer Extension** (`designer-extension/`) — the panel you use inside the Webflow
  Designer. It reads the selected element through the Designer APIs and sets the attributes
  Waterfall responds to.
- **Data Client** (`data-client/`) — a Cloudflare Worker at `api.heywellspring.com`. It holds
  the site's authorization, registers the pinned Waterfall script through Webflow's Custom Code
  API, and reports which version a site is on.

The Waterfall runtime itself is a versioned npm package served from jsDelivr. Wellspring
registers it by exact version with a Subresource Integrity hash, so the code running on a site
is pinned and verifiable rather than copied into the page.

Wellspring is free to use. There are no paid tiers and no in-App purchases.

## Installing

Install the App onto a site from Webflow, open it in the Designer, and click **Install** on the
Setup tab to authorize. Once authorized, **Install Code** registers Waterfall on the site —
publish the site afterwards to make it live.

To remove it, use **Uninstall** on the Setup tab and publish again. Uninstalling the App from
your Webflow site settings also revokes its access and removes the script it applied.

## Local development

### Prerequisites

Node and npm. We recommend [nvm](https://github.com/nvm-sh/nvm) to install and manage versions.

### Designer Extension

```bash
cd designer-extension
npm install
npm run dev
```

`npm run dev` serves the panel on port 1337 for the Designer's development App. To produce the
submission artifacts instead:

```bash
npm run build     # typecheck, build, bundle, then verify bundle.zip and sourcemaps.zip
npm run verify    # re-run the artifact checks on their own
```

`npm run build` writes `bundle.zip` (uploaded to Webflow) and `sourcemaps.zip` (the private
review upload). `verify-bundle.js` fails the build if either one would trip App review — a
source map inside the public bundle, a missing map, a stray dev endpoint, or an oversized zip.

Creating a waterfall normally requires an authorized site. Set `VITE_SKIP_AUTH=true` in
`designer-extension/.env` to work on the panel without completing authorization. It is gated on
`import.meta.env.DEV`, so it has no effect on any built bundle.

### Data Client

```bash
cd data-client
npm install
npm run dev      # wrangler dev
npm test         # vitest, against the Workers runtime
npm run deploy   # wrangler deploy
```

Secrets are set with `wrangler secret put`, never committed: `WEBFLOW_CLIENT_SECRET` and
`TOKEN_ENCRYPTION_KEY`. Only `WEBFLOW_CLIENT_ID` lives in `wrangler.jsonc`.

To let the deployed Worker accept requests from a local panel, list loopback origins in
`CORS_DEV_ORIGINS` in `.dev.vars`. It is ignored in production — the Worker constrains it to
loopback hosts in code, so a stray value cannot expose a public origin.

### Database

D1 schema lives in `schema.sql`, with incremental changes in `migrations/`:

```bash
npx wrangler d1 execute wellspring --remote --file=./migrations/0001_oauth_state_session.sql
```

## Releasing a new Waterfall version

1. Add the release to `data-client/src/releases.ts`.
2. Bump `WATERFALL_VERSION` in `data-client/src/index.ts` and recompute `integrityHash`:
   ```bash
   npm pack well-waterfall@<version>
   openssl dgst -sha256 -binary dist/well-waterfall.umd.js | openssl base64 -A
   ```
3. `npm run deploy` the Worker.
4. Rebuild and submit the extension as an App update if its bundle changed.

## Repository layout

| Path | What it is |
|------|------------|
| `designer-extension/` | The Designer panel (Vite, React, TypeScript) |
| `data-client/` | The Cloudflare Worker (Hono, D1) |
| `review/` | Reviewer responses for App review findings |
