import type { CrmDocument } from "@/lib/types";
import { CRM_DOCUMENT_CATEGORIES } from "@/lib/constants/crm-document-categories";
import { formatDate } from "@/lib/utils/format";
import { getWarrantyStatus, formatDaysUntil, WARRANTY_STATUS_CONFIG } from "@/lib/utils/warranty";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

/** One row per business document — mirrors the Home Digital Twin's
 * DocumentCard. License/insurance are compliance docs with an expiry, same
 * concept as a homeowner warranty, so this reuses that helper. */
export function CrmDocumentCard({ document }: { document: CrmDocument }) {
  const { icon: Icon, label } = CRM_DOCUMENT_CATEGORIES[document.category];
  const expiryStatus = document.expiresAt ? getWarrantyStatus(document.expiresAt) : null;

  return (
    <Card size="sm">
      <CardContent className="flex items-start gap-3">
        <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary">
          <Icon className="size-4 text-secondary-foreground" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <p className="truncate text-sm font-medium">{document.title}</p>
            {expiryStatus && document.expiresAt && (
              <Badge variant="muted" className={WARRANTY_STATUS_CONFIG[expiryStatus].className}>
                {formatDaysUntil(document.expiresAt)}
              </Badge>
            )}
          </div>
          <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span>{label}</span>
            {document.issuer && <span>{document.issuer}</span>}
            {document.linkedCustomer && <span>{document.linkedCustomer}</span>}
            <span>{formatDate(document.uploadedAt)}</span>
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
