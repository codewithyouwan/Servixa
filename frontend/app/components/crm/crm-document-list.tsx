import type { CrmDocument, CrmDocumentCategory } from "@/lib/types";
import { CRM_DOCUMENT_CATEGORIES } from "@/lib/constants/crm-document-categories";
import { CrmDocumentCard } from "./crm-document-card";
import { EmptyState } from "@/app/components/dashboard/states";

/** Mirrors the Home Digital Twin's DocumentList — filters to one category
 * and shows an EmptyState when there's nothing in it yet. */
export function CrmDocumentList({
  category,
  documents,
}: {
  category: CrmDocumentCategory;
  documents: CrmDocument[];
}) {
  const config = CRM_DOCUMENT_CATEGORIES[category];
  const items = documents.filter((d) => d.category === category);

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
      {items.map((doc) => (
        <CrmDocumentCard key={doc.id} document={doc} />
      ))}
    </div>
  );
}
