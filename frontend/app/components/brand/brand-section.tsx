"use client";

/**
 * Renders whichever Brand Profile section is active. Mirrors
 * app/components/crm/crm-section.tsx exactly: section switching lives
 * entirely in the sidebar's collapsible Brand Profile tree (sidebar.tsx),
 * so this component has no horizontal tab bar of its own — just the active
 * section's header (icon + label + description) and content. Downloads is
 * the one section with its own horizontal sub-tabs (License/Insurance-style
 * categories), same exception CRM's Documents section has.
 */

import { useSearchParams } from "next/navigation";

import type { BrandData } from "@/lib/hooks/use-brand";
import { BRAND_SECTIONS, type BrandSectionValue } from "@/lib/constants/brand-sections";
import { OverviewTab } from "./overview-tab";
import { ProductsTab } from "./products-tab";
import { ProjectsTab } from "./projects-tab";
import { DownloadsTab } from "./downloads-tab";
import { DealersTab } from "./dealers-tab";
import { SupportTab } from "./support-tab";

function SectionContent({
  value,
  data,
  onChange,
}: {
  value: BrandSectionValue;
  data: BrandData;
  onChange: () => void;
}) {
  switch (value) {
    case "overview":
      return <OverviewTab overview={data.overview} onChange={onChange} />;
    case "products":
      return <ProductsTab products={data.products} onChange={onChange} />;
    case "projects":
      return <ProjectsTab projects={data.projects} onChange={onChange} />;
    case "downloads":
      return <DownloadsTab downloads={data.downloads} onChange={onChange} />;
    case "dealers":
      return <DealersTab dealers={data.dealers} onChange={onChange} />;
    case "support":
      return <SupportTab faqs={data.faqs} tickets={data.tickets} onChange={onChange} />;
  }
}

export function BrandSection({ data, onChange }: { data: BrandData; onChange: () => void }) {
  const searchParams = useSearchParams();
  const activeValue = (searchParams.get("tab") as BrandSectionValue) ?? "overview";
  const section = BRAND_SECTIONS.find((s) => s.value === activeValue) ?? BRAND_SECTIONS[0];
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
