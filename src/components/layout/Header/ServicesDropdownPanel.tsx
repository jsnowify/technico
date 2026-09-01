"use client";

import type { RefObject } from "react";
import Link from "next/link";
import type { Service } from "@/lib/content/types";
import { DROPDOWN_RADIUS } from "./header.config";

interface ServicesDropdownPanelProps {
  panelRef: RefObject<HTMLDivElement | null>;
  services: Service[];
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}

export default function ServicesDropdownPanel({
  panelRef,
  services,
  onPointerEnter,
  onPointerLeave,
}: ServicesDropdownPanelProps) {
  return (
    <div
      ref={panelRef}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      className="invisible fixed z-[200] w-[min(92vw,720px)] -translate-x-1/2 overflow-hidden opacity-0"
      style={{
        borderRadius: DROPDOWN_RADIUS,
        transformOrigin: "top center",
        transform: "scale(0.98, 0.92)",
        willChange: "transform, opacity",
        background:
          "linear-gradient(135deg, rgba(255, 255, 255, 0.68) 0%, rgba(255, 255, 255, 0.5) 45%, rgba(255, 255, 255, 0.62) 100%)",
        backdropFilter: "blur(30px) saturate(190%) brightness(1.05)",
        WebkitBackdropFilter: "blur(30px) saturate(190%) brightness(1.05)",
        border: "1px solid rgba(255, 255, 255, 0.4)",
        boxShadow:
          "0 20px 45px rgba(0, 0, 0, 0.16), inset 0 1px 1px rgba(255, 255, 255, 0.7), inset 0 -1px 1px rgba(0, 0, 0, 0.04)",
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-1/2 opacity-60"
        style={{
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.4), rgba(255,255,255,0))",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-14 -right-8 h-36 w-52 rounded-full opacity-35"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 70%)",
        }}
      />

      <div className="relative z-10 divide-y divide-black/10 p-8">
        {services.map((service, index) => (
          <div
            key={service.slug}
            className="grid grid-cols-[180px_1fr] gap-8 py-6 first:pt-0 last:pb-0"
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-black/40">
              {`S${String(index + 1).padStart(2, "0")}`}
            </span>

            <Link
              href={`/services/${service.slug}`}
              data-cursor="highlight"
              className="flex flex-col gap-1"
            >
              <span className="text-sm font-medium text-black/85 transition-colors hover:text-black">
                {service.title}
              </span>
              <span className="text-xs text-black/45">
                {service.shortDescription}
              </span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
