import { QUALIFYING_QUESTIONS } from "@/lib/constants";

/* ================================================================
   QUALIFY (ninth section)
   ================================================================
   Black section, fully static -- no scroll-triggered reveal, same
   "content first" reasoning Overview.tsx uses for its own static
   section. Same calm, spacious panel language as Discuss.tsx
   (generous padding, a small mono uppercase caption label, a
   centered narrow measure) but laid out as its own `md:grid-cols-2`
   grid of four bordered panels rather than Discuss's two-tone split
   or the earlier row-list -- and with no decorative background
   numeral this time, just the purple caption label carrying the
   accent.

   1. Standard eyebrow + headline + subcopy, eyebrow keeps
      Overview.tsx's purple marker (square + label both in
      `purple-secondary`) -- the one eyebrow on the site that isn't
      monochrome, matching the reference design's "SERP" tag.

   2. The four questions sit in a 2x2 grid on md+ (single column
      below that), each its own hairline-bordered panel
      (`border-white/10`) with a small `purple-secondary` "Question
      0X" caption, the question itself, then the answer in the same
      font-mono uppercase tracking-wide voice used across the other
      redesigned sections. Generous py-16/20 padding and a
      `max-w-md` centered measure keep each panel unhurried.
   ================================================================ */

export default function Qualify() {
  return (
    <section className="bg-black-bg">
      <div className="mx-auto max-w-6xl px-6 pt-20 pb-20 sm:pt-24 sm:pb-24 md:pt-28 md:pb-28">
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-2.5">
          <span className="h-2.5 w-2.5 shrink-0 bg-purple-secondary" />
          <span className="font-mono text-xs tracking-[0.14em] text-purple-secondary uppercase text-balance sm:text-sm">
            SERP
          </span>
        </div>

        {/* Headline */}
        <h2 className="mx-auto mt-7 max-w-4xl text-balance text-center text-[2rem] leading-[1.2] font-normal tracking-tight text-white sm:mt-8 sm:text-[42px] sm:leading-[1.15] sm:tracking-[-1.5px] md:text-[50px] md:leading-[1.12] md:tracking-[-2px]">
          Outshine Your Competition And Secure Top Rankings On Search Engine
          Result Pages (SERPs)
        </h2>
        <p className="mx-auto mt-7 max-w-2xl text-center text-sm leading-loose text-white/50 text-pretty sm:mt-8 sm:text-base">
          If Any Of These Questions Resonate With Your Business Goals, Then Book
          A Strategy Call To Explore Our Digital Marketing Solutions, Designed
          Specifically To Support Your Needs, Budget, And Aspirations.
        </p>

        {/* Qualifying questions -- 2x2 grid of bordered, spacious
            panels, purple accent carried by the caption label only. */}
        <div className="mt-20 grid grid-cols-1 gap-3 sm:mt-24 md:mt-28 md:grid-cols-2">
          {QUALIFYING_QUESTIONS.map((item, index) => (
            <div
              key={item.question}
              className="flex flex-col justify-center border border-white/10 px-8 py-16 sm:px-10 sm:py-20 md:px-12 md:py-20"
            >
              <div className="mx-auto max-w-md text-center">
                <span className="mb-6 block font-mono text-xs tracking-[0.2em] text-purple-secondary uppercase">
                  Question {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="text-xl leading-snug font-semibold tracking-tight text-white sm:text-2xl">
                  {item.question}
                </h3>
                <p className="mt-6 font-mono text-sm leading-loose tracking-wide text-white/50 uppercase text-pretty sm:text-base">
                  {item.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
