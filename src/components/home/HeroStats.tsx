/* ================================================================
   HERO STATS
   ================================================================
   Split out of Hero.tsx: the "2.5k+ / Project Completed", "100+ /
   Happy Client", "5+ / Years Of Experience" stats that used to live
   in a white bg-white-bg bar at the bottom of the hero section.

   Restyled to match a reference layout (dark, editorial, per-row):
     - A "H . 00N" mono index kicker on the left of each row.
     - The stat's number rendered large in the middle, count-up on
       scroll (via the shared StatCounter component — same
       count-from-0-on-enter, reset-on-leave, replay-on-re-enter
       behavior Hero used to do inline, now shared with
       ServicesMarketStats.tsx instead of duplicated).
     - The stat's label on the right, short, regular weight/font.
     - A 0.5px hairline divider between rows (never above the first
       or below the last) — the reference's between-row rule.

   The reference layout also has a small bracketed annotation next
   to the number ("{. OF TESTED SYSTEMS }") in addition to the
   right-side label — that's a third piece of copy per stat the
   original data doesn't have (Hero only ever had a value + a
   label), so it's left out here rather than inventing new copy;
   only the value/label pieces the section already had are kept.

   Section is dark (bg-black-bg) to match the reference and to flow
   directly out of the hero above it, rather than the previous
   white-bg-white-bg treatment — Hero.tsx's bottom fade-to-white and
   the `border-t border-black/5 bg-white-bg` wrapper it used are
   gone along with the inline stats block.
   ================================================================ */

import StatCounter from "@/components/services/StatCounter";

const STATS = [
  { value: "2.5k+", label: "Project Completed" },
  { value: "100+", label: "Happy Client" },
  { value: "5+", label: "Years Of Experience" },
] as const;

export default function HeroStats() {
  return (
    <section className="bg-black-bg">
      <div className="w-full px-5 sm:px-10 md:px-16 lg:px-24">
        {STATS.map((stat, i) => (
          <div key={stat.label}>
            {i > 0 && (
              <div
                aria-hidden="true"
                className="h-[0.5px] w-full bg-white/15"
              />
            )}

            <div className="flex flex-col gap-4 py-10 sm:grid sm:grid-cols-[80px_1fr_auto] sm:items-center sm:gap-8 sm:py-14 md:gap-14 md:py-16 lg:gap-20">
              <span className="font-mono text-xs tracking-[0.14em] text-white/40 uppercase">
                {`H . 00${i + 1}`}
              </span>

              <StatCounter
                value={stat.value}
                className="text-[96px] leading-none font-medium tracking-tight text-white"
              />

              <p className="max-w-56 text-base leading-snug font-normal tracking-tight text-white uppercase sm:text-lg md:text-xl">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
