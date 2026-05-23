import { useState } from "react";
import { useReactToPrint } from "react-to-print";
import { Download, Printer, Save, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportInvoicePdf } from "@/lib/pdfExport";
import { useInvoice } from "@/context/InvoiceContext";
import { cn } from "@/lib/utils";

interface InvoiceActionsProps {
  printRef: React.RefObject<HTMLDivElement | null>;
  className?: string;
}

export function InvoiceActions({ printRef, className }: InvoiceActionsProps) {
  const { invoice, saveDraft, rememberClient } = useInvoice();
  const [saved, setSaved] = useState(false);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: invoice.invoiceNumber,
  });

  const handleSave = () => {
    saveDraft();
    rememberClient();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className={cn("no-print toolbar-group", className)}>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 rounded-md px-3"
        onClick={handleSave}
      >
        {saved ? (
          <Check className="h-3.5 w-3.5 text-emerald-600" />
        ) : (
          <Save className="h-3.5 w-3.5" />
        )}
        {saved ? "Saved" : "Save"}
      </Button>
      <span className="h-5 w-px bg-border/80" />
      <Button
        variant="ghost"
        size="sm"
        className="h-8 rounded-md px-3"
        onClick={() => handlePrint?.()}
      >
        <Printer className="h-3.5 w-3.5" />
        Print
      </Button>
      <Button
        size="sm"
        className="h-8 rounded-md px-3"
        onClick={() => exportInvoicePdf(invoice)}
      >
        <Download className="h-3.5 w-3.5" />
        PDF
      </Button>
    </div>
  );
}
