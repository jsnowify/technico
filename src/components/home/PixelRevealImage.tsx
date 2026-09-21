"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

interface PixelRevealImageProps {
  src: string;
  alt: string;
  sizes: string;
  fit?: "cover" | "contain";
  canvasClassName?: string;
  revealId?: string;
  /** Preload only a true above-the-fold/LCP image. */
  priority?: boolean;
}

type PixelRevealWindow = Window & {
  __technicoPixelRevealSeen?: Set<string>;
};

/** Stored in memory: survives client navigation, resets on full refresh. */
function getRevealRegistry(): Set<string> {
  const browserWindow = window as PixelRevealWindow;
  browserWindow.__technicoPixelRevealSeen ??= new Set<string>();
  return browserWindow.__technicoPixelRevealSeen;
}

/**
 * Draws the actual source image into a low-resolution canvas, then increases
 * that canvas resolution until it resolves into the clear Next.js image below.
 */
export default function PixelRevealImage({
  src,
  alt,
  sizes,
  fit = "cover",
  canvasClassName = "bg-black-bg",
  revealId,
  priority = false,
}: PixelRevealImageProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    const source = imageRef.current;
    if (!wrapper || !canvas || !source) return;

    const revealRegistry = getRevealRegistry();
    const revealKey = `${revealId ?? src}:${fit}`;
    if (revealRegistry.has(revealKey)) {
      canvas.style.display = "none";
      return;
    }

    if (prefersReducedMotion) {
      revealRegistry.add(revealKey);
      canvas.style.display = "none";
      return;
    }

    const buffer = document.createElement("canvas");
    const mobile = window.matchMedia(
      "(max-width: 767px), (pointer: coarse)",
    ).matches;
    const animation = { pixelSize: 30 };
    let lastDraw = 0;
    let lastColumns = -1;
    let lastRows = -1;
    let revealTween: gsap.core.Tween | null = null;
    let fadeTween: gsap.core.Tween | null = null;
    let observer: IntersectionObserver | null = null;
    let revealed = false;

    const draw = () => {
      if (!source.naturalWidth || !source.naturalHeight || revealed) return;

      const rect = wrapper.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const maxPixels = mobile ? 450_000 : 1_000_000;
      const dpr = Math.min(
        window.devicePixelRatio || 1,
        mobile ? 1 : 1.5,
        Math.sqrt(maxPixels / (rect.width * rect.height)),
      );
      const outputWidth = Math.max(1, Math.round(rect.width * dpr));
      const outputHeight = Math.max(1, Math.round(rect.height * dpr));
      const outputResized =
        canvas.width !== outputWidth || canvas.height !== outputHeight;
      if (outputResized) {
        canvas.width = outputWidth;
        canvas.height = outputHeight;
      }

      const columns = Math.max(1, Math.ceil(rect.width / animation.pixelSize));
      const rows = Math.max(1, Math.ceil(rect.height / animation.pixelSize));
      if (!outputResized && columns === lastColumns && rows === lastRows)
        return;
      lastColumns = columns;
      lastRows = rows;
      if (buffer.width !== columns) buffer.width = columns;
      if (buffer.height !== rows) buffer.height = rows;

      const bufferContext = buffer.getContext("2d");
      const context = canvas.getContext("2d");
      if (!bufferContext || !context) return;

      bufferContext.clearRect(0, 0, columns, rows);
      bufferContext.imageSmoothingEnabled = true;

      const sourceRatio = source.naturalWidth / source.naturalHeight;
      const frameRatio = rect.width / rect.height;

      if (fit === "contain") {
        // Preserve the entire transparent service icon and center it exactly
        // where object-contain places the clear Next.js image underneath.
        let drawWidth = columns;
        let drawHeight = rows;

        if (sourceRatio > frameRatio) drawHeight = columns / sourceRatio;
        else drawWidth = rows * sourceRatio;

        bufferContext.drawImage(
          source,
          0,
          0,
          source.naturalWidth,
          source.naturalHeight,
          (columns - drawWidth) / 2,
          (rows - drawHeight) / 2,
          drawWidth,
          drawHeight,
        );
      } else {
        let sourceX = 0;
        let sourceY = 0;
        let sourceWidth = source.naturalWidth;
        let sourceHeight = source.naturalHeight;

        // Match object-cover exactly so the pixel canvas and clear image align.
        if (sourceRatio > frameRatio) {
          sourceWidth = source.naturalHeight * frameRatio;
          sourceX = (source.naturalWidth - sourceWidth) / 2;
        } else {
          sourceHeight = source.naturalWidth / frameRatio;
          sourceY = (source.naturalHeight - sourceHeight) / 2;
        }

        bufferContext.drawImage(
          source,
          sourceX,
          sourceY,
          sourceWidth,
          sourceHeight,
          0,
          0,
          columns,
          rows,
        );
      }

      context.clearRect(0, 0, outputWidth, outputHeight);
      context.imageSmoothingEnabled = false;
      context.drawImage(
        buffer,
        0,
        0,
        columns,
        rows,
        0,
        0,
        outputWidth,
        outputHeight,
      );
    };

    const startReveal = () => {
      if (revealTween || revealed) return;
      observer?.disconnect();
      // Remember this reveal across client navigation. A browser refresh
      // recreates window and therefore starts with a fresh registry.
      revealRegistry.add(revealKey);
      draw();

      revealTween = gsap.to(animation, {
        pixelSize: 3,
        duration: 0.65,
        ease: "power3.inOut",
        snap: { pixelSize: 1 },
        onUpdate: () => {
          const now = performance.now();
          if (now - lastDraw < (mobile ? 40 : 30)) return;
          lastDraw = now;
          draw();
        },
        onComplete: () => {
          fadeTween = gsap.to(canvas, {
            opacity: 0,
            duration: 0.16,
            ease: "power1.out",
            onComplete: () => {
              revealed = true;
              canvas.style.display = "none";
              resizeObserver.disconnect();
            },
          });
        },
      });
    };

    const resizeObserver = new ResizeObserver(draw);
    resizeObserver.observe(wrapper);

    const handleImageLoad = () => {
      draw();
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) startReveal();
        },
        { threshold: 0.25, rootMargin: "0px 0px -8% 0px" },
      );
      observer.observe(wrapper);
    };

    if (source.complete && source.naturalWidth) handleImageLoad();
    else source.addEventListener("load", handleImageLoad, { once: true });

    return () => {
      source.removeEventListener("load", handleImageLoad);
      observer?.disconnect();
      resizeObserver.disconnect();
      revealTween?.kill();
      fadeTween?.kill();
    };
  }, [fit, revealId, src]);

  return (
    <div ref={wrapperRef} className="absolute inset-0">
      <Image
        ref={imageRef}
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={fit === "contain" ? "object-contain" : "object-cover"}
      />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={`technico-pixel-canvas pointer-events-none absolute inset-0 h-full w-full ${canvasClassName}`}
      />
    </div>
  );
}
