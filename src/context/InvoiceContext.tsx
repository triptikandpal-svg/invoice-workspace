import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { calculateTotals } from "@/lib/calculations";
import {
  deleteDraft,
  loadDrafts,
  loadRecentClients,
  loadSavedBusiness,
  saveBusinessProfile,
  saveRecentClient,
  upsertDraft,
} from "@/lib/storage";
import {
  createNewInvoice,
  defaultBusiness,
  type ClientInfo,
  type DashboardStats,
  type Invoice,
} from "@/types/invoice";

interface InvoiceContextValue {
  invoice: Invoice;
  setInvoice: React.Dispatch<React.SetStateAction<Invoice>>;
  updateInvoice: (patch: Partial<Invoice>) => void;
  totals: ReturnType<typeof calculateTotals>;
  drafts: Invoice[];
  clients: ClientInfo[];
  saveDraft: () => void;
  removeDraft: (id: string) => void;
  loadDraft: (draft: Invoice) => void;
  newInvoice: () => void;
  rememberClient: () => void;
  selectClient: (client: ClientInfo) => void;
  stats: DashboardStats;
}

const InvoiceContext = createContext<InvoiceContextValue | null>(null);

function computeStats(drafts: Invoice[]): DashboardStats {
  const nonDraft = drafts.filter((d) => d.paymentStatus !== "draft");
  const paid = nonDraft.filter((d) => d.paymentStatus === "paid");
  const pending = nonDraft.filter((d) => d.paymentStatus === "pending");
  const overdue = nonDraft.filter((d) => d.paymentStatus === "overdue");

  const sum = (list: Invoice[]) =>
    list.reduce(
      (acc, inv) => acc + calculateTotals(inv.items, inv.discountPercent).grandTotal,
      0
    );

  return {
    revenue: sum(paid),
    pendingAmount: sum(pending) + sum(overdue),
    paidCount: paid.length,
    pendingCount: pending.length,
    overdueCount: overdue.length,
  };
}

export function InvoiceProvider({ children }: { children: ReactNode }) {
  const [invoice, setInvoice] = useState<Invoice>(() => {
    const saved = loadSavedBusiness();
    const base = createNewInvoice();
    if (saved) {
      try {
        base.business = { ...defaultBusiness, ...JSON.parse(saved) };
      } catch {
        /* ignore */
      }
    }
    return base;
  });
  const [drafts, setDrafts] = useState<Invoice[]>(() => loadDrafts());
  const [clients, setClients] = useState<ClientInfo[]>(() => loadRecentClients());

  useEffect(() => {
    saveBusinessProfile(JSON.stringify(invoice.business));
  }, [invoice.business]);

  const totals = useMemo(
    () => calculateTotals(invoice.items, invoice.discountPercent),
    [invoice.items, invoice.discountPercent]
  );

  const stats = useMemo(() => computeStats(drafts), [drafts]);

  const updateInvoice = useCallback((patch: Partial<Invoice>) => {
    setInvoice((prev) => ({ ...prev, ...patch, updatedAt: new Date().toISOString() }));
  }, []);

  const saveDraft = useCallback(() => {
    const updated = upsertDraft({ ...invoice, paymentStatus: invoice.paymentStatus || "draft" });
    setDrafts(updated);
  }, [invoice]);

  const removeDraft = useCallback((id: string) => {
    setDrafts(deleteDraft(id));
  }, []);

  const loadDraft = useCallback((draft: Invoice) => {
    setInvoice({ ...draft });
  }, []);

  const newInvoice = useCallback(() => {
    const saved = loadSavedBusiness();
    const base = createNewInvoice();
    if (saved) {
      try {
        base.business = { ...defaultBusiness, ...JSON.parse(saved) };
      } catch {
        /* ignore */
      }
    }
    setInvoice(base);
  }, []);

  const rememberClient = useCallback(() => {
    setClients(saveRecentClient(invoice.client));
  }, [invoice.client]);

  const selectClient = useCallback((client: ClientInfo) => {
    setInvoice((prev) => ({ ...prev, client: { ...client } }));
  }, []);

  const value: InvoiceContextValue = {
    invoice,
    setInvoice,
    updateInvoice,
    totals,
    drafts,
    clients,
    saveDraft,
    removeDraft,
    loadDraft,
    newInvoice,
    rememberClient,
    selectClient,
    stats,
  };

  return <InvoiceContext.Provider value={value}>{children}</InvoiceContext.Provider>;
}

export function useInvoice() {
  const ctx = useContext(InvoiceContext);
  if (!ctx) throw new Error("useInvoice must be used within InvoiceProvider");
  return ctx;
}
