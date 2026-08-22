// DOM refs for PageTransition's three cube-wipe layers, collected by
// PageTransition.tsx as its cells mount and driven by TransitionLink's
// cover/reveal GSAP timeline. Lives in its own module (rather than
// co-located with the PageTransition component) so PageTransition.tsx
// can stay a component-only export for Fast Refresh.
export const transitionCellRefs = {
  purple1: [] as HTMLDivElement[],
  black: [] as HTMLDivElement[],
  purple2: [] as HTMLDivElement[],
};
