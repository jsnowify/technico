import Cta from "@/components/ui/CTA";
import GridCorners from "@/components/ui/GridCorners";
import HorizontalStaggerRows from "@/components/ui/HorizontalStaggerRows";
import { SITE_PHONE_HREF } from "@/lib/constants";

const STORY = [
  {
    number: "001",
    label: "About",
    caption: ["DATA-DRIVEN.", "RESULTS-DRIVEN."],
    paragraphs: [
      "We focus on building online visibility and creating long-term growth for brands like yours.",
      "With our data-driven approach and modern digital marketing tactics, we make sure your strategies hit the mark every time. Forget generic solutions, our digital marketers deliver strategies that actually work.",
    ],
  },
  {
    number: "002",
    label: "Mission",
    caption: ["SEEN, HEARD,", "REMEMBERED."],
    paragraphs: [
      "We help businesses grow by leveraging digital marketing channels that connect with target audiences. No fluff, just smart, innovative marketing strategies that hit the right message. Our goal? To simplify digital growth and make it accessible and effective for every client.",
      "Our team at Technico Digital Solutions believes in strategy that scales, creativity that connects, and marketing that makes an impact. By tapping into the right digital marketing tactics, we increase brand awareness and help you reach potential customers for your business expansion.",
    ],
  },
  {
    number: "003",
    label: "Approach",
    caption: ["STRATEGY FIRST,", "CONSISTENT EXECUTION."],
    paragraphs: [
      "Our approach starts with discovering important customer behaviours and analyzing trends to stay ahead of the curve, building integrated campaigns across SEO, social, design, and content that speak directly to your target, and measuring success through web analytics, key performance indicators (KPIs), and transparent reporting, so you always know where your business stands.",
      "Our digital marketing positions your brand on top of search engine results pages (SERPs) and social media channels. We fine-tune campaigns to build brand awareness. It's all about results, not just reach.",
    ],
  },
] as const;

export default function AboutStory() {
  return (
    <section
      aria-label="About: About, Mission, Approach"
      className="bg-black-bg"
    >
      <div className="container-x mx-auto w-full max-w-[1920px] py-16 sm:py-20 lg:py-24">
        <div className="relative border-y border-white/20">
          <GridCorners />
          {STORY.map((chapter) => (
            <article
              key={chapter.label}
              data-stagger-hover
              className="grid min-w-0 grid-cols-[48px_minmax(0,1fr)] border-b border-dashed border-white/20 last:border-b-0 sm:grid-cols-[70px_minmax(0,0.95fr)_minmax(0,1.05fr)] lg:grid-cols-[90px_minmax(220px,0.65fr)_minmax(0,1.35fr)]"
            >
              <HorizontalStaggerRows />
              <div className="relative border-r border-white/15 px-3 py-7 font-mono text-xs text-accent sm:px-5 sm:py-9">
                {chapter.number}
              </div>
              <div className="relative px-5 py-7 sm:px-7 sm:py-9 lg:border-r lg:border-white/15 lg:px-9">
                <p className="font-mono text-xs tracking-[0.05em] text-content-muted uppercase">
                  <span aria-hidden="true">{"// "}</span>
                  {chapter.caption.map((line, index) => (
                    <span key={line} className={index ? "block" : ""}>
                      {line}
                    </span>
                  ))}
                </p>
                <h2 className="h2-section mt-4 leading-[1.05] font-medium tracking-heading text-white-text">
                  {chapter.label}
                </h2>
              </div>
              <div className="relative col-span-2 space-y-5 border-t border-white/15 px-5 py-7 sm:col-span-1 sm:border-t-0 sm:px-7 sm:py-9 lg:px-9">
                {chapter.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="body-copy max-w-[68ch] leading-[1.65] text-content"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>

      <Cta
        title="Take your brand to the next level"
        description="Our team of experts will help you connect with the right audience and grow your business."
        cta={{ label: "Free Strategy", href: SITE_PHONE_HREF }}
      />
    </section>
  );
}
