# View Transitions — Next.js App Router

## Goal

Use view transitions to improve continuity between navigation states without making navigation slower or less accessible.

## Principle

Navigation correctness comes first.

A transition is an enhancement, not a requirement for content delivery.

## App Router

Before enabling view transitions, verify the current Next.js version and official API because navigation/view-transition support evolves between releases.

Official documentation:

- https://nextjs.org/docs/app
- https://nextjs.org/docs

Do not copy configuration from an older Next.js version without checking current documentation.

## Design rules

Transitions should:

- preserve spatial continuity
- avoid blocking navigation unnecessarily
- be short
- work without JavaScript where possible
- respect reduced motion
- avoid animating large unrelated regions

## Navigation timing

Avoid transitions that wait for:

- analytics
- non-critical API calls
- large images
- decorative animations

The user should perceive navigation as immediate.

## Shared elements

Good candidates:

- product image
- page title
- selected navigation item
- card → detail view
- persistent visual object

Bad candidates:

- entire page screenshots
- large backgrounds
- every paragraph
- constantly changing content

## Accessibility

Respect:

```css
@media (prefers-reduced-motion: reduce) {
  /* Disable or shorten transitions. */
}
```

Do not create motion that makes content difficult to follow.

## With GSAP

Do not let GSAP navigation animations compete with framework-level view transitions.

Choose one owner for each transition.

Avoid:

```text
Next navigation transition
+
GSAP page transition
+
Lenis scroll transition
+
CSS transition
```

all controlling the same property.

## App Router boundaries

Keep navigation orchestration close to the routing layer.

Do not turn the whole application into a Client Component merely to animate route changes.

## Verification

Test:

- direct page load
- client navigation
- back/forward
- slow network
- mobile
- reduced motion
- keyboard navigation
- deep links
- failed navigation/data loading

## Performance

A transition that makes navigation feel slower is a regression.

Prefer subtle continuity over spectacle.
