type Listener = () => void;

let listeners: Listener[] = [];

/**
 * Called once a page is fully uncovered and ready to run its enter
 * animation — by the initial Loader finishing, by a TransitionLink's
 * cover/reveal wave finishing, or by the App-level route watcher when
 * navigation happened with nothing covering the screen at all (e.g.
 * browser back/forward). Fires fresh on every page, unlike a one-shot
 * flag — each usePageEnter mount registers its own listener and waits
 * for the next call.
 */
export function notifyPageReady() {
  const current = listeners;
  listeners = [];
  current.forEach((cb) => cb());
}

/**
 * Registers `cb` to run the next time notifyPageReady() fires. Returns
 * an unsubscribe function — call it on cleanup so a component that
 * unmounts before the signal arrives doesn't leak a stale callback.
 */
export function onPageReady(cb: Listener) {
  listeners.push(cb);
  return () => {
    listeners = listeners.filter((l) => l !== cb);
  };
}
