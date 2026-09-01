/**
 * IANA timezone list + friendly formatting for TimezonePicker.
 *
 * `Intl.supportedValuesOf("timeZone")` gives every zone the runtime
 * knows about (all modern browsers + Node 18+); the short list below
 * is only a fallback for the rare engine without it, not the primary
 * source. All offset math is delegated to Intl.DateTimeFormat so it
 * stays correct across DST changes without pulling in a date
 * library.
 */

export interface TimezoneOption {
  value: string; // IANA identifier, e.g. "America/Vancouver"
  city: string; // "Vancouver"
  region: string; // "America"
  offsetLabel: string; // "UTC-7"
  offsetMinutes: number; // for sorting west-to-east
}

const FALLBACK_ZONES = [
  "Pacific/Honolulu",
  "America/Anchorage",
  "America/Los_Angeles",
  "America/Vancouver",
  "America/Denver",
  "America/Phoenix",
  "America/Chicago",
  "America/Mexico_City",
  "America/New_York",
  "America/Toronto",
  "America/Halifax",
  "America/Sao_Paulo",
  "America/Argentina/Buenos_Aires",
  "UTC",
  "Europe/London",
  "Europe/Lisbon",
  "Europe/Paris",
  "Europe/Berlin",
  "Europe/Madrid",
  "Europe/Rome",
  "Europe/Athens",
  "Europe/Moscow",
  "Africa/Cairo",
  "Africa/Johannesburg",
  "Africa/Lagos",
  "Asia/Jerusalem",
  "Asia/Dubai",
  "Asia/Karachi",
  "Asia/Kolkata",
  "Asia/Dhaka",
  "Asia/Bangkok",
  "Asia/Jakarta",
  "Asia/Shanghai",
  "Asia/Singapore",
  "Asia/Hong_Kong",
  "Asia/Tokyo",
  "Asia/Seoul",
  "Asia/Manila",
  "Australia/Perth",
  "Australia/Sydney",
  "Pacific/Auckland",
];

function getAllZoneNames(): string[] {
  if (typeof Intl.supportedValuesOf === "function") {
    try {
      const zones = Intl.supportedValuesOf("timeZone");
      if (zones.length > 0) return zones;
    } catch {
      // fall through to the curated list below
    }
  }
  return FALLBACK_ZONES;
}

function getOffset(zone: string, at: Date): { label: string; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: zone,
    timeZoneName: "shortOffset",
  }).formatToParts(at);
  const raw =
    parts.find((part) => part.type === "timeZoneName")?.value ?? "GMT+0";
  const match = /GMT([+-])(\d{1,2})(?::(\d{2}))?/.exec(raw);
  const minutes = match
    ? (match[1] === "-" ? -1 : 1) *
      (Number(match[2]) * 60 + Number(match[3] ?? 0))
    : 0;
  return { label: raw.replace("GMT", "UTC"), minutes };
}

/**
 * Builds the full searchable timezone list, sorted west-to-east by
 * current UTC offset (then alphabetically). Pass a fixed `at` in
 * tests; defaults to now.
 */
export function getTimezoneOptions(at: Date = new Date()): TimezoneOption[] {
  return getAllZoneNames()
    .map((value) => {
      const [region, ...rest] = value.split("/");
      const city = (rest.pop() ?? region).replace(/_/g, " ");
      const { label, minutes } = getOffset(value, at);
      return {
        value,
        city,
        region: region.replace(/_/g, " "),
        offsetLabel: label,
        offsetMinutes: minutes,
      };
    })
    .sort(
      (a, b) =>
        a.offsetMinutes - b.offsetMinutes || a.city.localeCompare(b.city),
    );
}

/**
 * The visitor's actual IANA zone (e.g. "Asia/Manila"), used as the
 * sensible default before they've touched the field. Resolved
 * client-side only — see the effect in ContactForm for why.
 */
export function guessTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "UTC";
  }
}
