import { useNavigate } from "react-router-dom";
import { Trash2, FileEdit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useInvoice } from "@/context/InvoiceContext";
import { calculateTotals } from "@/lib/calculations";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { PaymentStatus } from "@/types/invoice";

const statusVariant: Record<
  PaymentStatus,
  "secondary" | "warning" | "success" | "danger"
> = {
  draft: "secondary",
  pending: "warning",
  paid: "success",
  overdue: "danger",
};

export function DraftsPage() {
  const navigate = useNavigate();
  const { drafts, loadDraft, removeDraft } = useInvoice();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Saved drafts</h1>
        <p className="text-sm text-muted-foreground">
          Invoices stored in your browser — up to 50 recent entries
        </p>
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>All invoices</CardTitle>
          <CardDescription>{drafts.length} saved locally</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {drafts.length === 0 ? (
            <p className="px-6 py-12 text-center text-muted-foreground">
              No drafts yet. Create an invoice and click Save draft.
            </p>
          ) : (
            <ul className="divide-y">
              {drafts.map((inv) => {
                const total = calculateTotals(inv.items, inv.discountPercent).grandTotal;
                return (
                  <li
                    key={inv.id}
                    className="flex flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between hover:bg-muted/20"
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <p className="font-medium">{inv.invoiceNumber}</p>
                        <Badge variant={statusVariant[inv.paymentStatus]}>
                          {inv.paymentStatus}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {inv.client.name || "No client"} · {formatDate(inv.invoiceDate)} ·{" "}
                        {formatCurrency(total, inv.currency)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          loadDraft(inv);
                          navigate("/create");
                        }}
                      >
                        <FileEdit className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDraft(inv.id)}
                        aria-label="Delete draft"
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
