import { cn } from "@/lib/utils";

/**
 * BestBuild "Pillar" mark — two mirrored B's back to back (5:8 Fibonacci
 * bowls), per the brand identity spec. One B represents the homeowner, the
 * other the builder; the channel of light between them is the platform.
 * Pure stroke paths (no fills), so it scales cleanly from favicon to hero.
 */

const INK = "#212832";
const TEAL = "#157E7C";
const WHITE = "#FFFFFF";

const LEFT_B =
  "M41.5 17.5 V82.5 M41.5 17.5 H34 A12.5 12.5 0 0 0 34 42.5 A20 20 0 0 0 34 82.5 H41.5";
const RIGHT_B =
  "M58.5 17.5 V82.5 M58.5 17.5 H66 A12.5 12.5 0 0 1 66 42.5 A20 20 0 0 1 66 82.5 H58.5";

export type LogoTone = "two-tone" | "light" | "ink" | "accent";

interface LogoMarkProps {
  className?: string;
  size?: number;
  /**
   * "two-tone" (default) — ink left B, teal right B, for light backgrounds.
   * "light" — both B's white, for dark/colored backgrounds.
   * "ink" — both B's ink, for a single-color mono treatment.
   * "accent" — both B's teal.
   */
  tone?: LogoTone;
  strokeWidth?: number;
}

export function LogoMark({ className, size = 32, tone = "two-tone", strokeWidth = 10 }: LogoMarkProps) {
  const leftColor = tone === "two-tone" ? INK : tone === "light" ? WHITE : tone === "accent" ? TEAL : INK;
  const rightColor = tone === "two-tone" ? TEAL : tone === "light" ? WHITE : tone === "accent" ? TEAL : INK;

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      aria-hidden="true"
      className={cn("shrink-0", className)}
    >
      <path
        d={LEFT_B}
        fill="none"
        stroke={leftColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={RIGHT_B}
        fill="none"
        stroke={rightColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Mark on a solid teal rounded tile — app-icon / favicon treatment. */
export function LogoTile({ className, size = 40 }: { className?: string; size?: number }) {
  return (
    <div
      aria-hidden="true"
      className={cn("flex shrink-0 items-center justify-center rounded-[22%] bg-primary", className)}
      style={{ width: size, height: size }}
    >
      <LogoMark size={size * 0.76} tone="light" />
    </div>
  );
}

interface LogoProps {
  className?: string;
  markSize?: number;
  wordmarkClassName?: string;
  tone?: LogoTone;
  /** Hide the "BestBuild" wordmark and render only the mark. */
  markOnly?: boolean;
}

/** Full lockup: mark + "BestBuild" wordmark, used in navbars, sidebars, footers. */
export function Logo({ className, markSize = 32, wordmarkClassName, tone = "two-tone", markOnly = false }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark size={markSize} tone={tone} />
      {!markOnly && (
        <span
          className={cn(
            "text-lg font-semibold tracking-tight",
            tone === "light" ? "text-white" : "text-foreground",
            wordmarkClassName,
          )}
        >
          Best
          <span className={tone === "light" ? "text-white/70" : "text-primary"}>Build</span>
        </span>
      )}
    </span>
  );
}
