// Tracks whether the initial page loader is still covering the
// screen. Consumed by CustomCursor.tsx to suppress itself while the
// loader is active — same reasoning as lib/transitionState.ts for
// TransitionLink's route-change wipes. Starts true because the loader
// covers the screen from first paint; flipped false the moment its
// timeline completes, right alongside the notifyPageReady() call that
// already marks that same moment.
export const loaderState = { isActive: true };
