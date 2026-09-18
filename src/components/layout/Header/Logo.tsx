"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import HorizontalStagger from "./HorizontalStagger";

interface LogoProps {
  scrolled: boolean;
  siteName: string;
}

const LOGO_WHITE = "/technico-digitals-solutions-inc-logo-white.svg";
const LOGO_BLACK = "/technico-digitals-solutions-inc-logo-black.svg";

export default function Logo({ scrolled, siteName }: LogoProps) {
  const [active, setActive] = useState(false);
  const useDarkArtwork = scrolled && !active;

  return (
    <Link
      href="/"
      aria-label={siteName}
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      className="relative z-10 -mx-2 flex items-center gap-2 overflow-hidden px-2 py-1.5 sm:gap-3"
    >
      <HorizontalStagger active={active} />

      <span className="relative z-10 block h-9 w-9 shrink-0 sm:h-10 sm:w-10 lg:h-12 lg:w-12">
        <Image
          src={LOGO_WHITE}
          alt=""
          aria-hidden="true"
          fill
          sizes="48px"
          className={`object-contain transition-opacity duration-300 ${
            useDarkArtwork ? "opacity-0" : "opacity-100"
          }`}
        />
        <Image
          src={LOGO_BLACK}
          alt=""
          aria-hidden="true"
          fill
          sizes="48px"
          className={`object-contain transition-opacity duration-300 ${
            useDarkArtwork ? "opacity-100" : "opacity-0"
          }`}
        />
      </span>

      <span
        className={`relative z-10 hidden font-mono text-xs font-semibold tracking-[0.1em] uppercase transition-colors duration-300 sm:inline-block sm:text-sm sm:tracking-[0.14em] ${
          useDarkArtwork ? "text-black" : "text-white"
        }`}
      >
        TCHNIC_
      </span>
    </Link>
  );
}
