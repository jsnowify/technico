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
      className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden"
    >
      <span
        className={`absolute h-px bg-current transition-[width,transform] duration-700 [transition-timing-function:cubic-bezier(.16,1,.3,1)] ${
          open
            ? "w-5 translate-x-1 -translate-y-[5px]"
            : "w-6 translate-x-0 -translate-y-[5px]"
        }`}
      />
      <span
        className={`absolute h-px bg-current transition-[width,transform] delay-75 duration-700 [transition-timing-function:cubic-bezier(.16,1,.3,1)] ${
          open ? "w-4 -translate-x-1" : "w-6 translate-x-0"
        }`}
      />
      <span
        className={`absolute h-px bg-current transition-[width,transform] delay-150 duration-700 [transition-timing-function:cubic-bezier(.16,1,.3,1)] ${
          open
            ? "w-5 translate-x-1 translate-y-[5px]"
            : "w-6 translate-x-0 translate-y-[5px]"
        }`}
      />
    </button>
  );
}
