# Mantine / Hooks — Listeners, Outside Click, Disclosure

## Scope

Use `@mantine/hooks` when it already exists in the project and provides a clear solution.

Do not add a hook library for a problem already solved cleanly by React or browser APIs.

## Event listeners

Prefer lifecycle-safe hooks for global listeners.

Listeners should:

- be installed only when needed
- be removed on cleanup
- avoid stale closures
- avoid unnecessary re-registration

For high-frequency events such as scroll and pointer movement:

- throttle or use requestAnimationFrame where necessary
- avoid updating React state every frame
- prefer refs for transient values
- measure performance before optimizing

## Outside click

For menus, popovers, and disclosure UI:

- close on outside pointer interaction when appropriate
- do not close when interacting with the trigger if that interaction toggles the state
- support Escape
- restore focus appropriately
- keep pointer and keyboard behavior consistent

Do not manually attach several competing document listeners for one component.

## Disclosure

Use a disclosure hook for simple open/close state:

```ts
const { opened, open, close, toggle } = useDisclosure()
```

Do not use a disclosure hook for complex state machines.

## Accessibility

A disclosure component should expose:

- `aria-expanded`
- `aria-controls`
- a stable controlled element ID
- keyboard support
- visible focus

For dialogs, use a proper dialog primitive rather than building a fake modal from a `<div>`.

## Hook boundaries

Hooks containing browser APIs must be Client Component code.

Do not import a browser-only hook into Server Components.

## Stable callbacks

Avoid unnecessary callback memoization.

Use `useCallback` when:

- a child depends on referential identity
- a hook dependency requires stability
- a subscription API requires a stable handler

Do not use it everywhere by default.

## Scroll hooks

Scroll state should not cause the entire application tree to rerender.

Prefer:

- refs
- isolated client components
- requestAnimationFrame
- CSS where possible

For animation, coordinate with GSAP/Lenis rather than creating multiple independent scroll systems.

## Cleanup

Every subscription, timer, observer, or animation must have a clear lifecycle.

Typical resources:

- `window.addEventListener`
- `document.addEventListener`
- `setTimeout`
- `setInterval`
- `ResizeObserver`
- `IntersectionObserver`
- GSAP timelines/ScrollTriggers
- Lenis instances

## Rule

A hook should make lifecycle behavior easier to reason about, not hide it.
