import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { lineSubtotal, lineTax } from "@/lib/calculations";
import { formatCurrency } from "@/lib/utils";
import { createEmptyItem, type Invoice, type InvoiceItem } from "@/types/invoice";

interface InvoiceItemsTableProps {
  invoice: Invoice;
  onChange: (items: InvoiceItem[]) => void;
}

export function InvoiceItemsTable({ invoice, onChange }: InvoiceItemsTableProps) {
  const updateItem = (id: string, patch: Partial<InvoiceItem>) => {
    onChange(invoice.items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const addRow = () => onChange([...invoice.items, createEmptyItem()]);

  const removeRow = (id: string) => {
    if (invoice.items.length <= 1) return;
    onChange(invoice.items.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-[13px] font-semibold text-foreground">Items</Label>
        <Button type="button" variant="outline" size="sm" onClick={addRow}>
          <Plus className="h-3.5 w-3.5" />
          Add row
        </Button>
      </div>

      <div className="hidden overflow-hidden rounded-lg border border-border/70 md:block">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-border/60 bg-muted/30 text-left">
              <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Description
              </th>
              <th className="w-20 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Qty
              </th>
              <th className="w-28 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Rate
              </th>
              <th className="w-20 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Tax
              </th>
              <th className="w-28 px-4 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Total
              </th>
              <th className="w-12" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {invoice.items.map((item) => {
              const total = lineSubtotal(item) + lineTax(item);
              return (
                <tr key={item.id} className="group bg-card transition-colors hover:bg-muted/20">
                  <td className="px-3 py-2">
                    <Input
                      className="h-9 border-transparent bg-transparent shadow-none hover:border-border/80 focus-visible:border-border"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, { description: e.target.value })}
                      placeholder="Description"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <Input
                      className="h-9 border-transparent bg-transparent shadow-none hover:border-border/80 focus-visible:border-border"
                      type="number"
                      min={0}
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(item.id, { quantity: parseFloat(e.target.value) || 0 })
                      }
                    />
                  </td>
                  <td className="px-3 py-2">
                    <Input
                      className="h-9 border-transparent bg-transparent shadow-none hover:border-border/80 focus-visible:border-border"
                      type="number"
                      min={0}
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) =>
                        updateItem(item.id, { unitPrice: parseFloat(e.target.value) || 0 })
                      }
                    />
                  </td>
                  <td className="px-3 py-2">
                    <Input
                      className="h-9 border-transparent bg-transparent shadow-none hover:border-border/80 focus-visible:border-border"
                      type="number"
                      min={0}
                      max={100}
                      value={item.taxPercent}
                      onChange={(e) =>
                        updateItem(item.id, { taxPercent: parseFloat(e.target.value) || 0 })
                      }
                    />
                  </td>
                  <td className="px-4 py-2 text-right font-medium tabular-nums">
                    {formatCurrency(total, invoice.currency)}
                  </td>
                  <td className="px-2 py-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100"
                      onClick={() => removeRow(item.id)}
                      disabled={invoice.items.length <= 1}
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {invoice.items.map((item) => {
          const total = lineSubtotal(item) + lineTax(item);
          return (
            <div
              key={item.id}
              className="rounded-lg border border-border/70 bg-muted/10 p-4 space-y-3"
            >
              <Input
                value={item.description}
                onChange={(e) => updateItem(item.id, { description: e.target.value })}
                placeholder="Description"
              />
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase tracking-wider">Qty</Label>
                  <Input
                    type="number"
                    min={0}
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(item.id, { quantity: parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase tracking-wider">Rate</Label>
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) =>
                      updateItem(item.id, { unitPrice: parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase tracking-wider">Tax %</Label>
                  <Input
                    type="number"
                    min={0}
                    value={item.taxPercent}
                    onChange={(e) =>
                      updateItem(item.id, { taxPercent: parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-semibold tabular-nums">
                  {formatCurrency(total, invoice.currency)}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeRow(item.id)}
                  disabled={invoice.items.length <= 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
