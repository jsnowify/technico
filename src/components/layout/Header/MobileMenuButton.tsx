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
      className="group relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-black"
    >
      <span
        className={`absolute h-px w-6 bg-current transition-[transform,width] duration-500 [transition-timing-function:cubic-bezier(.22,.8,.22,1)] motion-reduce:transition-none ${
          open
            ? "translate-y-0 rotate-45"
            : "-translate-y-[6px] rotate-0"
        }`}
      />
      <span
        className={`absolute h-px bg-current transition-[transform,opacity,width] duration-300 [transition-timing-function:cubic-bezier(.22,.8,.22,1)] motion-reduce:transition-none ${
          open ? "w-0 translate-x-3 opacity-0" : "w-6 translate-x-0 opacity-100"
        }`}
      />
      <span
        className={`absolute h-px w-6 bg-current transition-[transform,width] duration-500 [transition-timing-function:cubic-bezier(.22,.8,.22,1)] motion-reduce:transition-none ${
          open
            ? "translate-y-0 -rotate-45"
            : "translate-y-[6px] rotate-0"
        }`}
      />
    </button>
  );
}
