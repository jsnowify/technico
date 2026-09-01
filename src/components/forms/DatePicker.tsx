"use client";

import { useMemo, useState } from "react";
import {
  MONTH_LABELS,
  WEEKDAY_LABELS,
  addMonths,
  fromISODate,
  getCalendarGrid,
  isSameDay,
  isWeekend,
  startOfDay,
  startOfMonth,
  toISODate,
} from "@/lib/utils/date";
import { CalendarIcon, ChevronDownIcon } from "@/components/forms/pickerIcons";

interface DatePickerProps {
  id: string;
  name: string;
  value: string; // ISO "yyyy-mm-dd", or "" for unset
  onChange: (value: string) => void;
  min?: string; // ISO "yyyy-mm-dd"
  /** Calls only happen on business days — grays out and disables Sat/Sun instead of just leaving them pickable. */
  disableWeekends?: boolean;
}

/**
 * A real, always-on month-grid calendar — no trigger button, no
 * popover. Visitors booking a call want to see availability at a
 * glance, and hiding the grid behind a click just adds a step
 * between "I'm scheduling a call" and "here are my options." The
 * calendar sits inline in the form flow, styled as its own card so
 * it still reads as one field among the others rather than a stray
 * widget. A hidden input still carries `name`/`value` so the
 * surrounding <form>'s server action sees the same "yyyy-mm-dd"
 * string it always did.
 *
 * Same soft `bg-white/5` + `border-white/10` box every other field
 * in the form uses (see fieldStyles.ts), so it reads as one more
 * field in the set rather than a different kind of surface.
 */
export default function DatePicker({
  id,
  name,
  value,
  onChange,
  min,
  disableWeekends = false,
}: DatePickerProps) {
  const selectedDate = useMemo(() => fromISODate(value), [value]);
  const minDate = useMemo(() => (min ? fromISODate(min) : null), [min]);
  const today = useMemo(() => startOfDay(new Date()), []);

  const [visibleMonth, setVisibleMonth] = useState(() =>
    startOfMonth(selectedDate ?? minDate ?? today),
  );

  const grid = useMemo(() => getCalendarGrid(visibleMonth), [visibleMonth]);

  const isDisabled = (day: Date) =>
    Boolean(minDate && day < minDate) || (disableWeekends && isWeekend(day));

  const canGoToPreviousMonth =
    !minDate || startOfMonth(minDate) < startOfMonth(visibleMonth);

  const handleSelect = (day: Date) => {
    if (isDisabled(day)) return;
    onChange(toISODate(day));
    // Clicking a leading/trailing day from an adjacent month should
    // leave the calendar showing that month, rather than looking
    // like the click didn't register.
    if (day.getMonth() !== visibleMonth.getMonth()) {
      setVisibleMonth(startOfMonth(day));
    }
  };

  const selectedLabel = selectedDate
    ? selectedDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div
      id={id}
      role="group"
      aria-label="Choose a date"
      className="mt-2 w-full overflow-hidden rounded-lg border border-white/10 bg-white/5"
    >
      <input type="hidden" name={name} value={value} />

      {/* Month header + nav */}
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-6">
        <span className="flex items-center gap-2.5 text-sm font-bold tracking-tight text-white uppercase sm:text-base">
          <CalendarIcon className="size-4 shrink-0 text-purple-accent" />
          {MONTH_LABELS[visibleMonth.getMonth()]} {visibleMonth.getFullYear()}
        </span>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setVisibleMonth((month) => addMonths(month, -1))}
            disabled={!canGoToPreviousMonth}
            aria-label="Previous month"
            className="flex size-7 items-center justify-center rounded-full border border-white/10 text-white/60 transition-colors hover:bg-purple-accent/15 disabled:pointer-events-none disabled:opacity-30"
          >
            <ChevronDownIcon className="size-3.5 rotate-90" />
          </button>

          <button
            type="button"
            onClick={() => setVisibleMonth((month) => addMonths(month, 1))}
            aria-label="Next month"
            className="flex size-7 items-center justify-center rounded-full border border-white/10 text-white/60 transition-colors hover:bg-purple-accent/15"
          >
            <ChevronDownIcon className="size-3.5 -rotate-90" />
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="px-5 pt-5 sm:px-6">
        <div className="grid grid-cols-7 gap-y-2 text-center">
          {WEEKDAY_LABELS.map((weekday) => (
            <span
              key={weekday}
              className="font-mono text-[10px] tracking-wide text-white/35 uppercase"
            >
              {weekday}
            </span>
          ))}

          {grid.map((day) => {
            const inVisibleMonth = day.getMonth() === visibleMonth.getMonth();
            const disabled = isDisabled(day);
            const selected = selectedDate && isSameDay(day, selectedDate);
            const isToday = isSameDay(day, today);

            return (
              <button
                key={day.toISOString()}
                type="button"
                onClick={() => handleSelect(day)}
                disabled={disabled}
                aria-current={isToday ? "date" : undefined}
                aria-pressed={Boolean(selected)}
                className={`mx-auto flex size-9 items-center justify-center rounded-full text-sm transition-colors sm:size-10 ${
                  selected
                    ? "bg-purple-secondary text-white"
                    : disabled
                      ? "text-white/20"
                      : !inVisibleMonth
                        ? "text-white/25 hover:bg-purple-accent/15"
                        : "text-white-text hover:bg-purple-accent/15"
                } ${isToday && !selected ? "ring-1 ring-inset ring-purple-accent/50" : ""} disabled:cursor-not-allowed disabled:hover:bg-transparent`}
              >
                {day.getDate()}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer: selected date + jump to today */}
      <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 px-5 py-3.5 sm:px-6">
        <span
          className={`truncate text-sm ${selectedLabel ? "text-white-text" : "text-white/30"}`}
        >
          {selectedLabel ?? "No date selected"}
        </span>

        <button
          type="button"
          onClick={() => handleSelect(today)}
          disabled={isDisabled(today)}
          className="shrink-0 rounded-lg border border-white/10 px-3 py-1.5 font-mono text-[11px] tracking-[0.14em] text-white/60 uppercase transition-colors hover:bg-purple-accent/15 disabled:pointer-events-none disabled:opacity-30"
        >
          Today
        </button>
      </div>

      {disableWeekends && (
        <p className="border-t border-white/10 bg-white/[0.02] px-5 py-2.5 font-mono text-[10px] tracking-wide text-white/35 uppercase sm:px-6">
          Grayed-out dates aren&rsquo;t available — Mon–Fri only
        </p>
      )}
    </div>
  );
}
