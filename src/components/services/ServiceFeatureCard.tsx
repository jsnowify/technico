import GeometricIcon from "@/components/ui/icons";
import Button from "@/components/ui/Button";

interface ServiceFeatureCardProps {
  eyebrow: string;
  headline: string;
  paragraph: string;
  image: { src: string; alt: string };
  cta: { label: string; href: string };
  checklist: string[];
}

/**
 * ServiceFeatureCard
 * -----------------------------------------------------------------
 * Renders right after ServiceFeatureList (see
 * responsive_web_design_card.png / responsive_web_design_full.png).
 * A notched photo card on the left, paired with an icon-badge
 * checklist column on the right (same icon-square + divider
 * treatment as ServiceComparison's rows).
 *
 * The card's outline is CARD_SVG's own path, drawn directly at its
 * native 618x920 viewBox with preserveAspectRatio="none" against an
 * aspect-[618/920] wrapper — same technique as ChannelsJigsawCard —
 * so the bottom-right notch scales uniformly instead of stretching.
 * The card fills its full grid column (no max-w cap) so it renders
 * close to that native 618x920 size on desktop instead of shrinking.
 * Everything else stacks on top of the photo, inside that same clip:
 *   - SCRIM_SVG's own shape, filled black at 50% opacity, dims the
 *     whole photo so the text stays legible over it.
 *   - Eyebrow (14px) and headline (40px) flow as one inline run
 *     inside a single rounded-[32px] black box — one box total, not
 *     a chiclet per wrapped line — sized by shrink-to-fit (absolute,
 *     `left` only, no `right`) to hug the widest line.
 *   - A frosted glass panel (rx-30, #0A0A0C @ 20% opacity +
 *     backdrop-blur) holds the paragraph (18px, font-light/300,
 *     `line-clamp-6` so long copy can't grow past a safe height).
 *   - The CTA sits directly below that panel in normal flow (a shared
 *     `gap-6` flex column, not two separately-absolute boxes), at
 *     Button's standard size (no `size` override) — so it can never
 *     overlap the panel or run into the card's own notch, regardless
 *     of paragraph length.
 *
 * `image` is a placeholder for now — swap `src` once the real photo
 * (phone mockup + sketch pages) is provided.
 */
const VIEW_W = 618;
const VIEW_H = 920;

const CARD_PATH =
  "M618 682C618 709.614 595.614 732 568 732H531.475C503.86 732 481.475 754.386 481.475 782V870C481.475 897.614 459.089 920 431.475 920H50C22.3858 920 0 897.614 0 870V50C0 22.3858 22.3858 0 50 0H568C595.614 0 618 22.3858 618 50V682Z";

