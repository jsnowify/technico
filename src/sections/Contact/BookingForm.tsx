// BookingForm.tsx
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";

/**
 * "Book Appointment" form — the working contact form for /contact.
 * Rendered directly under Contact.tsx's hero, inside the same
 * `usePageEnter` container, so it inherits the page's entrance
 * animation via `data-reveal-stagger` the same way the old single
 * mailto button did.
 *
 * No backend exists in this project (static Vite/React site, no API
 * routes) — same situation Contact.tsx was already in with its
 * `mailto:hello@technicosolutionsinc.com` CTA. Submitting builds a
 * `mailto:` link with every field folded into the subject/body and
 * hands off to the visitor's own mail client, then swaps to a
 * confirmation panel. If a real backend/CRM/Calendly integration
 * shows up later, only `handleSubmit` needs to change — the form
 * state and fields underneath it don't.
 *
 * Layout: two panels on large screens — "when" (calendar + time +
 * timezone) on the left, "who/what" (contact + project details) on
 * the right — stacking to one column below `lg`. Inputs are built
 * from scratch (no form library, none of the dependencies pull one
 * in) as small local primitives at the bottom of this file, styled to
 * match the rest of the site: font-mono uppercase micro labels,
 * hairline borders, accent-purple focus states, rounded-full pill
 * controls echoing <Button>.
 */

const SERVICES = [
  "SEO",
  "Website Development & Design",
  "Creative Design & Content Services",
  "Media Buying & Digital Advertising",
  "Social Media Management",
  "Email Marketing",
  "Something else",
] as const;

const BUDGETS = [
  "Under $2,500 / mo",
  "$2,500 – $5,000 / mo",
  "$5,000 – $10,000 / mo",
  "$10,000+ / mo",
  "Not sure yet",
] as const;

const TIME_SLOTS = [
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
] as const;

type TimezoneOption = { label: string; value: string };

const TIMEZONES: TimezoneOption[] = [
  { label: "Pacific Time — Vancouver", value: "America/Vancouver" },
  { label: "Mountain Time — Calgary", value: "America/Edmonton" },
  { label: "Central Time — Winnipeg", value: "America/Winnipeg" },
  { label: "Eastern Time — Toronto", value: "America/Toronto" },
  { label: "Atlantic Time — Halifax", value: "America/Halifax" },
  { label: "Eastern Time — New York", value: "America/New_York" },
  { label: "Central Time — Chicago", value: "America/Chicago" },
  { label: "Mountain Time — Denver", value: "America/Denver" },
  { label: "Pacific Time — Los Angeles", value: "America/Los_Angeles" },
  { label: "GMT — London", value: "Europe/London" },
  { label: "Central European — Paris", value: "Europe/Paris" },
  { label: "UTC", value: "UTC" },
];

/** Adds the visitor's own detected zone to the top of the list if it
 *  isn't already one of the curated options, so the default selection
 *  is correct for them without them having to think about it. */
function useTimezoneOptions() {
  return useMemo(() => {
    let detected = "";
    try {
      detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      detected = "";
    }

    if (!detected || TIMEZONES.some((tz) => tz.value === detected)) {
      return {
        options: TIMEZONES,
        defaultValue: detected || TIMEZONES[0].value,
      };
    }

    return {
      options: [
        { label: `Detected — ${detected}`, value: detected },
        ...TIMEZONES,
      ],
      defaultValue: detected,
    };
  }, []);
}

