import { useRef } from "react";
import { usePageEnter } from "../../hooks/usePageEnter";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import RevealText from "../../components/motion/TextReveal";
import BookingForm from "../../sections/Contact/BookingForm";
import ReactiveGrid from "../../components/effects/ReactiveGrid";

export default function Contact() {
  const containerRef = useRef<HTMLDivElement>(null);
  useDocumentTitle("Contact");
  usePageEnter(containerRef);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen bg-black px-6 pb-32 pt-40 text-white md:px-10 lg:px-12"
    >
      {/* Ambient background, same live grid every other numbered
          section on the site uses. Clipping lives on this inner
          wrapper (not the <section> itself) — BookingForm's calendar
          panel is `lg:sticky`, and an `overflow-hidden` ancestor
          breaks sticky positioning. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        <ReactiveGrid className="z-0 text-white" opacity={0.1} shipCount={1} />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <RevealText
          as="p"
          className="font-mono text-xs uppercase tracking-[0.2em] text-[#6D28D9]"
        >
          04 / Contact
        </RevealText>

        <RevealText
          as="h1"
          className="mt-8 max-w-6xl text-6xl font-bold uppercase leading-[0.85] tracking-[-0.05em] md:text-8xl lg:text-[10rem]"
          lines={["Let's", "build", "something."]}
        />

        <div data-reveal-stagger>
          <p className="mt-8 max-w-lg text-lg text-white/60">
            Pick a time that works and tell us a bit about the project — we'll
            take it from there.
          </p>
        </div>

        <BookingForm />
      </div>
    </section>
  );
}
