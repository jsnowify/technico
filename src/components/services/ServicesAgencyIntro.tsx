import Link from "next/link";
import PixelRevealImage from "@/components/home/PixelRevealImage";

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
          fill="var(--color-purple-accent)"
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
          fill="var(--color-accent-light)"
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

export default function ServicesAgencyIntro() {
  return (
    <section className="bg-black-bg">
      <div className="container-x mx-auto w-full max-w-[1920px] section-y">
        <header className="grid grid-cols-1 gap-5 border-t border-white/20 pt-5 sm:grid-cols-[minmax(130px,0.35fr)_minmax(0,1.65fr)] sm:gap-8 lg:gap-16">
          <div className="flex items-start gap-3 font-mono text-[11px] tracking-[0.04em] text-white/50 uppercase sm:pt-1 sm:text-xs">
            <span aria-hidden="true">/</span>
            <span>Why Technico</span>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(260px,0.8fr)] lg:gap-12">
            <h2 className="h2-section max-w-[21ch] leading-[1.08] font-medium tracking-heading text-white">
              Digital marketing agency in Canada — Technico Digital Solutions.
            </h2>
            <p className="body-copy max-w-[52ch] leading-[1.65] tracking-[-0.02em] text-content">
              As a trusted internet marketing agency, we deliver measurable
              results for your business. Our team of digital marketers and SEO
              specialists believe in building strong partnerships and
              guaranteeing your success. Imagine where your business could be
              six months from now. Let&rsquo;s make it happen. Our{" "}
              <Link
                href="https://technicosolutions.com/"
                className="text-content underline decoration-1 underline-offset-4 hover:text-accent-light"
              >
                Digital Marketing Services Agency
              </Link>{" "}
              is ready to help you get your business moving.
            </p>
          </div>
        </header>

        {/* Pillar + photo grid */}
        <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden border border-white/15 bg-white/15 sm:grid-cols-2 md:grid-cols-3 lg:mt-10">
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
  const backgroundClass =
    pillar.tile === "purple"
      ? "bg-purple-accent"
      : pillar.tile === "pink"
        ? "bg-pink-accent"
        : "bg-white-bg";
  const textColor =
    pillar.tile === "light"
      ? pillar.title === "Transparency"
        ? "text-purple-secondary"
        : "text-pink-accent"
      : "text-white";

  return (
    <div
      className={`relative aspect-[4/3] overflow-hidden sm:aspect-square ${backgroundClass}`}
    >
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
    <div className="relative aspect-[4/3] overflow-hidden bg-white-bg sm:aspect-square">
      <PixelRevealImage
        src={src}
        alt={alt}
        sizes="(min-width: 768px) 33vw, 50vw"
      />
      <div className="absolute inset-0 bg-black/30" aria-hidden="true" />
    </div>
  );
}
