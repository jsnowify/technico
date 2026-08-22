// Tracks whether a TransitionLink cover/reveal animation is currently
// mid-flight. Consumed by App.tsx's RouteReadyWatcher (to know whether
// a route change is already covered vs. needs an immediate reveal
// signal) and CustomCursor.tsx (to suppress the cursor while the
// screen is covered) — both need this outside of TransitionLink's own
// render, so it lives here rather than as a co-located export.
export const transitionState = { isAnimating: false };
