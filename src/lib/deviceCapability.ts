/*
 * ============================================================
 * DEVICE CAPABILITY SIGNALS
 *
 * Both ReactiveGrid (canvas-cost tiering) and SmoothScroll (Lenis
 * duration/easing tiering) independently read the same rough
 * capability signals — coarse pointer, core count, device memory,
 * viewport width — and previously duplicated that reading verbatim.
 * This is the one place that touches `navigator`/`matchMedia` for
 * that purpose; each caller keeps its own tier thresholds and
 * tier-naming on top, since a scroll-smoothing decision and a
 * canvas-resolution decision genuinely warrant different cutoffs.
 *
 * Read on demand, not cached — callers are expected to read this
 * once on mount (a phone rotating doesn't change its CPU), not on
 * every resize.
 * ============================================================
 */
export type DeviceCapabilitySignals = {
  coarsePointer: boolean;
  /** navigator.hardwareConcurrency, defaulting to 4 when unavailable. */
  cores: number;
  /** navigator.deviceMemory in GB, when the browser exposes it (Chromium-only). */
  memory: number | undefined;
  /** True below a common mobile/tablet breakpoint (768px). */
  narrow: boolean;
};

export function getDeviceCapabilitySignals(): DeviceCapabilitySignals {
  if (typeof window === "undefined") {
    return { coarsePointer: false, cores: 4, memory: undefined, narrow: false };
  }

  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = (navigator as unknown as { deviceMemory?: number })
    .deviceMemory;
  const narrow = window.innerWidth < 768;

  return { coarsePointer, cores, memory, narrow };
}
