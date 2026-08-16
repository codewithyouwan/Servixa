"use client";

import { Bar, BarChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { jobsByService } from "../../data/dashboard";

const chartConfig = {
  jobs: {
    label: "Jobs",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function JobsByServiceChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Jobs by service</CardTitle>
        <CardDescription>Completed and active jobs per service</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-56 w-full">
          <BarChart data={jobsByService} layout="vertical" margin={{ left: 8, right: 8 }}>
            <XAxis type="number" dataKey="jobs" hide />
            <YAxis
              dataKey="service"
              type="category"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={120}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="jobs" fill="var(--color-jobs)" radius={4} isAnimationActive={false} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
