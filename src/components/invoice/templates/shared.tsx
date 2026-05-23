import { calculateTotals, lineSubtotal, lineTax } from "@/lib/calculations";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Invoice } from "@/types/invoice";

export interface TemplateProps {
  invoice: Invoice;
  className?: string;
}

export function useInvoiceDisplay(invoice: Invoice) {
  const totals = calculateTotals(invoice.items, invoice.discountPercent);
  return { totals };
}

export function ItemsTable({
  invoice,
  compact = false,
}: {
  invoice: Invoice;
  compact?: boolean;
}) {
  return (
    <table className={`w-full ${compact ? "text-xs" : "text-sm"}`}>
      <thead>
        <tr className="border-b text-left text-muted-foreground">
          <th className="py-2 pr-4 font-medium">Description</th>
          <th className="py-2 pr-4 font-medium text-right">Qty</th>
          <th className="py-2 pr-4 font-medium text-right">Rate</th>
          <th className="py-2 pr-4 font-medium text-right">Tax</th>
          <th className="py-2 font-medium text-right">Amount</th>
        </tr>
      </thead>
      <tbody>
        {invoice.items.map((item) => (
          <tr key={item.id} className="border-b border-dashed last:border-0">
            <td className="py-3 pr-4">{item.description || "—"}</td>
            <td className="py-3 pr-4 text-right">{item.quantity}</td>
            <td className="py-3 pr-4 text-right">
              {formatCurrency(item.unitPrice, invoice.currency)}
            </td>
            <td className="py-3 pr-4 text-right">{item.taxPercent}%</td>
            <td className="py-3 text-right font-medium">
              {formatCurrency(lineSubtotal(item) + lineTax(item), invoice.currency)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function TotalsBlock({ invoice }: { invoice: Invoice }) {
  const { totals } = useInvoiceDisplay(invoice);
  return (
    <div className="ml-auto w-full max-w-[240px] space-y-1.5 text-sm">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Subtotal</span>
        <span>{formatCurrency(totals.subtotal, invoice.currency)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Tax / GST</span>
        <span>{formatCurrency(totals.taxTotal, invoice.currency)}</span>
      </div>
      {invoice.discountPercent > 0 && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">Discount ({invoice.discountPercent}%)</span>
          <span>-{formatCurrency(totals.discountAmount, invoice.currency)}</span>
        </div>
      )}
      <div className="flex justify-between border-t pt-2 text-base font-semibold">
        <span>Total due</span>
        <span>{formatCurrency(totals.grandTotal, invoice.currency)}</span>
      </div>
    </div>
  );
}

export function AddressBlock({ text }: { text: string }) {
  return (
    <p className="whitespace-pre-line text-sm text-muted-foreground leading-relaxed">{text}</p>
  );
}

export function MetaDates({ invoice }: { invoice: Invoice }) {
  return (
    <dl className="space-y-1 text-sm">
      <div className="flex justify-between gap-8">
        <dt className="text-muted-foreground">Invoice date</dt>
        <dd className="font-medium">{formatDate(invoice.invoiceDate)}</dd>
      </div>
      <div className="flex justify-between gap-8">
        <dt className="text-muted-foreground">Due date</dt>
        <dd className="font-medium">{formatDate(invoice.dueDate)}</dd>
      </div>
      <div className="flex justify-between gap-8">
        <dt className="text-muted-foreground">Status</dt>
        <dd className="font-medium capitalize">{invoice.paymentStatus}</dd>
      </div>
    </dl>
  );
}
