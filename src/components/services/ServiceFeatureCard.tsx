import Button from "@/components/ui/Button";
import GeometricIcon from "@/components/ui/icons";
import HorizontalStaggerRows from "@/components/ui/HorizontalStaggerRows";
import GridCorners from "@/components/ui/GridCorners";
import { SERVICE_ACCENT, type ServiceAccent } from "./serviceAccent";

interface ServiceFeatureCardProps {
  eyebrow: string;
  headline: string;
  paragraph: string;
  image: { src: string; alt: string };
  cta: { label: string; href: string };
  checklist: string[];
  accent?: ServiceAccent;
}

export default function ServiceFeatureCard({
  eyebrow,
  headline,
  paragraph,
  image,
  cta,
  checklist,
  accent = "purple",
}: ServiceFeatureCardProps) {
  const tone = SERVICE_ACCENT[accent];

  return (
    <section className="bg-black-bg">
      <div className="relative grid grid-cols-1 border border-white/18 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <GridCorners accent={accent} />

        <div className="border-b border-white/18 lg:border-r lg:border-b-0">
          <div className="relative aspect-[4/3] overflow-hidden border-b border-white/18 sm:aspect-[16/10] lg:aspect-[4/3]">
            {/* Some service placeholders use remote hosts that are not in
                next/image's allowlist, so this remains a plain image. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.src}
              alt={image.alt}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <span className="absolute top-4 left-4 bg-black-bg px-3 py-2 font-mono text-[10px] tracking-[0.06em] text-content uppercase sm:top-6 sm:left-6 sm:text-xs">
              <span aria-hidden="true">{"// "}</span>
              {eyebrow}
            </span>
          </div>

          <div className="p-5 sm:p-7 lg:p-9">
            <h2 className="max-w-[18ch] font-medium tracking-heading whitespace-pre-line text-white-text">
              {headline}
            </h2>
            {paragraph.split("\n\n").map((text, index) => (
              <p
                key={index}
                className={`body-copy max-w-[64ch] leading-[1.62] text-content ${
                  index === 0 ? "mt-5" : "mt-4"
                }`}
              >
                {text}
              </p>
            ))}
            <div className="mt-7">
              <Button to={cta.href} variant={tone.button} size="md">
                {cta.label}
              </Button>
            </div>
          </div>
        </div>

        <ul className="flex flex-col">
          {checklist.map((item, index) => (
            <li
              key={`${item}-${index}`}
              data-stagger-hover
              className="group relative flex min-h-20 flex-1 items-center gap-4 overflow-hidden border-b border-white/18 p-5 last:border-b-0 sm:p-6"
            >
              <HorizontalStaggerRows />
              <span
                className={`relative flex h-11 w-11 shrink-0 items-center justify-center ${tone.fill} text-black-bg`}
              >
                <GeometricIcon index={index} className="h-5 w-5" />
              </span>
              <p className={`body-copy relative leading-[1.55] text-content`}>
                {item}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
