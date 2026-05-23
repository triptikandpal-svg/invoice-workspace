import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormSection } from "@/components/layout/FormSection";
import { TemplatePicker } from "./TemplatePicker";
import { InvoiceItemsTable } from "./InvoiceItemsTable";
import { formatCurrency } from "@/lib/utils";
import { useInvoice } from "@/context/InvoiceContext";
import type { BusinessInfo, ClientInfo, PaymentStatus } from "@/types/invoice";

export function InvoiceForm() {
  const { invoice, setInvoice, updateInvoice, totals, clients, selectClient, rememberClient } =
    useInvoice();

  const setBusiness = (patch: Partial<BusinessInfo>) =>
    setInvoice((prev) => ({ ...prev, business: { ...prev.business, ...patch } }));

  const setClient = (patch: Partial<ClientInfo>) =>
    setInvoice((prev) => ({ ...prev, client: { ...prev.client, ...patch } }));

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setBusiness({ logo: reader.result as string });
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-5">
      <FormSection step={1} title="Invoice details" description="Number, dates, status, and layout.">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="invoiceNumber">Invoice number</Label>
            <Input
              id="invoiceNumber"
              className="font-mono"
              value={invoice.invoiceNumber}
              onChange={(e) => updateInvoice({ invoiceNumber: e.target.value })}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Template</Label>
            <TemplatePicker
              value={invoice.template}
              onChange={(template) => updateInvoice({ template })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="invoiceDate">Invoice date</Label>
            <Input
              id="invoiceDate"
              type="date"
              value={invoice.invoiceDate}
              onChange={(e) => updateInvoice({ invoiceDate: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due date</Label>
            <Input
              id="dueDate"
              type="date"
              value={invoice.dueDate}
              onChange={(e) => updateInvoice({ dueDate: e.target.value })}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Payment status</Label>
            <Select
              value={invoice.paymentStatus}
              onValueChange={(v) => updateInvoice({ paymentStatus: v as PaymentStatus })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </FormSection>

      <FormSection step={2} title="Your business" description="Shown on the invoice header.">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <div className="flex h-[88px] w-[88px] shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-border/80 bg-muted/20">
            {invoice.business.logo ? (
              <img
                src={invoice.business.logo}
                alt="Company logo"
                className="h-full w-full object-contain p-2"
              />
            ) : (
              <span className="px-2 text-center text-[11px] text-muted-foreground">Logo</span>
            )}
          </div>
          <div className="flex-1 space-y-2">
            <Label htmlFor="logo">Company logo</Label>
            <div className="flex flex-wrap gap-2">
              <label className="inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-lg border border-border/80 bg-card px-3 text-[13px] font-medium shadow-soft transition-colors hover:bg-muted/50">
                <Upload className="h-4 w-4" />
                Upload image
                <input
                  id="logo"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleLogoUpload}
                />
              </label>
              {invoice.business.logo && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setBusiness({ logo: undefined })}
                >
                  Remove
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label>Business name</Label>
            <Input
              value={invoice.business.name}
              onChange={(e) => setBusiness({ name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={invoice.business.email}
              onChange={(e) => setBusiness({ email: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input
              value={invoice.business.phone}
              onChange={(e) => setBusiness({ phone: e.target.value })}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Address</Label>
            <Textarea
              value={invoice.business.address}
              onChange={(e) => setBusiness({ address: e.target.value })}
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label>Tax ID / GSTIN</Label>
            <Input
              value={invoice.business.taxId}
              onChange={(e) => setBusiness({ taxId: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Website</Label>
            <Input
              value={invoice.business.website}
              onChange={(e) => setBusiness({ website: e.target.value })}
            />
          </div>
        </div>
      </FormSection>

      <FormSection step={3} title="Client" description="Bill-to information.">
        {clients.length > 0 && (
          <div className="space-y-2">
            <Label>Recent clients</Label>
            <Select
              onValueChange={(id) => {
                const client = clients.find((c) => c.id === id);
                if (client) selectClient(client);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Load a saved client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((c) => (
                  <SelectItem key={c.id} value={c.id!}>
                    {c.name} {c.company ? `· ${c.company}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Client name</Label>
            <Input
              value={invoice.client.name}
              onChange={(e) => setClient({ name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Company</Label>
            <Input
              value={invoice.client.company}
              onChange={(e) => setClient({ company: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={invoice.client.email}
              onChange={(e) => setClient({ email: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input
              value={invoice.client.phone}
              onChange={(e) => setClient({ phone: e.target.value })}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Address</Label>
            <Textarea
              value={invoice.client.address}
              onChange={(e) => setClient({ address: e.target.value })}
              rows={2}
            />
          </div>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={rememberClient}>
          Save client for later
        </Button>
      </FormSection>

      <section className="app-panel overflow-hidden">
        <div className="border-b border-border/60 px-6 py-5">
          <div className="flex items-start gap-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border/80 bg-muted/40 text-[13px] font-semibold text-muted-foreground">
              4
            </span>
            <div>
              <h2 className="text-[15px] font-semibold tracking-tight">Line items & totals</h2>
              <p className="text-[13px] text-muted-foreground">Products, services, tax, and discounts.</p>
            </div>
          </div>
        </div>
        <div className="space-y-6 px-6 py-5">
          <InvoiceItemsTable
            invoice={invoice}
            onChange={(items) => setInvoice((prev) => ({ ...prev, items }))}
          />
          <div className="grid gap-4 border-t border-border/60 pt-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Discount (%)</Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={invoice.discountPercent}
                onChange={(e) =>
                  updateInvoice({ discountPercent: parseFloat(e.target.value) || 0 })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                value={invoice.notes}
                onChange={(e) => updateInvoice({ notes: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <div className="rounded-xl border border-border/70 bg-muted/20 p-5">
            <div className="ml-auto max-w-xs space-y-2.5 text-[13px]">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="tabular-nums text-foreground">
                  {formatCurrency(totals.subtotal, invoice.currency)}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Tax / GST</span>
                <span className="tabular-nums text-foreground">
                  {formatCurrency(totals.taxTotal, invoice.currency)}
                </span>
              </div>
              {invoice.discountPercent > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount ({invoice.discountPercent}%)</span>
                  <span className="tabular-nums">
                    -{formatCurrency(totals.discountAmount, invoice.currency)}
                  </span>
                </div>
              )}
              <div className="flex justify-between border-t border-border/60 pt-3 text-base font-semibold">
                <span>Total</span>
                <span className="tabular-nums">
                  {formatCurrency(totals.grandTotal, invoice.currency)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
