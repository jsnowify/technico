# Core Review — Reviewing Next.js Diffs

## Goal

Review diffs for:

1. Correctness
2. Simplicity
3. Next.js architectural fit
4. Performance
5. Accessibility
6. Security
7. Maintainability
8. Testability

Correctness comes before elegance. Simplicity comes before abstraction.

## Review order

### 1. Behavioral correctness

Ask:

- Does the change satisfy the requested behavior?
- Does it preserve existing behavior outside the requested scope?
- Are loading, error, empty, unauthorized, and not-found states handled?
- Are race conditions or stale updates possible?
- Are server/client boundaries correct?
- Are cache semantics intentional?

### 2. Next.js correctness

Check:

- App Router conventions are followed.
- Server Components remain the default.
- Client Components are limited to interactive/browser-dependent leaves.
- Server-only code cannot leak into client bundles.
- Route Handlers are used as HTTP boundaries, not as internal RPC calls from Server Components.
- `Link`, `Image`, `Script`, Metadata APIs, `notFound()`, `redirect()`, `loading.tsx`, and `error.tsx` are used where appropriate.
- Dynamic APIs such as `cookies()` and `headers()` are not introduced accidentally.
- Caching/revalidation behavior is intentional.

### 3. Simplification

Reject unnecessary complexity.

Prefer:

- one function over a class hierarchy
- an existing utility over a new abstraction
- direct composition over prop drilling through many layers
- a Server Component over a client-side data-fetching wrapper when possible
- native HTML over a custom primitive when no behavior is needed
- a small adapter over a generic "manager" abstraction

Ask:

> Can this be made smaller without losing clarity or correctness?

### 4. Data flow

Look for:

- sequential requests that could run in parallel
- duplicated fetching
- client fetches that should happen on the server
- missing caching
- over-caching personalized data
- unnecessary serialization across the server/client boundary
- fetching an internal API from a Server Component

Prefer parallel work:

```ts
const [user, projects] = await Promise.all([
  getUser(),
  getProjects(),
])
```

### 5. Client boundary review

A `"use client"` file pulls its imported dependency graph toward the client boundary.

Check whether the boundary can be moved lower:

```text
Server page
├── Server content
├── Server data
└── Client interactive island
```

instead of:

```text
Client page
├── all content
├── all data plumbing
└── one button that needed state
```

### 6. Error handling

Review:

- expected errors are represented as UI state
- unexpected errors reach `error.tsx` or an error boundary
- user input is validated server-side
- sensitive errors are not exposed to users
- logging contains enough diagnostic context without secrets

### 7. Accessibility

Check:

- semantic elements
- keyboard operation
- visible focus
- accessible names
- labels for inputs
- correct heading hierarchy
- reduced-motion behavior
- sufficient contrast
- status/error announcements where necessary

### 8. Performance

Look for:

- large client bundles
- unnecessary dependencies
- expensive rerenders
- layout shifts
- unoptimized images
- render-blocking scripts
- animation of layout properties
- long main-thread tasks
- request waterfalls

### 9. Security

Check:

- server-only secrets
- authorization on the server
- input validation
- safe redirects
- safe HTML rendering
- CSRF considerations for state-changing endpoints
- rate limiting for sensitive public endpoints
- secure cookie configuration

### 10. Tests

Prefer tests around behavior and boundaries rather than implementation details.

Test:

- validation
- permissions
- critical transformations
- important UI states
- route handlers
- server actions
- adapters at external boundaries

## Review verdict

Use:

- **Blocker** — incorrect, insecure, or likely to break production.
- **Major** — significant correctness/performance/architecture problem.
- **Minor** — worthwhile improvement but not a release blocker.
- **Nit** — optional style/readability suggestion.

Do not report subjective preferences as defects.

## Simplification checklist

Before approving, ask:

- Can any new file disappear?
- Can any new dependency disappear?
- Can any abstraction disappear?
- Can a client component become a server component?
- Can a request be removed?
- Can a state variable be derived instead?
- Can an effect be removed?
- Can the API surface be smaller?

## Final review principle

A good diff is not the diff with the most architecture.

It is the smallest diff that makes the system more correct, understandable, testable, and resilient.
