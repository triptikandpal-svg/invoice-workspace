import { useNavigate } from "react-router-dom";
import { Trash2, FileEdit, FileText, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/PageHeader";
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
    <div className="page-shell space-y-8">
      <PageHeader
        eyebrow="Manage"
        title="Saved drafts"
        description="Invoices stored in your browser — up to 50 recent entries."
        actions={
          <Button onClick={() => navigate("/create")}>
            <Plus className="h-4 w-4" />
            New invoice
          </Button>
        }
      />

      <div className="app-panel overflow-hidden">
        <div className="flex items-center justify-between border-b border-border/60 px-6 py-4">
          <p className="text-[13px] text-muted-foreground">
            <span className="font-semibold text-foreground">{drafts.length}</span> saved locally
          </p>
        </div>

        {drafts.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border/80 bg-muted/30">
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="mt-4 text-sm font-medium">No drafts yet</p>
            <p className="mt-1 max-w-sm text-[13px] text-muted-foreground">
              Create an invoice and click Save to store it here.
            </p>
            <Button size="sm" className="mt-5" onClick={() => navigate("/create")}>
              Create invoice
            </Button>
          </div>
        ) : (
          <ul className="divide-y divide-border/60">
            {drafts.map((inv) => {
              const total = calculateTotals(inv.items, inv.discountPercent).grandTotal;
              return (
                <li
                  key={inv.id}
                  className="group flex flex-col gap-4 px-6 py-5 transition-colors hover:bg-muted/20 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-mono text-[13px] font-semibold tracking-tight">
                        {inv.invoiceNumber}
                      </span>
                      <Badge variant={statusVariant[inv.paymentStatus]} className="capitalize">
                        {inv.paymentStatus}
                      </Badge>
                    </div>
                    <p className="mt-1.5 text-[13px] text-muted-foreground">
                      {inv.client.name || "No client"} · {formatDate(inv.invoiceDate)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-[15px] font-semibold tabular-nums">
                      {formatCurrency(total, inv.currency)}
                    </p>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          loadDraft(inv);
                          navigate("/create");
                        }}
                      >
                        <FileEdit className="h-3.5 w-3.5" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 opacity-60 group-hover:opacity-100"
                        onClick={() => removeDraft(inv.id)}
                        aria-label="Delete draft"
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
