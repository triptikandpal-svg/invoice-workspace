import type { ClientInfo, Invoice } from "@/types/invoice";

const DRAFTS_KEY = "siw_drafts";
const CLIENTS_KEY = "siw_clients";
const BUSINESS_KEY = "siw_business";

export function loadDrafts(): Invoice[] {
  try {
    const raw = localStorage.getItem(DRAFTS_KEY);
    return raw ? (JSON.parse(raw) as Invoice[]) : [];
  } catch {
    return [];
  }
}

export function saveDrafts(drafts: Invoice[]): void {
  localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
}

export function upsertDraft(invoice: Invoice): Invoice[] {
  const drafts = loadDrafts();
  const idx = drafts.findIndex((d) => d.id === invoice.id);
  const updated = { ...invoice, updatedAt: new Date().toISOString() };
  if (idx >= 0) {
    drafts[idx] = updated;
  } else {
    drafts.unshift(updated);
  }
  saveDrafts(drafts.slice(0, 50));
  return loadDrafts();
}

export function deleteDraft(id: string): Invoice[] {
  const drafts = loadDrafts().filter((d) => d.id !== id);
  saveDrafts(drafts);
  return drafts;
}

export function loadRecentClients(): ClientInfo[] {
  try {
    const raw = localStorage.getItem(CLIENTS_KEY);
    return raw ? (JSON.parse(raw) as ClientInfo[]) : [];
  } catch {
    return [];
  }
}

export function saveRecentClient(client: ClientInfo): ClientInfo[] {
  if (!client.name.trim()) return loadRecentClients();
  const clients = loadRecentClients();
  const id = client.id ?? crypto.randomUUID?.() ?? `${Date.now()}`;
  const entry: ClientInfo = { ...client, id };
  const filtered = clients.filter((c) => c.id !== id && c.email !== client.email);
  const updated = [entry, ...filtered].slice(0, 20);
  localStorage.setItem(CLIENTS_KEY, JSON.stringify(updated));
  return updated;
}

export function loadSavedBusiness(): string | null {
  return localStorage.getItem(BUSINESS_KEY);
}

export function saveBusinessProfile(data: string): void {
  localStorage.setItem(BUSINESS_KEY, data);
}
