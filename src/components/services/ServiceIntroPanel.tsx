import Image from "next/image";
import Link from "next/link";

/* ================================================================
   SERVICE INTRO PANEL
   ================================================================
   Renders the "introPanel" section on /services/[slug] (see
   lib/content/types.ts). Eyebrow + headline sit in normal flow,
   followed by a notched photo panel: the image fills a tall right
   column plus a full-width band along the bottom, leaving an
   L-shaped gap in the top-left where the paragraph copy is
   overlaid — per the content-type comment this file used to be
   missing entirely (this file previously contained a stray copy of
   ServicesAgencyIntro.tsx instead of its own implementation, which
   is why every "introPanel" section on /services/[slug] failed to
   type-check — this restores an actual props-driven component).

   The notch/overlay treatment only applies from `lg` up, where
   there's enough width for the text to sit comfortably inside the
   cut-out corner. Below that it falls back to a plain stacked
   layout (headline -> paragraphs -> full-width photo) so the copy
   never gets squeezed into a tiny corner on a phone. Double-check
   the notch proportions (45% / 55% below) against the real design
   reference — they're a reasonable approximation of "tall right
   column + full-width bottom band", not pulled from a mock.
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
        className="text-white underline decoration-1 underline-offset-4 hover:text-white/80"
      >
        {link.label}
      </Link>
      {text.slice(idx + link.label.length)}
    </>
  );
}

function IntroParagraphs({
  paragraphs,
  className = "",
}: {
  paragraphs: IntroPanelParagraph[];
  className?: string;
}) {
  return (
    <div className={className}>
      {paragraphs.map((paragraph, i) => (
        <p
          key={i}
          className={`text-justify text-sm leading-relaxed font-light tracking-body text-white/70 sm:text-base ${
            i > 0 ? "mt-4" : ""
          }`}
        >
          {renderParagraphText(paragraph.text, paragraph.link)}
        </p>
      ))}
    </div>
  );
}

export default function ServiceIntroPanel({
  eyebrow,
  headline,
  paragraphs,
  image,
}: ServiceIntroPanelProps) {
  return (
    <section className="bg-black-bg">
      <div className="container-x py-20 sm:py-24 md:py-28">
        <span className="font-mono text-xs tracking-[0.16em] text-white/60 uppercase sm:text-sm">
          {eyebrow}
        </span>

        <h2 className="mt-5 max-w-3xl text-[32px] leading-[1.15] font-medium tracking-heading text-white sm:mt-6 sm:text-[40px] md:text-[44px]">
          {headline}
        </h2>

        {/* MOBILE / TABLET — plain stacked layout, no notch. */}
        <div className="mt-10 lg:hidden">
          <IntroParagraphs paragraphs={paragraphs} />
          <div className="relative mt-8 aspect-[4/3] w-full overflow-hidden rounded-[28px] sm:aspect-[16/9]">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* DESKTOP — notched photo: tall right column + full-width
            bottom band, paragraph copy overlaid in the cut-out
            top-left gap. */}
        <div className="relative mt-14 hidden aspect-[2/1] w-full lg:block">
          <div
            className="absolute inset-0 overflow-hidden rounded-[28px]"
            style={{
              clipPath:
                "polygon(45% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 55%, 45% 55%)",
            }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>

          <IntroParagraphs
            paragraphs={paragraphs}
            className="absolute top-0 left-0 flex h-[55%] w-[45%] flex-col justify-center pr-8 xl:pr-10"
          />
        </div>
      </div>
    </section>
  );
}
