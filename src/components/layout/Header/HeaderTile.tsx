"use client";

import Link from "next/link";
import ScrambleText from "@/components/motion/ScrambleText";
import HorizontalStagger from "./HorizontalStagger";
import HeaderDrop from "./HeaderDrop";
import styles from "./Header.module.css";

type HeaderTileProps = {
  label: string;
  href: string;
  info?: string;
  hasDropdown?: boolean;
  active: boolean;
  onActiveChange: (active: boolean) => void;
  onNavigate: () => void;
};

/** A sharp editorial tile shared by every desktop navigation item. */
export default function HeaderTile({
  label,
  href,
  info,
  hasDropdown = false,
  active,
  onActiveChange,
  onNavigate,
}: HeaderTileProps) {
  return (
    <div
      className={`group relative shrink-0 ${
        hasDropdown ? "w-[126px] xl:w-[136px]" : "w-[92px] xl:w-[106px]"
      }`}
      onPointerEnter={() => onActiveChange(true)}
      onPointerLeave={() => onActiveChange(false)}
      onFocusCapture={() => onActiveChange(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          onActiveChange(false);
        }
      }}
    >
      <div className={styles.tileClip}>
        <Link
          href={href}
          onClick={onNavigate}
          data-dropped={hasDropdown && active}
          aria-expanded={hasDropdown ? active : undefined}
          aria-controls={hasDropdown ? "desktop-services-panel" : undefined}
          className={`${styles.tileTravel} relative isolate flex h-12 w-full items-center justify-center overflow-hidden bg-[var(--header-paper)] px-3 font-mono text-[14px] font-bold uppercase tracking-[-0.045em] text-[#121212] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-purple-secondary`}
        >
          <HorizontalStagger
            active={active}
            className="bg-[var(--header-accent)]"
            rows={6}
          />
          <span className="relative z-10 block whitespace-nowrap">
            {label}
            {hasDropdown ? " +" : ""}
          </span>
        </Link>
      </div>

      {info && (
        <HeaderDrop open={active} className="absolute inset-x-0 top-full">
          <p className="min-h-12 px-3 pb-4 pt-3 font-mono text-[12px] leading-tight uppercase tracking-[-0.045em] text-[#222]">
            {"// "}
            {active ? <ScrambleText text={info} trigger="mount" /> : info}
          </p>
        </HeaderDrop>
      )}
    </div>
  );
}
