import GridCorners from "@/components/ui/GridCorners";
import HorizontalStaggerRows from "@/components/ui/HorizontalStaggerRows";
import StatCounter from "@/components/services/StatCounter";

const STATS = [
  { value: "2.5k+", label: "Project Completed" },
  { value: "100+", label: "Happy Client" },
  { value: "5+", label: "Years Of Experience" },
] as const;

export default function HeroStats() {
  return (
    <section aria-label="Company results" className="bg-black-bg text-white-text">
      <div className="container-x mx-auto w-full max-w-[1920px] py-10 sm:py-12 md:py-16">
        <div className="relative border-y border-white/20">
          <GridCorners />

          {STATS.map((stat, index) => (
            <article
              key={stat.label}
              data-stagger-hover
              tabIndex={0}
              className="group grid min-w-0 grid-cols-[52px_minmax(0,1fr)] overflow-hidden border-b border-white/15 bg-black-bg last:border-b-0 sm:grid-cols-[76px_minmax(0,1fr)_minmax(180px,0.48fr)]"
            >
              <HorizontalStaggerRows />

              <span className="relative z-[1] flex items-center justify-center border-r border-white/15 px-2 py-6 font-mono text-[10px] tracking-[0.06em] text-content-muted uppercase sm:py-8 sm:text-xs">
                H / {String(index + 1).padStart(2, "0")}
              </span>

              <div className="relative z-[1] flex min-w-0 items-center px-5 py-6 sm:px-8 sm:py-8 lg:px-12">
                <StatCounter
                  value={stat.value}
                  className="max-w-full text-[clamp(3.5rem,13vw,8.5rem)] leading-[0.82] font-medium tracking-[-0.075em] text-white-text"
                />
              </div>

              <div className="relative z-[1] col-span-2 flex min-w-0 items-end border-t border-white/15 px-5 py-5 sm:col-span-1 sm:border-t-0 sm:border-l sm:px-7 sm:py-8 lg:px-10">
                <p className="body-copy max-w-[20ch] leading-[1.35] tracking-[-0.025em] text-content uppercase">
                  {stat.label}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
