import type { Metadata } from "next";
import { CalendarDays, TrendingDown, TrendingUp } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  dashboardStats,
  recentActivity,
  upcomingAppointments,
  type Appointment,
  type StatCard,
} from "../data/dashboard";
import { JobsByServiceChart } from "./components/jobs-by-service-chart";
import { RevenueChart } from "./components/revenue-chart";

export const metadata: Metadata = {
  title: "Dashboard — BestBuild Provider",
};

const appointmentBadge: Record<Appointment["type"], { label: string; className: string }> = {
  "site-visit": { label: "Site visit", className: "bg-secondary text-secondary-foreground" },
  inspection: { label: "Inspection", className: "bg-accent text-accent-foreground" },
  delivery: { label: "Delivery", className: "bg-muted text-muted-foreground" },
  meeting: { label: "Meeting", className: "bg-primary/10 text-primary" },
};

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function StatCardItem({ stat }: { stat: StatCard }) {
  const up = stat.change >= 0;
  return (
    <Card>
      <CardHeader>
        <CardDescription>{stat.label}</CardDescription>
        <CardTitle className="text-2xl tabular-nums lg:text-3xl">{stat.value}</CardTitle>
        <CardAction>
          <Badge
            variant="outline"
            className={
              up
                ? "text-tea-green-700 dark:text-tea-green-400"
                : "text-destructive"
            }
          >
            {up ? <TrendingUp /> : <TrendingDown />}
            {up ? "+" : ""}
            {stat.change}%
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">{stat.hint}</p>
      </CardContent>
    </Card>
  );
}

export default function ProviderDashboardPage() {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => (
          <StatCardItem key={stat.label} stat={stat} />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <RevenueChart />
          <JobsByServiceChart />
        </div>
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent activity</CardTitle>
              <CardDescription>Latest updates across your jobs</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <Avatar size="sm" className="mt-0.5">
                    <AvatarFallback>{initials(activity.actor)}</AvatarFallback>
                  </Avatar>
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <p className="text-sm leading-snug">
                      <span className="font-medium">{activity.actor}</span>{" "}
                      <span className="text-muted-foreground">{activity.action}</span>{" "}
                      <span className="font-medium">{activity.target}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Upcoming appointments</CardTitle>
              <CardDescription>Next few days</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col">
              {upcomingAppointments.map((appointment, index) => (
                <div key={appointment.id}>
                  {index > 0 && <Separator className="my-3" />}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 flex-col gap-1">
                      <p className="truncate text-sm font-medium">{appointment.title}</p>
                      <p className="text-xs text-muted-foreground">{appointment.client}</p>
                      <Badge className={appointmentBadge[appointment.type].className}>
                        {appointmentBadge[appointment.type].label}
                      </Badge>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
                      <CalendarDays className="size-3.5" />
                      <span>
                        {appointment.date} · {appointment.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
