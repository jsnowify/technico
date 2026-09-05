import type { ReactNode } from "react";

/* ================================================================
   CHANNELS JIGSAW CARD
   ================================================================
   The two-panel "puzzle piece" card from your mock/CARD_SVG.svg:
   a solid-purple text panel on the left and a photo panel on the
   right, joined at the bottom by a small interlocking notch —
   instead of the plain stacked-heading treatment the section used
   before.

   Both panels are built the same way: an <svg> with a fixed
   viewBox (657x787, matching CARD_SVG.svg) holding the panel-shape
   <path>, plus a <foreignObject> that carries the real HTML text so
   it wraps normally instead of being drawn as SVG <text>. The
   wrapping div is locked to the same aspect ratio as the viewBox
   (aspect-[657/787]) with preserveAspectRatio="none", so the shape
   — and the notch specifically — scales uniformly at any width
   instead of stretching into an ellipse.

   The right panel's path is CARD_SVG.svg's path mirrored
   horizontally (x -> 657 - x for every point), so its notch is a
   mirror image of the left panel's and the two line up in the
   middle when the panels sit side by side.

   The photo panel uses your real Cloudinary asset now; the dark
   overlay rect stays on top so the white caption keeps enough
   contrast over it.

   Plain <img>, not next/image, on purpose: this sits inside an SVG
   <foreignObject>. It's the same res.cloudinary.com host the rest
   of this section already uses via next/image, so if you'd rather
   get Next's image optimization here too, this is a fine place to
   switch — swap this <img> for next/image with `fill` and drop the
   inline width/height/objectFit below.
   ================================================================ */

const VIEW_W = 657;
const VIEW_H = 787;

const LEFT_PATH =
  "M652 0C654.761 0 657 2.23858 657 5V726.499C657 734.343 644.702 740 636.858 740C622.027 740 610.003 752.536 610.003 768C610.003 776.047 604.435 787 596.388 787H5C2.23858 787 0 784.761 0 782V5C8.05344e-06 2.23858 2.23858 0 5 0H652Z";

// LEFT_PATH mirrored horizontally (x -> 657 - x) so the notch on
// this panel's bottom-left meets the left panel's bottom-right notch.
const RIGHT_PATH =
  "M5 0C2.239 0 0 2.23858 0 5V726.499C0 734.343 12.298 740 20.142 740C34.973 740 46.997 752.536 46.997 768C46.997 776.047 52.565 787 60.612 787H652C654.761 787 657 784.761 657 782V5C657 2.23858 654.761 0 652 0H5Z";

const CHANNELS_PHOTO =
  "https://res.cloudinary.com/dp9bjis3z/image/upload/q_auto:best/v1788578769/services-overview/technico-look_delxjj.avif";

function PanelText({
  children,
  align = "start",
  size = 72,
}: {
  children: ReactNode;
  align?: "start" | "end";
  size?: number;
}) {
  return (
    <div
      // @ts-expect-error -- xmlns is required on the foreignObject's
      // root element for it to render as HTML, not a valid JSX/DOM prop.
      xmlns="http://www.w3.org/1999/xhtml"
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: align === "start" ? "flex-start" : "flex-end",
        boxSizing: "border-box",
      }}
      className="p-10"
    >
      <p
        style={{ fontSize: `${size}px` }}
        className="leading-[0.95] tracking-[-2px] font-normal text-white"
      >
        {children}
      </p>
    </div>
  );
}

export default function ChannelsJigsawCard() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-4">
      {/* Left panel — purple by default, slides in pink on hover.
          The pink layer is the same path, scaled in from 0 width at
          its left edge (transform-box: fill-box makes the 0-100%
          scale-x relative to the shape's own bounding box, not the
          full SVG viewport) so the reveal always matches the card's
          rounded/notched outline exactly, at any size. */}
      <div className="group relative aspect-[657/787] w-full cursor-pointer">
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
        >
          <path d={LEFT_PATH} fill="#6D28D9" />
          <path
            d={LEFT_PATH}
            fill="#EC4899"
            style={{ transformBox: "fill-box", transformOrigin: "left center" }}
            className="scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100"
          />
          <foreignObject x="0" y="0" width={VIEW_W} height={VIEW_H * 0.62}>
            <PanelText align="start">
              You don&apos;t have to rely on just one marketing channel to grow
              your business.
            </PanelText>
          </foreignObject>
        </svg>
      </div>

      {/* Right panel — placeholder photo + dark overlay, text anchored to the bottom */}
      <div className="relative aspect-[657/787] w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
        >
          <defs>
            <clipPath id="channels-jigsaw-right-clip">
              <path d={RIGHT_PATH} />
            </clipPath>
          </defs>
          <g clipPath="url(#channels-jigsaw-right-clip)">
            <foreignObject x="0" y="0" width={VIEW_W} height={VIEW_H}>
              <div
                // @ts-expect-error -- see PanelText note above
                xmlns="http://www.w3.org/1999/xhtml"
                style={{ width: "100%", height: "100%", position: "relative" }}
              >
                <img
                  src={CHANNELS_PHOTO}
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                <div className="absolute inset-0 bg-black/40" />
              </div>
            </foreignObject>
          </g>
          <foreignObject x="0" y="0" width={VIEW_W} height={VIEW_H}>
            <PanelText align="end" size={64}>
              We look at where your customers are searching, what they see when
              they land on your website, and how
            </PanelText>
          </foreignObject>
        </svg>
      </div>
    </div>
  );
}
