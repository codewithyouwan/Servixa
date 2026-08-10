import type { Metadata } from "next";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProviderHeader } from "./components/provider-header";
import { ProviderSidebar } from "./components/provider-sidebar";

export const metadata: Metadata = {
  title: "Provider Portal — BestBuild",
  description: "Manage your leads, jobs, and clients on BestBuild.",
};

export default function ProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <ProviderSidebar />
        <SidebarInset>
          <ProviderHeader />
          <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
