# Design Engineering — Motion, Easing, Micro-interactions, Perceived Performance

## Goal

Motion should improve comprehension, hierarchy, feedback, and perceived responsiveness.

Motion is not decoration by default.

## Principles

1. Animate intent, not everything.
2. Prefer transform and opacity for frequent animation.
3. Avoid animating layout-heavy properties when possible.
4. Keep interaction feedback immediate.
5. Respect reduced motion.
6. Avoid blocking content behind unnecessary animation.
7. Use motion to establish continuity between states.

## Next.js boundary

Animation libraries such as GSAP should normally live in Client Components.

Keep the surrounding page and content server-rendered where possible:

```text
Server page
├── SEO/content
├── Server data
└── Client animation island
```

Do not make an entire page `"use client"` merely because one section animates.

## GSAP

When using GSAP:

- scope selectors with refs
- clean up animations on unmount
- use `useGSAP` when the project already uses `@gsap/react`
- avoid creating duplicate ScrollTriggers
- respect reduced motion
- avoid global selectors
- avoid excessive `scrub` work on mobile
- prefer transform-based animation

Example pattern:

```tsx
"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "@/lib/gsap"

export function MotionSection() {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const items = root.current?.querySelectorAll("[data-motion]")
    if (!items) return

    gsap.from(items, {
      y: 24,
      opacity: 0,
      duration: 0.7,
      stagger: 0.06,
      ease: "power2.out",
    })
  }, { scope: root })

  return <section ref={root}>...</section>
}
```

## Easing

Use easing according to intent:

- `ease-out` → entering/responding
- `ease-in-out` → state transitions
- spring-like motion → physical interfaces
- linear → continuous progress only

Do not choose an easing curve simply because it looks dramatic.

## Duration

Typical starting points:

- micro feedback: ~100–200ms
- UI state transition: ~200–400ms
- content reveal: ~400–800ms

Tune based on interaction and perceived speed.

## Micro-interactions

Good micro-interactions communicate:

- hover affordance
- press feedback
- focus
- success
- error
- state change
- navigation continuity

Do not animate a control so heavily that it delays recognition.

## Reduced motion

Support:

```css
@media (prefers-reduced-motion: reduce) {
  /* Reduce or remove non-essential motion. */
}
```

For JavaScript animation, detect reduced motion before creating expensive animation systems.

## Scroll animation

Scroll-triggered effects should:

- degrade gracefully
- avoid excessive pinned sections
- avoid huge DOM transforms
- avoid scroll-linked effects that monopolize the main thread
- remain understandable if motion is disabled

## Perceived performance

Users perceive a UI as fast when:

- feedback is immediate
- skeleton/loading states are meaningful
- navigation begins quickly
- content appears progressively
- animations do not block interaction

Do not use a long entrance animation to hide slow data fetching.

## Layout stability

Reserve dimensions for:

- images
- media
- dynamic content
- animated elements

Avoid causing CLS through late-loading fonts, images, or content.

## Animation review

Before shipping, ask:

- Does the animation communicate something?
- Can it be shorter?
- Does it run on the compositor where possible?
- Does it run only when needed?
- What happens with reduced motion?
- What happens on low-end devices?
- Does it delay interaction?
