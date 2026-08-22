import type Lenis from "lenis";

// Single shared Lenis instance, created once by <SmoothScroll /> in App.
// Exposed this way (rather than context) so plain event handlers and
// effects elsewhere — e.g. ScrollToTop's route-change scroll reset —
// can reach it without needing to be React children of the provider.
let lenisInstance: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenisInstance = instance;
}

export function getLenis(): Lenis | null {
  return lenisInstance;
}
