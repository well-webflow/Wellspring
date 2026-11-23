# Reviewer response — Prohibited Popups

**Finding:** Popups and new windows are allowed only on direct user interaction, never on load
or a timer. Confirm this opens from a click or other user action.
**Bundle reviewed:** `assets/index-BLyBhK71.js`
**Summary:** Confirmed. The bundle contains exactly one `window.open`, it is the first statement
of a click handler, and it already passes `"noopener,noreferrer"`. Nothing opens a window on
load or from a timer.

## The only window-opening call in the bundle

One `window.open`, and no other way to open a window — no `showModalDialog`, no `target=_blank`
anchor, no programmatic click. It is the body of `authorizeAndInstall`:

```js
authorizeAndInstall:async function(){
  window.open(`${al}/auth`,"_blank","noopener,noreferrer"),
  p(!0),d(!0),
  await webflow.notify({type:"Info",message:"Please complete authorization in the opened window."}),
  h(),
  o.current=window.setInterval(i,2e3),
  l.current=window.setTimeout(async()=>{ h(),d(!1),p(!1), await webflow.notify({type:"Error",message:"Authorization timed out. ..."}) },12e4)
}
```

Source: `src/lib/api.ts` (`launchWebflowAuth`), called from
`src/apps/waterfall/hooks/useWaterfallInstall.ts`.

## It opens from a click

`authorizeAndInstall` is referenced in exactly one place in the bundle, as the `onClick` of the
Install button:

```js
ie.jsx(Zo,{onClick:u,size:"sm",children:"Cancel"}),
ie.jsx(Zo,{onClick:d, ... })   // d === authorizeAndInstall
```

There is no other reference: it is not called on mount, from an effect, from a timer, or from
any other handler. The window opens on the user's click and on nothing else.

## It is not opened after an await

`window.open` is the **first statement** of the handler. No `await` precedes it, so the call
runs inside the click's own task and keeps the user-activation that browsers require. This is
deliberate and documented in the source; the state updates and the `await webflow.notify` that
follow it cannot move it out of the gesture.

## The adjacent timers do not open anything

`setInterval` and `setTimeout` appear immediately after `window.open` in the minified output,
which is likely what prompted the confirmation request. Neither opens a window:

- `window.setInterval(i, 2000)` polls the authorization status, because the auth window's
  `closed` flag cannot be read reliably from inside the Designer.
- `window.setTimeout(..., 120000)` gives up after two minutes. Its whole body is visible above:
  it clears the poll, resets two state flags, and shows an error notice.

Both are cleared on success, on cancel, and on unmount.

## Hardening already applied

The call passes `"noopener,noreferrer"` as the features argument, so the authorization window
cannot reach back into the extension through `window.opener` and no referrer is sent.

## Confirmation dialogs

The bundle also contains three `confirm()` calls — breaking-version update, uninstall, and
disconnect. These are not popup windows, and all three are inside `onClick` handlers, shown
only in response to a user's click on a destructive action.
