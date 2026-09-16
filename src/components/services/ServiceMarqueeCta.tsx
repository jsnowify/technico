"use client";

import MarqueeText from "@/components/ui/MarqueeText";

interface ServiceMarqueeCtaProps {
  /** Short repeating phrase, e.g. "Let's connect." */
  text: string;
  cta: { label: string; href: string };
  /** "pink" | "purple" — matches getServiceAccent(). */
  accent: "pink" | "purple";
}

/**
 * ServiceMarqueeCta
 * -----------------------------------------------------------------
 * Full-bleed CTA row: `text` repeats edge-to-edge in an endless
 * autoplay marquee, the whole row linking to `cta.href`.
 *
 * Thin services-flavored wrapper around the reusable
 * components/ui/MarqueeText.tsx (see that file's doc comment for
 * the seamless-loop mechanic) — kept around so
 * app/services/[slug]/page.tsx's `marqueeCta` section type and
 * lib/content/services.ts's existing `{ text, cta, accent }` shape
 * don't need to change. Anywhere else in the site wanting this
 * effect (e.g. a "LET'S CONNECT" band outside the services flow)
 * should reach for <MarqueeText /> directly instead of this wrapper.
 */
export default function ServiceMarqueeCta({
  text,
  cta,
  accent,
}: ServiceMarqueeCtaProps) {
  return <MarqueeText text={text} cta={cta} accent={accent} />;
}
