import { useRef } from "react";
import { usePageEnter } from "../../hooks/usePageEnter";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import RevealText from "../../components/motion/TextReveal";

export default function Blog() {
  const containerRef = useRef<HTMLDivElement>(null);
  useDocumentTitle("Blog");
  usePageEnter(containerRef);

  return (
    <section
      ref={containerRef}
      className="min-h-screen bg-black px-6 pb-32 pt-40 text-white md:px-10 lg:px-12"
    >
      <div className="mx-auto max-w-7xl">
        <RevealText
          as="p"
          className="font-mono text-xs uppercase tracking-[0.2em] text-[#6D28D9]"
        >
          02 / Insights
        </RevealText>

        <RevealText
          as="h1"
          className="mt-8 max-w-5xl text-6xl font-bold uppercase leading-[0.85] tracking-[-0.05em] md:text-8xl lg:text-[10rem]"
          lines={["Ideas", "worth", "sharing."]}
        />

        <div
          data-reveal-stagger
          className="mt-20 border-t border-white/20 pt-8"
        >
          <p className="text-lg text-white/60">
            Strategy, marketing, technology, and growth insights.
          </p>
        </div>
      </div>
    </section>
  );
}
