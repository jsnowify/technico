import Image from "next/image";
import Link from "next/link";

/* ================================================================
   SERVICES AGENCY INTRO
   ================================================================
   Next section after ServicesChapterReel on /services. Simplified
   per updated client direction: the intro copy that used to live in
   two tilted "quote card" panels (pink + purple) is now just plain
   text, followed by the same 3x2 grid mixing icon tiles with photo
   tiles.

   TYPOGRAPHY PASS — aligned to the rest of /services instead of this
   section's own one-off values:
     - Heading was a much larger, animated `TextRevealBlock` at 72px
       with `tracking-tight`. It's now a plain, static `<h2>` sized
       and spaced exactly like every other section heading on this
       page (32px -> 40px -> 44px, `leading-[1.1]`, `tracking-heading`
       — see ServicesChapterReel's `SectionIntro`, ServicesTailored-
       Strategy's header) instead of its own scale/animation/tracking.
     - Paragraph was `font-normal` with an inline `clamp()` font-size
       and a hand-rolled `lineHeight: 1.6`. It's now `font-light` at
       the site's standard 18px/`leading-relaxed` with `tracking-body`
       (the same combo used on every other paragraph in this file's
       sibling sections), still justified with the leading indent.
     - Outer wrapper was a one-off `mx-auto max-w-6xl px-6`, with the
       paragraph re-wrapped in its own `w-full px-5` on top of that
       (a second, slightly different side padding stacked on the
       first). Both are replaced by `.container-x`, the same global
       container class the rest of /services uses, so this section's
       measure lines up with its neighbors instead of drifting a few
       pixels off on each side.

   ASSET NOTES:
   - The two photo tiles now use the real Cloudinary images supplied
     by the client (handshake, conversation). Update the `src`
     values below if the assets change.
   - The four grid tiles share a cut-corner silhouette via a CSS
     clip-path; the purple/pink icon tiles reuse the client's
     Figma-exported SVG blob shape as a background.

   Server component (no "use client") — nothing here needs client-side
   JS anymore now that the heading's scroll-triggered reveal is gone.
   ================================================================ */

interface Pillar {
  title: string;
  icon: React.ReactNode;
  tile: "purple" | "pink" | "light";
}

const PILLARS: Pillar[] = [
  {
    title: "Partner-Focused",
    tile: "purple",
    // Four-petal pinwheel — represents a close working partnership.
    icon: (
      <svg
        viewBox="0 0 52 52"
        fill="none"
        className="h-11 w-11 sm:h-14 sm:w-14"
      >
        <path
          d="M0 0C0 6.8801 2.73234 13.4784 7.59753 18.3429C12.4627 23.2081 19.061 25.9411 25.9411 25.9411V0H0ZM25.9411 25.9411H51.8827V0C45.0026 0 38.4038 2.73301 33.5386 7.59753C28.6735 12.4627 25.9411 19.0604 25.9411 25.9411ZM25.9411 25.9411V51.8821H51.8827C51.8827 45.0021 49.1504 38.4038 44.2852 33.5387C39.42 28.6741 32.821 25.9411 25.9411 25.9411ZM25.9411 25.9411H0V51.8821C6.8801 51.8821 13.479 49.1491 18.3442 44.2845C23.2094 39.4194 25.9411 32.8211 25.9411 25.9411Z"
          fill="#FFFFF9"
        />
      </svg>
    ),
  },
  {
    title: "Transparency",
    tile: "light",
    // Twin leaning ovals — a stylized quote/lens mark.
    icon: (
      <svg
        viewBox="0 0 52 52"
        fill="none"
        className="h-11 w-11 sm:h-14 sm:w-14"
      >
        <path
          d="M0 0V51.8827C14.3268 51.8827 25.9409 40.2686 25.9409 25.9425C25.9409 11.6161 14.3268 0.00268387 0 0ZM25.9409 0V51.8827C40.2678 51.8827 51.8821 40.2686 51.8821 25.9425C51.8821 11.6161 40.2678 0.00268387 25.9409 0Z"
          fill="#6D28D9"
        />
      </svg>
    ),
  },
  {
    title: "Proven Track Record",
    tile: "light",
    // Open ring — represents a track record you can see straight through.
    icon: (
      <svg
        viewBox="0 0 52 52"
        fill="none"
        className="h-11 w-11 sm:h-14 sm:w-14"
      >
        <path
          d="M25.9425 0C11.6718 0 0 11.672 0 25.945C0 40.2136 11.6718 51.8827 25.9425 51.8827C40.2136 51.8827 51.8827 40.2136 51.8827 25.945C51.8827 11.672 40.2136 0 25.9425 0ZM25.9425 9.38969C35.1406 9.38969 42.4951 16.7467 42.4951 25.945C42.4951 35.1433 35.1406 42.4978 25.9425 42.4978C16.7442 42.4978 9.38765 35.1433 9.38765 25.945C9.38765 16.7467 16.7442 9.38969 25.9425 9.38969Z"
          fill="#EC4899"
        />
      </svg>
    ),
  },
  {
    title: "Guaranteed Success",
    tile: "pink",
    // Pennant/flag — represents a guaranteed outcome.
    icon: (
      <svg
        viewBox="0 0 52 52"
        fill="none"
        className="h-11 w-11 sm:h-14 sm:w-14"
      >
        <path
          d="M52 0V51.8827H51.8485C49.8415 24.1877 27.8123 2.15851 0.117251 0.151473V0H52Z"
          fill="#FFFFF9"
        />
      </svg>
    ),
  },
];

