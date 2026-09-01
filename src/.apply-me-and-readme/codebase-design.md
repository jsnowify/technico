# Codebase Design — Deep Modules, Seams, Adapters, Testability

## Architectural goal

Build a Next.js application where most business logic is independent of React and framework-specific rendering details.

Prefer deep modules:

```text
UI / Route
    ↓
Application use case
    ↓
Domain logic
    ↓
Adapter / infrastructure
```

The UI should orchestrate user interaction, not become the business-logic layer.

## Deep modules

A deep module exposes a small interface while hiding significant implementation detail.

Good:

```ts
export async function createOrder(input: CreateOrderInput) {
  // validation + orchestration
}
```

The caller should not need to know:

- database schema details
- transaction implementation
- provider SDK quirks
- retry logic
- serialization details

## Seams

A seam is a controlled boundary where implementation can change without forcing unrelated code to change.

Useful seams include:

- payment providers
- email providers
- analytics
- storage
- database access
- external APIs
- authentication
- search

Do not create seams for every function.

## Adapters

External systems belong behind adapters.

```ts
export interface EmailSender {
  send(input: EmailInput): Promise<void>
}
```

Then:

```ts
export class ProviderEmailSender implements EmailSender {
  async send(input: EmailInput) {
    // provider-specific implementation
  }
}
```

The application should depend on the interface when substituting the provider is useful.

## Dependency direction

Prefer:

```text
components → use cases → domain
                         ↑
                    adapters
```

Avoid domain logic importing:

- React
- Next.js UI components
- browser globals
- database-specific models
- provider SDKs

## Next.js boundary

Keep framework-specific code at the edges:

- `app/**/page.tsx`
- `app/**/layout.tsx`
- `app/**/route.ts`
- Server Actions
- middleware/proxy layer where applicable
- metadata files

The core application logic should be callable from tests without rendering a page.

## Data access

Prefer one clear data-access layer rather than scattered database calls throughout components.

Example:

```ts
// lib/data/users.ts
export async function getUserById(id: string) {
  // database access
}
```

A Server Component can call this directly.

Do not create an HTTP Route Handler just to call it from the server.

## Testability

A function is easy to test when:

- inputs are explicit
- dependencies are controlled
- side effects are isolated
- outputs are deterministic
- framework state is not required

Prefer dependency injection when a real external dependency would make tests slow or nondeterministic.

## Transaction boundaries

Put transactional behavior near the data-access/use-case boundary.

Do not spread transaction semantics across UI components.

## Serialization

Server-to-client props must be serializable.

Do not pass:

- database clients
- class instances unless supported/intentional
- functions
- secrets
- unnecessary large objects

Pass only the data the client actually needs.

## Repository structure

A practical App Router structure:

```text
app/
  layout.tsx
  page.tsx
  (marketing)/
  dashboard/
  api/
components/
  ui/
  sections/
lib/
  actions/
  data/
  domain/
  adapters/
  validation/
  utils/
public/
tests/
```

Adapt this to the existing project rather than forcing a wholesale restructure.

## Avoid architecture theater

Do not add:

- repositories over a single ORM call without a reason
- service classes for every operation
- factories that only return one implementation
- generic "managers"
- unnecessary dependency injection containers
- abstraction layers that have no second implementation or testing benefit

## Design test

For every abstraction, ask:

> What change becomes easier because this abstraction exists?

If the answer is unclear, remove it.
