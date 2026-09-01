# Modern Web Guidance — Platform-First Next.js

## Principle

Use the web platform first. Use Next.js second. Add libraries only when they solve a real problem.

## HTML

Prefer semantic elements:

- `header`
- `nav`
- `main`
- `section`
- `article`
- `aside`
- `footer`
- `button`
- `a`
- `form`
- `label`

Use ARIA to supplement semantics, not replace them.

## Forms

Use native form controls whenever possible.

Validate on the server even when client validation exists.

For mutations in Next.js, Server Actions can be appropriate when the operation belongs to the application server.

Client validation improves UX. Server validation provides security.

## Security

Never trust client input.

Validate:

- body
- query parameters
- route parameters
- cookies
- headers
- uploaded files

Keep secrets in server-only environment variables.

Only expose variables with `NEXT_PUBLIC_` when they are intentionally public.

## Cookies

Use secure cookie settings for authentication/session data:

- `HttpOnly`
- `Secure` in production
- appropriate `SameSite`
- narrow `Path`
- appropriate expiration

Do not store sensitive tokens in localStorage by default.

## Headers

Consider:

- Content-Security-Policy
- Strict-Transport-Security
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy

Choose policies based on the application's actual requirements.

## URL state

Prefer URL parameters for state that should be:

- shareable
- bookmarkable
- navigable
- indexable where appropriate

Examples:

- filters
- search
- pagination
- tabs when they represent meaningful navigation

## CSS

Prefer CSS for:

- layout
- hover states
- simple transitions
- responsive behavior
- media queries
- reduced motion

Use JavaScript animation only when CSS cannot provide the required behavior.

## Responsive design

Build from content constraints rather than device-specific pixel assumptions.

Use:

- fluid sizing
- container queries where useful
- responsive typography
- flexible grids
- `clamp()`
- modern viewport units where appropriate

## Accessibility

Required baseline:

- keyboard access
- visible focus
- semantic headings
- accessible names
- alt text
- form labels
- reduced motion
- sufficient contrast
- logical reading order

## Progressive enhancement

A page should remain understandable when:

- JavaScript is delayed
- animation is disabled
- network speed is poor
- a third-party script fails

Do not make essential content depend on decorative JavaScript.

## Images

Use responsive image delivery.

Avoid:

```css
background-image: url(...)
```

for content images where semantic `<img>`/`next/image` behavior is more appropriate.

## Browser APIs

Guard browser-only APIs behind client boundaries.

Never assume `window` exists during server rendering.

## Web performance

Prioritize:

- HTML delivery
- useful content
- image dimensions
- font strategy
- JS reduction
- caching
- server rendering
- streaming
- low main-thread work

Measure rather than guessing.
