import { Users } from "lucide-react";

import type { Customer } from "@/lib/provider/types";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/app/components/shared/states";

export function CustomersTab({ customers }: { customers: Customer[] }) {
  if (customers.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No customers yet"
        description="Customers are derived from your leads and quotes — once you have one, they'll show up here."
      />
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Customer</TableHead>
          <TableHead>Jobs</TableHead>
          <TableHead>Total spent</TableHead>
          <TableHead>Last activity</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.map((customer) => (
          <TableRow key={customer.id}>
            <TableCell>
              <p className="font-medium">{customer.name}</p>
              {customer.email && <p className="text-xs text-muted-foreground">{customer.email}</p>}
            </TableCell>
            <TableCell className="tabular-nums">{customer.totalJobs}</TableCell>
            <TableCell className="tabular-nums">{formatCurrency(customer.totalSpent)}</TableCell>
            <TableCell className="text-muted-foreground">{formatDate(customer.lastActivityAt)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
