WELLSPRING — ADDITIONAL NOTES FOR REVIEWERS

WHAT THE APP IS

Wellspring is a Hybrid App: a Designer Extension plus a Data Client. It ships one feature today,
Waterfall, which turns a Webflow element into a configurable slider. The Designer Extension writes
data attributes onto the selected element; the Data Client registers and applies the matching
runtime script to the site through the Custom Code API. The two halves are the same product — the
extension never calls the Webflow API directly, only this App's own backend.

The App is free. There are no paid tiers, no in-App purchases, no subscription, and no ads. The
About tab carries an optional "Buy me a coffee" donation link, which is voluntary and gates nothing.

HOW TO TEST IT

Credentials for the demo account are in the App Credentials section above.

1. Open the Wellspring panel in the Designer on the test site and choose Waterfall.
2. Setup tab -> Install. This opens the OAuth window from our Install URL
   (https://api.heywellspring.com/auth). Approve it; the panel switches to "Install Code".
3. Install Code registers Waterfall on the site and applies it at site level. Publish the site.
4. Select a slider element and use the module screens to change settings; each writes a data
   attribute the runtime reads.
5. Uninstall removes the script from the site and every page. Publish again to clear the live site.

To see the denial path, click Install and reject the authorization. The window shows
"Authorization cancelled" and the panel returns to its uninstalled state.

SCOPES — FIVE, AND WHY

sites:read, pages:read, authorized_user:read, custom_code:read, custom_code:write.

Every one maps to an endpoint the App actually calls: GET /v2/sites (callback), GET
/v2/sites/{id}/pages (the page sweep on uninstall), POST /beta/token/resolve (verifying the Designer
ID token on every request), the registered_scripts and custom_code reads, and the registered_scripts
and custom_code writes. GET /v2/token/introspect needs no scope. That is the complete list; there is
no other Webflow API call anywhere in the App.

sites:write and pages:write are deliberately absent. The endpoint reference for custom code lists
custom_code:write and nothing else, while the Working with Custom Code guide says in prose that
removing a script also needs sites:write or pages:write. Rather than pick a reading, we tested:
with exactly the five scopes above, install and uninstall both succeed end to end against a real
site, with no 403. We would rather not ask users for broader write access to their sites and pages
than we have demonstrated we need — but if review requires those scopes regardless, tell us and we
will add them.

CODE DELIVERED TO CUSTOMER SITES

One file, pinned and immutable:

  https://cdn.jsdelivr.net/npm/well-waterfall@1.6.0/dist/well-waterfall.umd.js
  integrityHash sha256-tkslpcSrmMuy9PzYsw8BK6mcLAEH8BxWnfYGdm7RkXg=

It is registered through the Custom Code API with hostedLocation + integrityHash on an exact npm
version, never a tag or range, so what runs always equals what was disclosed. Nothing is delivered
by copy-paste snippet, and there is no runtime loader — the script fetches no further code. Changing
what runs on customer sites means publishing a new npm version, registering a new script version,
and submitting an App update; we do not edit a registered version in place. The file carries a
source map, which is public at the same path.

DISCONNECT AND UNINSTALL

Wellspring stores no user account. There is no Wellspring login and no third-party service to link
to, so there is no account link for a Disconnect to sever. The only thing stored per site is the
Webflow authorization itself: site_id, the AES-GCM encrypted access token, its IV, the granted
scopes, and timestamps.

The Setup tab shows exactly one of two buttons:

- Disconnect, only when the site is authorized and the script is not installed. Deletes the stored
  authorization. Nothing is on the site in that state, so nothing is removed from it.
- Uninstall, only when the script is installed. Removes every matching script at site level and on
  every page, then deletes the stored authorization. It does not auto-publish; the success message
  asks the user to publish.

Neither calls POST /oauth/revoke_authorization — that string appears nowhere in the codebase. The
Disconnect confirmation tells the user that removing Wellspring's access completely means
uninstalling the App from Webflow site settings.

REVOCATION

There is no uninstall webhook, so a 401 on a previously valid token is treated as revocation: the
call raises TokenRevokedError, every handler stops calling the Webflow API for that site
immediately, and the stored install is deleted. Because a 401 can also mean a bad client-supplied
ID token, revocation is confirmed against the access token alone (GET /v2/token/introspect) before
anything is deleted, so a forged ID token cannot delete another site's install.

FOUR PATTERNS AN AUTOMATED SCAN WILL FLAG — ALL BENIGN

1. One "javascript:" literal in the application chunk. It is an entry in react-router 7.18.1's
   invalidProtocols array — the denylist that makes normalizeRedirectLocation throw on a
   javascript: redirect. It is the guard, not the hazard. There is no javascript: URI and no inline
   event-handler attribute anywhere in the artifact; index.html has one module script tag with a
   src, two modulepreload links, and one stylesheet link.

2. One window.location.assign, in src/lib/hashHistory.tsx. It is a same-origin fallback that
   re-navigates the extension's own sandboxed iframe to its own hash route, reached only if
   history.pushState throws for a reason other than DataCloneError. It is not a top-frame redirect:
   the bundle contains no window.top, no window.parent, and no parent-document access.

3. One window.open, the first statement of the Install button's click handler, passing
   "noopener,noreferrer". It opens the OAuth window and nothing else; it is never called on mount,
   from an effect, or from a timer. The setInterval and setTimeout that follow it in the minified
   output poll authorization status and time out after two minutes — neither opens a window.

4. Three innerHTML sinks in assets/react-vendor-*.js. All three are React DOM's own internals. Our
   application code contains no HTML sink of any kind, inserts no script at runtime, and renders
   every value as a React text node.

Related: source maps resolve some react-router modules to a dist/development path. react-router 7.x
routes every consumer there; it is not a development build. The bundle is a production Vite build
(terser, drop_debugger) and contains no localhost, loopback, private-network, cloud-metadata, or
tunnel reference. We hand-wrote the hash router specifically to avoid react-router's built-in
http://localhost parsing fallback shipping in the artifact.

DATA HANDLING

The backend stores only what is listed under Disconnect above. The resolved Webflow user — id,
email, name, site — exists for the lifetime of a single request, to check the ID token belongs to
the site being addressed, and is never written to the database. The OAuth access token is encrypted
at rest, never returned to the browser, and there is no endpoint that exposes it. The extension
makes exactly two network calls, both HTTPS to api.heywellspring.com, both carrying only the
Designer ID token. There is no analytics, telemetry, error reporting, or third-party call of any
kind in the bundle.
