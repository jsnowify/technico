import Link from "next/link";
import GridCorners from "@/components/ui/GridCorners";
import ServiceSectionHeader from "./ServiceSectionHeader";
import type { ServiceAccent } from "./serviceAccent";

/* ================================================================
   SERVICE INTRO PANEL
   ================================================================
   The "introPanel" section on /services/[slug] (see
   lib/content/types.ts): the opportunity stated once, with a
   supporting photograph.

   Rebuilt in the service-detail system. The old version clipped the
   photo into a rounded L-shaped notch and overlaid the copy in the
   cut-out — a shape that fought the hairline grid the rest of the
   page is built on, and that squeezed the copy into a fixed box it
   could overflow. Now the copy and the photo are two cells of one
   bordered panel: the copy column can grow to whatever the content
   needs, and the photo fills its cell edge to edge at every width.
   ================================================================ */

interface IntroPanelParagraph {
  text: string;
  /** `label` must be an exact substring of `text` — that substring
   * renders as an internal link. */
  link?: { label: string; href: string };
}

interface ServiceIntroPanelProps {
  eyebrow: string;
  headline: string;
  paragraphs: IntroPanelParagraph[];
  image: { src: string; alt: string };
  accent?: ServiceAccent;
}

function renderParagraphText(
  text: string,
  link?: { label: string; href: string },
) {
  if (!link) return text;

  const idx = text.indexOf(link.label);
  if (idx === -1) return text;

  return (
    <>
      {text.slice(0, idx)}
      <Link
        href={link.href}
        className="text-white-text underline decoration-1 underline-offset-4 hover:text-content"
      >
        {link.label}
      </Link>
      {text.slice(idx + link.label.length)}
    </>
  );
}

export default function ServiceIntroPanel({
  eyebrow,
  headline,
  paragraphs,
  image,
  accent = "purple",
}: ServiceIntroPanelProps) {
  return (
    <section className="bg-black-bg">
      <ServiceSectionHeader
        eyebrow={eyebrow}
        headline={headline}
        accent={accent}
        headlineWidth="max-w-[26ch]"
      />

      <div className="relative mt-12 grid grid-cols-1 border border-white/18 sm:mt-16 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <GridCorners accent={accent} />

        <div className="flex flex-col justify-center border-b border-white/18 p-5 sm:p-7 lg:border-r lg:border-b-0 lg:p-9">
          {paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className={`body-copy max-w-[58ch] leading-[1.62] text-content ${
                index > 0 ? "mt-5" : ""
              }`}
            >
              {renderParagraphText(paragraph.text, paragraph.link)}
            </p>
          ))}
        </div>

        <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[16/9] lg:aspect-auto lg:min-h-[420px]">
          {/* Some service placeholders use remote hosts that are not in
              next/image's allowlist, so this remains a plain image. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.src}
            alt={image.alt}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <span className="absolute top-4 left-4 bg-black-bg px-3 py-2 font-mono text-[10px] tracking-[0.06em] text-content uppercase sm:top-6 sm:left-6 sm:text-xs">
            <span aria-hidden="true">{"// "}</span>
            {eyebrow}
          </span>
        </div>
      </div>
    </section>
  );
}
