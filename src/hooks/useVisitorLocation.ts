import { useEffect, useState } from "react";

type VisitorLocation = {
  latitude: number;
  longitude: number;
  countryCode: string;
  continentCode: string;
};

type LocationState = {
  location: VisitorLocation;
  /** true until the lookup resolves (success OR fallback) */
  loading: boolean;
  /** true if we're showing the fallback rather than a real lookup */
  isFallback: boolean;
};

// Technico's home base — shown immediately and used if the IP lookup
// fails, is blocked by an ad/privacy blocker, or simply hasn't
// resolved yet. Never leave the UI blank while waiting on the network.
const FALLBACK_LOCATION: VisitorLocation = {
  latitude: 14.5833,
  longitude: 121.0,
  countryCode: "PH",
  continentCode: "AS",
};

const CONTINENT_NAMES: Record<string, string> = {
  AF: "AFRICA",
  AN: "ANTARCTICA",
  AS: "ASIA",
  EU: "EUROPE",
  NA: "N. AMERICA",
  OC: "OCEANIA",
  SA: "S. AMERICA",
};

export function continentName(code: string): string {
  return CONTINENT_NAMES[code] ?? code;
}

export function toDegreesMinutes(
  value: number,
  positiveSuffix: string,
  negativeSuffix: string,
): string {
  const suffix = value >= 0 ? positiveSuffix : negativeSuffix;
  const abs = Math.abs(value);
  const degrees = Math.floor(abs);
  const minutes = Math.round((abs - degrees) * 60);

  return `${degrees}°${String(minutes).padStart(2, "0")}'${suffix}`;
}

/**
 * Looks up the visitor's approximate location from their public IP
 * (city-level accuracy at best — this is not GPS). Runs once on
 * mount; no permission prompt, unlike navigator.geolocation, since it
 * only ever sees what the request's source IP already reveals.
 *
 * Uses ipapi.co's free, keyless, CORS-enabled endpoint. If it's slow,
 * blocked, or rate-limited, callers get FALLBACK_LOCATION and
 * `isFallback: true` instead of an error state to handle.
 */
export function useVisitorLocation(): LocationState {
  const [location, setLocation] = useState<VisitorLocation>(FALLBACK_LOCATION);
  const [loading, setLoading] = useState(true);
  const [isFallback, setIsFallback] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    // Don't let a slow/hanging request keep the readout on "loading"
    // indefinitely — bail to the fallback after a short timeout.
    const timeout = window.setTimeout(() => controller.abort(), 4000);

    fetch("https://ipapi.co/json/", { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`ipapi.co responded ${res.status}`);
        return res.json();
      })
      .then(
        (data: {
          latitude?: number;
          longitude?: number;
          country_code?: string;
          continent_code?: string;
          error?: boolean;
        }) => {
          if (cancelled || data.error) return;

          if (
            typeof data.latitude !== "number" ||
            typeof data.longitude !== "number" ||
            !data.country_code ||
            !data.continent_code
          ) {
            return;
          }

          setLocation({
            latitude: data.latitude,
            longitude: data.longitude,
            countryCode: data.country_code,
            continentCode: data.continent_code,
          });
          setIsFallback(false);
        },
      )
      .catch(() => {
        // Silently keep the fallback — a decorative readout isn't
        // worth surfacing a network error to the visitor.
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, []);

  return { location, loading, isFallback };
}
