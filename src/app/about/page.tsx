import { buildMetadata } from "@/lib/seo";
import { SITE_NAME } from "@/lib/constants";

export const metadata = buildMetadata({
  title: "About",
  description: `Learn about ${SITE_NAME} and how we approach digital projects.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="text-4xl font-semibold tracking-tight text-black-text">
        About {SITE_NAME}
      </h1>
      <div className="mt-8 space-y-4 text-lg leading-8 text-black-text/70">
        <p>
          We&apos;re a digital solutions company focused on building fast,
          accessible, and maintainable web products.
        </p>
      </div>
    </div>
  );
}
