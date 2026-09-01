"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useDismiss } from "@/lib/hooks/useDismiss";
import { getTimezoneOptions, type TimezoneOption } from "@/lib/utils/timezone";
import {
  FIELD_CLASSES,
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
  GlobeIcon,
  SearchIcon,
} from "@/components/forms/pickerIcons";

export interface QuickTimezone {
  value: string;
  label: string;
}

interface DisplayOption {
  value: string;
  label: string;
  offsetLabel?: string;
}

interface TimezonePickerProps {
  id: string;
  name: string;
  value: string; // IANA identifier, e.g. "America/Vancouver"
  onChange: (value: string) => void;
  quickPicks?: QuickTimezone[];
  placeholder?: string;
}

/**
 * Searchable timezone combobox, backed by every zone the browser
 * knows about (see lib/utils/timezone.ts) rather than the old
 * six-item PT/MT/CT/ET/AT/"Other" select — that list quietly assumed
 * a North American visitor. Typing filters by city, region, or UTC
 * offset; leaving the search empty shows `quickPicks` first so
 * returning to the common case is still one click.
 *
 * The full zone list depends on Intl/the current date, so it's
 * computed in an effect rather than during render — same reasoning
 * as the `minDate`/timezone-guess effect this component replaces in
 * ContactForm: keeps the server-rendered HTML and first client
 * render identical.
 */
export default function TimezonePicker({
  id,
  name,
  value,
  onChange,
  quickPicks = [],
  placeholder = "Select a time zone",
}: TimezonePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [allZones, setAllZones] = useState<TimezoneOption[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useDismiss(containerRef, isOpen, () => setIsOpen(false));

  useEffect(() => {
    setAllZones(getTimezoneOptions());
  }, []);

  const selected = allZones.find((zone) => zone.value === value);

  const filtered = useMemo<DisplayOption[] | null>(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return null; // signals "show quick picks instead"
    return allZones
      .filter((zone) =>
        `${zone.city} ${zone.region} ${zone.offsetLabel} ${zone.value}`
          .toLowerCase()
          .includes(trimmed),
      )
      .map((zone) => ({
        value: zone.value,
        label: zone.city,
        offsetLabel: zone.offsetLabel,
      }));
  }, [allZones, query]);

  // Quick picks show the visitor's own offset for that zone, looked
  // up from the already-computed full list rather than recomputed.
  const quickDisplay = useMemo<DisplayOption[]>(() => {
    if (quickPicks.length === 0) {
      return allZones.slice(0, 8).map((zone) => ({
        value: zone.value,
        label: zone.city,
        offsetLabel: zone.offsetLabel,
      }));
    }
    return quickPicks.map((pick) => ({
      value: pick.value,
      label: pick.label,
      offsetLabel: allZones.find((zone) => zone.value === pick.value)
        ?.offsetLabel,
    }));
  }, [quickPicks, allZones]);

  const visibleOptions: DisplayOption[] = filtered ?? quickDisplay;

  const open = () => {
    setQuery("");
    setActiveIndex(0);
    setIsOpen(true);
    // Panel mounts this render; focus the search field once it exists.
    requestAnimationFrame(() => searchInputRef.current?.focus());
  };

  const commit = (index: number) => {
    const option = visibleOptions[index];
    if (!option) return;
    onChange(option.value);
    setIsOpen(false);
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex((index) =>
          Math.min(index + 1, visibleOptions.length - 1),
        );
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((index) => Math.max(index - 1, 0));
        break;
      case "Enter":
        event.preventDefault();
        commit(activeIndex);
        break;
      default:
        break;
    }
  };

  const triggerLabel = selected
    ? `${selected.city} — ${selected.offsetLabel}`
    : value || placeholder;

  return (
    <div ref={containerRef} className="relative">
      <input type="hidden" name={name} value={value} />

      <button
        type="button"
        id={id}
        onClick={() => (isOpen ? setIsOpen(false) : open())}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={FIELD_TRIGGER_CLASSES}
      >
        <span
          className={`flex items-center gap-2.5 truncate ${value ? "" : "text-white/30"}`}
        >
          <GlobeIcon className="size-4 shrink-0 text-white/40" />
          <span className="truncate">{triggerLabel}</span>
        </span>
        <ChevronDownIcon
          className={`size-4 shrink-0 text-white/40 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className={POPOVER_PANEL_CLASSES}>
          <div className="relative border-b border-white/10 p-2">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-5 size-4 -translate-y-1/2 text-white/35" />
            <input
              ref={searchInputRef}
              type="text"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setActiveIndex(0);
              }}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search city, region, or UTC offset"
              className={`${FIELD_CLASSES} mt-0 py-2 pl-9 text-sm`}
            />
          </div>

          <ul
            role="listbox"
            aria-label="Time zone"
            className={OPTION_LIST_CLASSES}
          >
            {visibleOptions.length === 0 && (
              <li className="px-4 py-3 text-sm text-white/40">
                No matching time zones.
              </li>
            )}

            {!filtered && quickPicks.length > 0 && (
              <li className="px-4 pt-1.5 pb-1 font-mono text-[10px] tracking-[0.14em] text-white/35 uppercase">
                Common
              </li>
            )}

            {visibleOptions.map((option, index) => {
              const isSelected = option.value === value;
              const isActive = index === activeIndex;
              const offsetLabel = option.offsetLabel;

              return (
                <li key={option.value}>
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
                    <span className="truncate">{option.label}</span>
                    <span className="flex shrink-0 items-center gap-2">
                      {offsetLabel && (
                        <span
                          className={`font-mono text-[11px] ${isSelected ? "text-white/80" : "text-white/40"}`}
                        >
                          {offsetLabel}
                        </span>
                      )}
                      {isSelected && <CheckIcon className="size-4 shrink-0" />}
                    </span>
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