/* -------------------------------------------------------------------------- */
/* Calendar                                                                   */
/* -------------------------------------------------------------------------- */

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function isSameDay(a: Date | null, b: Date) {
  return (
    !!a &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function Calendar({
  selected,
  onSelect,
}: {
  selected: Date | null;
  onSelect: (date: Date) => void;
}) {
  const today = useMemo(() => startOfDay(new Date()), []);
  const [viewedMonth, setViewedMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );

  const isAtCurrentMonth =
    viewedMonth.getFullYear() === today.getFullYear() &&
    viewedMonth.getMonth() === today.getMonth();

  const daysInMonth = new Date(
    viewedMonth.getFullYear(),
    viewedMonth.getMonth() + 1,
    0,
  ).getDate();
  const leadingBlanks = viewedMonth.getDay(); // 0 = Sunday

  const cells = useMemo(() => {
    const out: Array<{ date: Date; disabled: boolean } | null> = [];
    for (let i = 0; i < leadingBlanks; i++) out.push(null);
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        viewedMonth.getFullYear(),
        viewedMonth.getMonth(),
        day,
      );
      const dow = date.getDay();
      const disabled = date < today || dow === 0 || dow === 6;
      out.push({ date, disabled });
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewedMonth, daysInMonth, leadingBlanks]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-[0.1em] text-white">
          {viewedMonth.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </span>

        <div className="flex items-center gap-1">
          <button
            type="button"
            data-cursor="highlight"
            aria-label="Previous month"
            disabled={isAtCurrentMonth}
            onClick={() =>
              setViewedMonth(
                (m) => new Date(m.getFullYear(), m.getMonth() - 1, 1),
              )
            }
            className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 text-white/60 transition-colors duration-200 hover:border-white/40 hover:text-white disabled:pointer-events-none disabled:opacity-25"
          >
            ‹
          </button>
          <button
            type="button"
            data-cursor="highlight"
            aria-label="Next month"
            onClick={() =>
              setViewedMonth(
                (m) => new Date(m.getFullYear(), m.getMonth() + 1, 1),
              )
            }
            className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 text-white/60 transition-colors duration-200 hover:border-white/40 hover:text-white"
          >
            ›
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-y-1 text-center">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <span
            key={i}
            className="font-mono text-[10px] uppercase tracking-[0.1em] text-white/30"
          >
            {d}
          </span>
        ))}

        {cells.map((cell, i) =>
          cell === null ? (
            <span key={i} />
          ) : (
            <div key={i} className="flex justify-center py-0.5">
              <button
                type="button"
                data-cursor="highlight"
                disabled={cell.disabled}
                aria-pressed={isSameDay(selected, cell.date)}
                onClick={() => onSelect(cell.date)}
                className={[
                  "flex h-8 w-8 items-center justify-center rounded-full text-xs transition-colors duration-200",
                  isSameDay(selected, cell.date)
                    ? "bg-[var(--color-accent)] text-white"
                    : "text-white/70 hover:bg-white/10",
                  cell.disabled &&
                    "pointer-events-none text-white/15 line-through",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {cell.date.getDate()}
              </button>
            </div>
          ),
        )}
      </div>

      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.1em] text-white/30">
        Mon–Fri only
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Small form primitives                                                     */
/* -------------------------------------------------------------------------- */

function FieldLabel({
  children,
  htmlFor,
}: {
  children: string;
  htmlFor?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block font-mono text-[10px] uppercase tracking-[0.14em] text-white/40"
    >
      {children}
    </label>
  );
}

function ErrorText({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs text-red-400">{message}</p>;
}

const INPUT_BASE =
  "w-full border-b bg-transparent pb-2.5 text-sm text-white outline-none transition-colors duration-200 placeholder:text-white/25";

function fieldBorder(hasError?: boolean) {
  return hasError
    ? "border-red-400/60"
    : "border-white/15 focus:border-[var(--color-accent)]";
}

function TextField({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  autoComplete,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        data-cursor="text"
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={[INPUT_BASE, fieldBorder(!!error)].join(" ")}
      />
      <ErrorText message={error} />
    </div>
  );
}

function TextAreaField({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
}) {
  return (
    <div>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <textarea
        id={id}
        value={value}
        data-cursor="text"
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className={[INPUT_BASE, "resize-none", fieldBorder(!!error)].join(" ")}
      />
      <ErrorText message={error} />
    </div>
  );
}

function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  error,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Array<{ label: string; value: string }>;
  error?: string;
}) {
  return (
    <div>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={[
            INPUT_BASE,
            fieldBorder(!!error),
            "cursor-pointer appearance-none pr-6",
          ].join(" ")}
        >
          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              className="bg-black text-white"
            >
              {opt.label}
            </option>
          ))}
        </select>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-2.5 right-0 text-white/40"
        >
          ▾
        </span>
      </div>
      <ErrorText message={error} />
    </div>
  );
}

