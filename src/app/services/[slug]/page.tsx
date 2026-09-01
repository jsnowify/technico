import Link from "next/link";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { getAllServices, getServiceBySlug } from "@/lib/content/services";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_NAME, SITE_URL, SERVICE_AREAS } from "@/lib/constants";

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

  return (
    <div className="mx-auto max-w-3xl px-6 py-24">
      <JsonLd data={serviceJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      {/* Breadcrumb nav — visible counterpart to the BreadcrumbList
          schema above; structured data should mirror what's on the
          page, not stand in for it. */}
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex flex-wrap items-center gap-1.5 font-mono text-xs tracking-wide text-black-text/50 uppercase">
          <li>
            <Link href="/" className="hover:text-black-text">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/services" className="hover:text-black-text">
              Services
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-black-text">
            {service.title}
          </li>
        </ol>
      </nav>

      <h1 className="text-4xl font-semibold tracking-tight text-black-text">
        {service.title}
      </h1>

      {service.subtitle && (
        <p className="mt-3 text-lg text-black-text/60">{service.subtitle}</p>
      )}

      {service.quote && (
        <p className="mt-6 border-l-2 border-purple-secondary pl-4 text-xl font-medium text-black-text">
          {service.quote}
        </p>
      )}

      <div className="mt-8 space-y-4 text-lg leading-8 text-black-text/70">
        {service.description.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      {service.tags && service.tags.length > 0 && (
        <ul className="mt-10 flex flex-wrap gap-2">
          {service.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-black-text/15 px-4 py-1.5 text-sm text-black-text/70"
            >
              {tag}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-14 border-t border-black-text/10 pt-8">
        <p className="text-sm text-black-text/60">
          Explore our other{" "}
          <Link
            href="/services"
            className="text-purple-secondary underline decoration-1 underline-offset-4 hover:text-purple-accent"
          >
            digital marketing services
          </Link>{" "}
          or{" "}
          <Link
            href="/contact"
            className="text-purple-secondary underline decoration-1 underline-offset-4 hover:text-purple-accent"
          >
            get in touch
          </Link>{" "}
          to talk about your project.
        </p>
      </div>
    </div>
  );
}
