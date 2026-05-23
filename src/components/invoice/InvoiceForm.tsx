import type { ReactNode } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { InvoiceItemsTable } from "./InvoiceItemsTable";
import { formatCurrency } from "@/lib/utils";
import { useInvoice } from "@/context/InvoiceContext";
import type { BusinessInfo, ClientInfo, InvoiceTemplate, PaymentStatus } from "@/types/invoice";

const templates: { value: InvoiceTemplate; label: string }[] = [
  { value: "minimal", label: "Minimal" },
  { value: "corporate", label: "Corporate" },
  { value: "freelancer", label: "Freelancer" },
  { value: "tax", label: "Tax Invoice" },
];

function FieldGroup({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

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
    <div className="space-y-6">
      <FieldGroup title="Invoice details" description="Number, dates, status, and template">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="invoiceNumber">Invoice number</Label>
            <Input
              id="invoiceNumber"
              value={invoice.invoiceNumber}
              onChange={(e) => updateInvoice({ invoiceNumber: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Template</Label>
            <Select
              value={invoice.template}
              onValueChange={(v) => updateInvoice({ template: v as InvoiceTemplate })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {templates.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
      </FieldGroup>

      <FieldGroup title="Your business" description="Shown on the invoice header">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted/30">
            {invoice.business.logo ? (
              <img
                src={invoice.business.logo}
                alt="Company logo"
                className="h-full w-full object-contain"
              />
            ) : (
              <span className="text-xs text-muted-foreground text-center px-2">No logo</span>
            )}
          </div>
          <div className="flex-1 space-y-2">
            <Label htmlFor="logo">Company logo</Label>
            <div className="flex gap-2">
              <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border border-input bg-card px-3 h-9 text-sm font-medium shadow-soft hover:bg-accent">
                <Upload className="h-4 w-4" />
                Upload
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
      </FieldGroup>

      <FieldGroup title="Client" description="Bill-to information">
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
        <Button type="button" variant="secondary" size="sm" onClick={rememberClient}>
          Save client for later
        </Button>
      </FieldGroup>

      <Card className="shadow-soft">
        <CardContent className="space-y-6 pt-6">
          <InvoiceItemsTable
            invoice={invoice}
            onChange={(items) => setInvoice((prev) => ({ ...prev, items }))}
          />
          <div className="grid gap-4 border-t pt-6 sm:grid-cols-2">
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
          <div className="ml-auto max-w-xs space-y-2 rounded-lg bg-muted/40 p-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(totals.subtotal, invoice.currency)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax / GST</span>
              <span>{formatCurrency(totals.taxTotal, invoice.currency)}</span>
            </div>
            {invoice.discountPercent > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount ({invoice.discountPercent}%)</span>
                <span>-{formatCurrency(totals.discountAmount, invoice.currency)}</span>
              </div>
            )}
            <div className="flex justify-between border-t pt-2 text-base font-semibold">
              <span>Total</span>
              <span>{formatCurrency(totals.grandTotal, invoice.currency)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
