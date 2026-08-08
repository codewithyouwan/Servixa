import { ClipboardList } from "lucide-react";

import type { Order } from "@/lib/types";
import { ORDER_STATUS } from "@/lib/constants/crm-status";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/app/components/dashboard/states";

export function OrdersTab({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="No orders yet"
        description="Accepted quotes become orders here, with scheduling and job status."
      />
    );
  }

  return (
    <div className="space-y-2">
      {orders.map((order) => (
        <Card key={order.id} size="sm">
          <CardContent className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-medium">{order.title}</p>
                <Badge variant="muted" className={ORDER_STATUS[order.status].className}>
                  {ORDER_STATUS[order.status].label}
                </Badge>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {order.customerName}
                {order.completedDate
                  ? ` · completed ${formatDate(order.completedDate)}`
                  : order.scheduledDate
                    ? ` · scheduled ${formatDate(order.scheduledDate)}`
                    : ""}
              </p>
            </div>
            <span className="shrink-0 text-sm font-medium tabular-nums">
              {formatCurrency(order.amount)}
            </span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
