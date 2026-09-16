import Image from "next/image";

/* ================================================================
   BLOG HERO
   ----------------------------------------------------------------
   Desktop layout:

   ┌──────────────────────────────────────────────────────────────┐
   │                                                              │
   │                         IMAGE                                │
   │                                                              │
   │                 ┌──────────────────────┐                     │
   │                 │        TITLE         │                     │
   │                 └──────────────────────┘                     │
   └──────────────────────────────────────────────────────────────┘
       DATE · READ TIME                              AUTHOR

   The supplied SVG controls ONLY the hero/card shape.

   IMPORTANT:
   - Metadata is OUTSIDE the SVG/card.
   - Title remains positioned over the bottom-center notch.
   - This matches the client's reference layout.
   ================================================================ */

const VIEW_W = 1272;
const VIEW_H = 500;

const NOTCH_X = 352;
const NOTCH_W = 568;
const NOTCH_Y = 408;

/* Exact client-supplied SVG path */
const HERO_PATH =
  "M1272 470C1272 486.569 1258.57 500 1242 500H950C933.431 500 920 486.569 920 470V438C920 421.431 906.569 408 890 408H382C365.431 408 352 421.431 352 438V470C352 486.569 338.569 500 322 500H30C13.4315 500 0 486.569 0 470V30C0 13.4315 13.4315 0 30 0H1242C1258.57 0 1272 13.4315 1272 30V470Z";

interface BlogHeroProps {
  title: string;
  coverImage: string;
  publishedAt: string;
  readTime: string;
  author: string;
}

export default function BlogHero({
  title,
  coverImage,
  publishedAt,
  readTime,
  author,
}: BlogHeroProps) {
  const dateLabel = new Date(publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <section className="bg-black-bg">
      <div className="container-x pt-24 pb-16 sm:pt-28 sm:pb-20">
        {/* ============================================================
            MOBILE / TABLET
            ============================================================ */}

        <div className="flex flex-col gap-6 lg:hidden">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[28px] bg-[#1A1B1E] sm:aspect-[16/9]">
            <Image
              src={coverImage}
              alt={title}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>

          <h1 className="text-2xl leading-[1.2] font-semibold tracking-tight text-white uppercase sm:text-[28px]">
            {title}
          </h1>

          <div className="flex items-center justify-between font-mono text-[11px] font-light tracking-[-0.01em] text-white/50 uppercase">
            <span>
              {dateLabel} <span className="text-white/25">.</span> {readTime}
            </span>

            <span>{author}</span>
          </div>
        </div>

        {/* ============================================================
            DESKTOP
            ============================================================ */}

        <div className="mx-auto hidden w-full lg:block">
          {/* ==========================================================
              HERO SHAPE

              This container represents ONLY the SVG/card.

              The metadata is intentionally NOT inside this element.
              ========================================================== */}

          <div
            className="relative w-full"
            style={{
              aspectRatio: `${VIEW_W} / ${VIEW_H}`,
            }}
          >
            {/* --------------------------------------------------------
                SVG SHAPE + IMAGE
                -------------------------------------------------------- */}

            <svg
              viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
              className="absolute inset-0 h-full w-full"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <clipPath id="heroNotchClip" clipPathUnits="userSpaceOnUse">
                  <path d={HERO_PATH} />
                </clipPath>
              </defs>

              {/* Base shape */}
              <path d={HERO_PATH} fill="#1A1B1E" />

              {/* Image clipped to exact client shape */}
              <foreignObject
                x="0"
                y="0"
                width={VIEW_W}
                height={VIEW_H}
                clipPath="url(#heroNotchClip)"
              >
                <div
                  // @ts-expect-error -- xmlns is required inside foreignObject
                  xmlns="http://www.w3.org/1999/xhtml"
                  style={{
                    width: "100%",
                    height: "100%",
                    position: "relative",
                  }}
                >
                  <img
                    src={coverImage}
                    alt={title}
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center",
                    }}
                  />
                </div>
              </foreignObject>
            </svg>

            {/* ========================================================
                TITLE

                The title sits inside the bottom-center notch area.

                It is intentionally allowed to visually extend slightly
                below the SVG/card, just like the reference design.
                ======================================================== */}

            <div
              className="absolute z-10 flex items-start justify-center px-6 pt-[10px] text-center"
              style={{
                left: `${(NOTCH_X / VIEW_W) * 100}%`,
                width: `${(NOTCH_W / VIEW_W) * 100}%`,
                top: `${(NOTCH_Y / VIEW_H) * 100}%`,
                height: `${((VIEW_H - NOTCH_Y) / VIEW_H) * 100}%`,
              }}
            >
              <h1 className="max-w-[568px] text-[26px] leading-[1.08] font-semibold tracking-tight text-white uppercase xl:text-[32px]">
                {title}
              </h1>
            </div>
          </div>

          {/* ==========================================================
              METADATA — OUTSIDE THE HERO CARD

              THIS IS THE IMPORTANT FIX.

              The date/read-time and author are now below the SVG,
              rather than positioned inside the 408-500px leg area.
              ========================================================== */}

          <div className="relative z-20 mt-2 flex w-full items-start justify-between px-6">
            {/* LEFT — DATE / READ TIME */}
            <p className="whitespace-nowrap font-mono text-[13px] leading-none font-light tracking-[-0.01em] text-white/60 uppercase">
              {dateLabel} <span className="text-white/25">.</span> {readTime}
            </p>

            {/* RIGHT — AUTHOR */}
            <p className="whitespace-nowrap font-mono text-[13px] leading-none font-light tracking-[-0.01em] text-white/60 uppercase">
              {author}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
