import { useRef } from "react";
import { InvoiceForm } from "@/components/invoice/InvoiceForm";
import { InvoicePreview } from "@/components/invoice/InvoicePreview";
import { InvoiceActions } from "@/components/invoice/InvoiceActions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useInvoice } from "@/context/InvoiceContext";

export function CreateInvoicePage() {
  const { invoice, newInvoice } = useInvoice();
  const printRef = useRef<HTMLDivElement>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Create invoice</h1>
          <p className="text-sm text-muted-foreground">
            Build your invoice with live preview — print or export when ready
          </p>
        </div>
        <InvoiceActions printRef={printRef} />
      </div>

      <div className="grid gap-8 xl:grid-cols-2">
        <div className="space-y-6 min-w-0">
          <InvoiceForm />
        </div>

        <div className="min-w-0 xl:sticky xl:top-20 xl:self-start">
          <Card className="shadow-card overflow-hidden">
            <CardHeader className="border-b bg-muted/30">
              <CardTitle className="text-base">Live preview</CardTitle>
              <CardDescription>Updates as you edit — optimized for print</CardDescription>
            </CardHeader>
            <CardContent className="p-0 overflow-auto max-h-[calc(100vh-8rem)]">
              <div ref={printRef} className="print-area">
                <InvoicePreview invoice={invoice} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <p className="no-print text-center">
        <button
          type="button"
          onClick={newInvoice}
          className="text-sm text-muted-foreground hover:text-foreground underline"
        >
          Start a new blank invoice
        </button>
      </p>
    </div>
  );
}
