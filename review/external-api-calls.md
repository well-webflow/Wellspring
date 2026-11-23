# Reviewer response — External API Calls

**Finding:** Network calls found. Every endpoint must use HTTPS and point to production, and
credential headers must never go to non-Webflow domains.
**Bundle reviewed:** `assets/index-BLyBhK71.js`
**Summary:** Both calls are HTTPS to our own production backend. The only header sent is the
Webflow ID token, which is designed to be sent to the App's own backend and is verified with
Webflow before anything happens. No Webflow API credential ever reaches the browser.

## Every network call in the bundle

The bundle contains exactly two `fetch()` calls and no other network primitive — no
`XMLHttpRequest`, `sendBeacon`, `WebSocket`, `EventSource`, or `importScripts`. There is no
analytics, telemetry, error reporting, or third-party call of any kind.

| # | Call | Method | Endpoint | Headers |
|---|------|--------|----------|---------|
| 1 | `call()` | POST | `https://api.heywellspring.com/sites/{siteId}/{path}` | `X-Webflow-Id-Token` |
| 2 | `checkStatus()` | GET | `https://api.heywellspring.com/sites/{siteId}/status` | `X-Webflow-Id-Token` |

Both are in `src/lib/api.ts`. Both build their URL from one module-level constant:

```ts
const API_BASE = 'https://api.heywellspring.com';
```

## HTTPS

Both endpoints are HTTPS. `API_BASE` is a hard-coded constant — not an environment variable,
not a build-mode switch, and with no fallback — so no build can emit an `http://` endpoint.

## Production

`api.heywellspring.com` is the production custom domain of our Cloudflare Worker, declared in
the Worker's `wrangler.jsonc`. It is the only host the extension contacts. The bundle contains
no localhost, loopback, private-network, cloud-metadata, or tunnel reference; the
Non-Production Endpoints finding against the previous bundle was resolved in this revision.

## The credential header

`X-Webflow-Id-Token` carries the value of `webflow.getIdToken()`.

This is the Designer ID token, and sending it to the App's own backend is its intended use —
Webflow provides `POST https://api.webflow.com/beta/token/resolve` specifically so an App's
backend can verify it. It is a short-lived token that grants no Webflow API access on its own.
It is not an OAuth access token, an API key, or a user credential.

`api.heywellspring.com` is not a third party. It is this App's own backend, operated by us,
and it is the only destination the token is ever sent to.

## What the backend does with it

Every `/sites/:siteId/*` route runs through one middleware (`requireDesignerAuth` in
`src/auth.ts`) before any handler sees the request:

1. Look up the OAuth access token stored for that `siteId`. No stored install → `401`.
2. `POST https://api.webflow.com/beta/token/resolve` with the ID token, authorized with that
   stored access token.
3. Reject unless the resolved `siteId` matches the `siteId` in the route — so a valid token
   for one site cannot act on another.

Every failure returns the same `401 {"error":"Not authorized"}`, so a caller cannot probe
whether a site has the App installed.

## Credential handling

The OAuth access token is stored server-side and used only for Webflow API calls made from the
Worker. It is never returned to the extension and there is no endpoint that exposes it. The
browser therefore never holds a Webflow API credential.

CORS on the authorized routes is restricted to the App's Designer Extension origin. The one
additional variable that can widen it is constrained to loopback origins in code, so a
misconfiguration cannot expose these routes to a public origin.
