import { ItemsTable, TotalsBlock, type TemplateProps, useInvoiceDisplay } from "./shared";
import { formatCurrency, formatDate } from "@/lib/utils";
import { lineSubtotal, lineTax } from "@/lib/calculations";

export function TaxInvoiceTemplate({ invoice, className = "" }: TemplateProps) {
  const { totals } = useInvoiceDisplay(invoice);

  return (
    <div className={`bg-white p-8 md:p-12 text-foreground border-2 border-slate-200 ${className}`}>
      <div className="mb-6 text-center border-b-2 border-slate-900 pb-4">
        <p className="text-xs font-bold uppercase tracking-[0.2em]">Tax Invoice</p>
        <h1 className="mt-1 text-xl font-bold">{invoice.business.name}</h1>
        <p className="text-sm text-muted-foreground">
          GSTIN / Tax ID: {invoice.business.taxId || "—"}
        </p>
      </div>

      <div className="mb-6 grid gap-4 text-sm sm:grid-cols-2">
        <div className="rounded border p-4">
          <p className="font-semibold uppercase text-xs text-muted-foreground mb-2">Supplier</p>
          <p className="font-medium">{invoice.business.name}</p>
          <p className="whitespace-pre-line text-muted-foreground">{invoice.business.address}</p>
        </div>
        <div className="rounded border p-4">
          <p className="font-semibold uppercase text-xs text-muted-foreground mb-2">Recipient</p>
          <p className="font-medium">{invoice.client.name || "—"}</p>
          <p className="whitespace-pre-line text-muted-foreground">{invoice.client.address}</p>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap justify-between gap-4 text-sm border-b pb-4">
        <div>
          <span className="text-muted-foreground">Invoice No: </span>
          <span className="font-semibold">{invoice.invoiceNumber}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Date: </span>
          <span>{formatDate(invoice.invoiceDate)}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Due: </span>
          <span>{formatDate(invoice.dueDate)}</span>
        </div>
      </div>

      <ItemsTable invoice={invoice} />

      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-xs border">
          <thead className="bg-muted/50">
            <tr>
              <th className="border px-2 py-1 text-left">HSN/SAC</th>
              <th className="border px-2 py-1 text-right">Taxable</th>
              <th className="border px-2 py-1 text-right">Tax %</th>
              <th className="border px-2 py-1 text-right">Tax Amt</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item) => (
              <tr key={item.id}>
                <td className="border px-2 py-1">—</td>
                <td className="border px-2 py-1 text-right">
                  {formatCurrency(lineSubtotal(item), invoice.currency)}
                </td>
                <td className="border px-2 py-1 text-right">{item.taxPercent}%</td>
                <td className="border px-2 py-1 text-right">
                  {formatCurrency(lineTax(item), invoice.currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:justify-between">
        <p className="text-xs text-muted-foreground max-w-xs whitespace-pre-line">
          {invoice.notes}
        </p>
        <div>
          <TotalsBlock invoice={invoice} />
          <p className="mt-2 text-right text-xs font-semibold">
            Total Tax: {formatCurrency(totals.taxTotal, invoice.currency)}
          </p>
        </div>
      </div>
    </div>
  );
}
