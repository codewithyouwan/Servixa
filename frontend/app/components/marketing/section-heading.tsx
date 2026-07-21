import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  /** Word or phrase inside the title to render in serif italic. */
  accent?: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

/**
 * Consistent section header: uppercase eyebrow, large tracking-tight title
 * with optional serif-italic accent, supporting description.
 */
export function SectionHeading({
  eyebrow,
  title,
  accent,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  const parts = accent ? title.split(accent) : [title];

  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      <p className="text-xs font-semibold tracking-widest text-primary uppercase">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
        {accent && parts.length === 2 ? (
          <>
            {parts[0]}
            <em className="font-serif italic">{accent}</em>
            {parts[1]}
          </>
        ) : (
          title
        )}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 text-lg text-pretty text-muted-foreground",
            align === "center" && "mx-auto max-w-2xl"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
