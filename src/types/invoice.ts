export type PaymentStatus = "draft" | "pending" | "paid" | "overdue";

export type InvoiceTemplate =
  | "minimal"
  | "corporate"
  | "freelancer"
  | "tax";

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxPercent: number;
}

export interface BusinessInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  taxId: string;
  website: string;
  logo?: string;
}

export interface ClientInfo {
  id?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  company: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  paymentStatus: PaymentStatus;
  template: InvoiceTemplate;
  business: BusinessInfo;
  client: ClientInfo;
  items: InvoiceItem[];
  notes: string;
  discountPercent: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceTotals {
  subtotal: number;
  taxTotal: number;
  discountAmount: number;
  grandTotal: number;
}

export interface DashboardStats {
  revenue: number;
  pendingAmount: number;
  paidCount: number;
  pendingCount: number;
  overdueCount: number;
}

export const defaultBusiness: BusinessInfo = {
  name: "Acme Studio LLC",
  email: "billing@acmestudio.com",
  phone: "+1 (555) 010-2000",
  address: "120 Market Street, Suite 400\nSan Francisco, CA 94105",
  taxId: "US-12-3456789",
  website: "www.acmestudio.com",
};

export const defaultClient: ClientInfo = {
  name: "",
  email: "",
  phone: "",
  address: "",
  company: "",
};

export function createEmptyItem(): InvoiceItem {
  return {
    id: crypto.randomUUID?.() ?? `${Date.now()}`,
    description: "",
    quantity: 1,
    unitPrice: 0,
    taxPercent: 0,
  };
}

export function createNewInvoice(): Invoice {
  const now = new Date().toISOString();
  const today = new Date().toISOString().split("T")[0];
  const due = new Date();
  due.setDate(due.getDate() + 14);

  return {
    id: crypto.randomUUID?.() ?? `${Date.now()}`,
    invoiceNumber: `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    invoiceDate: today,
    dueDate: due.toISOString().split("T")[0],
    paymentStatus: "draft",
    template: "corporate",
    business: { ...defaultBusiness },
    client: { ...defaultClient },
    items: [
      {
        id: crypto.randomUUID?.() ?? "1",
        description: "Professional services",
        quantity: 1,
        unitPrice: 0,
        taxPercent: 0,
      },
    ],
    notes: "Thank you for your business. Payment is due within the terms stated above.",
    discountPercent: 0,
    currency: "USD",
    createdAt: now,
    updatedAt: now,
  };
}
