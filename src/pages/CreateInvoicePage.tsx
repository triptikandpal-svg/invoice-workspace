import { useRef } from "react";
import { RotateCcw } from "lucide-react";
import { InvoiceForm } from "@/components/invoice/InvoiceForm";
import { InvoicePreview } from "@/components/invoice/InvoicePreview";
import { InvoiceActions } from "@/components/invoice/InvoiceActions";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { useInvoice } from "@/context/InvoiceContext";
import { formatCurrency } from "@/lib/utils";

export function CreateInvoicePage() {
  const { invoice, newInvoice, totals } = useInvoice();
  const printRef = useRef<HTMLDivElement>(null);

  return (
    <div className="page-shell space-y-8">
      <PageHeader
        eyebrow="Editor"
        title="Create invoice"
        description="Fill in details on the left — your printable invoice updates instantly on the right."
        actions={
          <div className="hidden lg:block">
            <InvoiceActions printRef={printRef} />
          </div>
        }
      />

      <div className="flex items-center justify-between gap-4 rounded-xl border border-border/70 bg-card px-4 py-3 shadow-soft lg:hidden">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Total
          </p>
          <p className="text-lg font-semibold tabular-nums tracking-tight">
            {formatCurrency(totals.grandTotal, invoice.currency)}
          </p>
        </div>
        <InvoiceActions printRef={printRef} />
      </div>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] xl:gap-10">
        <div className="min-w-0 space-y-5">
          <InvoiceForm />
        </div>

        <div className="min-w-0 xl:sticky xl:top-[4.5rem] xl:self-start">
          <div className="app-panel overflow-hidden">
            <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Preview
                </p>
                <p className="mt-0.5 text-[13px] font-medium capitalize text-foreground">
                  {invoice.template} template
                </p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-muted-foreground">Total due</p>
                <p className="text-lg font-semibold tabular-nums tracking-tight">
                  {formatCurrency(totals.grandTotal, invoice.currency)}
                </p>
              </div>
            </div>
            <div className="preview-frame max-h-[calc(100vh-10rem)] overflow-auto">
              <div className="preview-paper">
                <div ref={printRef} className="print-area">
                  <InvoicePreview invoice={invoice} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="no-print flex justify-center border-t border-border/60 pt-6">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-muted-foreground"
          onClick={newInvoice}
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset to blank invoice
        </Button>
      </div>
    </div>
  );
}