/**
 * Time zone picker. A native `<select>` couldn't show anything but
 * the label text, which left the visitor guessing whether "Eastern
 * Time — Toronto" actually meant their own zone. This is a small
 * custom listbox instead: the closed button previews the live local
 * time for whatever's selected, and every row in the open panel shows
 * its own live time too, so picking a zone is a glance instead of a
 * guess. Closes on outside click, Escape, or a selection.
 *
 * Search: the curated `options` list (12 common zones) is what shows
 * by default, but the visitor isn't limited to it — typing filters
 * across every IANA zone the runtime knows about (~400, via
 * `Intl.supportedValuesOf`), not just the curated shortlist, so
 * someone booking from Manila or Nairobi can still find their own
 * zone by city or region instead of hunting for the closest curated
 * approximation.
 */
function timeInZone(tz: string, at: Date) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZone: tz,
    }).format(at);
  } catch {
    return "";
  }
}

/** "+05:30" / "−08:00" style offset, used both for sorting and as a
 *  small trailing hint in search results (raw IANA ids like
 *  "Asia/Kolkata" don't make the offset obvious at a glance). */
function offsetInZone(tz: string, at: Date): string {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      timeZoneName: "shortOffset",
    }).formatToParts(at);
    const raw = parts.find((p) => p.type === "timeZoneName")?.value ?? "";
    return raw.replace("GMT", "UTC");
  } catch {
    return "";
  }
}

/** Turns a raw IANA id ("Asia/Kolkata", "America/Argentina/Buenos_Aires")
 *  into a readable "Kolkata — Asia" style label, matching the curated
 *  list's "City — Region" shape so search results and shortlist rows
 *  don't look like two different UIs bolted together. */
function formatTzLabel(tz: string): string {
  const parts = tz.split("/");
  const city = (parts.at(-1) ?? tz).replace(/_/g, " ");
  const region = parts.length > 1 ? parts[0].replace(/_/g, " ") : "";
  return region ? `${city} — ${region}` : city;
}

/** Every IANA zone the runtime exposes, falling back to just the
 *  curated list on the rare engine without `supportedValuesOf`
 *  (search then quietly degrades to "search the shortlist only"
 *  instead of throwing). */
