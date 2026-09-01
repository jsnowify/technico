/**
 * Single source of truth for the contact form's field chrome. This
 * used to be defined inline in ContactForm.tsx; it's pulled out here
 * so DatePicker/TimeSlotPicker/TimezonePicker can reuse the exact
 * same box, label, and focus-ring styling instead of approximating
 * it — a custom trigger button that's even slightly off from the
 * text/select inputs next to it reads as a bug, not a design choice.
 *
 * Dark theme: the whole contact form sits on `bg-black-bg`, so every
 * box here is a soft white-tinted fill (`bg-white/5`) with a hairline
 * white border rather than a filled white input — that's what keeps
 * fields readable as "boxes" without turning the section into a grid
 * of bright rectangles. Purple-secondary stays the one accent color,
 * used only for focus rings and selected/active states, so it reads
 * as *the* highlight rather than competing with anything else.
 */

export const FIELD_CLASSES =
  "mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3.5 text-white-text placeholder:text-white/30 transition-colors focus-visible:border-purple-accent/50 focus-visible:bg-white/[0.07] focus-visible:outline focus-visible:outline-2 focus-visible:outline-purple-accent";

/** Same box as FIELD_CLASSES, styled as a clickable trigger (button) instead of a text input. */
export const FIELD_TRIGGER_CLASSES = `${FIELD_CLASSES} flex items-center justify-between gap-2 text-left`;

/**
 * `<select>` needs its own variant: `appearance-none` strips the
 * browser's native arrow (which can't be recolored for a dark field
 * and looks broken sitting in one) and `pr-10` reserves room for the
 * custom ChevronDownIcon the field renders on top of it instead —
 * same visual language as DatePicker/TimezonePicker's trigger arrow.
 */
export const SELECT_CLASSES = `${FIELD_CLASSES} appearance-none pr-10`;

export const LABEL_CLASSES = "block text-sm font-medium text-white-text/80";

export const FIELDSET_CLASSES = "m-0 min-w-0 border-0 p-0";

export const GROUP_LABEL_CLASSES =
  "mb-8 block w-full p-0 font-mono text-xs tracking-[0.2em] text-purple-accent/70 uppercase";

/** Dropdown/panel shell shared by every custom picker. */
export const POPOVER_PANEL_CLASSES =
  "absolute z-30 mt-2 w-full overflow-hidden rounded-lg border border-white/10 bg-[#0a0a12]/98 shadow-[0_20px_45px_rgba(0,0,0,0.5)] backdrop-blur-sm";

export const OPTION_LIST_CLASSES = "max-h-64 overflow-y-auto py-1.5";

export const OPTION_BASE_CLASSES =
  "flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-2.5 text-left text-sm text-white-text transition-colors";

export const OPTION_INACTIVE_CLASSES = "hover:bg-purple-accent/10";

export const OPTION_ACTIVE_CLASSES = "bg-purple-accent/10";

export const OPTION_SELECTED_CLASSES = "bg-purple-secondary text-white";

/**
 * Chip/tag toggle — the one selection pattern used everywhere a
 * visitor picks from a short list of options (Time slots, and now
 * Services). Centralized here so both stay visually identical
 * instead of drifting into two different "selected" looks. Uses the
 * same 5px radius as the Submit button (`rounded-[5px]`) rather than
 * a fully-rounded pill.
 */
export const CHIP_BASE_CLASSES =
  "rounded-[5px] border px-4 py-2.5 text-sm font-medium text-center transition-colors";

/**
 * Services uses the same colors/states and radius as CHIP_* but
 * left-aligned text instead of centered. Service titles run long
 * ("SEO (Search Engine Optimization)", "Creative Design & Content
 * Services") and wrap to two lines on narrow screens — centered text
 * looks fine on one line but uneven once a second line appears.
 */
export const TAG_BASE_CLASSES =
  "rounded-[5px] border px-4 py-2.5 text-sm font-medium text-left leading-snug transition-colors";

export const CHIP_INACTIVE_CLASSES =
  "border-white/10 text-white-text/70 hover:border-purple-accent/40 hover:text-white";

export const CHIP_ACTIVE_CLASSES =
  "border-purple-secondary bg-purple-secondary text-white";
