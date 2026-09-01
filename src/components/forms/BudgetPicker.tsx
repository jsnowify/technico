"use client";

import { useRef, useState } from "react";
import { useDismiss } from "@/lib/hooks/useDismiss";
import {
  FIELD_TRIGGER_CLASSES,
  OPTION_ACTIVE_CLASSES,
  OPTION_BASE_CLASSES,
  OPTION_INACTIVE_CLASSES,
  OPTION_LIST_CLASSES,
  OPTION_SELECTED_CLASSES,
  POPOVER_PANEL_CLASSES,
} from "@/components/forms/fieldStyles";
import {
  CheckIcon,
  ChevronDownIcon,
  TagIcon,
} from "@/components/forms/pickerIcons";

interface BudgetPickerProps {
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  placeholder?: string;
}

/**
 * Same trigger-button + popover-listbox chrome as TimezonePicker
 * (POPOVER_PANEL_CLASSES / OPTION_* tokens in fieldStyles.ts) instead
 * of a native `<select>` — the budget field used to be the one
 * dropdown in the form that looked like a different control from
 * Time Zone sitting right below it. No search box here: unlike the
 * full IANA zone list, the six budget ranges are short and fixed, so
 * there's nothing a search input would buy.
 */
export default function BudgetPicker({
  id,
  name,
  value,
  onChange,
  options,
  placeholder = "Select a range",
}: BudgetPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useDismiss(containerRef, isOpen, () => setIsOpen(false));

  const open = () => {
    const currentIndex = options.indexOf(value);
    setActiveIndex(currentIndex >= 0 ? currentIndex : 0);
    setIsOpen(true);
  };

  const commit = (index: number) => {
    const option = options[index];
    if (!option) return;
    onChange(option);
    setIsOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isOpen) {
      if (
        event.key === "ArrowDown" ||
        event.key === "Enter" ||
        event.key === " "
      ) {
        event.preventDefault();
        open();
      }
      return;
    }

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex((index) => Math.min(index + 1, options.length - 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((index) => Math.max(index - 1, 0));
        break;
      case "Enter":
        event.preventDefault();
        commit(activeIndex);
        break;
      case "Escape":
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <input type="hidden" name={name} value={value} />

      <button
        type="button"
        id={id}
        onClick={() => (isOpen ? setIsOpen(false) : open())}
        onKeyDown={handleKeyDown}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={FIELD_TRIGGER_CLASSES}
      >
        <span
          className={`flex items-center gap-2.5 truncate ${value ? "" : "text-white/30"}`}
        >
          <TagIcon className="size-4 shrink-0 text-white/40" />
          <span className="truncate">{value || placeholder}</span>
        </span>
        <ChevronDownIcon
          className={`size-4 shrink-0 text-white/40 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className={POPOVER_PANEL_CLASSES}>
          <ul
            role="listbox"
            aria-label={placeholder}
            className={OPTION_LIST_CLASSES}
          >
            {options.map((option, index) => {
              const isSelected = option === value;
              const isActive = index === activeIndex;

              return (
                <li key={option}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => commit(index)}
                    className={`${OPTION_BASE_CLASSES} ${
                      isSelected
                        ? OPTION_SELECTED_CLASSES
                        : isActive
                          ? OPTION_ACTIVE_CLASSES
                          : OPTION_INACTIVE_CLASSES
                    }`}
                  >
                    <span className="truncate">{option}</span>
                    {isSelected && <CheckIcon className="size-4 shrink-0" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
