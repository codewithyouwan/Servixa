import Link from "next/link";
import { ArrowRight, Clock, MapPin, Users } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export interface Position {
  title: string;
  type: "Internship" | "Full-Time";
  openings: number;
  location: string;
  duration?: string;
  doTitle: string;
  doItems: string[];
  wantTitle: string;
  wantItems: string[];
  skills: string[];
}

/**
 * Rich job card: badges, meta chips, two-column detail lists, skill tags,
 * and an Apply button.
 */
export function JobCard({ position }: { position: Position }) {
  return (
    <article className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-blue-slate-200/60 sm:p-8">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                position.type === "Internship"
                  ? "bg-accent text-accent-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              {position.type}
            </span>
            <span className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-[10px] font-semibold text-muted-foreground">
              <Users aria-hidden="true" className="h-3 w-3" />
              {position.openings}{" "}
              {position.openings === 1 ? "opening" : "openings"}
            </span>
          </div>
          <h3 className="mt-3 text-xl font-semibold tracking-tight text-foreground">
            {position.title}
          </h3>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <MapPin aria-hidden="true" className="h-3.5 w-3.5" />
              {position.location}
            </span>
            {position.duration && (
              <span className="flex items-center gap-1.5">
                <Clock aria-hidden="true" className="h-3.5 w-3.5" />
                {position.duration}
              </span>
            )}
          </div>
        </div>

        <Link
          href="mailto:careers@bestbuild.com"
          className={cn(
            buttonVariants({ variant: "default", size: "lg" }),
            "group h-11 shrink-0 rounded-full px-6"
          )}
        >
          Apply
          <ArrowRight
            aria-hidden="true"
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </div>

      {/* Details */}
      <div className="mt-6 grid grid-cols-1 gap-6 border-t border-border/60 pt-6 md:grid-cols-2">
        <div>
          <h4 className="text-sm font-semibold text-foreground">
            {position.doTitle}
          </h4>
          <ul className="mt-3 space-y-2">
            {position.doItems.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground"
              >
                <span
                  aria-hidden="true"
                  className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground">
            {position.wantTitle}
          </h4>
          <ul className="mt-3 space-y-2">
            {position.wantItems.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground"
              >
                <span
                  aria-hidden="true"
                  className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Skills */}
      <div className="mt-6 flex flex-wrap gap-2 border-t border-border/60 pt-5">
        {position.skills.map((skill) => (
          <span
            key={skill}
            className="rounded-full border border-border/70 bg-muted/50 px-3 py-1 text-xs font-medium text-foreground/80"
          >
            {skill}
          </span>
        ))}
      </div>
    </article>
  );
}
