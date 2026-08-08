import type { BrandDownload } from "@/lib/brand/types";
import { DOWNLOAD_CATEGORIES } from "@/lib/brand/constants";
import { formatDate } from "@/lib/utils/format";
import { Card, CardContent } from "@/components/ui/card";

/** Mirrors the Home Digital Twin's DocumentCard / CRM's CrmDocumentCard —
 * one row per download. */
export function DownloadCard({ download }: { download: BrandDownload }) {
  const { icon: Icon, label } = DOWNLOAD_CATEGORIES[download.category];

  return (
    <Card size="sm">
      <CardContent className="flex items-start gap-3">
        <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary">
          <Icon className="size-4 text-secondary-foreground" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{download.title}</p>
          <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span>{label}</span>
            {download.linkedProductName && <span>{download.linkedProductName}</span>}
            <span>{formatDate(download.uploadedAt)}</span>
            <span className="uppercase">{download.fileType}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
