import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { getAllServices, getServiceBySlug } from "@/lib/content/services";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

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
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-24">
      <JsonLd data={serviceJsonLd} />
      <h1 className="text-4xl font-semibold tracking-tight text-black-text">
        {service.title}
      </h1>
      <div className="mt-8 space-y-4 text-lg leading-8 text-black-text/70">
        {service.description.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}
