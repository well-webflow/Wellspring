# Reviewer response — Disconnect and uninstall

**Requirement:** An in-App Disconnect is required when an App links a Webflow site or Workspace
to an account in the developer's service. Disconnect ends that account link only, must not call
`POST /oauth/revoke_authorization`, and must leave the user able to connect again without
redoing Webflow OAuth.

**Summary:** Wellspring has no account in its service, so the Disconnect requirement does not
apply to it. The App ships a Disconnect button anyway, as a way to delete the stored
authorization. `POST /oauth/revoke_authorization` is never called from anywhere in the App.

## Wellspring stores no user account

There is no Wellspring login, no Wellspring user record, and no third-party service to link to.
The only thing stored per site is the Webflow authorization itself:

| Column | Contents |
| --- | --- |
| `site_id` | The Webflow site the authorization is for (primary key) |
| `access_token` | The Webflow OAuth token, AES-GCM encrypted at rest |
| `token_iv` | The per-row initialization vector |
| `scopes` | The scopes the token was granted |
| `installed_at` / `updated_at` | Timestamps |

`data-client/schema.sql`. There is no account table because there are no accounts. The resolved
user (`ResolvedUser` in `data-client/src/types.ts`) exists only for the lifetime of one request,
to check that the ID token belongs to the site being addressed; it is never written to the
database.

Because the only link is the Webflow authorization, there is no separate account link for a
Disconnect to sever. The requirement's precondition is not met.

## What the two buttons do

Both are in `designer-extension/src/apps/waterfall/views/SetupView.tsx`, and they are mutually
exclusive — the UI shows exactly one, based on whether the Waterfall script is applied.

**Disconnect** — shown only when the site is authorized and the script is *not* installed.
Deletes the stored authorization row. The confirmation says so, and tells the user that removing
Wellspring's access completely means uninstalling the App from Webflow site settings. Because
this state has no script applied, nothing is removed from the site.

**Uninstall** — shown only when the script *is* installed. Removes every applied script whose id
matches `waterfall`, at **site level and on every page** (`removeScriptEverywhere` in
`data-client/src/webflow.ts`), then deletes the stored authorization. It does not auto-publish;
the success message prompts the user to publish, because the removal reaches the live site on the
next publish.

## Reconnecting

After either button, reconnecting goes through Webflow OAuth again, because the authorization is
the only thing that was stored and the App deliberately keeps nothing else. This is not the
"must reconnect without redoing OAuth" case the guideline describes — that case is about not
forcing a user to re-authorize Webflow merely to switch accounts in the developer's service, and
Wellspring has no such accounts to switch between.

The App handles the half-disconnected state explicitly rather than leaving the user stuck: if
access was removed from the Webflow side while the script is still on the published site,
Wellspring cannot remove it, so the Setup tab says so and directs the user to click Install to
reconnect, after which an Uninstall button appears.

## Revocation

`POST /oauth/revoke_authorization` appears nowhere in this repository. Revocation is handled
from the other direction: a 401 on a previously valid token raises `TokenRevokedError`
(`data-client/src/webflow.ts`), every handler stops calling the API for that site immediately,
and the stored install is deleted. `requireDesignerAuth` confirms revocation against the access
token alone before deleting, so a forged ID token cannot delete another site's install.
