# Frontend — Next.js App Router Runtime UI

## Default architecture

Use the Next.js App Router.

Pages and layouts are Server Components by default. Use Client Components only where interactivity or browser APIs require them.

## Server vs Client

### Server Component

Use for:

- data fetching
- database access
- secrets
- metadata
- static content
- server-side composition

### Client Component

Use for:

- `useState`
- `useReducer`
- event handlers
- `useEffect`
- browser APIs
- interactive animations
- client-only libraries

Keep the client boundary narrow.

## Data fetching

Fetch data in Server Components whenever possible.

Do not do:

```text
Server Component → internal Route Handler → database
```

Prefer:

```text
Server Component → data function → database
```

Use Route Handlers for actual HTTP boundaries such as:

- public APIs
- webhook endpoints
- browser/client requests
- integrations requiring HTTP

## Loading and streaming

Use:

- `loading.tsx`
- `<Suspense>`
- meaningful skeletons

Stream slow sections rather than blocking an entire page when practical.

## Error handling

Use:

- `error.tsx` for route-level runtime errors
- `not-found.tsx` for missing resources
- `notFound()` for resource lookup failures
- `redirect()` when navigation is part of server logic

Keep expected validation errors separate from unexpected failures.

## Navigation

Prefer:

```tsx
import Link from "next/link"
```

for internal navigation.

Use ordinary anchors for external URLs.

Do not manually implement client-side routing unless the interaction genuinely requires it.

## Images

Prefer:

```tsx
import Image from "next/image"
```

for content images.

Specify dimensions or use responsive sizing to prevent layout shifts.

Use meaningful `alt` text for informative images. Use empty alt text for decorative images.

## Fonts

Prefer `next/font` for application fonts where possible.

Avoid unnecessary external font requests.

## Scripts

Use `next/script` for third-party scripts when it provides better loading control.

Load analytics and non-critical scripts without blocking initial rendering.

## Lenis

If the project uses Lenis:

- initialize it once at the application/client boundary
- do not create a new instance per section
- clean it up correctly
- coordinate it with GSAP ScrollTrigger if both are used
- avoid unnecessary scroll listeners
- respect reduced motion
- ensure keyboard/accessibility behavior is not broken

Do not introduce smooth scrolling merely because it looks fashionable.

## Component design

Prefer composition:

```tsx
<Card>
  <CardHeader />
  <CardContent />
  <CardFooter />
</Card>
```

over large components with dozens of boolean props.

Keep components cohesive.

## State

Prefer derived state:

```ts
const isEmpty = items.length === 0
```

instead of duplicating it:

```ts
const [isEmpty, setIsEmpty] = useState(false)
```

Do not use state for values that can be calculated from props/data.

## Effects

Before writing `useEffect`, ask:

- Is this synchronization with an external system?
- Can it happen during render?
- Can it happen in an event handler?
- Can it happen on the server?

If yes, avoid the effect.

## UI states

Every important interactive component should consider:

- idle
- hover
- focus
- pressed
- loading
- success
- error
- disabled
- empty

## Accessibility

Use semantic HTML first.

Prefer:

```html
<button>
```

over:

```html
<div role="button">
```

unless there is a compelling reason otherwise.

## Performance

Avoid:

- giant client components
- unnecessary context providers
- large dependency imports
- repeated DOM queries
- expensive render-time calculations
- unnecessary effects
- layout animation

Use dynamic imports for genuinely heavy client-only features when appropriate.

## React keys

Use stable identity keys:

```tsx
items.map((item) => <Item key={item.id} />)
```

Do not use array indexes when item order can change.

## Hydration

Ensure server and client render the same initial output.

Avoid rendering browser-only values directly during the initial server render.

Use client effects only when the value genuinely depends on the browser.
