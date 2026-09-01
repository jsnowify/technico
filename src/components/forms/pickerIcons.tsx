/**
 * Minimal inline icons for the custom pickers. Plain stroked SVGs
 * rather than an icon package — nothing else in this codebase pulls
 * one in (see the gsap-only import audit), so a handful of ~10-line
 * paths costs less than a new dependency.
 */

export function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M5 7.5L10 12.5L15 7.5" />
    </svg>
  );
}

export function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="4.5" width="14" height="12" rx="2" />
      <path d="M3 8.5H17" />
      <path d="M6.5 2.5V5.5" />
      <path d="M13.5 2.5V5.5" />
    </svg>
  );
}

export function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="7" />
      <path d="M10 6V10L12.5 12" />
    </svg>
  );
}

export function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="7" />
      <path d="M3 10H17" />
      <path d="M10 3C11.75 5 12.5 7.4 12.5 10C12.5 12.6 11.75 15 10 17C8.25 15 7.5 12.6 7.5 10C7.5 7.4 8.25 5 10 3Z" />
    </svg>
  );
}

export function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="9" cy="9" r="6" />
      <path d="M13.5 13.5L17.5 17.5" />
    </svg>
  );
}

export function TagIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M10.5 3H16.5C17.0523 3 17.5 3.44772 17.5 4V10L9.20711 18.2929C8.81658 18.6834 8.18342 18.6834 7.79289 18.2929L2.70711 13.2071C2.31658 12.8166 2.31658 12.1834 2.70711 11.7929L10.5 3Z" />
      <circle cx="13.5" cy="7" r="1.25" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 10.5L8 14.5L16 6" />
    </svg>
  );
}
