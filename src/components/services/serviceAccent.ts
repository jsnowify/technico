export type ServiceAccent = "pink" | "purple";

/** Shared accent utilities. Legacy pink names resolve to the light violet token. */
export const SERVICE_ACCENT: Record<
  ServiceAccent,
  {
    /** Hairline rule beside an eyebrow, and any 1px accent divider. */
    rule: string;
    /** Filled square icon tile — pair with `text-black-bg`. */
    fill: string;
    /** Text color for mono indices and the `+` registration marks. */
    text: string;
    /** Button variant that matches the accent. */
    button: "purple-fill" | "pink-fill";
  }
> = {
  purple: {
    rule: "bg-purple-accent",
    fill: "bg-purple-accent",
    text: "text-purple-accent",
    button: "purple-fill",
  },
  pink: {
    rule: "bg-pink-accent",
    fill: "bg-pink-accent",
    text: "text-pink-accent",
    button: "pink-fill",
  },
};

/** Shared easing for every service-section transition. */
export const SERVICE_EASE = "ease-[cubic-bezier(0.22,0.8,0.22,1)]";
