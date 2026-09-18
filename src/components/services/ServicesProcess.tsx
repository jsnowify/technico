import HorizontalStaggerRows from "@/components/ui/HorizontalStaggerRows";
import GridCorners from "@/components/ui/GridCorners";
import ServiceSectionHeader from "./ServiceSectionHeader";
import { SERVICE_ACCENT, type ServiceAccent } from "./serviceAccent";

interface ProcessStep {
  title: string;
  description: string;
}

interface ServicesProcessProps {
  eyebrow: string;
  headline: string;
  paragraph: string;
  steps: ProcessStep[];
  descriptionLayout?: "centered" | "edge";
  accent?: ServiceAccent;
}

export default function ServicesProcess({
  eyebrow,
  headline,
  paragraph,
  steps,
  descriptionLayout = "centered",
  accent = "purple",
}: ServicesProcessProps) {
  const tone = SERVICE_ACCENT[accent];

  return (
    <section className="bg-black-bg">
      <ServiceSectionHeader
        eyebrow={eyebrow}
        headline={headline}
        paragraph={paragraph}
        accent={accent}
      />

      <ol className="relative mt-12 border border-white/18 sm:mt-16">
        <GridCorners accent={accent} />

        {steps.map((step, index) => (
          <li
            key={`${step.title}-${index}`}
            data-stagger-hover
            className="group relative grid grid-cols-1 overflow-hidden border-b border-dashed border-white/18 last:border-b-0 lg:grid-cols-[12%_88%]"
          >
            <HorizontalStaggerRows />

            <div className="relative flex items-start justify-between gap-5 p-5 lg:border-r lg:border-white/18 lg:p-7">
              <span
                className={`font-mono text-xs tracking-[0.06em] ${tone.text}`}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <span aria-hidden="true" className="font-mono text-content-muted">
                {"//"}
              </span>
            </div>

            <div className="relative grid grid-cols-1 gap-5 p-5 pt-0 sm:p-7 lg:grid-cols-[minmax(0,0.55fr)_minmax(0,1fr)] lg:items-center lg:p-9">
              <h3
                className={`text-[clamp(1.5rem,2.5vw,2.25rem)] leading-[1.05] font-medium text-white-text`}
              >
                {step.title}
              </h3>
              <p
                className={`body-copy max-w-[60ch] leading-[1.62] text-content ${
                  descriptionLayout === "centered" ? "md:text-center" : ""
                }`}
              >
                {step.description}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
