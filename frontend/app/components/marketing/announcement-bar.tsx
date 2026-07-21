import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

/**
 * Slim announcement strip above the navbar, CrewAI-style.
 */
export function AnnouncementBar() {
  return (
    <div className="bg-space-indigo-950 text-blue-slate-50">
      <Link
        href="#ai-features"
        className="group mx-auto flex h-9 max-w-7xl items-center justify-center gap-2 px-4 text-xs font-medium outline-none focus-visible:ring-3 focus-visible:ring-muted-teal-400/60 sm:text-[13px]"
      >
        <Sparkles aria-hidden="true" className="h-3.5 w-3.5 text-tea-green-400" />
        <span className="truncate">
          NEW: The AI Project Assistant now writes your full scope of work
        </span>
        <ArrowRight
          aria-hidden="true"
          className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5"
        />
      </Link>
    </div>
  );
}
