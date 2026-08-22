import TransitionLink from "./TransitionLink";
import { NAVIGATION } from "../../data/navigation";

export default function Footer() {
  return (
    <footer className="bg-black px-6 pb-8 pt-20 text-white md:px-10 lg:px-12">
      <div className="grid gap-16 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]">
        <div>
          <TransitionLink
            to="/"
            className="text-2xl font-black uppercase tracking-[-0.04em]"
          >
            Technico
          </TransitionLink>

          <p className="mt-6 max-w-md text-sm leading-relaxed text-white/60">
            Strategy, creativity, and technology built to help businesses become
            more visible, memorable, and profitable.
          </p>
        </div>

        <div>
          <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.15em] text-white/40">
            Navigation
          </p>

          <nav className="flex flex-col items-start gap-3">
            {NAVIGATION.map((item) => (
              <TransitionLink
                key={item.path}
                to={item.path}
                className="text-sm transition-colors duration-300 hover:text-[#6D28D9]"
              >
                {item.label}
              </TransitionLink>
            ))}
          </nav>
        </div>

        <div>
          <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.15em] text-white/40">
            Connect
          </p>

          <div className="flex flex-col items-start gap-3 text-sm">
            <a
              href="#"
              className="transition-colors duration-300 hover:text-[#6D28D9]"
            >
              Instagram
            </a>

            <a
              href="#"
              className="transition-colors duration-300 hover:text-[#6D28D9]"
            >
              LinkedIn
            </a>

            <a
              href="mailto:hello@technicosolutionsinc.com"
              className="transition-colors duration-300 hover:text-[#6D28D9]"
            >
              Email
            </a>
          </div>
        </div>
      </div>

      <div className="mt-20 flex flex-col gap-4 border-t border-white/10 pt-6 text-[10px] uppercase tracking-[0.08em] text-white/40 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Technico Solutions Inc.</p>
        <p>All rights reserved.</p>
      </div>
    </footer>
  );
}
