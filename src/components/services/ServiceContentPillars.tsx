import Image from "next/image";
import ServiceAccordion from "./ServiceAccordion";
import GridCorners from "@/components/ui/GridCorners";
import ServiceSectionHeader from "./ServiceSectionHeader";

interface ServiceContentPillarsProps {
  eyebrow: string;
  headline: string;
  paragraph: string;
  quote: string;
  quoteAttribution: string;
  image: { src: string; alt: string };
  items: { title: string; description: string }[];
}

export default function ServiceContentPillars({
  eyebrow,
  headline,
  paragraph,
  quote,
  quoteAttribution,
  image,
  items,
}: ServiceContentPillarsProps) {
  return (
    <section className="bg-black-bg">
      <ServiceSectionHeader
        eyebrow={eyebrow}
        headline={headline}
        paragraph={paragraph}
      />
      <div className="relative mt-12 grid grid-cols-1 border border-white/18 lg:grid-cols-2">
        <GridCorners />
        <div className="border-b border-white/18 lg:border-r lg:border-b-0">
          <div className="relative aspect-[16/9] overflow-hidden border-b border-white/18">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(min-width: 1024px) 45vw, 90vw"
              className="object-cover"
            />
          </div>
          <figure className="p-5 sm:p-7 lg:p-9">
            <blockquote className="border-l border-purple-accent pl-5">
              <p className="body-copy text-content">{quote}</p>
            </blockquote>
            <figcaption className="mt-5 font-mono text-sm text-purple-accent">
              {quoteAttribution}
            </figcaption>
          </figure>
        </div>
        <ServiceAccordion
          items={items.map((item) => ({
            title: item.title,
            body: item.description,
          }))}
        />
      </div>
    </section>
  );
}
