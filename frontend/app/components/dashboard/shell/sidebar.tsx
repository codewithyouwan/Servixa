"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Bot, Briefcase, Building2, ChevronRight, FolderKanban, FolderLock, LayoutDashboard, MessageSquare, ReceiptText, Search, Settings } from "lucide-react";

import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants/routes";
import { CRM_SECTIONS } from "@/lib/constants/crm-sections";
import { BRAND_SECTIONS } from "@/lib/constants/brand-sections";
import { useAuth } from "@/app/components/providers/auth-provider";

const HOMEOWNER_NAV_ITEMS = [
  { label: "Dashboard", href: ROUTES.dashboard, icon: LayoutDashboard },
  { label: "Projects", href: ROUTES.projects, icon: FolderKanban },
  { label: "Quotes", href: ROUTES.quotes, icon: ReceiptText },
  { label: "Home Digital Twin", href: ROUTES.digitalTwin, icon: FolderLock },
  { label: "Messages", href: ROUTES.messages, icon: MessageSquare },
  { label: "Find Contractors", href: ROUTES.providers, icon: Search },
  { label: "AI Assistant", href: ROUTES.assistant, icon: Bot },
] as const;

// CRM and Brand Profile are each a whole module (they'll keep growing), so
// they get their own expandable group instead of one flat link — same idea
// as a folder in a file tree. Section lists live in lib/constants/crm-
// sections.ts and brand-sections.ts, shared with each module's page content
// header so the two can't drift apart. CollapsibleNavGroup below renders
// either one — same expand/collapse behavior, different data.

const CONTRACTOR_TOP_ITEMS = [
  { label: "Dashboard", href: ROUTES.dashboard, icon: LayoutDashboard },
] as const;

const CONTRACTOR_BOTTOM_ITEMS = [
  { label: "Messages", href: ROUTES.messages, icon: MessageSquare },
  { label: "AI Assistant", href: ROUTES.assistant, icon: Bot },
] as const;

const BRAND_TOP_ITEMS = [
  { label: "Dashboard", href: ROUTES.dashboard, icon: LayoutDashboard },
] as const;

const BRAND_BOTTOM_ITEMS = [
  { label: "Messages", href: ROUTES.messages, icon: MessageSquare },
] as const;

function NavLink({
  href,
  label,
  icon: Icon,
  active,
  indent,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
  indent?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-2.5 rounded-lg py-2 text-sm font-medium transition-colors",
        indent ? "pr-3 pl-9" : "px-3",
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
      )}
    >
      <Icon className="size-4 shrink-0" aria-hidden />
      {label}
    </Link>
  );
}

type IconType = React.ComponentType<{ className?: string }>;

/** Expandable module group in the sidebar tree (CRM, Brand Profile — any
 * role-specific module with its own set of sub-sections). Auto-expands on
 * entering the module (deep-links, back/forward) but stays toggle-able by
 * hand — same as VS Code keeping a folder open while you're inside it, but
 * letting you collapse it manually. Adjusted during render (not an effect)
 * per React's "adjusting state on prop change" pattern — avoids the extra
 * render pass an effect-based sync would cause. */
function CollapsibleNavGroup({
  icon: Icon,
  label,
  basePath,
  sections,
  activeTab,
}: {
  icon: IconType;
  label: string;
  basePath: string;
  sections: ReadonlyArray<{ value: string; label: string; icon: IconType }>;
  activeTab: string;
}) {
  const pathname = usePathname();
  const onModule = pathname.startsWith(basePath);

  const [open, setOpen] = useState(onModule);
  const [wasOnModule, setWasOnModule] = useState(onModule);
  if (onModule !== wasOnModule) {
    setWasOnModule(onModule);
    if (onModule) setOpen(true);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={cn(
          "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          onModule
            ? "text-sidebar-foreground"
            : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
        )}
      >
        <ChevronRight className={cn("size-3.5 shrink-0 transition-transform", open && "rotate-90")} aria-hidden />
        <Icon className="size-4 shrink-0" aria-hidden />
        {label}
      </button>

      {open && (
        <div className="flex flex-col gap-0.5">
          {sections.map(({ value, label: sectionLabel, icon: SectionIcon }) => (
            <NavLink
              key={value}
              href={`${basePath}?tab=${value}`}
              label={sectionLabel}
              icon={SectionIcon}
              active={onModule && activeTab === value}
              indent
            />
          ))}
        </div>
      )}
    </>
  );
}

function ContractorNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") ?? "dashboard";

  return (
    <>
      {CONTRACTOR_TOP_ITEMS.map(({ href, label, icon }) => (
        <NavLink key={href} href={href} label={label} icon={icon} active={pathname === href} />
      ))}

      <CollapsibleNavGroup
        icon={Briefcase}
        label="CRM"
        basePath={ROUTES.crm}
        sections={CRM_SECTIONS}
        activeTab={activeTab}
      />

      {CONTRACTOR_BOTTOM_ITEMS.map(({ href, label, icon }) => (
        <NavLink key={href} href={href} label={label} icon={icon} active={pathname.startsWith(href)} />
      ))}
    </>
  );
}

function BrandNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") ?? "overview";

  return (
    <>
      {BRAND_TOP_ITEMS.map(({ href, label, icon }) => (
        <NavLink key={href} href={href} label={label} icon={icon} active={pathname === href} />
      ))}

      <CollapsibleNavGroup
        icon={Building2}
        label="Brand Profile"
        basePath={ROUTES.brand}
        sections={BRAND_SECTIONS}
        activeTab={activeTab}
      />

      {BRAND_BOTTOM_ITEMS.map(({ href, label, icon }) => (
        <NavLink key={href} href={href} label={label} icon={icon} active={pathname.startsWith(href)} />
      ))}
    </>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const isContractor = user?.role === "service_provider";
  const isBrand = user?.role === "brand";

  return (
    <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
      <div className="flex h-14 items-center border-b border-sidebar-border px-5">
        <Link href={ROUTES.home} className="text-base font-semibold tracking-tight text-sidebar-foreground">
          Best<span className="text-primary">Build</span>
        </Link>
      </div>

      <nav aria-label="Dashboard" className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3">
        {isContractor ? (
          <ContractorNav />
        ) : isBrand ? (
          <BrandNav />
        ) : (
          HOMEOWNER_NAV_ITEMS.map(({ href, label, icon }) => (
            <NavLink
              key={href}
              href={href}
              label={label}
              icon={icon}
              active={href === ROUTES.dashboard ? pathname === href : pathname.startsWith(href)}
            />
          ))
        )}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <Link
          href={ROUTES.settings}
          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
        >
          <Settings className="size-4 shrink-0" aria-hidden />
          Settings
        </Link>
      </div>
    </aside>
  );
}
