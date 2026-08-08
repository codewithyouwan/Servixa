"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { LoaderCircle, LocateFixed, MapPin } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * The default postal code is shared across the app (hero search, floating
 * search) and seeded from the code the user enters in their profile at
 * sign-up.
 */
export const ZIP_STORAGE_KEY = "bestbuild.zip";

/**
 * Global postal-code validation: BestBuild is a global platform, so this
 * accepts any common national format — US "75201", Japan "123-4567",
 * UK "SW1A 1AA", Canada "K1A 0B1", India "482002", and similar.
 * Rules: 3–10 characters, alphanumeric with optional single spaces or
 * hyphens between them, and at least one digit.
 */
export const ZIP_PATTERN = /^(?=.*\d)[A-Za-z0-9]+(?:[ -][A-Za-z0-9]+)*$/;

export function isValidPostalCode(code: string): boolean {
  const trimmed = code.trim();
  return (
    trimmed.length >= 3 && trimmed.length <= 10 && ZIP_PATTERN.test(trimmed)
  );
}

/** Normalize user input: uppercase, collapse whitespace. */
export function normalizePostalCode(code: string): string {
  return code.trim().toUpperCase().replace(/\s+/g, " ");
}

export function getSavedZip(): string {
  if (typeof window === "undefined") return "";
  const saved = localStorage.getItem(ZIP_STORAGE_KEY) ?? "";
  return isValidPostalCode(saved) ? saved : "";
}

export function saveZip(zip: string) {
  if (isValidPostalCode(zip)) {
    localStorage.setItem(ZIP_STORAGE_KEY, normalizePostalCode(zip));
  }
}

interface ZipSelectorProps {
  value: string;
  onChange: (zip: string) => void;
  /** Unique id prefix so multiple selectors can coexist on one page. */
  idPrefix: string;
  /** Which side the popover opens on. Use "top" when the selector sits near the bottom of the viewport. */
  popoverSide?: "bottom" | "top";
  className?: string;
}

/**
 * Compact ZIP-code selector that sits on the left side of a search bar.
 * The user can type a 5-digit ZIP or use their current location (reverse
 * geocoded). The chosen ZIP persists as the default for future searches.
 */
