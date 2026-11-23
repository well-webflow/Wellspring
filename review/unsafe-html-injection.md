# Reviewer response — Unsafe HTML Injection

**Finding:** Do not insert untrusted data into your UI as raw HTML, and never insert `<script>`
tags at runtime through `innerHTML`, `document.write()`, or `insertAdjacentHTML()`. These sinks
are the mechanism; a reviewer confirms whether the data is untrusted or a script is inserted.
**Evidence cited:** 3 locations, all in `assets/react-vendor-WTahRxmL.js`
**Summary:** Confirmed safe. All three are React DOM's own internals. Our application code
contains no HTML sink of any kind, inserts no script at runtime, and renders every value as a
React text node.

## Our application code has zero HTML sinks

Searching the whole `src/` tree returns no match for any of:

`dangerouslySetInnerHTML`, `innerHTML`, `outerHTML`, `document.write`, `insertAdjacentHTML`,
`createContextualFragment`, `eval(`, `new Function`, `srcdoc`

The same holds for the compiled application chunk, `assets/index-BLyBhK71.js`: zero occurrences
of every sink above, including `dangerouslySetInnerHTML`. Every piece of UI is rendered through
JSX, so React escapes all interpolated values as text nodes.

## The three cited locations are React DOM internals

| # | What it is | Reachable from our code? |
|---|------------|--------------------------|
| 1 | A string in React's known-props table, listing `dangerouslySetInnerHTML` and `innerHTML` as recognised prop names | Not a sink — it is a list of names |
| 2 | `setInnerHTML`, React's implementation of the `dangerouslySetInnerHTML` prop, with an SVG namespace fallback | No. Only runs if a component passes `dangerouslySetInnerHTML`. None does |
| 3 | React's element factory for the `"script"` element type | No. Only runs if a component renders a `<script>` element. None does |

Location 3 is worth a note, because it reads as the opposite of what it is. React creates a
script element through a detached `div`'s `innerHTML` specifically so the element is marked
parser-inserted and therefore **will not execute** when it is attached. It is a safeguard
against script execution, not a way to inject one.

## Untrusted data and how it is rendered

Two kinds of data in the UI do not originate in our source:

- **Names from the Designer** — waterfall and element names read through the Webflow Designer
  API, which a site author controls.
- **Release notes from our backend** — version, date, summary, and change lines returned by
  `GET /releases`.

Both are rendered as JSX children, so React inserts them as text nodes and escapes them. Neither
is passed to an HTML sink, because the application has none.

## Font Awesome

The other vendor chunk, `assets/fontawesome-DfK4-APd.js`, also contains `innerHTML` and
`outerHTML` inside Font Awesome's DOM-replacement feature — the part that scans the document for
`<i>` tags and swaps them for SVG, injects a `<style>` tag, and watches for mutations.

Every one of those paths is switched off at startup, in `src/main.tsx`, before any component
renders:

```ts
fontAwesomeConfig.autoAddCss = false;
fontAwesomeConfig.autoReplaceSvg = false;
fontAwesomeConfig.observeMutations = false;
```

Icons are rendered only through `@fortawesome/react-fontawesome` components, which build SVG as
React elements. Font Awesome never writes HTML into the document.

## Why the finding cannot be cleared by a code change

These sinks live in React DOM, which every Designer Extension built with React ships. They are
not reachable from our code, and removing them would mean not using React. The application-level
answer to the finding is the section above: no sink, no runtime script insertion, no raw HTML.
