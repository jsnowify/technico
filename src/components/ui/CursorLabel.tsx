import { forwardRef, type ReactNode } from "react";

interface CursorLabelProps {
  children: ReactNode;
  className?: string;
}

/** Shared cursor-follow label for GlobalCursor, Feedback, and TrustedBy. */
const CursorLabel = forwardRef<HTMLSpanElement, CursorLabelProps>(
  function CursorLabel({ children, className = "" }, ref) {
    return (
      <span
        ref={ref}
        data-cursor-ui
        aria-hidden="true"
        className={`pointer-events-none flex min-h-12 min-w-24 items-center justify-start gap-3 border border-black-bg/25 bg-accent px-3.5 py-2.5 font-mono text-[10px] font-medium tracking-[0.035em] text-black-bg uppercase shadow-[4px_4px_0_rgba(0,0,0,0.22)] ${className}`}
      >
        <span className="text-[12px] leading-none">+</span>
        <span className="whitespace-nowrap">{children}</span>
      </span>
    );
  },
);

export default CursorLabel;
