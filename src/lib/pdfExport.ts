import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Invoice } from "@/types/invoice";
import { calculateTotals, lineSubtotal, lineTax } from "@/lib/calculations";
import { formatCurrency, formatDate } from "@/lib/utils";

export function exportInvoicePdf(invoice: Invoice): void {
  const doc = new jsPDF();
  const totals = calculateTotals(invoice.items, invoice.discountPercent);
  const margin = 14;
  let y = margin;

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(invoice.business.name || "Invoice", margin, y);
  y += 8;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100);
  doc.text(`Invoice #${invoice.invoiceNumber}`, margin, y);
  y += 5;
  doc.text(`Date: ${formatDate(invoice.invoiceDate)}  |  Due: ${formatDate(invoice.dueDate)}`, margin, y);
  y += 10;

  doc.setTextColor(0);
  doc.setFont("helvetica", "bold");
  doc.text("Bill To", margin, y);
  y += 5;
  doc.setFont("helvetica", "normal");
  doc.text(invoice.client.name || "Client", margin, y);
  y += 5;
  if (invoice.client.company) {
    doc.text(invoice.client.company, margin, y);
    y += 5;
  }
  if (invoice.client.email) {
    doc.text(invoice.client.email, margin, y);
    y += 5;
  }

  y += 5;

  autoTable(doc, {
    startY: y,
    head: [["Description", "Qty", "Unit", "Tax %", "Amount"]],
    body: invoice.items.map((item) => [
      item.description || "—",
      String(item.quantity),
      formatCurrency(item.unitPrice, invoice.currency),
      `${item.taxPercent}%`,
      formatCurrency(lineSubtotal(item) + lineTax(item), invoice.currency),
    ]),
    styles: { fontSize: 9 },
    headStyles: { fillColor: [30, 41, 59] },
  });

  const finalY = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable
    ?.finalY ?? y + 40;

  let summaryY = finalY + 10;
  const rightX = 140;

  doc.setFont("helvetica", "normal");
  doc.text("Subtotal:", rightX, summaryY);
  doc.text(formatCurrency(totals.subtotal, invoice.currency), 190, summaryY, { align: "right" });
  summaryY += 6;
  doc.text("Tax:", rightX, summaryY);
  doc.text(formatCurrency(totals.taxTotal, invoice.currency), 190, summaryY, { align: "right" });
  if (invoice.discountPercent > 0) {
    summaryY += 6;
    doc.text(`Discount (${invoice.discountPercent}%):`, rightX, summaryY);
    doc.text(`-${formatCurrency(totals.discountAmount, invoice.currency)}`, 190, summaryY, {
      align: "right",
    });
  }
  summaryY += 8;
  doc.setFont("helvetica", "bold");
  doc.text("Total:", rightX, summaryY);
  doc.text(formatCurrency(totals.grandTotal, invoice.currency), 190, summaryY, {
    align: "right",
  });

  if (invoice.notes) {
    summaryY += 14;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(80);
    const split = doc.splitTextToSize(invoice.notes, 180);
    doc.text(split, margin, summaryY);
  }

  doc.save(`${invoice.invoiceNumber || "invoice"}.pdf`);
}
