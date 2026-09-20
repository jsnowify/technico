import Image from "next/image";
import ServiceAccordion from "./ServiceAccordion";
import GridCorners from "@/components/ui/GridCorners";
import ServiceSectionHeader from "./ServiceSectionHeader";
import { serviceLinkedText } from "./serviceLinkedText";

interface ServiceInsightsProps {
  image?: { src: string; alt: string };
  headline: string;
  intro: string;
  introLink?: { label: string; href: string };
  items: {
    title: string;
    description: string;
    link?: { label: string; href: string };
  }[];
  closingParagraph?: string;
}

export default function ServiceInsights({
  image,
  headline,
  intro,
  introLink,
  items,
  closingParagraph,
}: ServiceInsightsProps) {
  const photo = image ?? { src: "/images/placeholder.png", alt: "" };
  return (
    <section className="bg-black-bg">
      <ServiceSectionHeader
        headline={headline}
        paragraph={serviceLinkedText(intro, introLink)}
      />
      <div className="relative mt-12 grid grid-cols-1 border border-white/18 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <GridCorners />
        <div className="relative aspect-[4/3] overflow-hidden border-b border-white/18 lg:aspect-auto lg:min-h-[420px] lg:border-r lg:border-b-0">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(min-width: 1024px) 38vw, 90vw"
            className="object-cover"
          />
        </div>
        <ServiceAccordion
          items={items.map((item) => ({
            title: item.title,
            body: renderBody(item.description, item.link),
          }))}
        />
      </div>
      {closingParagraph && (
        <p className="body-copy mt-9 max-w-[76ch] text-content">
          {closingParagraph}
        </p>
      )}
    </section>
  );
}

/**
 * Accordion bodies can hold several paragraphs: separate them with a
 * blank line ("\n\n") in the description. A description with no blank
 * line renders exactly as before.
 */
function renderBody(
  description: string,
  link?: { label: string; href: string },
) {
  const paragraphs = description.split("\n\n");
  if (paragraphs.length === 1) return serviceLinkedText(description, link);

  return paragraphs.map((text, index) => (
    <span key={index} className={index > 0 ? "mt-4 block" : "block"}>
      {serviceLinkedText(text, link)}
    </span>
  ));
}
