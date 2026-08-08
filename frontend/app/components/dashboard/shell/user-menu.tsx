"use client";

import { usePathname, useRouter } from "next/navigation";
import { Briefcase, Building2, Home, LogOut, Settings, UserRound } from "lucide-react";

import type { User } from "@/lib/types";
import { ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils";
import { initials } from "@/lib/utils/format";
import { useAuth } from "@/app/components/providers/auth-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserMenu({ user }: { user: User }) {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuth();
  const isContractor = user.role === "service_provider";
  const isBrand = user.role === "brand";

  // Full reload (not client-side nav) so the mock session re-reads ?role= —
  // see lib/auth/mock-session.ts. There's no real login yet, so this is how
  // to preview any side of the app; remove once real role-based auth ships.
  function previewAs(role: "homeowner" | "service_provider" | "brand") {
    window.location.href = `${pathname}?role=${role}`;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Account menu"
        className="rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <Avatar>
          {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt="" />}
          <AvatarFallback>{initials(user.name)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <div className="px-2.5 py-2">
          <p className="text-sm font-medium">{user.name}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push(ROUTES.settings)}>
          <UserRound aria-hidden /> Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(ROUTES.settings)}>
          <Settings aria-hidden /> Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="px-2.5 py-1.5 text-xs font-medium text-muted-foreground">
          Preview as (no login yet)
        </div>
        <DropdownMenuItem
          className={cn(user.role === "homeowner" && "pointer-events-none opacity-40")}
          onClick={() => previewAs("homeowner")}
        >
          <Home aria-hidden /> Homeowner
        </DropdownMenuItem>
        <DropdownMenuItem
          className={cn(isContractor && "pointer-events-none opacity-40")}
          onClick={() => previewAs("service_provider")}
        >
          <Briefcase aria-hidden /> Contractor
        </DropdownMenuItem>
        <DropdownMenuItem
          className={cn(isBrand && "pointer-events-none opacity-40")}
          onClick={() => previewAs("brand")}
        >
          <Building2 aria-hidden /> Brand
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive data-[highlighted]:bg-destructive/10 data-[highlighted]:text-destructive [&_svg]:text-destructive"
          onClick={async () => {
            await logout();
            router.push(ROUTES.login);
          }}
        >
          <LogOut aria-hidden /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
