# Performance Audit — Lighthouse, Core Web Vitals, Next.js

## Goal

Measure → identify bottleneck → fix → rebuild → measure again.

Do not optimize based only on code inspection.

## Core Web Vitals

Monitor:

- LCP — Largest Contentful Paint
- INP — Interaction to Next Paint
- CLS — Cumulative Layout Shift

Also inspect:

- TTFB
- JavaScript execution
- long tasks
- image weight
- font loading
- network waterfalls

## Production measurement

Use a production build:

```bash
npm run build
npm run start
```

Then measure the production server.

Do not rely exclusively on development performance.

## LCP

Investigate:

- hero images
- fonts
- server response time
- render-blocking resources
- large client bundles
- slow data fetching

For an important above-the-fold image, configure `next/image` appropriately and avoid lazy-loading the actual LCP asset.

## INP

Look for:

- large event handlers
- React rerenders
- expensive state updates
- animation work
- third-party scripts
- large JavaScript bundles

Prefer smaller client boundaries.

## CLS

Reserve space for:

- images
- fonts
- ads
- dynamic UI
- media

Avoid injecting content above already-rendered content.

## Request waterfalls

Bad:

```ts
const user = await getUser()
const posts = await getPosts(user.id)
const settings = await getSettings()
```

when the requests are independent.

Prefer:

```ts
const [user, settings] = await Promise.all([
  getUser(),
  getSettings(),
])
```

Then fetch dependent data after the required dependency exists.

## Server/client split

Check whether client-side fetching can move to a Server Component.

The goal is not "server everything"; the goal is to keep unnecessary JavaScript and round trips out of the browser.

## Caching

Understand the current Next.js caching model before changing it.

Use explicit cache/revalidation behavior for data that benefits from it.

Do not cache:

- personalized data
- authorization-sensitive responses
- rapidly changing data

unless the cache key and invalidation semantics are correct.

## `use cache`

When using Cache Components, explicitly cache stable or reusable results with `use cache`.

Read dynamic request data such as cookies/headers outside cached scopes and pass the needed values as arguments when appropriate.

## Bundle audit

Inspect:

```bash
npx @next/bundle-analyzer
```

or the repository's configured bundle analysis tool.

Look for:

- duplicate libraries
- large icon packages
- client-only libraries imported too high
- entire utility libraries imported for one function
- animation libraries loaded on pages that do not animate

## Images

Use `next/image` where appropriate.

Check:

- dimensions
- sizes
- quality
- format
- loading behavior
- remote image configuration

## Fonts

Use `next/font` where appropriate.

Avoid loading many weights/styles that are never used.

## Third-party scripts

Every third-party script has a performance cost.

Ask:

- Is it required?
- Can it load later?
- Can it be server-side?
- Can it be replaced?
- Does it run on every page?

## Animation

Audit:

- ScrollTrigger count
- event listeners
- layout reads/writes
- large DOM transforms
- pinned sections
- mobile behavior

Prefer transform/opacity.

## Lighthouse

Run Lighthouse in a clean/incognito environment against a production build.

Review:

- Performance
- Accessibility
- Best Practices
- SEO

Lighthouse is a diagnostic tool, not the sole definition of performance.

## Verification

After a fix:

1. Rebuild.
2. Re-run the measurement.
3. Compare before/after.
4. Confirm no regression in accessibility or functionality.
