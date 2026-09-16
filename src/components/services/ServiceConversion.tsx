import Image from "next/image";
import GeometricIcon from "@/components/ui/icons";

interface ServiceConversionFeature {
  text: string;
  /** Substring of `text` to render underlined, matching the mock's
   * "Conversion Rate Optimization" treatment — omit for a plain line. */
  emphasis?: string;
}

interface ServiceConversionProps {
  headline: string;
  description: string;
  image: { src: string; alt: string };
  features: ServiceConversionFeature[];
  /** "pink" | "purple" — badge on the headline card. Feature bullets
   * stay pink regardless (matches the mock's fixed "//" mark). */
  accent?: "pink" | "purple";
}

/**
 * ServiceConversion
 * -----------------------------------------------------------------
 * Renders right after ServiceHighlights on /services/[slug] (see
 * services_conversion_section.png). A full-bleed photo carries a
 * dark floating card with the headline, followed by a centered
 * supporting paragraph and a 2-column list of "//" bullet features
 * (three items; the third naturally wraps to its own row in the
 * left column via normal grid flow — no extra markup needed).
 *
 * Reuses the same handshake photo already used in
 * ServicesAgencyIntro rather than a new upload.
 */
export default function ServiceConversion({
  headline,
  description,
  image,
  features,
  accent = "purple",
}: ServiceConversionProps) {
  const accentBg = accent === "pink" ? "bg-pink-accent" : "bg-purple-accent";

  return (
    // `relative z-10 -mt-*` pulls this section up over the bottom of
    // ServiceHighlights' rounded panel (which sits directly above it
    // in page.tsx) so the photo overlaps that panel's bottom edge
    // instead of leaving a plain bg-black-bg gap between the two —
    // reads as one connected block rather than two stacked sections.
    <section className="relative z-10 -mt-16 bg-black-bg px-10 pb-[80px] sm:-mt-20 md:-mt-24">
      {/* Photo + floating headline card. Wrapped in a relative parent
          so a color-matched backdrop can sit behind the photo's top
          half (see below) independent of the -mt overlap above. */}
      <div className="relative mt-6 sm:mt-8">
        {/* Half-height backdrop matching ServiceHighlights' own
            #1A1A1A panel color exactly. This isn't load-bearing for
            the overlap itself (the -mt trick above already does
            that) — it's a belt-and-suspenders color match so the
            transition still reads as one continuous block even in
            spots the negative margin doesn't physically cover
            (e.g. the side gutters beside the rounded photo card),
            instead of relying purely on precise pixel overlap. */}
        <div
          aria-hidden="true"
          className="absolute top-0 -left-10 -right-10 h-1/2 bg-[#1A1A1A]"
        />

        <div className="relative mt-[80px] overflow-hidden rounded-3xl shadow-2xl">
          <div className="relative aspect-video w-full sm:aspect-21/10">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>

          {/* Glassmorphism card: translucent black + backdrop-blur instead
              of solid black, plus a soft white border and a subtle top
              sheen so it reads as glass sitting on the photo rather than
              an opaque cutout. */}
          <div className="absolute top-6 left-6 max-w-md rounded-3xl border border-white/15 bg-black-bg/35 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:top-8 sm:left-8 sm:max-w-xl sm:p-7 md:max-w-2xl">
            {/* Sheen — angled highlight fading from the top-left corner,
                the classic glass "light catching the edge" cue. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-3xl bg-linear-to-br from-white/15 via-white/0 to-transparent"
            />

            <div className="relative flex items-end justify-between gap-4">
              {/* `whitespace-pre-line` honors the "\n" in the headline
                  string (see lib/content/services.ts) so it always breaks
                  after "Organic" / before "Traffic" as specified, instead
                  of wherever the container happens to wrap it. */}
              <h2 className="text-[28px] leading-[1.15] font-medium tracking-tight whitespace-pre-line text-white sm:text-[36px] md:text-[44px]">
                {headline}
              </h2>
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${accentBg}`}
              >
                <GeometricIcon index={10} className="h-4 w-4 text-white" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Supporting paragraph — same justified + first-line-indent
          treatment as ServicesAgencyIntro's intro copy, and the same
          full section width (no extra max-w cap) so it lines up with
          how that other paragraph is sized. */}
      <p
        className="mt-10 w-full text-justify indent-6 font-light text-pretty text-white/50 sm:indent-8"
        style={{
          fontSize: "clamp(0.95rem, 1.9vw, 1.25rem)",
          lineHeight: 1.6,
        }}
      >
        {description}
      </p>

      {/* "//" bullet features */}
      <div className="mt-10 grid w-full grid-cols-1 gap-x-16 gap-y-6 sm:grid-cols-2">
        {features.map((feature, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-pink-accent font-mono text-sm font-medium text-white">
              {"//"}
            </span>
            <p className="text-base leading-snug text-white/90">
              {renderFeatureText(feature)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function renderFeatureText({ text, emphasis }: ServiceConversionFeature) {
  if (!emphasis) return text;

  const idx = text.indexOf(emphasis);
  if (idx === -1) return text;

  return (
    <>
      {text.slice(0, idx)}
      <span className="text-white underline decoration-1 underline-offset-4">
        {emphasis}
      </span>
      {text.slice(idx + emphasis.length)}
    </>
  );
}
