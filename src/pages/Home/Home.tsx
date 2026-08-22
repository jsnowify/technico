import { useRef } from "react";

import { usePageEnter } from "../../hooks/usePageEnter";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

import Hero from "../../sections/Home/Hero";
import Introduction from "../../sections/Home/Introduction";
import Approach from "../../sections/Home/Approach";
import Diagnostics from "../../sections/Home/Diagnostics";
import Services from "../../sections/Home/Services";
import Partners from "../../sections/Home/Partners";
import Process from "../../sections/Home/Process";
import Feedback from "../../sections/Home/Feedback";
import Ignition from "../../sections/Home/Ignition";
import FAQ from "../../sections/Home/Faq";
import Booking from "../../sections/Home/Booking";

/**
 * Pure composer. Hero, Introduction, Approach, Diagnostics, and
 * Services render in plain normal document flow, one after another —
 * no pin wrapper at this level. That pinned "pile of folders"
 * hand-off has been replaced by each section's own restrained,
 * scroll-triggered reveal (see sections/Home/Introduction.tsx,
 * sections/Home/Approach.tsx, and sections/Home/Diagnostics.tsx),
 * which needs nothing pinned to work.
 *
 * The old `Stack`/`StackSection`/`useStackScrollGate` pin machinery
 * was confirmed unused project-wide (no page or component imported
 * them) and has been removed.
 *
 * Services (see sections/Home/Services.tsx) is the one exception:
 * it owns a small, self-contained pin of its own — scoped entirely
 * inside that file, torn down on unmount, desktop+motion-allowed
 * only — for its scroll-driven horizontal service sequence. That is
 * a property of Services itself, not of this composer; Home still
 * just renders sections in a row.
 *
 * Partners (see sections/Home/Partners.tsx) follows Services as
 * section 07 — a black-ground logo wall closing out the numbered
 * sequence, same restrained scroll-triggered reveal as Introduction/
 * Approach/Diagnostics, no pin.
 *
 * Process (see sections/Home/Process.tsx) is section 08 — "Our
 * Proven Approach," a four-step launch-countdown sequence with its
 * own pinned horizontal track (desktop+motion-allowed only, same
 * self-contained pin/teardown pattern as Services), reversed in
 * direction from Services' — see that file's header comment for why.
 *
 * Feedback (see sections/Home/Feedback.tsx) is section 09 — client
 * results presented through a scroll-driven orbital sequence, one
 * client active at a time. Same self-contained pin pattern as
 * Process/Services, own background system instead of a shared track.
 *
 * Ignition (see sections/Home/Ignition.tsx) is section 10 — four
 * capability signals in tactile, pointer-reactive cards, breaking out
 * into one full-bleed final call to action. Plain scroll-triggered
 * reveal like Introduction/Approach/Diagnostics/Partners/Process, no
 * pin.
 *
 * FAQ (see sections/Home/Faq.tsx) is section 11 — a single-open
 * accordion of qualification/comparison questions, plus a modest
 * closing nudge toward /contact. Same plain scroll-triggered reveal
 * as its siblings; the accordion's own expand/collapse is the one new
 * interaction this page needed, built on the same measured-height
 * technique Header.tsx already uses for its mobile category
 * disclosure (see that file's header comment in Faq.tsx for detail).
 *
 * Booking (see sections/Home/Booking.tsx) now closes the page as
 * section 12, rendered directly before <Footer>. It reuses the same
 * `BookingForm` component /contact renders (sections/Contact/
 * BookingForm.tsx) so a visitor convinced by FAQ can book right here
 * instead of clicking through to another page. Same numbered-section
 * chrome and scroll-triggered reveal as every section above it.
 */
export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  useDocumentTitle("Home");
  usePageEnter(containerRef);

  return (
    <div ref={containerRef} className="bg-black">
      <Hero />
      <Introduction />
      <Approach />
      <Diagnostics />
      <Services />
      <Partners />
      <Process />
      <Feedback />
      <Ignition />
      <FAQ />
      <Booking />
    </div>
  );
}
