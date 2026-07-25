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
 * The default ZIP is shared across the app (hero search, floating search)
 * and seeded from the ZIP the user enters in their profile at sign-up.
 */
export const ZIP_STORAGE_KEY = "bestbuild.zip";

export const ZIP_PATTERN = /^\d{5}$/;

export function getSavedZip(): string {
  if (typeof window === "undefined") return "";
  const saved = localStorage.getItem(ZIP_STORAGE_KEY) ?? "";
  return ZIP_PATTERN.test(saved) ? saved : "";
}

export function saveZip(zip: string) {
  if (ZIP_PATTERN.test(zip)) localStorage.setItem(ZIP_STORAGE_KEY, zip);
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
    const trimmed = zip.trim();
    if (!ZIP_PATTERN.test(trimmed)) {
      setError("Enter a valid 5-digit ZIP code.");
      return;
    }
    saveZip(trimmed);
    onChange(trimmed);
    setOpen(false);
  }

  function handleSubmitDraft(event: FormEvent | KeyboardEvent) {
    event.preventDefault();
    commit(draft);
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
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const data = (await response.json()) as { postcode?: string };
          const zip = (data.postcode ?? "").slice(0, 5);
          if (ZIP_PATTERN.test(zip)) {
            commit(zip);
          } else {
            setError("Couldn't detect your ZIP — please enter it manually.");
          }
        } catch {
          setError("Couldn't detect your ZIP — please enter it manually.");
        } finally {
          setLocating(false);
        }
      },
      () => {
        setLocating(false);
        setError("Location permission denied — enter your ZIP manually.");
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
        aria-label={value ? `Location: ZIP ${value}` : "Set your ZIP code"}
        className={cn(
          "flex h-10 shrink-0 items-center gap-1.5 rounded-lg border-r border-border/60 px-2.5 text-sm font-medium transition-colors outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50",
          value ? "text-foreground" : "text-muted-foreground"
        )}
      >
        <MapPin aria-hidden="true" className="h-4 w-4 shrink-0 text-primary" />
        <span className="max-w-16 truncate tabular-nums">
          {value || "ZIP"}
        </span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Choose your location"
          className={cn(
            "absolute left-0 z-50 w-64 rounded-xl border border-border/70 bg-popover p-3 shadow-lg dark:shadow-black/50",
            popoverSide === "bottom" ? "top-full mt-2" : "bottom-full mb-2"
          )}
        >
          <label
            htmlFor={`${idPrefix}-zip-input`}
            className="text-xs font-semibold text-foreground"
          >
            ZIP code
          </label>
          <div className="mt-1.5 flex gap-2">
            <input
              ref={inputRef}
              id={`${idPrefix}-zip-input`}
              type="text"
              inputMode="numeric"
              autoComplete="postal-code"
              maxLength={5}
              placeholder="e.g. 75201"
              value={draft}
              onChange={(event) =>
                setDraft(event.target.value.replace(/\D/g, ""))
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
