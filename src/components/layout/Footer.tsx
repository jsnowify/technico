import TransitionLink from "./TransitionLink";
import NavLink from "../motion/NavLink";
import {
  NAV_LINKS,
  SITE_EMAIL,
  SITE_EMAIL_HREF,
  SITE_PHONE,
  SITE_PHONE_HREF,
} from "@/lib/constants";

const CONNECT_LINKS = [
  { label: "Instagram", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "Facebook", href: "#" },
  { label: SITE_PHONE, href: SITE_PHONE_HREF },
  { label: SITE_EMAIL, href: SITE_EMAIL_HREF },
] as const;

export default function Footer() {
  return (
    <footer className="bg-[#d9d9d9] text-black">
      {/* WORDMARK */}
      <div className="border-b border-black/10 px-6 pb-10 pt-16 text-center md:px-10 md:pt-20 lg:px-12">
        <TransitionLink
          to="/"
          className="inline-block text-[clamp(3.5rem,11vw,9rem)] font-black uppercase leading-[0.85] tracking-[-0.04em]"
        >
          Technico
        </TransitionLink>
      </div>

      {/* NAVIGATION / DESCRIPTION / CONNECT */}
      <div className="grid gap-10 border-b border-black/10 px-6 py-10 text-center md:px-10 md:py-14 lg:grid-cols-3 lg:gap-6 lg:px-12 lg:text-left">
        <div>
          <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.15em] text-black/45">
            Navigation
          </p>

          <nav className="flex flex-col items-center gap-3 lg:items-start">
            {NAV_LINKS.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                label={item.label.toUpperCase()}
                className="text-sm font-medium hover:text-[var(--color-accent)]"
              />
            ))}
          </nav>
        </div>

        <div className="flex items-center justify-center lg:px-4">
          <p className="max-w-xs text-sm leading-relaxed text-black/60">
            Our expertise lies in leveraging the latest technology to assist you
            in scaling your businesses, whether through generating more
            appointments or driving increased sales.
          </p>
        </div>

        <div>
          <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.15em] text-black/45 lg:text-right">
            Connect
          </p>

          <div className="flex flex-col items-center gap-3 lg:items-end">
            {CONNECT_LINKS.map((item) => (
              <NavLink
                key={item.label}
                href={item.href}
                label={item.label.toUpperCase()}
                className="text-sm font-medium hover:text-[var(--color-accent)]"
              />
            ))}
          </div>
        </div>
      </div>

      {/* LEGAL */}
      <div className="flex flex-col gap-4 px-6 py-6 font-mono text-[10px] uppercase tracking-[0.08em] text-black/40 sm:flex-row sm:items-center sm:justify-between md:px-10 lg:px-12">
        <p>© {new Date().getFullYear()} Technico Solutions Inc.</p>
        <p>All rights reserved.</p>
      </div>
    </footer>
  );
}
