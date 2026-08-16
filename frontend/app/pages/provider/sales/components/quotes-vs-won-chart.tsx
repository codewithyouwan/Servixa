"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { quotesVsWon } from "../../data/sales";

const chartConfig = {
  quotes: {
    label: "Quotes sent",
    color: "var(--chart-1)",
  },
  won: {
    label: "Jobs won",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export function QuotesVsWonChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quotes vs. jobs won</CardTitle>
        <CardDescription>Last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-72 w-full">
          <BarChart data={quotesVsWon} margin={{ left: 4, right: 4 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} width={32} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
            <Bar dataKey="quotes" fill="var(--color-quotes)" radius={4} isAnimationActive={false} />
            <Bar dataKey="won" fill="var(--color-won)" radius={4} isAnimationActive={false} />
            <ChartLegend content={<ChartLegendContent />} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
