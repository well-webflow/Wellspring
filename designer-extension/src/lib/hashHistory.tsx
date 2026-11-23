/**
 * Hash routing for the Designer Extension.
 *
 * Behaviourally this is react-router's `HashRouter`: the current route lives in the URL
 * hash, so reopening the panel lands back where you left off, and the back/forward
 * buttons work off the real browser history.
 *
 * It is written here because react-router's URL-based histories build every URL through
 * one helper that carries a hard-coded `http://localhost` fallback base, for the case
 * where no `window.location` is available. That literal is never fetched — it is only a
 * base for `new URL()` parsing — but it ships in the bundle, where Webflow's App review
 * scanner reads it as a non-production endpoint. This resolves against the extension's
 * own `window.location` instead, so no such literal exists.
 *
 * The one behaviour deliberately left out is react-router's support for a `<base href>`
 * element when writing hash hrefs. The extension's index.html has no `<base>`, and
 * Webflow serves the panel from a fixed origin, so the plain `#` + path form is correct.
 */
import { startTransition, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { NavigationType, Router, createPath, parsePath } from 'react-router';
import type { Location, Path, To } from 'react-router';

/** What we keep in `window.history.state`, mirroring react-router's own shape. */
interface HistoryState {
  usr: unknown;
  key: string;
  idx: number;
}

interface Update {
  action: NavigationType;
  location: Location;
}

const createKey = () => Math.random().toString(36).substring(2, 10);

/**
 * The base every relative path is resolved against. A sandboxed iframe reports its origin
 * as the string "null", in which case the full href is still a usable base.
 */
function currentBase(): string {
  return window.location.origin !== 'null' ? window.location.origin : window.location.href;
}

function hashHistory() {
  let action = NavigationType.Pop;
  let listener: ((update: Update) => void) | null = null;

  const readState = () => (window.history.state ?? null) as Partial<HistoryState> | null;

  const getIndex = () => readState()?.idx ?? null;

  let index = getIndex();
  if (index == null) {
    index = 0;
    window.history.replaceState({ ...readState(), idx: index }, '');
  }

  /** Reads the live location straight out of the hash, so it is never stale after a pop. */
  function getLocation(): Location {
    const { pathname: raw = '/', search = '', hash = '' } = parsePath(window.location.hash.substring(1));
    const pathname = raw.startsWith('/') || raw.startsWith('.') ? raw : '/' + raw;

    const state = readState();
    return { pathname, search, hash, state: state?.usr ?? null, key: state?.key ?? 'default' };
  }

  /** Builds the next location from a `To`, filling gaps from where we are now. */
  function nextLocation(to: To, state: unknown): Location {
    const path = typeof to === 'string' ? parsePath(to) : to;
    return {
      pathname: getLocation().pathname,
      search: '',
      hash: '',
      ...path,
      state: state ?? null,
      key: createKey(),
    };
  }

  const createHref = (to: To) => '#' + (typeof to === 'string' ? to : createPath(to));

  /** Resolves `to` against this document's own origin — the production host serving the panel. */
  function createURL(to: To): URL {
    const href = (typeof to === 'string' ? to : createPath(to)).replace(/ $/, '%20');
    return new URL(href, currentBase());
  }

  function go(to: To, state: unknown, replace: boolean) {
    action = replace ? NavigationType.Replace : NavigationType.Push;

    const location = nextLocation(to, state);
    index = replace ? (getIndex() ?? 0) : (getIndex() ?? 0) + 1;
    const historyState: HistoryState = { usr: location.state, key: location.key, idx: index };

    const url = createHref(location);
    if (replace) {
      window.history.replaceState(historyState, '', url);
    } else {
      try {
        window.history.pushState(historyState, '', url);
      } catch (err) {
        // A state object that can't be cloned is a bug worth surfacing; anything else
        // (a history length cap, say) falls back to a plain navigation, as react-router does.
        if (err instanceof DOMException && err.name === 'DataCloneError') throw err;
        window.location.assign(url);
      }
    }

    listener?.({ action, location: getLocation() });
  }

  function handlePop() {
    action = NavigationType.Pop;
    index = getIndex();
    listener?.({ action, location: getLocation() });
  }

  return {
    get action() {
      return action;
    },
    get location() {
      return getLocation();
    },
    createHref,
    createURL,
    encodeLocation(to: To): Path {
      const url = createURL(to);
      return { pathname: url.pathname, search: url.search, hash: url.hash };
    },
    push: (to: To, state?: unknown) => go(to, state, false),
    replace: (to: To, state?: unknown) => go(to, state, true),
    go: (delta: number) => window.history.go(delta),
    listen(fn: (update: Update) => void) {
      if (listener) throw new Error('A history only accepts one active listener');
      window.addEventListener('popstate', handlePop);
      listener = fn;
      return () => {
        window.removeEventListener('popstate', handlePop);
        listener = null;
      };
    },
  };
}

/** Drop-in replacement for react-router's `HashRouter`. */
export function HashRouter({ children }: { children: ReactNode }) {
  const historyRef = useRef<ReturnType<typeof hashHistory>>();
  if (!historyRef.current) historyRef.current = hashHistory();
  const history = historyRef.current;

  const [state, setState] = useState<Update>({ action: history.action, location: history.location });

  // Layout effect, not a plain effect: the listener has to be attached before the browser
  // can paint a navigation that happens during the first commit.
  useLayoutEffect(() => history.listen((update) => startTransition(() => setState(update))), [history]);

  return (
    <Router location={state.location} navigationType={state.action} navigator={history}>
      {children}
    </Router>
  );
}
