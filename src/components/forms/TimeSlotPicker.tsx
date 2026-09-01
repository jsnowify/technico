"use client";

import {
  CHIP_ACTIVE_CLASSES,
  CHIP_BASE_CLASSES,
  CHIP_INACTIVE_CLASSES,
} from "@/components/forms/fieldStyles";

export interface ListOption {
  value: string;
  label: string;
}

interface TimeSlotPickerProps {
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: ListOption[];
}

/**
 * Every time slot shown as its own pill, one tap to pick — not
 * hidden behind a dropdown/select the visitor has to open first.
 * Same single-choice behaviour as before (and the same hidden input
 * for the server action), just no popover: this list is short and
 * fixed, so there's nothing a dropdown buys here that a visible row
 * of options doesn't.
 *
 * Laid out as a fixed-column grid (3 cols on mobile, 4 from `sm` up)
 * rather than `flex flex-wrap`. Flex-wrap sized each pill to its own
 * label, so rows filled unevenly (e.g. 4 pills, then 5, then 2) and
 * nothing lined up column to column. The grid gives every slot an
 * equal-width cell — `w-full` on the button fills it — so slots align
 * into clean, even rows regardless of label length or how the last
 * row fills.
 */
export default function TimeSlotPicker({
  id,
  name,
  value,
  onChange,
  options,
}: TimeSlotPickerProps) {
  return (
    <div
      id={id}
      role="radiogroup"
      aria-label="Preferred time"
      className="mt-2 grid grid-cols-3 gap-2.5 sm:grid-cols-4"
    >
      <input type="hidden" name={name} value={value} />

      {options.map((option) => {
        const isSelected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(isSelected ? "" : option.value)}
            className={`${CHIP_BASE_CLASSES} w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-purple-accent ${
              isSelected ? CHIP_ACTIVE_CLASSES : CHIP_INACTIVE_CLASSES
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
