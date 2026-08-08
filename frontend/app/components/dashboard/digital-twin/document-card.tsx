import type { HomeDocument } from "@/lib/homeowner/types";
import { DOCUMENT_CATEGORIES } from "@/lib/homeowner/constants/document-categories";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { getWarrantyStatus, formatDaysUntil, WARRANTY_STATUS_CONFIG } from "@/lib/utils/warranty";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

/** One row per document. Category-aware: an invoice shows vendor + amount, a
 * warranty shows an expiry badge, photos/manuals show just the file meta —
 * one component instead of four, since the only real difference is which
 * optional fields are populated (mirrors the backend's single `docs` shape). */
export function DocumentCard({ document }: { document: HomeDocument }) {
  const { icon: Icon } = DOCUMENT_CATEGORIES[document.category];
  const warrantyStatus =
    document.category === "warranty" ? getWarrantyStatus(document.expiresAt) : null;

  return (
    <Card size="sm">
      <CardContent className="flex items-start gap-3">
        <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary">
          <Icon className="size-4 text-secondary-foreground" aria-hidden />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <p className="truncate text-sm font-medium">{document.title}</p>
            {warrantyStatus && document.expiresAt && (
              <Badge variant="muted" className={WARRANTY_STATUS_CONFIG[warrantyStatus].className}>
                {formatDaysUntil(document.expiresAt)}
              </Badge>
            )}
            {document.category === "invoice" && document.amount != null && (
              <span className="shrink-0 text-sm font-medium tabular-nums">
                {formatCurrency(document.amount)}
              </span>
            )}
          </div>

          <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            {document.vendor && <span>{document.vendor}</span>}
            {document.brand && <span>{document.brand}</span>}
            {document.linkedAppliance && <span>{document.linkedAppliance}</span>}
            <span>{formatDate(document.uploadedAt)}</span>
            <span className="uppercase">{document.fileType}</span>
          </p>

          {document.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {document.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
