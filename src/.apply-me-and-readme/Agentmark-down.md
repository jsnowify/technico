# Agent Markdown — Next.js Project Guidance

## Purpose

This file is the high-level instruction set for AI coding agents working in this Next.js repository.

The project uses the **Next.js App Router + TypeScript + React Server Components** unless the existing codebase clearly establishes another pattern.

Agents must prefer platform-native Next.js capabilities over unnecessary abstractions.

## Source of truth

Before making framework-specific changes, consult the current Next.js documentation:

- https://nextjs.org/docs
- https://nextjs.org/docs/app
- https://nextjs.org/docs/app/guides/production-checklist
- https://nextjs.org/docs/app/getting-started/server-and-client-components
- https://nextjs.org/docs/app/getting-started/fetching-data
- https://nextjs.org/docs/app/getting-started/metadata-and-og-images
- https://nextjs.org/docs/app/api-reference/functions/fetch
- https://nextjs.org/docs/app/api-reference/directives/use-cache

Do not rely on remembered behavior from older Next.js versions when the current documentation is available.

## Repository rules

1. Inspect the existing architecture before changing it.
2. Preserve existing public APIs and behavior unless the task explicitly asks for a breaking change.
3. Prefer the smallest correct change.
4. Do not introduce a dependency when the platform or an existing dependency already solves the problem.
5. Keep Server Components as the default.
6. Add `"use client"` only at the smallest boundary that requires client-only capabilities.
7. Keep secrets server-side.
8. Validate inputs at trust boundaries.
9. Use semantic HTML and accessible interactions.
10. Treat performance as a correctness concern, not a final polish step.
11. Run type checking, linting, tests, and a production build when applicable.
12. Never claim a change works without verifying it.

## Section synchronization

When changing architecture or conventions, update the relevant Markdown guidance in the same change.

- Runtime/component rules → `frontend.md`
- TypeScript/code conventions → `codestyle.md`
- Architecture → `codebase-design.md`
- Motion → `design-engineering.md`
- Hooks → `mantime-hooks.md`
- Web platform → `modern-web-guidance.md`
- Performance → `performance-audit.md` / `react-performance.md`
- SEO → `seo-aeo-best-practices.md`
- Analytics → `umami-analytics.md`
- Navigation transitions → `view-transitions.md`
- Diff review → `CoreReview.md`

## Agent workflow

### Before coding

- Read the relevant files.
- Identify the route boundary.
- Determine whether the code is server or client.
- Identify data ownership and caching behavior.
- Check existing utilities/components before creating new ones.
- Search for related usage before changing an API.

### During coding

- Make one coherent change at a time.
- Keep abstractions local until reuse is demonstrated.
- Avoid speculative refactors.
- Preserve accessibility.
- Avoid unnecessary client JavaScript.
- Avoid request waterfalls.
- Keep loading/error/empty states explicit.

### After coding

Run the narrowest useful verification first:

```bash
npm run lint
npx tsc --noEmit
npm test
npm run build
```

Use only commands that actually exist in the repository.

## Never do this

- Do not add `"use client"` to entire route trees just to access one interactive child.
- Do not fetch your own Route Handler from a Server Component.
- Do not put secrets in `NEXT_PUBLIC_*`.
- Do not use `window`, `document`, or browser APIs during server rendering.
- Do not disable caching globally to fix one stale-data problem.
- Do not add `useEffect` for work that can happen during render or on the server.
- Do not replace semantic HTML with clickable `<div>` elements.
- Do not add animation merely because a design reference contains motion.
- Do not optimize based on guesses; measure first.

## Expected agent output

When completing a code task, report:

1. What changed.
2. Why it changed.
3. Important trade-offs.
4. Verification performed.
5. Any remaining risks or follow-up work.
