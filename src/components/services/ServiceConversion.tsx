import HorizontalStaggerRows from "@/components/ui/HorizontalStaggerRows";
import Image from "next/image";
import GridCorners from "@/components/ui/GridCorners";
import ServiceSectionHeader from "./ServiceSectionHeader";
import type { ServiceAccent } from "./serviceAccent";

interface ServiceConversionFeature {
  text: string;
  emphasis?: string;
  link?: { label: string; href: string };
}
interface ServiceConversionProps {
  headline: string;
  description: string;
  image: { src: string; alt: string };
  features: ServiceConversionFeature[];
  accent?: ServiceAccent;
}

export default function ServiceConversion({
  headline,
  description,
  image,
  features,
  accent = "purple",
}: ServiceConversionProps) {
  return (
    <section className="bg-black-bg">
      <ServiceSectionHeader
        headline={headline}
        paragraph={description}
        accent={accent}
      />
      <div className="relative mt-12 border border-white/18">
        <GridCorners accent={accent} />
        <div className="relative aspect-[4/3] overflow-hidden border-b border-white/18 sm:aspect-[21/9]">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 1920px) 1740px, 90vw"
            className="object-cover"
          />
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-3">
          {features.map((feature, index) => (
            <li
              data-stagger-hover
              key={index}
              className="border-b border-dashed border-white/20 p-5 last:border-b-0 transition-colors duration-500  sm:p-7 md:border-r md:border-b-0 md:last:border-r-0"
            >
              <HorizontalStaggerRows />
              <span
                aria-hidden="true"
                className="mb-5 block font-mono text-xs text-purple-accent"
              >
                {String(index + 1).padStart(2, "0")} —
              </span>
              <p className="body-copy text-content">
                {renderFeatureText(feature)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function renderFeatureText({ text, emphasis, link }: ServiceConversionFeature) {
  const match = link?.label ?? emphasis;
  if (!match) return text;
  const index = text.indexOf(match);
  if (index === -1) return text;

  const marked = link ? (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="circle"
      data-cursor-label="Explore"
      className="underline underline-offset-4 hover:text-accent-light"
    >
      {match}
    </a>
  ) : (
    <span className="underline underline-offset-4">{match}</span>
  );

  return (
    <>
      {text.slice(0, index)}
      {marked}
      {text.slice(index + match.length)}
    </>
  );
}
