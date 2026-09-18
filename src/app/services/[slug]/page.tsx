import { notFound } from "next/navigation";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import {
  getAllServices,
  getServiceBySlug,
  getServiceAccent,
} from "@/lib/content/services";
import JsonLd from "@/components/seo/JsonLd";
import Cta from "@/components/ui/CTA";
import FAQ from "@/components/ui/FAQ";
import ServiceHighlights from "@/components/services/ServiceHighlights";
import ServiceComparison from "@/components/services/ServiceComparison";
import ServiceFeatureList from "@/components/services/ServiceFeatureList";
import ServiceFeatureCard from "@/components/services/ServiceFeatureCard";
import ServiceImageStatement from "@/components/services/ServiceImageStatement";
import ServicesProcess from "@/components/services/ServicesProcess";
import ServiceMarqueeCta from "@/components/services/ServiceMarqueeCta";
import ServiceConversion from "@/components/services/ServiceConversion";
import ServiceInsights from "@/components/services/ServiceInsights";
import ServiceResults from "@/components/services/ServiceResults";
import ServiceContentPillars from "@/components/services/ServiceContentPillars";
import ServicePillarCards from "@/components/services/ServicePillarCards";
import ServicesGrowBusiness from "@/components/services/ServicesGrowBusiness";
import TrustedBy from "@/components/home/TrustedBy";
import TechStack from "@/components/services/TechStack";
import ServiceIntroPanel from "@/components/services/ServiceIntroPanel";
import ServiceSectionFrame from "@/components/services/ServiceSectionFrame";
import detailStyles from "@/components/services/ServiceSectionFrame.module.css";
import type { ServiceSection } from "@/lib/content/types";
import {
  SITE_NAME,
  SITE_URL,
  SERVICE_AREAS,
  GRAPHIC_DESIGN_WORK,
} from "@/lib/constants";

export async function generateStaticParams() {
  const services = await getAllServices();
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return {};

  return buildMetadata({
    title: service.title,
    description: service.shortDescription,
    path: `/services/${slug}`,
  });
}

/**
 * Renders a hero paragraph, turning `link.label` into an underlined
 * link if present — same substring-match technique as
 * ServiceIntroPanel's paragraph `link` field.
 */
function renderHeroParagraph({
  text,
  link,
}: Extract<ServiceSection, { type: "hero" }>["paragraphs"][number]) {
  if (!link) return text;

  const idx = text.indexOf(link.label);
  if (idx === -1) return text;

  return (
    <>
      {text.slice(0, idx)}
      <Link
        href={link.href}
        className="text-content underline decoration-1 underline-offset-4 hover:text-accent-light"
      >
        {link.label}
      </Link>
      {text.slice(idx + link.label.length)}
    </>
  );
}

/**
 * Vertical padding for a "cta" block. Kept as a lookup rather than
 * inline in the switch below so the three known combinations stay
 * documented in one place. See ServiceSection["cta"]["spacing"] in
 * lib/content/types.ts for what each option means.
 */
const CTA_SPACING_CLASS: Record<
  NonNullable<Extract<ServiceSection, { type: "cta" }>["spacing"]>,
  string
> = {
  standalone: "bg-black-bg !pt-[80px] !pb-[80px]",
  compact: "bg-black-bg !pt-0 !pb-0",
  "tight-bottom": "bg-black-bg !pt-0 !pb-[80px]",
};

interface ServiceHeroProps {
  eyebrow: string;
  headline: string;
  paragraphs: Extract<ServiceSection, { type: "hero" }>["paragraphs"];
  accent: "pink" | "purple";
  position: number;
  total: number;
}

