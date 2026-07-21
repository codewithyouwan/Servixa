import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

interface TrustIndicatorsProps {
  /** Override the default set of trust indicators if needed. */
  items?: string[];
  className?: string;
}

const DEFAULT_ITEMS = [
  "Verified Service Providers",
  "AI-Powered Matching",
  "Free Project Posting",
];

/**
 * A row of short trust signals (e.g. "Verified Contractors"). Reusable
 * anywhere on the marketing site that needs the same quiet proof strip,
 * not just the Hero.
 */
export function TrustIndicators({
  items = DEFAULT_ITEMS,
  className,
}: TrustIndicatorsProps) {
  return (
    <ul className={cn("flex flex-wrap items-center gap-x-6 gap-y-2", className)}>
      {items.map((item) => (
        <li key={item} className="flex items-center gap-1.5">
          <Check aria-hidden="true" className="h-4 w-4 shrink-0 text-primary" />
          <span className="text-sm text-muted-foreground">{item}</span>
        </li>
      ))}
    </ul>
  );
}
