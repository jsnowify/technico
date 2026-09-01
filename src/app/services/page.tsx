import { buildMetadata } from "@/lib/seo";
import { getAllServices } from "@/lib/content/services";
import ServicesHero from "@/components/services/ServicesHero";
import ServicesAccordion from "@/components/services/ServicesAccordion";
import ServicesMarketOverview from "@/components/services/ServicesMarketOverview";

export const metadata = buildMetadata({
  title: "Services",
  description:
    "Our digital solutions — web development, design, and technology consulting.",
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
