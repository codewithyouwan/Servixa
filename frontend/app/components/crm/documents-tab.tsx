"use client";

import type { CrmDocument } from "@/lib/types";
import { CRM_DOCUMENT_CATEGORIES, CRM_DOCUMENT_CATEGORY_ORDER } from "@/lib/constants/crm-document-categories";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs";
import { CrmDocumentList } from "./crm-document-list";
import { AddCrmDocumentDialog } from "./add-crm-document-dialog";

/** Documents is a section with real sub-categories, so — unlike the other
 * CRM sections — it gets its own horizontal tab bar for License / Insurance
 * / Contract / Photo. Same pattern as the Home Digital Twin's
 * DigitalTwinTabs: horizontal tabs for sub-categories *within* a section,
 * not for switching between top-level sections (that's the sidebar tree). */
export function DocumentsTab({
  documents,
  onChange,
}: {
  documents: CrmDocument[];
  onChange: () => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <AddCrmDocumentDialog onCreated={onChange} />
      </div>

      <Tabs defaultValue="license">
        <TabsList>
          {CRM_DOCUMENT_CATEGORY_ORDER.map((category) => {
            const { label, icon: Icon } = CRM_DOCUMENT_CATEGORIES[category];
            const count = documents.filter((d) => d.category === category).length;
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

        {CRM_DOCUMENT_CATEGORY_ORDER.map((category) => (
          <TabsPanel key={category} value={category}>
            <CrmDocumentList category={category} documents={documents} />
          </TabsPanel>
        ))}
      </Tabs>
    </div>
  );
}
