# Code Style — Next.js + TypeScript

## General

- TypeScript is the default.
- Prefer explicit, narrow types over `any`.
- Prefer immutable data.
- Prefer named functions for exported behavior.
- Keep functions focused.
- Avoid premature abstractions.
- Follow the repository's existing formatter and lint configuration.

## TypeScript

Prefer:

```ts
type User = {
  id: string
  name: string
}
```

Use `interface` when the type is intentionally extensible or represents a public object contract.

Avoid:

```ts
const value: any = unknownValue
```

Prefer `unknown` at untrusted boundaries and narrow it.

Avoid non-null assertions unless the invariant is obvious and locally guaranteed:

```ts
value!.id
```

Prefer explicit validation or control flow.

## Imports

Prefer absolute aliases when the repository defines them:

```ts
import { Button } from "@/components/ui/Button"
```

Keep imports grouped consistently with the project.

Avoid barrel files when they create large dependency graphs or circular dependencies.

## Components

Server Components are the default.

Use:

```tsx
export default async function Page() {
  const data = await getData()

  return <PageView data={data} />
}
```

Use Client Components only when the component needs:

- state
- event handlers
- effects
- browser APIs
- client-only libraries

Keep `"use client"` as low in the tree as practical.

## The run() pattern

For action-oriented modules, prefer a small `run()` entry point when it improves testability and keeps orchestration separate from implementation details.

```ts
type Input = {
  userId: string
}

type Result = {
  success: boolean
}

export async function run(input: Input): Promise<Result> {
  const user = await getUser(input.userId)

  if (!user) {
    return { success: false }
  }

  await performOperation(user)

  return { success: true }
}
```

Rules:

- `run()` should orchestrate, not contain every implementation detail.
- Keep validation close to the boundary.
- Keep adapters behind functions/interfaces.
- Avoid global mutable state.
- Make dependencies injectable when testing benefits from it.
- Do not create a `run()` wrapper solely for ceremony.

## Server-only modules

If a module must never be imported by client code, make the boundary explicit where supported:

```ts
import "server-only"
```

Never import database clients, private API clients, filesystem access, or secret-bearing modules into Client Components.

## Async code

Prefer parallel work when dependencies allow it:

```ts
const [profile, posts] = await Promise.all([
  getProfile(),
  getPosts(),
])
```

Do not serialize independent requests.

## Error handling

Use typed/domain errors where useful.

Do not:

```ts
try {
  // everything
} catch {
  return null
}
```

unless swallowing the error is intentional.

Preserve diagnostic context in server logs while avoiding secrets and personal data.

## Naming

- Components: `PascalCase`
- Hooks: `useSomething`
- Functions: `camelCase`
- Constants: `UPPER_SNAKE_CASE` only for true constants
- Types: descriptive nouns
- Booleans: `is`, `has`, `can`, `should`

Prefer names that describe intent.

## Comments

Comment the reason, not the syntax.

Bad:

```ts
// Set loading to true
setLoading(true)
```

Good:

```ts
// Keep the optimistic state until the server confirms the mutation.
```

## Formatting

Use the repository formatter. Do not manually fight automated formatting.

## Before commit

```bash
npm run lint
npx tsc --noEmit
npm test
npm run build
```

Only run commands that exist in the repository.