function ServiceHero({
  eyebrow,
  headline,
  paragraphs,
  accent,
  position,
  total,
}: ServiceHeroProps) {
  const current = String(position).padStart(2, "0");
  const count = String(total).padStart(2, "0");

  return (
    <section className={detailStyles.hero} data-accent={accent}>
      <div className={detailStyles.heroInner}>
        <div className={detailStyles.heroMeta} aria-hidden="true">
          <span>TECHNICO_</span>
          <span>DIGITAL SOLUTIONS / SERVICES</span>
          <span>
            {current} / {count}
          </span>
        </div>

        <div className={detailStyles.heroGrid}>
          <div className={detailStyles.heroRail} aria-hidden="true">
            {"// Service detail"}
          </div>

          <div className={detailStyles.heroContent}>
            <div>
              <p className={detailStyles.heroEyebrow}>
                <span aria-hidden="true">{"//"}</span>
                <span>{eyebrow}</span>
              </p>
              <h1 className={detailStyles.heroTitle}>{headline}</h1>
            </div>

            <div className={detailStyles.heroCopy}>
              {paragraphs.map((paragraph, index) => (
                <p key={index}>{renderHeroParagraph(paragraph)}</p>
              ))}
            </div>
          </div>
        </div>

        <div className={detailStyles.heroFooter} aria-hidden="true">
          <span>{"// Profit over traffic"}</span>
          <div className={detailStyles.heroSignal}>
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>
    </section>
  );
}

