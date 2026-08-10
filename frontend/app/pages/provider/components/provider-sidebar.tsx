"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  FolderOpen,
  HardHat,
  KanbanSquare,
  LayoutDashboard,
  MessageSquare,
  Receipt,
  StickyNote,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { provider } from "../data/provider";
import { conversations } from "../data/chats";

const BASE = "/pages/provider";

const dashboardLinks = [
  { href: `${BASE}/dashboard`, label: "Dashboard", icon: LayoutDashboard },
  { href: `${BASE}/crm`, label: "CRM", icon: Users },
  { href: `${BASE}/projects`, label: "Project Management", icon: KanbanSquare },
  { href: `${BASE}/sales`, label: "Sales", icon: Receipt },
];

const appLinks = [
  { href: `${BASE}/files`, label: "File Manager", icon: FolderOpen },
  { href: `${BASE}/notes`, label: "Notes", icon: StickyNote },
  { href: `${BASE}/chats`, label: "Chats", icon: MessageSquare },
  { href: `${BASE}/calendar`, label: "Calendar", icon: Calendar },
];

const unreadTotal = conversations.reduce((sum, c) => sum + c.unread, 0);

export function ProviderSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href={`${BASE}/dashboard`} />}>
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <HardHat className="size-4" />
              </div>
              <div className="grid flex-1 text-left leading-tight">
                <span className="truncate font-semibold">BestBuild</span>
                <span className="truncate text-xs text-muted-foreground">Provider Portal</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboards</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {dashboardLinks.map((link) => (
                <SidebarMenuItem key={link.href}>
                  <SidebarMenuButton
                    tooltip={link.label}
                    isActive={pathname === link.href}
                    render={<Link href={link.href} />}
                  >
                    <link.icon />
                    <span>{link.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Apps</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {appLinks.map((link) => (
                <SidebarMenuItem key={link.href}>
                  <SidebarMenuButton
                    tooltip={link.label}
                    isActive={pathname === link.href}
                    render={<Link href={link.href} />}
                  >
                    <link.icon />
                    <span>{link.label}</span>
                  </SidebarMenuButton>
                  {link.label === "Chats" && unreadTotal > 0 && (
                    <SidebarMenuBadge>{unreadTotal}</SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip={provider.name}>
              <Avatar className="size-8 rounded-lg">
                <AvatarFallback className="rounded-lg bg-primary/10 text-primary">
                  {provider.initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left leading-tight">
                <span className="truncate text-sm font-medium">{provider.name}</span>
                <span className="truncate text-xs text-muted-foreground">{provider.company}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
