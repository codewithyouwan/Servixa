import type { DocumentCategory, HomeDocument } from "@/lib/homeowner/types";
import { DOCUMENT_CATEGORIES } from "@/lib/homeowner/constants/document-categories";
import { DocumentCard } from "./document-card";
import { EmptyState } from "@/app/components/shared/states";

export function DocumentList({
  category,
  documents,
}: {
  category: DocumentCategory;
  documents: HomeDocument[];
}) {
  const config = DOCUMENT_CATEGORIES[category];
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
        <DocumentCard key={doc.id} document={doc} />
      ))}
    </div>
  );
}