/** Shared "dog-eared" cut-corner silhouette for the four grid tiles
 * that don't render the client's exact square SVG (see file header). */
const TILE_CLIP = {
  clipPath: "polygon(0% 0%, 100% 0%, 100% 78%, 78% 100%, 0% 100%)",
} as const;

export default function ServicesAgencyIntro() {
  return (
    <section className="bg-black-bg">
      <div className="container-x pt-6 pb-20 sm:pt-8 sm:pb-24 md:pt-10 md:pb-28">
        <h2 className="mx-auto max-w-4xl text-center text-[32px] leading-[1.1] font-medium tracking-heading text-white sm:text-[40px] md:text-[44px]">
          Digital Marketing Agency in Canada – Technico Digital Solutions
        </h2>

        {/* Intro copy — same container-x measure as the heading and
            the rest of the section, no extra one-off padding. */}
        <div className="mt-12 sm:mt-14">
          <p className="text-justify indent-6 text-[18px] leading-relaxed font-light tracking-body text-pretty text-white/90 sm:indent-8">
            As a trusted internet marketing agency, we deliver measurable
            results for your business. Our team of digital marketers and SEO
            specialists believe in building strong partnerships and guaranteeing
            your success. Imagine where your business could be six months from
            now. Let&rsquo;s make it happen. Our{" "}
            <Link
              href="https://technicosolutions.com/"
              className="text-white underline decoration-1 underline-offset-4 hover:text-white/80"
            >
              Digital Marketing Services Agency
            </Link>{" "}
            is ready to help you get your business moving.
          </p>
        </div>

        {/* Pillar + photo grid */}
        <div className="mt-16 grid grid-cols-2 gap-4 sm:mt-20 sm:gap-5 md:grid-cols-3 md:gap-6">
          {/* Row 1 */}
          <PillarTile pillar={PILLARS[0]} />
          <PillarTile pillar={PILLARS[1]} />
          <PhotoTile
            src="https://res.cloudinary.com/dp9bjis3z/image/upload/f_avif/q_auto:best/f_webp/q_auto:best/dpr_auto/agency/technico-agency-1_qv5a4s.png"
            alt="Two business partners shaking hands after a successful meeting"
          />

          {/* Row 2 */}
          <PhotoTile
            src="https://res.cloudinary.com/dp9bjis3z/image/upload/f_avif/q_auto:best/f_webp/q_auto:best/dpr_auto/f_auto/q_auto/agency/technico-agency-2_fljus5.png"
            alt="A consultant listening closely to a client during a one-on-one conversation"
          />
          <PillarTile pillar={PILLARS[2]} />
          <PillarTile pillar={PILLARS[3]} />
        </div>
      </div>
    </section>
  );
}

function PillarTile({ pillar }: { pillar: Pillar }) {
  const isColorTile = pillar.tile === "purple" || pillar.tile === "pink";
  const textColor =
    pillar.tile === "light"
      ? pillar.title === "Transparency"
        ? "text-purple-secondary"
        : "text-pink-accent"
      : "text-white";

  return (
    <div
      className={`relative aspect-[4/5] overflow-hidden rounded-[28px] sm:aspect-square ${
        isColorTile ? "" : "bg-[#f3f4ee]"
      }`}
      style={isColorTile ? undefined : TILE_CLIP}
    >
      {isColorTile && (
        <svg
          viewBox="0 0 315 315"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          {pillar.tile === "purple" ? (
            <path
              d="M284.441 0C301.01 0 314.441 13.4315 314.441 30V257.701C314.441 265.059 309.54 271.346 304.337 276.549L276.55 304.337C271.347 309.54 265.06 314.441 257.702 314.441H30C13.4315 314.441 0 301.01 0 284.441V30C1.36718e-05 13.4315 13.4315 0 30 0H284.441Z"
              fill="#6D28D9"
            />
          ) : (
            <path
              d="M284.441 0C301.01 8.27533e-06 314.441 13.4315 314.441 30V254.018C314.441 261.974 311.281 269.605 305.655 275.231L275.231 305.655C269.605 311.281 261.974 314.441 254.018 314.441H30C13.4315 314.441 3.04988e-05 301.01 0 284.441V30C0 13.4315 13.4315 0 30 0H284.441Z"
              fill="#EC4899"
            />
          )}
        </svg>
      )}
      <div className="relative flex h-full flex-col items-center justify-center gap-5 p-6 text-center sm:gap-6 sm:p-7">
        <span aria-hidden="true" className="flex justify-center">
          {pillar.icon}
        </span>
        <p
          className={`text-2xl leading-snug font-semibold tracking-tight sm:text-3xl ${textColor}`}
        >
          {pillar.title}
        </p>
      </div>
    </div>
  );
}

function PhotoTile({ src, alt }: { src: string; alt: string }) {
  return (
    <div
      className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-white-bg sm:aspect-square"
      style={TILE_CLIP}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 768px) 33vw, 50vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/30" aria-hidden="true" />
    </div>
  );
}
