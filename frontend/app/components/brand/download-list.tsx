import type { BrandDownload, DownloadCategory } from "@/lib/brand/types";
import { DOWNLOAD_CATEGORIES } from "@/lib/brand/constants";
import { DownloadCard } from "./download-card";
import { EmptyState } from "@/app/components/shared/states";

export function DownloadList({
  category,
  downloads,
}: {
  category: DownloadCategory;
  downloads: BrandDownload[];
}) {
  const config = DOWNLOAD_CATEGORIES[category];
  const items = downloads.filter((d) => d.category === category);

  if (items.length === 0) {
    return (
      <EmptyState
        icon={config.icon}
        title={`No ${config.label.toLowerCase()} yet`}
        description={config.emptyDescription}
      />
    );
  }

  return (
    <div className="space-y-2">
      {items.map((download) => (
        <DownloadCard key={download.id} download={download} />
      ))}
    </div>
  );
}