export function ZipSelector({
  value,
  onChange,
  idPrefix,
  popoverSide = "bottom",
  className,
}: ZipSelectorProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  useEffect(() => {
    if (open) {
      // Focus the input once the popover renders.
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  function toggleOpen() {
    setOpen((wasOpen) => {
      if (!wasOpen) {
        setDraft(value);
        setError(null);
      }
      return !wasOpen;
    });
  }

  function commit(zip: string) {
    const normalized = normalizePostalCode(zip);
    if (!isValidPostalCode(normalized)) {
      setError("Enter a valid ZIP / postal code (e.g. 75201 or 123-4567).");
      return;
    }
    saveZip(normalized);
    onChange(normalized);
    setOpen(false);
  }

  function handleSubmitDraft(event: FormEvent | KeyboardEvent) {
    event.preventDefault();
    commit(draft);
  }

  /**
   * Reverse-geocode coordinates to a postal code, trying two free
   * providers so a single outage or gap in coverage doesn't fail the
   * lookup. Returns { postcode, countryCode } from the first provider
   * that answers, or null if both fail.
   */
  async function reverseGeocode(
    latitude: number,
    longitude: number
  ): Promise<{ postcode: string; countryCode: string } | null> {
    // Provider 1: BigDataCloud (no key, CORS-enabled)
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );
      if (response.ok) {
        const data = (await response.json()) as {
          postcode?: string;
          countryCode?: string;
        };
        if (data.postcode) {
          return {
            postcode: data.postcode,
            countryCode: data.countryCode ?? "",
          };
        }
      }
    } catch {
      // fall through to provider 2
    }
    // Provider 2: OpenStreetMap Nominatim
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
        { headers: { Accept: "application/json" } }
      );
      if (response.ok) {
        const data = (await response.json()) as {
          address?: { postcode?: string; country_code?: string };
        };
        if (data.address?.postcode) {
          return {
            postcode: data.address.postcode,
            countryCode: (data.address.country_code ?? "").toUpperCase(),
          };
        }
      }
    } catch {
      // both providers failed
    }
    return null;
  }

  async function useCurrentLocation() {
    if (!("geolocation" in navigator)) {
      setError("Location is not available in this browser.");
      return;
    }
    setLocating(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const result = await reverseGeocode(latitude, longitude);
          if (!result) {
            setError(
              "Couldn't reach the location service (a privacy blocker may be blocking it) — please enter your postal code manually."
            );
            return;
          }
          const detected = normalizePostalCode(result.postcode);
          if (isValidPostalCode(detected)) {
            commit(detected);
          } else {
            setError(
              "Your location didn't map to a postal code — please enter it manually."
            );
          }
        } catch {
          setError(
            "Couldn't detect your postal code — please enter it manually."
          );
        } finally {
          setLocating(false);
        }
      },
      (geoError) => {
        setLocating(false);
        setError(
          geoError.code === geoError.PERMISSION_DENIED
            ? "Location permission denied — enter your postal code manually."
            : "Couldn't get your location (timeout or unavailable) — enter your postal code manually."
        );
      },
      { timeout: 8000 }
    );
  }

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={toggleOpen}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={
          value
            ? `Location: postal code ${value}`
            : "Set your ZIP / postal code"
        }
        className={cn(
          "flex h-10 shrink-0 items-center gap-1.5 rounded-lg border-r border-border/60 px-2.5 text-sm font-medium transition-colors outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50",
          value ? "text-foreground" : "text-muted-foreground"
        )}
      >
        <MapPin aria-hidden="true" className="h-4 w-4 shrink-0 text-primary" />
        <span className="max-w-12 truncate tabular-nums sm:max-w-20">
          {value || "ZIP"}
        </span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Choose your location"
          className={cn(
            // bg-card is fully opaque in both themes — the popover must not
            // let the page behind it show through.
            "absolute left-0 z-50 w-64 rounded-xl border border-border bg-card p-3 opacity-100 shadow-xl backdrop-blur-none dark:shadow-black/50",
            popoverSide === "bottom" ? "top-full mt-2" : "bottom-full mb-2"
          )}
        >
          <label
            htmlFor={`${idPrefix}-zip-input`}
            className="text-xs font-semibold text-foreground"
          >
            ZIP / postal code
          </label>
          <div className="mt-1.5 flex gap-2">
            <input
              ref={inputRef}
              id={`${idPrefix}-zip-input`}
              type="text"
              autoComplete="postal-code"
              maxLength={10}
              placeholder="e.g. 75201 or 123-4567"
              value={draft}
              onChange={(event) =>
                setDraft(
                  event.target.value.replace(/[^A-Za-z0-9\s-]/g, "")
                )
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") handleSubmitDraft(event);
                if (event.key === "Escape") setOpen(false);
              }}
              className="h-9 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 text-sm tabular-nums transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
            <button
              type="button"
              onClick={handleSubmitDraft}
              className="h-9 shrink-0 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors outline-none hover:bg-primary/85 focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              Set
            </button>
          </div>

          <button
            type="button"
            onClick={useCurrentLocation}
            disabled={locating}
            className="mt-2.5 flex w-full items-center gap-2 rounded-lg border border-border/70 px-2.5 py-2 text-sm font-medium text-foreground transition-colors outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-60"
          >
            {locating ? (
              <LoaderCircle
                aria-hidden="true"
                className="h-4 w-4 animate-spin text-primary"
              />
            ) : (
              <LocateFixed
                aria-hidden="true"
                className="h-4 w-4 text-primary"
              />
            )}
            {locating ? "Detecting your location…" : "Use current location"}
          </button>

          {error && (
            <p role="alert" className="mt-2 text-xs font-medium text-destructive">
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
