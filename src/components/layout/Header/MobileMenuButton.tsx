"use client";

interface MobileMenuButtonProps {
  open: boolean;
  onClick: () => void;
}

/**
 * Hamburger / close toggle for the mobile nav.
 * Two bars that morph into an X, matching the rotate/transition
 * treatment already used for the services chevron in MobileNav.tsx.
 * Color is inherited (`currentColor`) so it follows the parent's
 * text-black / text-white swap in Header/index.tsx.
 */
export default function MobileMenuButton({
  open,
  onClick,
}: MobileMenuButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      className="relative flex h-10 w-10 shrink-0 items-center justify-center"
    >
      <span
        className={`absolute h-px w-6 bg-current transition-transform duration-500 ease-[cubic-bezier(0.77,0,0.175,1)] ${
          open ? "translate-y-0 rotate-45" : "-translate-y-[3px] rotate-0"
        }`}
      />
      <span
        className={`absolute h-px w-6 bg-current transition-transform duration-500 ease-[cubic-bezier(0.77,0,0.175,1)] ${
          open ? "translate-y-0 -rotate-45" : "translate-y-[3px] rotate-0"
        }`}
      />
    </button>
  );
}
