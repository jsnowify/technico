import Button from "@/components/ui/Button";

const LEFT_PARAGRAPH_BEFORE =
  "We have experience working with various industries, including e-commerce stores, local service providers, and entrepreneurs in the service sector. ";
const LEFT_PARAGRAPH_AFTER =
  " has helped businesses improve their rankings and drive profits. This includes businesses like yours, where we have successfully assisted clients in achieving their goals.";

const RIGHT_PARAGRAPH =
  "Your business is managed by marketers who excel in navigating the complexities of Google algorithms, adopting innovative marketing strategies, and leveraging the psychology of impactful advertising to drive exceptional results for your business.";

const BRAND_NAME = "Technico Digital Solutions";

/* ================================================================
   DISCUSS (tenth section)
   ================================================================
   Purple section built the same way as Strategy.tsx's split panel,
   now matching it more closely than the earlier pass: eyebrow,
   centered headline, then a two-tone `md:grid-cols-2` panel with
   font-mono uppercase copy, small caption labels, and a decorative
   quote mark on the left panel -- the exact construction Strategy
   uses for "Our Philosophy" / "Why It Works", just recolored
   (light-gray + black instead of purple + cream, since the section
   itself already sits on purple) and carrying Discuss's own two
   copy blocks, one per panel. Static server-rendered JSX, no
   scroll/entrance animation, matching Strategy's own non-hero
   approach.
   ================================================================ */

export default function Discuss() {
  return (
    <section className="bg-purple-secondary">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24 md:py-28">
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-2.5">
          <span className="h-2.5 w-2.5 shrink-0 bg-white" />
          <span className="font-mono text-xs tracking-[0.14em] text-white/70 uppercase text-balance sm:text-sm">
            Let&rsquo;s Discuss Your Project Right Away
          </span>
        </div>

        {/* Headline */}
        <h2 className="mx-auto mt-7 max-w-3xl text-balance text-center text-[2rem] leading-[1.2] font-normal tracking-tight text-white sm:mt-8 sm:text-[42px] sm:leading-[1.15] sm:tracking-[-1.5px] md:text-[50px] md:leading-[1.12] md:tracking-[-2px]">
          No More Searching for &ldquo;Digital Marketing Near Me&rdquo;
        </h2>

        {/* Split panel -- built the same way as Strategy.tsx's two
            panels: font-mono uppercase tracking-wide copy, a small
            caption label above the paragraph, a decorative quote
            mark on the left panel, and the same generous padding /
            centered max-w-sm measure / leading-loose rhythm. The two
            distinct paragraphs each get their own panel here
            (light-gray "experience" side, black "approach" side)
            rather than duplicating one paragraph across both, since
            Strategy's own panels each carry different copy too. */}
        <div className="mt-16 grid grid-cols-1 gap-3 sm:mt-20 md:mt-24 md:grid-cols-2">
          <div className="relative flex flex-col justify-center overflow-hidden bg-[#d9d9d9] px-8 py-16 sm:px-10 sm:py-20 md:px-12 md:py-24">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-6 left-4 font-serif text-[9rem] leading-none text-black-text/10 select-none sm:text-[11rem]"
            >
              &ldquo;
            </span>
            <div className="relative mx-auto max-w-sm text-center">
              <span className="mb-6 block font-mono text-xs tracking-[0.2em] text-black-text/40 uppercase">
                Our Experience
              </span>
              <p className="font-mono text-sm leading-loose tracking-wide text-black-text/80 uppercase text-pretty sm:text-base">
                {LEFT_PARAGRAPH_BEFORE}
                <span className="font-bold text-purple-secondary">
                  {BRAND_NAME}
                </span>
                {LEFT_PARAGRAPH_AFTER}
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-center bg-black-primary px-8 py-16 sm:px-10 sm:py-20 md:px-12 md:py-24">
            <div className="mx-auto max-w-sm text-center">
              <span className="mb-6 block font-mono text-xs tracking-[0.2em] text-white/50 uppercase">
                How We Work
              </span>
              <p className="font-mono text-sm leading-loose tracking-wide text-white/80 uppercase text-pretty sm:text-base">
                {RIGHT_PARAGRAPH}
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-14 flex justify-center sm:mt-16">
          <Button to="/contact" variant="light" size="lg">
            Free Strategy
          </Button>
        </div>
      </div>
    </section>
  );
}
