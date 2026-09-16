"use client";
import { useState } from "react";
import GeometricIcon from "@/components/ui/icons";

interface ServicePillarCardsItem {
  title: string;
  description: string;
}

interface ServicePillarCardsProps {
  eyebrow: string;
  headline: string;
  intro: string;
  items: ServicePillarCardsItem[];
  closingParagraph?: string;
}

/**
 * ServicePillarCards
 * -----------------------------------------------------------------
 * Eyebrow + headline (left) paired with a supporting intro paragraph
 * (right), then a row of four alternating-color cards — same
 * light/pink/purple/dark accent rotation as
 * ServicesIndustriesStack — each carrying a geometric icon, a "0X"
 * index, and a title. Cards are a single-open accordion (click to
 * reveal that card's description) with the same first-open-by-
 * default, one-at-a-time behavior as ServiceInsights' accordion. An
 * optional closing line sits centered below the grid.
 */
const PANEL_EASE = "ease-[cubic-bezier(0.77,0,0.175,1)]";

// Background, text color, and icon index rotate through these four
// looks — light, pink, purple, dark — same as the reference design.
const CARD_STYLES = [
  { bg: "bg-white-bg", text: "text-black-text", icon: 0 },
  { bg: "bg-pink-accent", text: "text-black-text", icon: 6 },
  { bg: "bg-purple-accent", text: "text-white", icon: 13 },
  { bg: "bg-[#1A1A1A]", text: "text-white", icon: 1 },
];

function PillarCard({
  item,
  index,
  isOpen,
  onToggle,
}: {
  item: ServicePillarCardsItem;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const style = CARD_STYLES[index % CARD_STYLES.length];

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isOpen}
      className={`flex h-full min-h-[320px] flex-col rounded-3xl p-7 text-left transition-colors duration-300 sm:min-h-[360px] sm:p-8 ${style.bg} ${style.text}`}
    >
      <GeometricIcon index={style.icon} className="h-8 w-8" />

      <div className="mt-auto">
        <span className="block text-sm font-medium opacity-60">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="mt-2 text-xl leading-snug font-semibold tracking-tight sm:text-2xl">
          {item.title}
        </h3>

        <div
          className={`grid transition-[grid-template-rows,opacity] duration-700 motion-reduce:transition-none ${PANEL_EASE} ${
            isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div
              className={`mt-4 border-t pt-4 ${
                style.text === "text-white"
                  ? "border-white/20"
                  : "border-black/10"
              }`}
            >
              <p className="text-sm leading-relaxed font-light opacity-80">
                {item.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

export default function ServicePillarCards({
  eyebrow,
  headline,
  intro,
  items,
  closingParagraph,
}: ServicePillarCardsProps) {
  // First card starts open by default, same as ServiceInsights.
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <section className="bg-black-bg px-10 pt-[80px] pb-[80px]">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-16">
        <div>
          <div className="flex items-center gap-2.5">
            <span aria-hidden="true" className="h-2 w-2 shrink-0 bg-white" />
            <p className="text-sm leading-none font-light tracking-wide text-white/70 uppercase">
              {eyebrow}
            </p>
          </div>
          <h2 className="mt-6 text-[32px] leading-[1.15] font-medium tracking-tight text-white sm:text-[40px] md:text-[44px]">
            {headline}
          </h2>
        </div>

        <p className="text-[15px] leading-relaxed font-light text-white/60 md:self-start">
          {intro}
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:items-stretch">
        {items.map((item, i) => (
          <PillarCard
            key={item.title}
            item={item}
            index={i}
            isOpen={openIndex === i}
            onToggle={() => toggleItem(i)}
          />
        ))}
      </div>

      {closingParagraph && (
        <p className="mx-auto mt-12 max-w-4xl text-center text-[15px] leading-relaxed font-light text-white/50">
          {closingParagraph}
        </p>
      )}
    </section>
  );
}
