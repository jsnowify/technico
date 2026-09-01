import { NAV_LINKS as SITE_NAV_LINKS } from "@/lib/constants";

/**
 * Header-specific nav list, derived from the single source of truth
 * in lib/constants.ts rather than hardcoding hrefs a second time.
 *
 *  - "Home" is dropped: Header already links home via <Logo>, so it
 *    doesn't belong in the horizontal nav row.
 *  - Labels are upper-cased to match the header's visual design
 *    ("SERVICES", "ABOUT", ...), with "Contact" specifically
 *    relabeled "CONTACT US" to match the original header copy.
 *  - `hasDropdown` is Header-only UI state (drives the Services
 *    mega-menu) and doesn't exist in the shared list, so it's added
 *    here based on href.
 */
export const NAV_LINKS = SITE_NAV_LINKS.filter((link) => link.href !== "/").map(
  (link) => ({
    href: link.href,
    label: link.label === "Contact" ? "CONTACT US" : link.label.toUpperCase(),
    hasDropdown: link.href === "/services",
  }),
);

export const SCROLL_ENTER_THRESHOLD = 80;

// A separate, lower threshold for reversing the pill morph. With a
// single shared threshold, hovering the scroll position right at
// SCROLL_ENTER_THRESHOLD (easy to do with inertial/trackpad
// scrolling) flickers the header in and out of its pill shape on
// every tiny wobble. Scrolling back up now has to clear more room
// before un-pilling, so the morph reads as one decisive shape change
// in each direction instead of a jittery one at the boundary.
export const SCROLL_LEAVE_THRESHOLD = 40;

/**
 * Timing for the header's shape morph (TOP_STATE <-> PILL_STATE <->
 * FOCUS_STATE), pulled out as named constants rather than scattered
 * inline magic numbers so the whole morph's pacing lives in one
 * place. GLASS_FADE_DELAY + GLASS_FADE_DURATION deliberately sum to
 * MORPH_DURATION so the glass background finishes fading in/out at
 * the exact instant the shape tween lands, instead of visibly
 * trailing or finishing early.
 */
export const MORPH_DURATION = 0.6;
export const MORPH_EASE = "power4.out";
export const GLASS_FADE_DELAY = 0.05;
export const GLASS_FADE_DURATION = MORPH_DURATION - GLASS_FADE_DELAY;

export const TOP_STATE = {
  maxWidth: 1280,
  marginTop: 0,
  marginLeft: 0,
  marginRight: 0,
  paddingLeft: 24,
  paddingRight: 24,
  borderRadius: 0,
  height: 80,
};

export const PILL_STATE = {
  maxWidth: 760,
  marginTop: 16,
  // Side inset so the pill actually floats off the screen edges on
  // narrow viewports instead of stretching full-bleed (it has no
  // max-width headroom to shrink into below ~760px wide, so without
  // this it just reads as a squashed full-width bar).
  marginLeft: 16,
  marginRight: 16,
  paddingLeft: 28,
  paddingRight: 28,
  borderRadius: 5,
  height: 60,
};

/**
 * THIRD HEADER STATE — "focus" mode.
 *
 * Same floating-pill geometry as PILL_STATE (marginTop/marginLeft/
 * marginRight/borderRadius/height all match), but shrunk down to a
 * small badge that hugs just the logo mark. Nav links, the CTA
 * button, and the mobile burger all fade out (autoAlpha, see
 * Header/index.tsx) at the same time this width tween runs, so the
 * shrinking wrapper reads as the header "collapsing down" to the
 * logo rather than clipping visible content.
 *
 * Driven by the "services:focus" / "services:unfocus" window events
 * dispatched from Services.tsx's own pin ScrollTrigger — see that
 * file for why a DOM event (rather than prop-drilling or context)
 * is the connection between the two.
 */
export const FOCUS_STATE = {
  maxWidth: 120,
  marginTop: 16,
  marginLeft: 16,
  marginRight: 16,
  paddingLeft: 20,
  paddingRight: 20,
  borderRadius: 5,
  height: 60,
};

export const SERVICES_FOCUS_EVENT = "services:focus";
export const SERVICES_UNFOCUS_EVENT = "services:unfocus";

export const DROPDOWN_RADIUS = 20;

export const BRACKET_IDLE_OFFSET = 5;
export const BRACKET_HOVER_OFFSET = 8;
