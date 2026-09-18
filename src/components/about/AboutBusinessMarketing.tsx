import Cta from "@/components/ui/CTA";
import GridCorners from "@/components/ui/GridCorners";
import HorizontalStaggerRows from "@/components/ui/HorizontalStaggerRows";
import { SITE_PHONE_HREF } from "@/lib/constants";

const PANELS = [
  {
    number: "004",
    label: "Business",
    paragraphs: [
      "We implement the perfect balance between creativity, data, and transparency to provide real results. Running a digital marketing campaign? Integrating content marketing? Our team brings the best of both worlds with modern digital tactics and a solid understanding of traditional marketing.",
      "Businesses choose us for a proven track record with measurable ROI, clear communication and a collaborative workflow, tailored strategies that are never one-size-fits-all, and ongoing optimization and support.",
    ],
  },
  {
    number: "005",
    label: "Marketing",
    paragraphs: [
      "Ready to see your business soar? If you're tired of ineffective campaigns and low engagement, it's time to work with a team that knows how to turn things around.",
      "Partner with the digital agency marketing team at Technico Digital Solutions and put your brand at the forefront of success today.",
    ],
  },
] as const;

export default function AboutBusinessMarketing() {
  return (
    <section aria-label="About: Business, Marketing" className="bg-black-bg">
      <div className="container-x mx-auto w-full max-w-[1920px] py-16 sm:py-20 lg:py-24">
        <div className="relative grid grid-cols-1 border border-white/20 lg:grid-cols-2">
          <GridCorners />
          {PANELS.map((panel) => (
            <article
              key={panel.label}
              data-stagger-hover
              className="relative min-w-0 border-b border-white/20 p-5 last:border-b-0 sm:p-7 lg:border-r lg:border-b-0 lg:p-9 lg:last:border-r-0"
            >
              <HorizontalStaggerRows />
              <div className="relative flex items-start justify-between gap-6 font-mono text-xs tracking-[0.05em] uppercase">
                <span className="text-accent">
                  {"// "}
                  {panel.label}
                </span>
                <span className="text-content-muted">A . {panel.number}</span>
              </div>
              <h2 className="h2-section relative mt-8 font-medium tracking-heading text-white-text">
                {panel.label}
              </h2>
              <div className="relative mt-6 space-y-5">
                {panel.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="body-copy max-w-[64ch] leading-[1.65] text-content"
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
        title="Your business transformation starts with one conversation."
        cta={{ label: "Book a Call", href: SITE_PHONE_HREF }}
      />
    </section>
  );
}
