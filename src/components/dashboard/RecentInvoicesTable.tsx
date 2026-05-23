import { Link } from "react-router-dom";
import { ArrowUpRight, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { calculateTotals } from "@/lib/calculations";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Invoice, PaymentStatus } from "@/types/invoice";

const statusVariant: Record<
  PaymentStatus,
  "secondary" | "warning" | "success" | "danger" | "outline"
> = {
  draft: "secondary",
  pending: "warning",
  paid: "success",
  overdue: "danger",
};

interface RecentInvoicesTableProps {
  drafts: Invoice[];
  onOpen: (invoice: Invoice) => void;
}

export function RecentInvoicesTable({ drafts, onOpen }: RecentInvoicesTableProps) {
  const recent = drafts.slice(0, 8);

  return (
    <div className="dashboard-panel overflow-hidden">
      <div className="flex flex-col gap-4 border-b border-border/60 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Activity
          </p>
          <h3 className="text-lg font-semibold tracking-tight">Recent invoices</h3>
          <p className="text-[13px] text-muted-foreground">
            Saved drafts and issued invoices
          </p>
        </div>
        <Button variant="outline" size="sm" className="h-9 shrink-0" asChild>
          <Link to="/drafts">
            View all
            <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
          </Link>
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/60 text-left">
              <th className="px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                Invoice
              </th>
              <th className="px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                Client
              </th>
              <th className="hidden px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground md:table-cell">
                Date
              </th>
              <th className="px-6 py-3.5 text-right text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                Amount
              </th>
              <th className="px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                Status
              </th>
              <th className="w-24 px-6 py-3.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {recent.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-16">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border/80 bg-muted/30">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="mt-4 text-sm font-medium text-foreground">No invoices yet</p>
                    <p className="mt-1 max-w-xs text-[13px] text-muted-foreground">
                      Create your first invoice to see activity and revenue metrics here.
                    </p>
                    <Button size="sm" className="mt-5" asChild>
                      <Link to="/create">Create invoice</Link>
                    </Button>
                  </div>
                </td>
              </tr>
            ) : (
              recent.map((inv) => {
                const total = calculateTotals(inv.items, inv.discountPercent).grandTotal;
                return (
                  <tr
                    key={inv.id}
                    className="group transition-colors hover:bg-muted/25"
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono text-[13px] font-medium tracking-tight">
                        {inv.invoiceNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[13px] font-medium text-foreground">
                        {inv.client.name || "—"}
                      </span>
                      {inv.client.company && (
                        <p className="mt-0.5 text-[12px] text-muted-foreground">
                          {inv.client.company}
                        </p>
                      )}
                    </td>
                    <td className="hidden px-6 py-4 text-[13px] text-muted-foreground md:table-cell">
                      {formatDate(inv.invoiceDate)}
                    </td>
                    <td className="px-6 py-4 text-right text-[13px] font-medium tabular-nums">
                      {formatCurrency(total, inv.currency)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={statusVariant[inv.paymentStatus]} className="capitalize">
                        {inv.paymentStatus}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 opacity-70 group-hover:opacity-100"
                        onClick={() => onOpen(inv)}
                      >
                        Open
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
