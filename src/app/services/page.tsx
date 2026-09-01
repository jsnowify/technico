import { buildMetadata } from "@/lib/seo";
import { getAllServices } from "@/lib/content/services";
import ServicesHero from "@/components/services/ServicesHero";
import ServicesAccordion from "@/components/services/ServicesAccordion";
import ServicesMarketOverview from "@/components/services/ServicesMarketOverview";

export const metadata = buildMetadata({
  title: "Digital Marketing Services",
  description:
    "SEO, web development, paid advertising, social media, and email marketing for businesses across Canada. Data-driven digital marketing services from Technico Digital Solutions.",
  path: "/services",
});

export default async function ServicesPage() {
  const services = await getAllServices();

  return (
    <>
      <ServicesHero />
      <ServicesMarketOverview />
      <ServicesAccordion services={services} />
    </>
  );
}
