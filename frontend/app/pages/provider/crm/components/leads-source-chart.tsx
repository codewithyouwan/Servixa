"use client";

import { Label, Pie, PieChart } from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { leadsBySource } from "../../data/crm";

const chartConfig = {
  leads: { label: "Leads" },
  "AI Match": { label: "AI Match", color: "var(--chart-1)" },
  "Marketplace Search": { label: "Marketplace Search", color: "var(--chart-2)" },
  Referrals: { label: "Referrals", color: "var(--chart-3)" },
  Direct: { label: "Direct", color: "var(--chart-4)" },
} satisfies ChartConfig;

const totalLeads = leadsBySource.reduce((sum, item) => sum + item.leads, 0);

export function LeadsSourceChart() {
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[280px] w-full"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel nameKey="source" />}
        />
        <Pie
          data={leadsBySource}
          dataKey="leads"
          nameKey="source"
          innerRadius={60}
          strokeWidth={5}
          isAnimationActive={false}
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-2xl font-bold"
                    >
                      {totalLeads}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy ?? 0) + 22}
                      className="fill-muted-foreground text-xs"
                    >
                      Leads
                    </tspan>
                  </text>
                );
              }
              return null;
            }}
          />
        </Pie>
        <ChartLegend
          content={<ChartLegendContent nameKey="source" className="flex-wrap" />}
        />
      </PieChart>
    </ChartContainer>
  );
}
