# Reviewer response — OAuth scopes

**Requirement:** Request the minimum scopes the App actually uses. Each Data API endpoint lists
its required scope; the union of what the App calls is the ceiling.
**Scopes requested:** `sites:read` `pages:read` `authorized_user:read` `custom_code:read`
`custom_code:write` — declared in one place, `data-client/src/index.ts`.
**Summary:** Five scopes, each tied to an endpoint the App calls. Nothing is requested that the
App does not use, and no scope is held for a feature that is not shipped. `sites:write` and
`pages:write` are deliberately **not** requested — install and uninstall were both verified
end-to-end without them.

## Every Webflow endpoint the App calls, and the scope it needs

| Endpoint | Where | Scope |
|---|---|---|
| `GET /v2/sites` | `src/index.ts`, OAuth callback — lists the sites the user authorized | `sites:read` |
| `GET /v2/sites/{id}/pages` | `src/webflow.ts` `listPages` — the page sweep on uninstall | `pages:read` |
| `POST /beta/token/resolve` | `src/auth.ts` — verifies the Designer ID token on every request | `authorized_user:read` |
| `GET /v2/sites/{id}/registered_scripts` | `src/webflow.ts` `listRegisteredScripts` | `custom_code:read` |
| `GET /v2/sites/{id}/custom_code` | `src/webflow.ts` `getAppliedScripts` | `custom_code:read` |
| `GET /v2/pages/{id}/custom_code` | `src/webflow.ts` `getAppliedScripts` | `custom_code:read` |
| `POST /v2/sites/{id}/registered_scripts/hosted` | `src/webflow.ts` `ensureScriptRegistered` | `custom_code:write` |
| `PUT /v2/sites/{id}/custom_code` | `src/webflow.ts` `applyScript` / `removeScriptsMatching` | `custom_code:write` |
| `PUT /v2/pages/{id}/custom_code` | `src/webflow.ts` `removeScriptsMatching` | `custom_code:write` |
| `GET /v2/token/introspect` | `src/webflow.ts` `isTokenRevoked` | none required |

That is the complete list. There is no other Webflow API call in the Worker, and the Designer
Extension makes none at all — it only ever calls this App's own backend.

The scope string sent in the authorize redirect is the same `SCOPES` constant stored with the
install, so what is requested and what is recorded cannot drift apart.

## Why `sites:write` and `pages:write` are not requested

Applying and removing custom code is the only write this App performs. The documentation is
inconsistent about what that needs:

- The **endpoint reference** for adding/updating page custom code lists `Required scope |
  custom_code:write`, and nothing else.
- The **Working with Custom Code guide** says, in prose, that uninstalling a script needs
  `custom_code:write` "plus `sites:write` or `pages:write` for scripts applied at the site or
  page level."

We resolved it by testing rather than by picking a reading. With exactly the five scopes above:

- **Install** — registering Waterfall and applying it at site level — succeeds.
- **Uninstall** — removing it from the site and sweeping every page — succeeds.

Both were exercised against a real site. Neither returns a 403. Requesting `sites:write` or
`pages:write` on top of that would be asking for broader write access to sites and pages than
this App needs or uses, which is why they are absent.

If review requires them regardless of the endpoint reference, say so and we will add them; we
would rather not ask users for write access we have demonstrated we do not need.

## Scope of the ID token path

`POST /beta/token/resolve` is the one call made with a user-supplied credential in play. It is
authorized with the install's stored access token and carries the Designer ID token in the body;
`authorized_user:read` covers resolving that token to a user and site. The resolved `siteId` is
then compared against the route's `siteId`, so an ID token for one site cannot act on another.
See `review/external-api-calls.md` for the full middleware walkthrough.
