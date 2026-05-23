import { useReactToPrint } from "react-to-print";
import { Download, Printer, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportInvoicePdf } from "@/lib/pdfExport";
import { useInvoice } from "@/context/InvoiceContext";

interface InvoiceActionsProps {
  printRef: React.RefObject<HTMLDivElement | null>;
}

export function InvoiceActions({ printRef }: InvoiceActionsProps) {
  const { invoice, saveDraft, rememberClient } = useInvoice();

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: invoice.invoiceNumber,
  });

  const handleSave = () => {
    saveDraft();
    rememberClient();
  };

  return (
    <div className="no-print flex flex-wrap gap-2">
      <Button variant="outline" onClick={handleSave}>
        <Save className="h-4 w-4" />
        Save draft
      </Button>
      <Button variant="outline" onClick={() => handlePrint?.()}>
        <Printer className="h-4 w-4" />
        Print invoice
      </Button>
      <Button variant="secondary" onClick={() => exportInvoicePdf(invoice)}>
        <Download className="h-4 w-4" />
        Export PDF
      </Button>
    </div>
  );
}
