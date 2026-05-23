import type { InvoiceItem, InvoiceTotals } from "@/types/invoice";

export function lineTotal(item: InvoiceItem): number {
  const base = item.quantity * item.unitPrice;
  const tax = base * (item.taxPercent / 100);
  return base + tax;
}

export function lineSubtotal(item: InvoiceItem): number {
  return item.quantity * item.unitPrice;
}

export function lineTax(item: InvoiceItem): number {
  return lineSubtotal(item) * (item.taxPercent / 100);
}

export function calculateTotals(
  items: InvoiceItem[],
  discountPercent: number
): InvoiceTotals {
  const subtotal = items.reduce((sum, item) => sum + lineSubtotal(item), 0);
  const taxTotal = items.reduce((sum, item) => sum + lineTax(item), 0);
  const discountAmount = subtotal * (discountPercent / 100);
  const grandTotal = subtotal + taxTotal - discountAmount;

  return {
    subtotal,
    taxTotal,
    discountAmount,
    grandTotal: Math.max(0, grandTotal),
  };
}
