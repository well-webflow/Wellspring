# Reviewer response — URL schemes and redirects

**Findings addressed:** (1) a `javascript:` literal in the application chunk, which matches the
inline-script/`javascript:`-URI rule; (2) a top-frame redirect, which matches the untrusted-redirect
rule.
**Bundle reviewed:** `assets/index-BLyBhK71.js`
**Summary:** Neither is a navigation our code performs. The `javascript:` literal is an entry in
react-router's *blocklist* of redirect schemes — the mechanism that rejects `javascript:` redirects.
The only `location.assign` is a same-origin fallback that re-navigates the extension's own iframe to
its own hash URL, never the top frame.

## 1. The `javascript:` literal is a denylist entry, not a URI

The application chunk contains exactly one occurrence of the string `javascript:`. It is a member of
this array:

```js
["about:","blob:","chrome:","chrome-untrusted:","content:","devtools:","data:","file:","filesystem:","javascript:"]
```

That is `invalidProtocols` in **react-router 7.18.1**. Unminified, from
`node_modules/react-router/dist/development/chunk-KS7C4IRE.mjs:5231`:

```js
var invalidProtocols = [ "about:", "blob:", /* … */ "javascript:" ];

function hasInvalidProtocol(location) {
  try { return invalidProtocols.includes(new URL(location).protocol); }
  catch { return false; }
}
```

Its only caller is `normalizeRedirectLocation`, which **throws** when a redirect target uses one of
these schemes:

```js
if (hasInvalidProtocol(url.toString())) {
  throw new Error("Invalid redirect location");
}
```

So the literal exists in order to block `javascript:` navigation. It is the guard, not the hazard.

There is no `javascript:` URI anywhere in the shipped artifact: no `href="javascript:"`, no
`src="javascript:"`, and no inline event-handler attribute of any kind. `dist/index.html` carries one
module `<script src>`, two `modulepreload` links, and one stylesheet link — no inline handlers, no
inline script body.

This block is byte-identical in react-router's `dist/development` and `dist/production` folders, so
its presence says nothing about build mode. The published bundle is a production Vite build
(`minify: 'terser'`, `drop_debugger: true`).

## 2. The only `location.assign` navigates this extension's own iframe

One `window.location.assign`, in `src/lib/hashHistory.tsx`:

```ts
try {
  window.history.pushState(historyState, '', url);
} catch (err) {
  // A state object that can't be cloned is a bug worth surfacing; anything else
  // (a history length cap, say) falls back to a plain navigation, as react-router does.
  if (err instanceof DOMException && err.name === 'DataCloneError') throw err;
  window.location.assign(url);
}
```

Three things make this not a top-frame redirect:

- **It is not the top frame.** `window.location` inside the extension's sandboxed iframe is that
  iframe's own location. The bundle contains no `window.top`, no `window.parent`, and no access to a
  parent document — confirmed by searching the whole artifact for each.
- **The destination is this extension's own URL.** `url` comes from `createHref`, which resolves
  against `currentBase()` — `window.location.origin`, or the iframe's own `href` when a sandboxed
  frame reports its origin as the string `"null"`. It is always a same-origin `#`-prefixed route of
  the panel, e.g. `#/waterfall/edit`. No external host can appear here; the router has no route that
  accepts a URL from outside the extension.
- **It is an unreachable-in-practice fallback.** It runs only if `history.pushState` throws for a
  reason other than `DataCloneError` — in effect a browser history-length cap. The normal path is
  `pushState`/`replaceState`, which change no document location at all.

## Why the router is hand-written

`src/lib/hashHistory.tsx` reimplements react-router's `HashRouter` deliberately, and the file says so
at the top. react-router's own URL-based histories build every URL through a helper carrying a
hard-coded `http://localhost` fallback base, for the case where no `window.location` exists. That
literal is never fetched — it is only a parsing base for `new URL()` — but it ships in the bundle,
where a scanner reads it as a non-production endpoint. Resolving against the extension's own
`window.location` instead means no such literal exists: the shipped artifact contains no
`localhost`, no `127.0.0.1`, no private-network address, and no tunnel hostname. Searched and
confirmed across all three JS chunks and the HTML.
