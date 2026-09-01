# Next.js Engineering Guidance

This directory contains the project's engineering rules for a modern Next.js App Router application.

## Documents

| File | Responsibility |
|---|---|
| `Agentmark-down.md` | AI-agent operating rules and synchronization |
| `CoreReview.md` | Diff review and simplification |
| `codestyle.md` | TypeScript conventions and `run()` pattern |
| `codebase-design.md` | Architecture, deep modules, seams, adapters |
| `design-engineering.md` | Motion, easing, micro-interactions |
| `frontend.md` | Next.js runtime UI and component boundaries |
| `mantime-hooks.md` | Hooks, listeners, disclosure, outside-click |
| `modern-web-guidance.md` | Platform, accessibility, forms, CSS, security |
| `performance-audit.md` | Lighthouse and Core Web Vitals |
| `react-performance.md` | React rendering and bundle performance |
| `seo-aeo-best-practices.md` | SEO, AEO, metadata, JSON-LD |
| `umami-analytics.md` | SSR-safe analytics |
| `view-transitions.md` | Navigation and view transitions |

## Core rule

Use the smallest correct architecture that takes advantage of Next.js Server Components, server-side data access, streaming, caching, metadata, optimized assets, and progressive enhancement.

Official references:

- https://nextjs.org/docs
- https://nextjs.org/docs/app
- https://nextjs.org/docs/app/guides/production-checklist
