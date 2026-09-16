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
import GeometricIcon from "@/components/ui/icons";
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
import FAQ from "@/components/ui/FAQ";
import TrustedBy from "@/components/home/TrustedBy";
import TechStack from "@/components/services/TechStack";
import ServiceIntroPanel from "@/components/services/ServiceIntroPanel";
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
        className="text-white underline decoration-1 underline-offset-4 hover:text-white/80"
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

  return (
    <>
      <JsonLd data={serviceJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      <div className="bg-black-bg">
        {/* Plain fallback header for services that don't have a
            `hero` block in their sections yet — keeps the page from
            rendering blank instead of inventing hero copy for them. */}
        {!hasHero && (
          <section className="bg-black-bg px-10 pt-20 pb-10 sm:pt-24 md:pt-28">
            <h1 className="max-w-xl text-[32px] leading-[1.05] font-medium tracking-tight text-white sm:text-[40px] md:text-[44px]">
              {service.title}
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed font-light text-white/60">
              {service.shortDescription}
            </p>
          </section>
        )}

        {sections.map((section, index) => {
          switch (section.type) {
            case "hero":
              return (
                <section
                  key={index}
                  className="relative overflow-hidden bg-black-bg"
                >
                  <div className="px-10 pt-20 pb-0 sm:pt-24 md:pt-28">
                    <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-sm font-light text-white ${
                              accent === "pink"
                                ? "bg-pink-accent"
                                : "bg-purple-accent"
                            }`}
                          >
                            <GeometricIcon index={10} className="h-3 w-3" />
                          </span>
                          <p className="text-base leading-none font-light tracking-wide text-white">
                            {section.eyebrow}
                          </p>
                        </div>
                        <h1 className="mt-6 max-w-xl text-[32px] leading-[1.05] font-medium tracking-tight text-white sm:text-[40px] md:text-[44px]">
                          {section.headline}
                        </h1>
                      </div>
                      <div className="space-y-6 text-lg leading-relaxed font-light text-white/60 md:pt-1">
                        {section.paragraphs.map((paragraph, i) => (
                          <p key={i}>{renderHeroParagraph(paragraph)}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              );

            case "cta":
              return (
                <Cta
                  key={index}
                  title={section.title}
                  description={section.description}
                  cta={section.cta}
                  wide={section.wide}
                  className={CTA_SPACING_CLASS[section.spacing ?? "standalone"]}
                />
              );

            case "highlights": {
              // Drop this block's own top padding when it's stacked
              // directly after another `highlights` block — that
              // first block's bottom padding already supplies the
              // gap, so stacking both blocks' padding would leave a
              // much bigger gap here than between any other pair of
              // sections on the page. See ServiceHighlights.tsx's
              // doc comment for the full explanation.
              const previousSection = sections[index - 1];
              const spacing =
                previousSection?.type === "highlights"
                  ? "tight-top"
                  : "default";

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
                  spacing={spacing}
                />
              );
            }

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
                  includeJsonLd={false}
                />
              );

            default:
              return null;
          }
        })}
      </div>
    </>
  );
}
