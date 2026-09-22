"use client";

interface MobileMenuButtonProps {
  open: boolean;
  onClick: () => void;
}

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
      aria-controls="mobile-header-menu"
      className="group relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden transition-transform duration-150 ease-out active:scale-90 focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-black"
    >
      <span
        className={`absolute h-px w-6 bg-current transition-transform duration-[420ms] [transition-timing-function:cubic-bezier(.34,1.56,.64,1)] motion-reduce:transition-none ${
          open ? "translate-y-0 rotate-45" : "-translate-y-[6px] rotate-0"
        }`}
      />
      <span
        className={`absolute h-px w-6 bg-current transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none ${
          open ? "scale-x-0 opacity-0" : "scale-x-100 opacity-100"
        }`}
      />
      <span
        className={`absolute h-px w-6 bg-current transition-transform duration-[420ms] [transition-timing-function:cubic-bezier(.34,1.56,.64,1)] motion-reduce:transition-none ${
          open ? "translate-y-0 -rotate-45" : "translate-y-[6px] rotate-0"
        }`}
      />
    </button>
  );
}
