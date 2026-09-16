"use client";

import GeometricIcon from "@/components/ui/icons";
import Button from "@/components/ui/Button";

interface GrowBusinessItem {
  text: string;
  tag: string;
}

interface ServicesGrowBusinessProps {
  headline: [string, string];
  intro: string;
  items: [
    GrowBusinessItem,
    GrowBusinessItem,
    GrowBusinessItem,
    GrowBusinessItem,
  ];
  closing: string;
}

/**
 * ServicesGrowBusiness
 * -----------------------------------------------------------------
 * Dark section that follows ServiceResults: a centered two-line
 * headline + intro paragraph, a 2x2 "bento" grid of four stat cards
 * with a notched corner + floating circle cutout, and a closing
 * paragraph underneath.
 *
 * THE NOTCHED CARD SHAPE
 * -----------------------------------------------------------------
 * Each card is one of two client-supplied 500x500 SVG shapes:
 * a rounded square with an L-shaped bite taken out of one corner,
 * plus a circular hole punched in that bite so the section
 * background peeks through as a floating dot.
 *
 * BLACK_CARD_PATH:
 *   fill #1A1B1E, bite at the TOP-RIGHT corner.
 *
 * WHITE_CARD_PATH:
 *   fill #D9D9D9, bite at the BOTTOM-RIGHT corner.
 *
 * The reference mock's 2x2 grid uses these two shapes across all
 * four positions by rotating them 180deg for the bottom row:
 *
 *   top-left     = black, as drawn
 *   top-right    = white, as drawn
 *   bottom-left  = white, rotated 180deg
 *   bottom-right = black, rotated 180deg
 *
 * CONTENT LAYOUT PER CARD
 * -----------------------------------------------------------------
 * Content is drawn over the shape rather than rotating with it,
 * so text always remains upright.
 *
 * Top-row cards:
 *   icon → paragraph → CTA
 *
 * Bottom-row cards:
 *   paragraph → icon + CTA
 *
 * CTA:
 *   Uses the shared Button component with variant="purple".
 */

const BLACK_CARD_PATH =
  "M376.373 0C387.419 4.18738e-06 396.373 8.95431 396.373 20V83.627C396.373 94.6726 405.327 103.627 416.373 103.627H480C491.046 103.627 500 112.581 500 123.627V480C500 491.046 491.046 500 480 500H20C8.95431 500 0 491.046 0 480V20C5.79832e-06 8.95431 8.95431 1.97022e-07 20 0H376.373ZM474.093 0C488.401 0 500 11.5986 500 25.9062C500 40.2141 488.401 51.8135 474.093 51.8135C459.785 51.8132 448.187 40.214 448.187 25.9062C448.187 11.5987 459.785 0.000262866 474.093 0Z";

const WHITE_CARD_PATH =
  "M500 376.373C500 387.419 491.046 396.373 480 396.373L416.373 396.373C405.327 396.373 396.373 405.327 396.373 416.373L396.373 480C396.373 491.046 387.419 500 376.373 500L20 500C8.95429 500 -2.14643e-05 491.046 -2.09815e-05 480L-8.74228e-07 20C5.40691e-06 8.95429 8.95431 -2.14643e-05 20 -2.09815e-05L480 -8.74228e-07C491.046 5.40691e-06 500 8.95431 500 20L500 376.373ZM500 474.093C500 488.401 488.401 500 474.094 500C459.786 500 448.187 488.401 448.187 474.093C448.187 459.785 459.786 448.187 474.094 448.187C488.401 448.187 500 459.785 500 474.093Z";

/**
 * Per-card visual configuration.
 *
 * Order:
 *   1. top-left
 *   2. top-right
 *   3. bottom-left
 *   4. bottom-right
 */
const CARD_CONFIG = [
  {
    variant: "black" as const,
    rotate: false,
    iconAlign: "left" as const,
    layout: "icon-top" as const,
    textClearance: false,
    iconClearance: false,
  },
  {
    variant: "white" as const,
    rotate: false,
    iconAlign: "right" as const,
    layout: "icon-top" as const,
    textClearance: false,
    iconClearance: false,
  },
  {
    variant: "white" as const,
    rotate: true,
    iconAlign: "left" as const,
    layout: "icon-bottom" as const,
    textClearance: true,
    iconClearance: false,
  },
  {
    variant: "black" as const,
    rotate: true,
    iconAlign: "left" as const,
    layout: "icon-bottom" as const,
    textClearance: false,
    iconClearance: true,
  },
];

