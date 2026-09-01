# Umami Analytics — SSR-Safe Next.js Instrumentation

## Goal

Track meaningful product behavior without leaking secrets, blocking rendering, or coupling business logic to analytics.

## Architecture

Keep analytics client-side only when the browser interaction itself is what is being measured.

Keep server-side analytics separate from UI components.

Do not import a browser-only analytics SDK into Server Components.

## Script loading

Analytics scripts must not unnecessarily block initial rendering.

Load the tracking script using the project's approved Next.js script strategy.

Do not manually inject scripts repeatedly from multiple components.

## Events

Track meaningful actions:

- CTA click
- form submission
- signup
- login
- purchase
- navigation intent
- feature activation

Avoid tracking every mouse movement or animation frame.

## Event naming

Use stable, lowercase, descriptive names:

```text
cta_click
contact_form_submit
signup_complete
pricing_view
```

Keep naming consistent across the application.

## Event properties

Send only useful, non-sensitive properties.

Good:

```ts
{
  location: "hero",
  plan: "pro"
}
```

Avoid:

- passwords
- access tokens
- raw form contents
- private messages
- unnecessary personal data
- secrets

## SSR safety

Never assume browser globals exist.

Do not call:

```ts
window.umami
```

during Server Component rendering.

Client instrumentation should execute only after the client runtime is available.

## Environment variables

A website ID or public analytics identifier may be public depending on the provider configuration.

Secrets must never use `NEXT_PUBLIC_*`.

## Privacy

Analytics implementation should follow the project's legal/privacy requirements.

Document:

- what is collected
- why it is collected
- retention
- consent requirements where applicable

## Performance

Analytics must be:

- asynchronous where possible
- non-blocking
- resilient if unavailable
- isolated from critical application behavior

If analytics fails, the application must continue working.

## Abstraction

If multiple pages call analytics, use a small helper:

```ts
export function trackEvent(name: string, data?: Record<string, unknown>) {
  // client-safe instrumentation
}
```

Do not build a large analytics framework unless the project actually needs one.

## Testing

Analytics should not break application tests.

Mock the analytics boundary rather than requiring the real analytics service.

## Rule

Analytics observes the product.

Analytics must never become a dependency that prevents the product from functioning.
