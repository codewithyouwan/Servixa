"use client";

/**
 * Renders whichever CRM section is active. Section switching now lives
 * entirely in the sidebar's collapsible CRM tree (sidebar.tsx) — this
 * component no longer renders its own horizontal tab bar, since that would
 * just be a second control for the exact same choice. Horizontal tabs are
 * reserved for sub-categories *within* a section (see DocumentsTab, which
 * still has one for License/Insurance/Contract/Photo).
 *
 * Still URL-driven (?tab=) rather than local state, because the sidebar
 * links and the Dashboard landing page's KPI cards both deep-link into
 * specific sections via that same query param.
 */

import { useSearchParams } from "next/navigation";

import type { CrmData } from "@/lib/hooks/use-crm";
import { CRM_SECTIONS, type CrmSectionValue } from "@/lib/constants/crm-sections";
import { DashboardTab } from "./dashboard-tab";
import { CustomersTab } from "./customers-tab";
import { LeadsTab } from "./leads-tab";
import { QuotesTab } from "./quotes-tab";
import { OrdersTab } from "./orders-tab";
import { InvoicesTab } from "./invoices-tab";
import { DocumentsTab } from "./documents-tab";

function SectionContent({ value, data, onChange }: { value: CrmSectionValue; data: CrmData; onChange: () => void }) {
  switch (value) {
    case "dashboard":
      return <DashboardTab dashboard={data.dashboard} />;
    case "leads":
      return <LeadsTab leads={data.leads} onChange={onChange} />;
    case "quotes":
      return <QuotesTab quotes={data.quotes} onChange={onChange} />;
    case "customers":
      return <CustomersTab customers={data.customers} />;
    case "orders":
      return <OrdersTab orders={data.orders} />;
    case "invoices":
      return <InvoicesTab invoices={data.invoices} onChange={onChange} />;
    case "documents":
      return <DocumentsTab documents={data.documents} onChange={onChange} />;
  }
}

export function CrmSection({ data, onChange }: { data: CrmData; onChange: () => void }) {
  const searchParams = useSearchParams();
  const activeValue = (searchParams.get("tab") as CrmSectionValue) ?? "dashboard";
  const section = CRM_SECTIONS.find((s) => s.value === activeValue) ?? CRM_SECTIONS[0];
  const Icon = section.icon;

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2.5">
        <Icon className="mt-0.5 size-5 shrink-0 text-muted-foreground" aria-hidden />
        <div>
          <h2 className="font-heading text-lg font-semibold tracking-tight">{section.label}</h2>
          <p className="text-sm text-muted-foreground">{section.description}</p>
        </div>
      </div>

      <SectionContent value={section.value} data={data} onChange={onChange} />
    </div>
  );
}
