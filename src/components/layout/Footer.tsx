import TransitionLink from "./TransitionLink";
import NavLink from "../motion/NavLink";
import {
  NAV_LINKS,
  SITE_EMAIL,
  SITE_EMAIL_HREF,
  SITE_PHONE,
  SITE_PHONE_HREF,
  SOCIAL_LINKS,
} from "@/lib/constants";

const CONNECT_LINKS = [
  // No Instagram URL has been supplied. Keep the label, but don't publish
  // a fake '#' link until the client confirms the actual account.
  { label: "Instagram", href: null },
  { label: "LinkedIn", href: SOCIAL_LINKS.linkedin },
  { label: "Facebook", href: SOCIAL_LINKS.facebook },
  { label: SITE_PHONE, href: SITE_PHONE_HREF },
  { label: SITE_EMAIL, href: SITE_EMAIL_HREF },
] as const;

export default function Footer() {
  return (
    <footer className="static min-h-[100svh] overflow-hidden bg-[#d9d9d9] text-black lg:sticky lg:bottom-0 lg:z-0 lg:h-[100svh]">
      <div className="container-x mx-auto flex min-h-[100svh] w-full max-w-[1920px] flex-col pt-[clamp(80px,9svh,108px)] pb-4 sm:pb-5 lg:h-[100svh]">
        <div className="grid grid-cols-2 gap-x-4 border-b border-black/20 pb-4 font-mono text-[9px] tracking-[0.05em] text-black/55 uppercase sm:grid-cols-3 sm:text-xs">
          <span>TECHNICO_</span>
          <span className="hidden text-center sm:block">DIGITAL SOLUTIONS</span>
          <span className="text-right">FOOTER / 00</span>
        </div>

        <div className="grid flex-1 grid-cols-1 content-center gap-4 py-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-6 sm:py-7 lg:grid-cols-[minmax(0,0.8fr)_minmax(280px,1.2fr)_minmax(0,0.8fr)] lg:items-center lg:gap-8">
          <div className="min-w-0 border-t border-black/15 pt-3 sm:order-1 lg:order-none lg:border-t-0 lg:pt-0">
            <p className="mb-3 font-mono text-[10px] tracking-[0.12em] text-black/45 uppercase">
              Navigation
            </p>
            <nav
              className="flex flex-col items-start gap-1.5 sm:gap-2.5"
              aria-label="Footer navigation"
            >
              {NAV_LINKS.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  label={item.label.toUpperCase()}
                  className="text-xs font-medium hover:text-[var(--color-accent-dark)] sm:text-sm"
                />
              ))}
            </nav>
          </div>

          <div className="min-w-0 border-y border-black/15 py-4 sm:order-3 sm:col-span-2 sm:py-6 lg:order-none lg:col-span-1 lg:border-x lg:border-y-0 lg:px-8 lg:py-10">
            <p className="mx-auto max-w-[42ch] text-xs leading-[1.6] text-black/65 sm:text-sm sm:leading-[1.65] lg:mx-0 lg:text-base">
              Our expertise lies in leveraging the latest technology to assist
              you in scaling your businesses, whether through generating more
              appointments or driving increased sales.
            </p>
          </div>

          <div className="min-w-0 sm:order-2 lg:text-right">
            <p className="mb-3 font-mono text-[10px] tracking-[0.12em] text-black/45 uppercase">
              Connect
            </p>
            <div className="flex flex-col items-start gap-1.5 sm:gap-2.5 lg:items-end">
              {CONNECT_LINKS.map((item) =>
                item.href ? (
                  <NavLink
                    key={item.label}
                    href={item.href}
                    label={item.label.toUpperCase()}
                    className="max-w-full text-xs font-medium break-all hover:text-[var(--color-accent-dark)] sm:text-sm"
                  />
                ) : (
                  <span
                    key={item.label}
                    className="max-w-full text-xs font-medium break-all text-black/50 sm:text-sm"
                  >
                    {item.label.toUpperCase()}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 border-t border-black/20 py-3 font-mono text-[9px] tracking-[0.06em] text-black/45 uppercase sm:flex-row sm:items-center sm:justify-between sm:gap-2 sm:text-[10px]">
          <p>© {new Date().getFullYear()} Technico Solutions Inc.</p>
          <p>All rights reserved.</p>
        </div>

        <TransitionLink
          to="/"
          aria-label="Technico home"
          className="block border-t border-black/20 pt-4 text-[clamp(3.5rem,13vw,14rem)] leading-[0.92] font-black tracking-[-0.095em] uppercase focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-black"
        >
          Technico
        </TransitionLink>
      </div>
    </footer>
  );
}
