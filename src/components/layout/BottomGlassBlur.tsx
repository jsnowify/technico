/**
 * BottomGlassBlur — a strip pinned to the very bottom of the
 * viewport where whatever's scrolled underneath goes from perfectly
 * sharp at the top of the strip to fully frosted at the bottom edge,
 * like looking through a pane of frosted glass propped against the
 * screen. The "liquid glass" bottom fade.
 *
 * Mounted once in app/layout.tsx, as a sibling of Header/Footer
 * outside `{children}`, so it's `position: fixed` against the
 * viewport (not any one page's layout) and stays put across every
 * route instead of being re-implemented per page.
 *
 * TECHNIQUE — progressive blur via stacked, individually-masked
 * `backdrop-filter` layers. A single `backdrop-filter: blur()` can
 * only ever apply one flat blur radius across its whole element —
 * there's no native way to make that radius itself ramp smoothly
 * from 0 to N over a gradient. The standard workaround (what every
 * "liquid glass" / progressive-blur UI actually is under the hood):
 * stack several full-height layers, each blurring a little harder
 * than the last, each one clipped to its own horizontal band via
 * `mask-image` so only that band of the strip carries that layer's
 * blur. Each band is 3 steps wide but only advances 1 step per
 * layer, so consecutive bands overlap heavily — that overlap is what
 * makes the *sum* of all 8 layers read as one continuous gradient
 * instead of visible blur "rings". Weakest blur sits at the top of
 * the strip (blends into whatever's not blurred at all above it),
 * strongest sits at the very bottom edge.
 *
 * No hooks/props/state involved — the layer list only ever depends
 * on the constant BLUR_STEPS below, so it's computed once at module
 * scope instead of recomputed (or memoized) per render, and the
 * component itself needs no "use client" directive.
 *
 * `pointer-events-none` throughout: this is a purely visual overlay
 * sitting on top of Footer/page content, so clicks/taps must pass
 * straight through to whatever's actually underneath it.
 */

const BLUR_STEPS = [0.5, 1, 2, 4, 8, 12, 18, 26] as const;

const LAYERS = (() => {
  const n = BLUR_STEPS.length;
  const step = 100 / n;

  return BLUR_STEPS.map((blur, i) => {
    const p1 = step * i;
    const p2 = step * (i + 1);
    const p3 = step * (i + 2);
    const p4 = step * (i + 3);

    const mask = `linear-gradient(to bottom, rgba(0,0,0,0) ${p1}%, rgba(0,0,0,1) ${p2}%, rgba(0,0,0,1) ${p3}%, rgba(0,0,0,0) ${p4}%)`;

    return { blur, mask };
  });
})();

export default function BottomGlassBlur() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[90] h-20 sm:h-24 lg:h-28"
    >
      {LAYERS.map((layer, i) => (
        <div
          key={i}
          className="absolute inset-0"
          style={{
            backdropFilter: `blur(${layer.blur}px)`,
            WebkitBackdropFilter: `blur(${layer.blur}px)`,
            maskImage: layer.mask,
            WebkitMaskImage: layer.mask,
          }}
        />
      ))}
    </div>
  );
}
