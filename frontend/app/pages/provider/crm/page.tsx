import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  crmStats,
  crmTasks,
  quarterTarget,
  recentLeads,
  salesPipeline,
  type CrmTask,
  type Lead,
} from "../data/crm";
import { LeadsSourceChart } from "./components/leads-source-chart";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const stageBarColors = [
  "bg-chart-1",
  "bg-chart-2",
  "bg-chart-3",
  "bg-chart-4",
  "bg-chart-5",
];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");
}

function priorityBadge(priority: CrmTask["priority"]) {
  if (priority === "high") return <Badge variant="destructive">High</Badge>;
  if (priority === "medium") return <Badge variant="secondary">Medium</Badge>;
  return <Badge variant="outline">Low</Badge>;
}

function stageBadge(stage: Lead["stage"]) {
  if (stage === "Won") {
    return (
      <Badge
        variant="outline"
        className="border-transparent bg-chart-3/15 text-chart-3"
      >
        Won
      </Badge>
    );
  }
  if (stage === "Lost") return <Badge variant="destructive">Lost</Badge>;
  if (stage === "New") return <Badge variant="outline">New</Badge>;
  return <Badge variant="secondary">{stage}</Badge>;
}

export default function CrmPage() {
  const targetPercent = Math.round(
    (quarterTarget.current / quarterTarget.target) * 100
  );
  const maxDeals = salesPipeline[0].deals;

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {crmStats.map((stat) => {
          const up = stat.change >= 0;
          return (
            <Card key={stat.label}>
              <CardHeader>
                <CardDescription>{stat.label}</CardDescription>
                <CardTitle className="text-2xl tabular-nums">
                  {stat.value}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span
                  className={
                    up
                      ? "inline-flex items-center gap-0.5 font-medium text-chart-3"
                      : "inline-flex items-center gap-0.5 font-medium text-destructive"
                  }
                >
                  {up ? (
                    <ArrowUpRight className="size-3.5" />
                  ) : (
                    <ArrowDownRight className="size-3.5" />
                  )}
                  {Math.abs(stat.change)}%
                </span>
                {stat.hint}
              </CardContent>
            </Card>
          );
        })}
        <Card>
          <CardHeader>
            <CardDescription>{quarterTarget.label}</CardDescription>
            <CardTitle className="text-2xl tabular-nums">
              {currency.format(quarterTarget.current)}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Progress value={targetPercent} />
            <p className="text-xs text-muted-foreground">
              {targetPercent}% of {currency.format(quarterTarget.target)} target
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Leads by source</CardTitle>
            <CardDescription>Where your leads come from</CardDescription>
          </CardHeader>
          <CardContent>
            <LeadsSourceChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Sales pipeline</CardTitle>
            <CardDescription>Deals by stage</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            {salesPipeline.map((stage, index) => (
              <div key={stage.stage} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{stage.stage}</span>
                  <span className="text-muted-foreground">
                    {stage.deals} deals ·{" "}
                    <span className="font-medium text-foreground tabular-nums">
                      {currency.format(stage.value)}
                    </span>
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full ${stageBarColors[index % stageBarColors.length]}`}
                    style={{ width: `${(stage.deals / maxDeals) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Tasks</CardTitle>
            <CardDescription>Your follow-ups and to-dos</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {crmTasks.map((task) => (
              <div key={task.id} className="flex items-start gap-3">
                <Checkbox defaultChecked={task.done} className="mt-0.5" />
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <span
                    className={
                      task.done
                        ? "text-sm text-muted-foreground line-through"
                        : "text-sm"
                    }
                  >
                    {task.title}
                  </span>
                  <div className="flex items-center gap-2">
                    {priorityBadge(task.priority)}
                    <span className="text-xs text-muted-foreground">
                      Due {task.due}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent leads</CardTitle>
            <CardDescription>Latest homeowner requests</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Homeowner</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead className="hidden xl:table-cell">Location</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead className="hidden text-right 2xl:table-cell">
                    Last activity
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar size="sm">
                          <AvatarFallback>
                            {initials(lead.homeowner)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium">{lead.homeowner}</span>
                          <span className="text-xs text-muted-foreground">
                            {lead.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{lead.project}</TableCell>
                    <TableCell className="hidden text-muted-foreground xl:table-cell">
                      {lead.location}
                    </TableCell>
                    <TableCell className="tabular-nums">{lead.budget}</TableCell>
                    <TableCell>{stageBadge(lead.stage)}</TableCell>
                    <TableCell className="hidden text-right text-muted-foreground 2xl:table-cell">
                      {lead.lastActivity}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