export default function ServiceFeatureCard({
  eyebrow,
  headline,
  paragraph,
  image,
  cta,
  checklist,
}: ServiceFeatureCardProps) {
  // Shortest text first, longest last — same visual-ramp sort as
  // ServiceFeatureList's checklist, by character count (not word
  // count) on a copy so the original `checklist` prop order/indices
  // stay intact.
  const sortedChecklist = [...checklist].sort((a, b) => a.length - b.length);

  return (
    <section className="bg-black-bg px-10 py-20 sm:py-24 md:py-28">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center md:gap-16">
        {/* Notched photo card — fills its column, no max-w cap */}
        <div className="relative mx-auto aspect-618/920 w-full">
          <svg
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
          >
            <defs>
              <clipPath id="service-feature-card-clip">
                <path d={CARD_PATH} />
              </clipPath>
            </defs>
            <g clipPath="url(#service-feature-card-clip)">
              <path d={CARD_PATH} fill="#1A1B1E" />
              <foreignObject x="0" y="0" width={VIEW_W} height={VIEW_H}>
                <div
                  // @ts-expect-error -- xmlns required for the foreignObject's
                  // root element to render as HTML rather than SVG.
                  xmlns="http://www.w3.org/1999/xhtml"
                  style={{
                    width: "100%",
                    height: "100%",
                    position: "relative",
                  }}
                >
                  {/* Placeholder photo filling the whole card shape.
                      Plain <img> for now — the placeholder lives on
                      gstatic, which isn't whitelisted in
                      next.config.js. Swap back to next/image (see
                      ChannelsJigsawCard's use of it inside a
                      foreignObject) once the real photo is hosted
                      somewhere already in images.remotePatterns. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="absolute inset-0 h-full w-full object-cover"
                  />

                  {/* Dark scrim — same outline as the card, 50% black,
                      dims the photo underneath the copy. */}
                  <svg
                    viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
                    preserveAspectRatio="none"
                    className="absolute inset-0 h-full w-full"
                    aria-hidden="true"
                  >
                    <path d={CARD_PATH} fill="black" fillOpacity="0.5" />
                  </svg>

                  {/* Eyebrow + headline flow as ONE inline run inside
                      a single rounded-[32px] black box — no tail, no
                      per-line chiclets. Since this element is
                      absolutely positioned with only `left` set (no
                      `right`/explicit width), its width is auto ->
                      shrink-to-fit, so the box hugs the widest of the
                      two lines instead of stretching full-width, and
                      both lines share that one box because the
                      background now lives on the block itself rather
                      than on a per-line inline span (that's what the
                      earlier box-decoration-clone attempt was for,
                      and it's no longer needed with a single box).
                      `whitespace-pre-line` honors the literal "\n" in
                      the headline string (see lib/content/services.ts,
                      same convention as ServiceConversion.tsx) so
                      "Responsive Web" stays on line 1 with the
                      eyebrow and "Design Services" wraps to line 2
                      exactly where authored. */}
                  <h2 className="absolute top-[5%] left-[4%] max-w-[92%] rounded-[15px] bg-black px-5 py-4 text-[40px] leading-[1.35] font-medium tracking-tight whitespace-pre-line text-white">
                    <span className="mr-3 inline-flex items-center gap-2 align-middle text-[14px] leading-none font-light tracking-widest whitespace-nowrap text-white/80 uppercase">
                      <span
                        aria-hidden="true"
                        className="h-1.5 w-1.5 shrink-0 bg-white/70"
                      />
                      {eyebrow}
                    </span>
                    {headline}
                  </h2>

                  {/* Frosted glass panel + CTA — grouped into ONE
                      flex column instead of two independently
                      absolute-positioned boxes. Raised to top-[26%]
                      (was 42%) per feedback, and the paragraph no
                      longer clamps to 6 lines — the full copy renders,
                      so this card's height now varies with paragraph
                      length instead of being fixed; long copy can run
                      close to (or past) the card's own bottom-right
                      notch, so keep an eye on that with real content. */}
                  <div className="absolute top-[26%] right-[6%] left-[6%] flex flex-col items-start gap-6">
                    <div className="w-full rounded-[30px] border border-white/10 bg-[#0A0A0C]/20 p-6 backdrop-blur-xl">
                      {/* `text-justify` doesn't play well with
                          `line-clamp` in WebKit — kept left-aligned
                          even now that the clamp is gone, since the
                          panel's fixed width still means the last
                          word of most lines won't reach the edge
                          evenly. `indent-6` matches the first-line
                          indent used on ServiceFeatureList's
                          paragraphs. */}
                      <p className="text-[18px] leading-relaxed font-light indent-6 text-white/70 sm:indent-8">
                        {paragraph}
                      </p>
                    </div>

                    <Button to={cta.href} variant="purple">
                      {cta.label}
                    </Button>
                  </div>
                </div>
              </foreignObject>
            </g>
          </svg>
        </div>

        {/* Checklist column — icon badge + divider per row, same
            treatment as ServiceComparison's rows (GeometricIcon in a
            rounded-md bg-purple-accent square, border-b divider
            between items, none after the last) so this list reads as
            the same list-item pattern used elsewhere on the site,
            instead of the plain small-square bullet it had before.
            `checklist` is still just `string[]` — no title/description
            split here, since the source content only ever supplies one
            line per item — so each icon index is just its position in
            the array (`i`), same as `columns[].rows[].icon` does
            elsewhere in lib/content/services.ts. */}
        <ul className="flex flex-col gap-8">
          {sortedChecklist.map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-4 border-b border-white/15 pb-8 last:border-b-0 last:pb-0"
            >
              <span
                aria-hidden="true"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-purple-accent"
              >
                <GeometricIcon index={i} className="h-5 w-5 text-black" />
              </span>
              <p className="pt-2 text-lg leading-relaxed font-normal text-white/80">
                {item}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