export default async function ServiceDetailPage({
  params,
}: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.shortDescription,
    areaServed: SERVICE_AREAS.map((area) => ({
      "@type": "Place",
      name: area,
    })),
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Services",
        item: `${SITE_URL}/services`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: service.title,
        item: `${SITE_URL}/services/${slug}`,
      },
    ],
  };

  const accent = getServiceAccent(service.slug);
  const sections = service.sections ?? [];
  const hasHero = sections.some((section) => section.type === "hero");
  const allServices = await getAllServices();
  const servicePosition =
    Math.max(
      allServices.findIndex((item) => item.slug === service.slug),
      0,
    ) + 1;

  return (
    <>
      <JsonLd data={serviceJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      <div className="bg-black-bg">
        {/* Plain fallback header for services that don't have a
            `hero` block in their sections yet — keeps the page from
            rendering blank instead of inventing hero copy for them. */}
        {!hasHero && (
          <ServiceHero
            eyebrow={service.title}
            headline={service.title}
            paragraphs={[{ text: service.shortDescription }]}
            accent={accent}
            position={servicePosition}
            total={allServices.length}
          />
        )}

        {sections.map((section, index) => {
          const renderedSection = (() => {
            switch (section.type) {
              case "hero":
                return (
                  <ServiceHero
                    key={index}
                    eyebrow={section.eyebrow}
                    headline={section.headline}
                    paragraphs={section.paragraphs}
                    accent={accent}
                    position={servicePosition}
                    total={allServices.length}
                  />
                );

              case "cta":
                return (
                  <Cta
                    key={index}
                    title={section.title}
                    description={section.description}
                    cta={section.cta}
                    wide={section.wide}
                    className={
                      CTA_SPACING_CLASS[section.spacing ?? "standalone"]
                    }
                  />
                );

              case "highlights":
                return (
                  <ServiceHighlights
                    key={index}
                    eyebrow={section.eyebrow}
                    headline={section.headline}
                    paragraph={section.paragraph}
                    items={section.items}
                    accent={accent}
                    cta={section.cta}
                    subheading={section.subheading}
                  />
                );

              case "conversion":
                return (
                  <ServiceConversion
                    key={index}
                    headline={section.headline}
                    description={section.description}
                    image={section.image}
                    features={section.features}
                    accent={accent}
                  />
                );

              case "insights":
                return (
                  <ServiceInsights
                    key={index}
                    image={section.image}
                    headline={section.headline}
                    intro={section.intro}
                    introLink={section.introLink}
                    items={section.items}
                    closingParagraph={section.closingParagraph}
                  />
                );

              case "results":
                return (
                  <ServiceResults
                    key={index}
                    headline={section.headline}
                    description={section.description}
                    descriptionLink={section.descriptionLink}
                    items={section.items}
                    accent={accent}
                  />
                );

              case "contentPillars":
                return (
                  <ServiceContentPillars
                    key={index}
                    eyebrow={section.eyebrow}
                    headline={section.headline}
                    paragraph={section.paragraph}
                    quote={section.quote}
                    quoteAttribution={section.quoteAttribution}
                    image={section.image}
                    items={section.items}
                  />
                );

              case "pillarCards":
                return (
                  <ServicePillarCards
                    key={index}
                    eyebrow={section.eyebrow}
                    headline={section.headline}
                    intro={section.intro}
                    items={section.items}
                    closingParagraph={section.closingParagraph}
                    accent={accent}
                  />
                );

              case "growBusiness":
                return (
                  <ServicesGrowBusiness
                    key={index}
                    headline={section.headline}
                    intro={section.intro}
                    items={section.items}
                    closing={section.closing}
                  />
                );

              case "comparison":
                return (
                  <ServiceComparison
                    key={index}
                    headline={section.headline}
                    intro={section.intro}
                    cta={section.cta}
                    columns={section.columns}
                    closing={section.closing}
                    accent={accent}
                  />
                );

              case "marqueeCta":
                return (
                  <ServiceMarqueeCta
                    key={index}
                    text={section.text}
                    cta={section.cta}
                    accent={accent}
                  />
                );

              case "featuresSplit":
                return (
                  <ServiceFeatureList
                    key={index}
                    eyebrow={section.eyebrow}
                    headline={section.headline}
                    paragraphs={section.paragraphs}
                    listHeading={section.listHeading}
                    items={section.items}
                    accent={accent}
                    image={section.image}
                  />
                );

              case "featureCard":
                return (
                  <ServiceFeatureCard
                    key={index}
                    eyebrow={section.eyebrow}
                    headline={section.headline}
                    paragraph={section.paragraph}
                    image={section.image}
                    cta={section.cta}
                    checklist={section.checklist}
                    accent={accent}
                  />
                );

              case "imageStatement":
                return (
                  <ServiceImageStatement
                    key={index}
                    eyebrow={section.eyebrow}
                    headline={section.headline}
                    cta={section.cta}
                    image={section.image}
                    shape={section.shape}
                    paragraph={section.paragraph}
                    bullets={section.bullets}
                    closingParagraph={section.closingParagraph}
                    accent={accent}
                  />
                );

              case "process":
                return (
                  <ServicesProcess
                    key={index}
                    eyebrow={section.eyebrow}
                    headline={section.headline}
                    paragraph={section.paragraph}
                    steps={section.steps}
                    descriptionLayout={section.descriptionLayout}
                    accent={accent}
                  />
                );

              case "trustedBy":
                return <TrustedBy key={index} />;

              case "techStack":
                return section.variant === "graphicDesignWork" ? (
                  <TechStack
                    key={index}
                    items={GRAPHIC_DESIGN_WORK}
                    heading={
                      <>
                        Our Recent
                        <br />
                        Graphic Design Work
                      </>
                    }
                  />
                ) : (
                  <TechStack key={index} />
                );

              case "introPanel":
                return (
                  <ServiceIntroPanel
                    key={index}
                    eyebrow={section.eyebrow}
                    headline={section.headline}
                    paragraphs={section.paragraphs}
                    image={section.image}
                    accent={accent}
                  />
                );

              case "faq":
                return (
                  <FAQ
                    key={index}
                    heading={
                      <>
                        {section.headline[0]}
                        <br />
                        {section.headline[1]}
                      </>
                    }
                    cta={section.cta}
                    items={section.items}
                  />
                );

              default:
                return null;
            }
          })();

          if (!renderedSection || section.type === "hero") {
            return renderedSection;
          }

          return (
            <ServiceSectionFrame
              key={`${section.type}-${index}`}
              index={index}
              type={section.type}
              accent={accent}
            >
              {renderedSection}
            </ServiceSectionFrame>
          );
        })}
      </div>
    </>
  );
}
