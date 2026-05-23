import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className="shadow-soft">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent invoices</CardTitle>
          <CardDescription>Saved drafts and issued invoices</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/drafts">View all</Link>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40 text-left text-muted-foreground">
                <th className="px-6 py-3 font-medium">Invoice</th>
                <th className="px-6 py-3 font-medium">Client</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Amount</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {recent.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    No invoices yet.{" "}
                    <Link to="/create" className="font-medium text-foreground underline">
                      Create your first invoice
                    </Link>
                  </td>
                </tr>
              ) : (
                recent.map((inv) => {
                  const total = calculateTotals(inv.items, inv.discountPercent).grandTotal;
                  return (
                    <tr key={inv.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="px-6 py-4 font-medium">{inv.invoiceNumber}</td>
                      <td className="px-6 py-4">{inv.client.name || "—"}</td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {formatDate(inv.invoiceDate)}
                      </td>
                      <td className="px-6 py-4">{formatCurrency(total, inv.currency)}</td>
                      <td className="px-6 py-4">
                        <Badge variant={statusVariant[inv.paymentStatus]}>
                          {inv.paymentStatus}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm" onClick={() => onOpen(inv)}>
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
      </CardContent>
    </Card>
  );
}