/**
 * NotchCardShape
 * -----------------------------------------------------------------
 * Renders the supplied SVG card shape.
 *
 * The content is rendered separately so rotation only affects
 * the background shape.
 */
function NotchCardShape({
  variant,
  rotate,
}: {
  variant: "black" | "white";
  rotate: boolean;
}) {
  return (
    <svg
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
      style={
        rotate
          ? {
              transform: "rotate(180deg)",
            }
          : undefined
      }
    >
      <path
        d={variant === "black" ? BLACK_CARD_PATH : WHITE_CARD_PATH}
        fill={variant === "black" ? "#1A1B1E" : "#D9D9D9"}
      />
    </svg>
  );
}

export default function ServicesGrowBusiness({
  headline,
  intro,
  items,
  closing,
}: ServicesGrowBusinessProps) {
  return (
    <section className="bg-black-bg px-10 pt-20 pb-20 sm:pt-24 sm:pb-24 md:pt-28 md:pb-28">
      {/* ============================================================
          HEADLINE
      ============================================================ */}

      <h2 className="text-center text-[32px] leading-[1.2] font-medium tracking-tight text-white sm:text-[40px] md:text-[44px]">
        {headline[0]}
        <br />
        {headline[1]}
      </h2>

      {/* ============================================================
          INTRO
      ============================================================ */}

      <p className="mt-5 w-full text-justify indent-6 text-sm leading-relaxed font-light text-white/50 sm:indent-8 sm:text-base">
        {intro}
      </p>

      {/* ============================================================
          CARD GRID
      ============================================================ */}

      <div className="mx-auto mt-14 grid max-w-3xl grid-cols-1 gap-6 sm:mt-16 sm:grid-cols-2 sm:gap-8">
        {items.map((item, i) => {
          const config = CARD_CONFIG[i];

          const isBlack = config.variant === "black";

          const iconColor = isBlack ? "text-white" : "text-black";

          const textColor = isBlack ? "text-white" : "text-black-text";

          /* ========================================================
             SHARED ICON
          ======================================================== */

          const icon = (
            <GeometricIcon
              index={1}
              className={`h-8 w-8 shrink-0 ${iconColor}`}
            />
          );

          /* ========================================================
             YOUR ACTUAL BUTTON COMPONENT

             No GooeyTag.
             No duplicate button implementation.
             ======================================================== */

          const pill = (
            <Button to="/contact" variant="purple" size="sm">
              {item.tag}
            </Button>
          );

          return (
            <div key={i} className="relative aspect-square w-full">
              {/* ==================================================
                  CARD BACKGROUND
              ================================================== */}

              <NotchCardShape variant={config.variant} rotate={config.rotate} />

              {/* ==================================================
                  CARD CONTENT
              ================================================== */}

              <div
                className={`absolute inset-0 flex flex-col justify-between ${
                  config.textClearance
                    ? "pt-[22%] pr-[9%] pb-[9%] pl-[13%]"
                    : "p-[9%]"
                }`}
              >
                {/* ==================================================
                    TOP ROW CARDS
                ================================================== */}

                {config.layout === "icon-top" ? (
                  <>
                    {/* Icon */}
                    <div
                      className={
                        config.iconAlign === "right" ? "self-end" : "self-start"
                      }
                    >
                      {icon}
                    </div>

                    {/* Text */}
                    <p
                      className={`
                        mt-4
                        flex-1
                        text-[15px]
                        leading-relaxed
                        font-normal
                        sm:text-base
                        ${textColor}
                      `}
                    >
                      {item.text}
                    </p>

                    {/* CTA */}
                    <div className="flex w-full justify-center">{pill}</div>
                  </>
                ) : (
                  /* ==================================================
                     BOTTOM ROW CARDS
                  ================================================== */
                  <>
                    {/* Text */}
                    <p
                      className={`
                        text-[15px]
                        leading-relaxed
                        font-normal
                        sm:text-base
                        ${textColor}
                      `}
                    >
                      {item.text}
                    </p>

                    {/* Bottom row */}
                    <div className="flex items-end gap-3">
                      {/* Icon (bottom-row cards are always left-aligned) */}
                      <div
                        className={`
                          self-start
                          ${config.iconClearance ? "mb-[8%] ml-[16%]" : ""}
                        `}
                      >
                        {icon}
                      </div>

                      {/* CTA */}
                      <div className="flex flex-1 justify-center">{pill}</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ============================================================
          CLOSING
      ============================================================ */}

      <p className="mt-14 w-full text-justify indent-6 text-sm leading-relaxed font-light text-white/50 sm:mt-16 sm:indent-8 sm:text-base">
        {closing}
      </p>
    </section>
  );
}
