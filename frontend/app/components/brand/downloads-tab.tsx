"use client";

import type { BrandDownload } from "@/lib/brand/types";
import { DOWNLOAD_CATEGORIES, DOWNLOAD_CATEGORY_ORDER } from "@/lib/brand/constants";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs";
import { DownloadList } from "./download-list";
import { AddDownloadDialog } from "./add-download-dialog";

/** Downloads has real sub-categories (Manuals/Spec Sheets/Install Guides/
 * Marketing), so — like CRM's Documents page — it gets its own horizontal
 * tab bar. Same pattern as digital-twin-tabs.tsx: horizontal tabs for
 * sub-categories *within* a page, not for switching between top-level
 * sections (that's the sidebar). */
export function DownloadsTab({
  downloads,
  onChange,
}: {
  downloads: BrandDownload[];
  onChange: () => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <AddDownloadDialog onCreated={onChange} />
      </div>

      <Tabs defaultValue="manual">
        <TabsList>
          {DOWNLOAD_CATEGORY_ORDER.map((category) => {
            const { label, icon: Icon } = DOWNLOAD_CATEGORIES[category];
            const count = downloads.filter((d) => d.category === category).length;
            return (
              <TabsTab key={category} value={category}>
                <Icon aria-hidden />
                {label}
                {count > 0 && (
                  <span className="rounded-full bg-background px-1.5 py-0.5 text-xs leading-none text-muted-foreground">
                    {count}
                  </span>
                )}
              </TabsTab>
            );
          })}
        </TabsList>

        {DOWNLOAD_CATEGORY_ORDER.map((category) => (
          <TabsPanel key={category} value={category}>
            <DownloadList category={category} downloads={downloads} />
          </TabsPanel>
        ))}
      </Tabs>
    </div>
  );
}
