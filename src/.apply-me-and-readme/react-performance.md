# React Performance — Next.js App Router

## Principle

Optimize architecture before memoization.

The biggest wins usually come from:

- smaller client boundaries
- less JavaScript
- fewer requests
- parallel fetching
- appropriate caching
- smaller component trees
- less expensive rendering

## Server Components

Use Server Components for work that does not require client interactivity.

This keeps work on the server and reduces browser JavaScript.

## Client Components

Do not make a parent Client Component just to host one interactive child.

Prefer:

```text
Server
├── content
├── data
└── ClientWidget
```

## Avoid unnecessary state

If a value can be derived, derive it.

Bad:

```ts
const [filtered, setFiltered] = useState(items)
```

Better:

```ts
const filtered = items.filter(matchesFilter)
```

If filtering is expensive, measure before adding memoization.

## Memoization

Use `useMemo` when:

- computation is genuinely expensive
- dependencies are stable
- profiling shows benefit

Use `useCallback` when function identity matters.

Use `React.memo` when repeated renders are demonstrably expensive and props are stable.

Do not blanket-wrap components with memoization.

## Context

Context updates can rerender many consumers.

Keep providers:

- low in scope
- focused
- split by concern

Do not put frequently changing values in a global provider unless necessary.

## Effects

Effects synchronize with external systems.

Avoid effects for:

- derived state
- event-specific actions
- calculations
- server data fetching that can happen in Server Components

## Async waterfalls

Find dependent and independent requests.

Parallelize independent requests.

Use Suspense boundaries to stream slow independent UI where appropriate.

## Lists

For large lists:

- stable keys
- pagination/virtualization when needed
- avoid rendering unnecessary rows
- avoid expensive per-row calculations
- keep row components focused

Do not virtualize small lists without a measured reason.

## Hydration

Hydration mismatches can be caused by:

- random values
- timestamps
- browser-only state
- inconsistent locale formatting
- DOM differences

Keep the initial server/client output deterministic.

## Dynamic imports

Use `next/dynamic` when a genuinely large client-only module can be deferred.

Do not dynamically import every component.

## Event handlers

Avoid expensive synchronous work inside:

- pointermove
- scroll
- resize
- input

Use requestAnimationFrame or debouncing/throttling where appropriate.

## Animation

Animation state should generally stay outside React state when it changes every frame.

For GSAP, DOM refs/timelines are often preferable to calling `setState` every frame.

## Data ownership

Fetch data as close as practical to where it is consumed, especially in Server Components.

Do not create massive "page data" objects that are passed through many layers.

## Performance debugging

Use:

- React DevTools Profiler
- browser Performance panel
- Next.js build output
- bundle analysis
- Lighthouse
- production measurements

Do not guess.

## Golden rule

The fastest React component is often the component that does not need to run in the browser.
