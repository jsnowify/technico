# QuoteScreen

## What this component is

A reusable futuristic quote-card / mini-screen component for
displaying quoted statements. It renders a compact black "screen"
framed with the site's instrument chrome — corner brackets, mono
status readouts, a verified/active header and footer — and types the
quote out character by character behind a blinking `|` cursor.

## Why it exists

It establishes one consistent visual treatment for quote-based
content across the site, instead of every section that needs a quote
building its own card, cursor, and typing logic from scratch.

## Where it is currently used

`src/sections/Home/Approach.tsx` — the pull-quote in the "04 /
Approach" section.

## How it should be used in the future

When another section contains a quoted statement that would benefit
from this treatment (a testimonial, a pull-quote, a callout stat with
a quoted line, etc.), reach for `QuoteScreen` instead of building a
new custom quote card. The section should only need to supply the
content (`quote`, and optionally `label`/`source`) — it should not
need to touch the card frame, the typing effect, or the cursor.

```tsx
import QuoteScreen from "../../components/ui/QuoteScreen";

<QuoteScreen
  quote="A powerful marketing strategy is not just about promotions..."
  label="Client Feedback"
  source="Ref — 04.Q1"
/>;
```

If a future use case genuinely needs new visual behavior (a different
frame shape, a different reveal style, etc.), extend this component
with a new prop rather than duplicating its markup elsewhere — see
"Important implementation rule" below.

## Props

| Prop              | Type      | Default   | Notes                                                                 |
| ----------------- | --------- | --------- | ---------------------------------------------------------------------- |
| `quote`           | `string`  | —         | Required. The statement to type out.                                  |
| `label`           | `string?` | —         | Optional small label, top-left of the header row.                     |
| `source`          | `string?` | `"Statement"` | Optional attribution, shown bottom-left, terminal-log style.     |
| `className`       | `string?` | —         | Extra classes merged onto the card frame.                             |
| `typingSpeed`     | `number?` | `34`      | Average ms per character (jittered per character).                    |
| `startDelay`      | `number?` | `200`     | Ms to wait, once visible, before typing starts.                       |
| `triggerOnScroll` | `boolean?`| `true`    | Start typing when scrolled into view vs. immediately on mount.        |

Deliberately not exposed as props: the frame styling, cursor
character, corner brackets, and header/footer status copy ("Verified"
/ "Active"/"Receiving") — those are the component's fixed visual
identity, not per-instance configuration. Keeping the API small is
intentional; see "Design philosophy" below.

## Design philosophy

`QuoteScreen` should remain:

- **Futuristic** — mini-screen framing, mono labels, status dots.
- **Minimal** — no more chrome than the corner brackets, header, and
  footer it already has.
- **Editorial** — it is still a quote card first; the technical
  detailing supports the quote, it doesn't compete with it.
- **Premium** — restrained, not a stereotypical hacker-terminal
  aesthetic.
- **Consistent with TECHNICO DIGITAL SOLUTIONS INC.**'s existing
  visual language — same primitives as the rest of the site
  (`TiltCard`, `ScrambleText`, `StatusDot`, the `translateZ`
  layering pattern), nothing invented from scratch.

## Important implementation rule

**Future sections should reuse and extend this component rather than
duplicating its typing/cursor/card logic.** If a new section needs a
quote, import `QuoteScreen`. If it needs something `QuoteScreen`
can't currently do, extend `QuoteScreen` (new prop, new variant) —
don't copy its markup into the new section and hand-roll another
typing effect.