function useAllTimezones(fallback: TimezoneOption[]) {
  return useMemo<TimezoneOption[]>(() => {
    const supportedValuesOf = (
      Intl as unknown as {
        supportedValuesOf?: (key: string) => string[];
      }
    ).supportedValuesOf;

    if (typeof supportedValuesOf !== "function") return fallback;

    try {
      return supportedValuesOf("timeZone").map((tz) => ({
        label: formatTzLabel(tz),
        value: tz,
      }));
    } catch {
      return fallback;
    }
  }, [fallback]);
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M8 4.75V8L10.25 9.25"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const MAX_SEARCH_RESULTS = 60;

function TimezoneSelect({
  id,
  value,
  onChange,
  options,
  error,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  options: TimezoneOption[];
  error?: string;
}) {
  const [open, setOpen] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const [query, setQuery] = useState("");
  const [highlightIndex, setHighlightIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const allTimezones = useAllTimezones(options);

  // Closes the panel and clears search state in one go, so re-opening
  // always starts from the curated shortlist rather than a stale
  // filtered view. Defined before the effects below so both can
  // reference it without relying on hoisting.
  const closePanel = () => {
    setOpen(false);
    setQuery("");
    setHighlightIndex(0);
  };

  // Live times stay reasonably fresh without a per-second re-render —
  // nothing here needs finer than minute precision.
  useEffect(() => {
    const tick = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) closePanel();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closePanel();
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  // Autofocus the search field the moment the panel opens. Search
  // state itself is reset wherever the panel closes (closePanel,
  // above) rather than here, so clearing it doesn't require its own
  // render-triggering effect.
  useEffect(() => {
    if (open) searchRef.current?.focus();
  }, [open]);

  const trimmedQuery = query.trim().toLowerCase();
  const isSearching = trimmedQuery.length > 0;

  // Empty query → the curated shortlist (fast, familiar, covers most
  // visitors). Non-empty query → every IANA zone whose city, region,
  // or raw id matches, sorted by current UTC offset so results read
  // west-to-east instead of alphabetically-scrambled.
  const results = useMemo<TimezoneOption[]>(() => {
    if (!isSearching) return options;

    const matches = allTimezones.filter(
      (opt) =>
        opt.label.toLowerCase().includes(trimmedQuery) ||
        opt.value.toLowerCase().includes(trimmedQuery),
    );

    return matches
      .slice()
      .sort((a, b) => a.value.localeCompare(b.value))
      .slice(0, MAX_SEARCH_RESULTS);
  }, [allTimezones, isSearching, options, trimmedQuery]);

  // Keyboard highlight is clamped inline at each read site (rather
  // than synced back into state via an effect) so a shrinking result
  // set never points past the end without an extra render round-trip.
  const activeIndex = Math.min(highlightIndex, Math.max(results.length - 1, 0));

  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>('[data-highlighted="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const commit = (tz: string) => {
    onChange(tz);
    closePanel();
  };

  const handleSearchKeyDown = (event: ReactKeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightIndex((i) => Math.max(i - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const picked = results[activeIndex];
      if (picked) commit(picked.value);
    }
  };

  const selected = options.find((opt) => opt.value === value) ??
    allTimezones.find((opt) => opt.value === value) ?? {
      label: formatTzLabel(value),
      value,
    };

  return (
    <div ref={rootRef} className="relative">
      <FieldLabel htmlFor={id}>Time zone</FieldLabel>

      <button
        id={id}
        type="button"
        data-cursor="highlight"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={[
          "flex w-full items-center justify-between gap-3 border-b bg-transparent pb-2.5 text-left text-sm text-white outline-none transition-colors duration-200",
          fieldBorder(!!error),
        ].join(" ")}
      >
        <span className="flex min-w-0 items-center gap-2">
          <ClockIcon className="h-3.5 w-3.5 shrink-0 text-white/40" />
          <span className="truncate">{selected?.label}</span>
        </span>

        <span className="flex shrink-0 items-center gap-2.5">
          <span className="font-mono text-[11px] tabular-nums text-white/40">
            {selected ? timeInZone(selected.value, now) : ""}
          </span>
          <span
            aria-hidden="true"
            className={[
              "text-white/40 transition-transform duration-200",
              open && "rotate-180",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            ▾
          </span>
        </span>
      </button>

      {open && (
        <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-[0_20px_50px_rgba(0,0,0,0.55)]">
          {/* Search — filters across every IANA zone once the visitor
              types, not just the 12-item shortlist below. */}
          <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2.5">
            <svg
              viewBox="0 0 16 16"
              fill="none"
              className="h-3.5 w-3.5 shrink-0 text-white/35"
              aria-hidden="true"
            >
              <circle
                cx="6.75"
                cy="6.75"
                r="4.25"
                stroke="currentColor"
                strokeWidth="1.2"
              />
              <path
                d="M10.5 10.5L13.5 13.5"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
            <input
              ref={searchRef}
              type="text"
              value={query}
              data-cursor="text"
              onChange={(e) => {
                setQuery(e.target.value);
                setHighlightIndex(0);
              }}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search any city or timezone…"
              aria-label="Search timezones"
              autoComplete="off"
              spellCheck={false}
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/25"
            />
            {query && (
              <button
                type="button"
                data-cursor="highlight"
                aria-label="Clear search"
                onClick={() => {
                  setQuery("");
                  searchRef.current?.focus();
                }}
                className="shrink-0 text-white/35 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          <div className="px-3 pt-2.5">
            <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/30">
              {isSearching
                ? `${results.length} match${results.length === 1 ? "" : "es"}`
                : "Suggested"}
            </span>
          </div>

          <ul
            ref={listRef}
            role="listbox"
            aria-label="Time zone"
            className="max-h-56 overflow-y-auto p-1.5 pt-1"
          >
            {results.length === 0 && (
              <li className="px-3 py-4 text-center text-xs text-white/35">
                No timezones match “{query}”.
              </li>
            )}

            {results.map((opt, i) => {
              const isSelected = opt.value === value;
              const isHighlighted = i === activeIndex;
              return (
                <li key={opt.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    data-cursor="highlight"
                    data-highlighted={isHighlighted}
                    onMouseEnter={() => setHighlightIndex(i)}
                    onClick={() => commit(opt.value)}
                    className={[
                      "flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors duration-150",
                      isSelected
                        ? "bg-[var(--color-accent)]/15 text-white"
                        : isHighlighted
                          ? "bg-white/[0.06] text-white"
                          : "text-white/60 hover:bg-white/[0.06] hover:text-white",
                    ].join(" ")}
                  >
                    <span className="truncate">{opt.label}</span>
                    <span className="flex shrink-0 items-center gap-2.5">
                      <span className="font-mono text-[10px] tabular-nums text-white/25">
                        {offsetInZone(opt.value, now)}
                      </span>
                      <span className="font-mono text-[11px] tabular-nums text-white/35">
                        {timeInZone(opt.value, now)}
                      </span>
                      {isSelected && (
                        <span
                          aria-hidden="true"
                          className="text-[var(--color-accent)]"
                        >
                          ✓
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <ErrorText message={error} />
    </div>
  );
}

function PillGroup({
  legend,
  options,
  selected,
  onToggle,
  multi,
  error,
}: {
  legend: string;
  options: readonly string[];
  selected: string[];
  onToggle: (value: string) => void;
  multi?: boolean;
  error?: string;
}) {
  return (
    <fieldset>
      <legend className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/40">
        {legend}
      </legend>
      <div
        className="flex flex-wrap gap-2"
        role={multi ? undefined : "radiogroup"}
      >
        {options.map((opt) => {
          const isSelected = selected.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              data-cursor="highlight"
              role={multi ? undefined : "radio"}
              aria-pressed={multi ? isSelected : undefined}
              aria-checked={multi ? undefined : isSelected}
              onClick={() => onToggle(opt)}
              className={[
                "rounded-full border px-4 py-2 text-xs transition-colors duration-200",
                isSelected
                  ? "border-[var(--color-accent)] bg-[var(--color-accent)]/15 text-white"
                  : "border-white/15 text-white/60 hover:border-white/35 hover:text-white",
              ].join(" ")}
            >
              {opt}
            </button>
          );
        })}
      </div>
      <ErrorText message={error} />
    </fieldset>
  );
}

/* -------------------------------------------------------------------------- */
/* Form state                                                                 */
/* -------------------------------------------------------------------------- */

type FormState = {
  date: Date | null;
  time: string | null;
  timezone: string;
  fullName: string;
  email: string;
  phone: string;
  company: string;
  projectDetails: string;
  services: string[];
  budget: string;
};

type Errors = Partial<Record<keyof FormState, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function BookingForm() {
  const { options: tzOptions, defaultValue: defaultTz } = useTimezoneOptions();

  const [form, setForm] = useState<FormState>({
    date: null,
    time: null,
    timezone: defaultTz,
    fullName: "",
    email: "",
    phone: "",
    company: "",
    projectDetails: "",
    services: [],
    budget: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleService = (service: string) => {
    setForm((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }));
  };

  const validate = (): Errors => {
    const next: Errors = {};
    if (!form.date) next.date = "Pick a date.";
    if (!form.time) next.time = "Pick a time.";
    if (!form.fullName.trim()) next.fullName = "Let us know who you are.";
    if (!form.email.trim() || !EMAIL_RE.test(form.email)) {
      next.email = "A valid email helps us confirm the slot.";
    }
    if (!form.phone.trim())
      next.phone = "A number in case we need to reach you.";
    if (!form.services.length) next.services = "Pick at least one.";
    if (!form.budget) next.budget = "Give us a ballpark.";
    return next;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const tzLabel =
      tzOptions.find((tz) => tz.value === form.timezone)?.label ??
      form.timezone;

    const dateLabel = form.date?.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    const subject = `Appointment request — ${form.fullName}`;
    const body = [
      `Name: ${form.fullName}`,
      `Email: ${form.email}`,
      `Phone: ${form.phone}`,
      form.company && `Company/organization: ${form.company}`,
      `Preferred date: ${dateLabel}`,
      `Preferred time: ${form.time} (${tzLabel})`,
      `Services: ${form.services.join(", ")}`,
      `Budget: ${form.budget}`,
      "",
      "Project details:",
      form.projectDetails.trim() || "—",
    ]
      .filter(Boolean)
      .join("\n");

    window.location.href = `mailto:hello@technicosolutionsinc.com?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div
        data-reveal-stagger
        className="mt-20 max-w-xl rounded-3xl border border-white/10 bg-white/[0.02] p-8 sm:p-10"
      >
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-accent)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
          Request drafted
        </div>
        <p className="mt-4 text-xl font-semibold leading-snug text-white">
          Your email client should be open with everything filled in.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-white/55">
          Hit send from there and we'll confirm your slot within one business
          day. Nothing opened?{" "}
          <a
            href="mailto:hello@technicosolutionsinc.com"
            data-cursor="highlight"
            className="text-white underline decoration-white/30 underline-offset-2 hover:decoration-white"
          >
            Email us directly
          </a>{" "}
          instead.
        </p>
        <button
          type="button"
          data-cursor="highlight"
          onClick={() => setSubmitted(false)}
          className="mt-6 text-xs uppercase tracking-[0.1em] text-white/50 underline decoration-white/20 underline-offset-4 hover:text-white"
        >
          Book another time
        </button>
      </div>
    );
  }

  return (
    <form
      data-reveal-stagger
      onSubmit={handleSubmit}
      noValidate
      className="mt-20 grid gap-10 lg:grid-cols-12 lg:gap-8"
    >
      {/* ---- When ---- */}
      <div className="lg:col-span-5">
        <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 lg:sticky lg:top-28">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/40">
            01 / When
          </span>

          <div className="mt-5">
            <Calendar selected={form.date} onSelect={(d) => set("date", d)} />
            <ErrorText message={errors.date} />
          </div>

          <div className="mt-8">
            <FieldLabel>Time</FieldLabel>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {TIME_SLOTS.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  data-cursor="highlight"
                  aria-pressed={form.time === slot}
                  onClick={() => set("time", slot)}
                  className={[
                    "rounded-full border px-3 py-2 text-xs transition-colors duration-200",
                    form.time === slot
                      ? "border-[var(--color-accent)] bg-[var(--color-accent)]/15 text-white"
                      : "border-white/15 text-white/60 hover:border-white/35 hover:text-white",
                  ].join(" ")}
                >
                  {slot}
                </button>
              ))}
            </div>
            <ErrorText message={errors.time} />
          </div>

          <div className="mt-8">
            <TimezoneSelect
              id="timezone"
              value={form.timezone}
              onChange={(v) => set("timezone", v)}
              options={tzOptions}
            />
          </div>
        </div>
      </div>

      {/* ---- Who / what ---- */}
      <div className="lg:col-span-7">
        <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/40">
            02 / You
          </span>

          <div className="mt-5 grid gap-6 sm:grid-cols-2">
            <TextField
              id="fullName"
              label="Full name"
              value={form.fullName}
              onChange={(v) => set("fullName", v)}
              placeholder="Jordan Smith"
              autoComplete="name"
              error={errors.fullName}
            />
            <TextField
              id="email"
              label="Email"
              type="email"
              value={form.email}
              onChange={(v) => set("email", v)}
              placeholder="jordan@company.com"
              autoComplete="email"
              error={errors.email}
            />
            <TextField
              id="phone"
              label="Phone"
              type="tel"
              value={form.phone}
              onChange={(v) => set("phone", v)}
              placeholder="(555) 123-4567"
              autoComplete="tel"
              error={errors.phone}
            />
            <TextField
              id="company"
              label="Company / organization"
              value={form.company}
              onChange={(v) => set("company", v)}
              placeholder="Optional"
              autoComplete="organization"
            />
          </div>

          <div className="mt-8 space-y-8">
            <PillGroup
              legend="Services"
              options={SERVICES}
              selected={form.services}
              onToggle={toggleService}
              multi
              error={errors.services}
            />

            <SelectField
              id="budget"
              label="Budget"
              value={form.budget}
              onChange={(v) => set("budget", v)}
              options={[
                { label: "Select a range", value: "" },
                ...BUDGETS.map((b) => ({ label: b, value: b })),
              ]}
              error={errors.budget}
            />

            <TextAreaField
              id="projectDetails"
              label="Project details"
              value={form.projectDetails}
              onChange={(v) => set("projectDetails", v)}
              placeholder="What are you trying to get done?"
            />
          </div>

          <button
            type="submit"
            data-cursor="highlight"
            className="group relative mt-8 inline-flex w-full items-center justify-center rounded-full bg-white px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.08em] text-black transition-colors duration-300 hover:bg-[var(--color-accent)] hover:text-white sm:w-auto sm:px-8"
          >
            Book Appointment
          </button>
        </div>
      </div>
    </form>
  );
}
