import Button from "@/components/ui/Button";
import RevealUpText from "@/components/motion/RevealUpText";

/**
 * Cta
 * -----------
 * Redesigned to match the editorial pattern used across About (see
 * AboutStory.tsx / AboutFieldsAccordion.tsx) instead of standing
 * apart with its own visual language:
 *
 *   - Same outlined mono tag pill ("// LABEL") used for each About
 *     chapter, in the same purple/pink accent pair.
 *   - Same oversized, tracking-tight headline treatment as the
 *     chapter titles (just sized down a step, since this is a
 *     closing statement, not a page-length hero).
 *   - Body copy runs through RevealUpText, the same word-by-word
 *     reveal AboutStory uses on its paragraphs, so scrolling into
 *     this section feels continuous with what came before it
 *     instead of switching motion languages at the last section.
 *   - Plain bordered Button (the same component used for the
 *     "Book a Call" button above AboutFieldsAccordion's list)
 *     instead of GlossyButton.
 *   - Full-bleed bg-black-bg section instead of a rounded black
 *     card — this site doesn't otherwise use "cards"; sections sit
 *     flush and are separated by hairlines/borders instead.
 *
 * The old RAYS/RayBurst sunburst SVG and GlossyButton import are
 * gone entirely — that scattered-rays-around-a-pill look doesn't
 * appear anywhere else in the design system, so it read as a one-
 * off rather than a variant of the shared pattern.
 *
 * Usage:
 *   <Cta
 *     title="Take your brand to the next level"
 *     description="Our team of experts will help you connect with
 *       the right audience and grow your business."
 *     cta={{ label: "Free Strategy", href: SITE_PHONE_HREF }}
 *   />
 */

interface CtaLink {
  label: string;
  href: string;
}

interface CtaProps {
  /** Mono tag pill text, shown as "// {tag}". */
  tag?: string;
  title?: string;
  description?: string;
  cta?: CtaLink;
  /** Tag pill / accent color — same purple/pink pair AboutStory
   *  alternates between chapters. */
  accent?: "purple" | "pink";
  className?: string;
}

const ACCENT_TEXT: Record<"purple" | "pink", string> = {
  purple: "text-purple-accent",
  pink: "text-pink-accent",
};

const ACCENT_BORDER: Record<"purple" | "pink", string> = {
  purple: "border-purple-accent/40",
  pink: "border-pink-accent/40",
};

export default function Cta({
  tag = "Let's Talk",
  title = "Take your brand to the next level",
  description = "Our team of experts will help you connect with the right audience and grow your business.",
  cta = { label: "Free Strategy", href: "#" },
  accent = "purple",
  className = "",
}: CtaProps) {
  return (
    <section
      className={`w-full border-t border-white/15 bg-black-bg ${className}`}
    >
      <div className="mx-auto flex max-w-3xl flex-col items-center px-5 py-20 text-center sm:px-10 sm:py-28">
        <span
          className={`inline-block w-fit border px-3 py-1.5 font-mono text-xs tracking-[0.14em] uppercase ${ACCENT_BORDER[accent]} ${ACCENT_TEXT[accent]}`}
        >
          {"// "}
          {tag}
        </span>

        <h2 className="mt-6 max-w-2xl text-[40px] leading-[0.95] font-medium tracking-tight text-white sm:text-[56px] md:text-[64px]">
          {title}
        </h2>

        <p className="mt-6 max-w-xl text-base leading-relaxed font-normal text-white/70 sm:text-lg">
          <RevealUpText text={description} />
        </p>

        <div className="mt-10">
          <Button to={cta.href} variant="white-static" size="md">
            {cta.label}
          </Button>
        </div>
      </div>
    </section>
  );
}
