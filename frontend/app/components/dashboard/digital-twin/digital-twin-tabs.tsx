"use client";

import { History } from "lucide-react";

import type { DigitalTwinData } from "@/lib/homeowner/hooks/use-digital-twin";
import { DOCUMENT_CATEGORIES, DOCUMENT_CATEGORY_ORDER } from "@/lib/homeowner/constants/document-categories";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs";
import { DocumentList } from "./document-list";
import { ServiceHistoryList } from "./service-history-list";

export function DigitalTwinTabs({ documents, serviceRecords }: DigitalTwinData) {
  return (
    <Tabs defaultValue="invoice">
      <TabsList>
        {DOCUMENT_CATEGORY_ORDER.map((category) => {
          const { label, icon: Icon } = DOCUMENT_CATEGORIES[category];
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
        <TabsTab value="service_history">
          <History aria-hidden />
          Service History
          {serviceRecords.length > 0 && (
            <span className="rounded-full bg-background px-1.5 py-0.5 text-xs leading-none text-muted-foreground">
              {serviceRecords.length}
            </span>
          )}
        </TabsTab>
      </TabsList>

      {DOCUMENT_CATEGORY_ORDER.map((category) => (
        <TabsPanel key={category} value={category}>
          <DocumentList category={category} documents={documents} />
        </TabsPanel>
      ))}

      <TabsPanel value="service_history">
        <ServiceHistoryList records={serviceRecords} />
      </TabsPanel>
    </Tabs>
  );
}
