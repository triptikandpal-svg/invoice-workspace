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
        <Label className="text-base">Line items</Label>
        <Button type="button" variant="outline" size="sm" onClick={addRow}>
          <Plus className="h-4 w-4" />
          Add item
        </Button>
      </div>

      <div className="hidden overflow-x-auto rounded-lg border md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/40 text-left text-muted-foreground">
              <th className="px-4 py-3 font-medium">Description</th>
              <th className="w-24 px-4 py-3 font-medium">Qty</th>
              <th className="w-32 px-4 py-3 font-medium">Unit price</th>
              <th className="w-24 px-4 py-3 font-medium">Tax %</th>
              <th className="w-32 px-4 py-3 text-right font-medium">Total</th>
              <th className="w-12 px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item) => {
              const total = lineSubtotal(item) + lineTax(item);
              return (
                <tr key={item.id} className="border-b last:border-0">
                  <td className="px-4 py-2">
                    <Input
                      value={item.description}
                      onChange={(e) => updateItem(item.id, { description: e.target.value })}
                      placeholder="Service or product"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <Input
                      type="number"
                      min={0}
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(item.id, { quantity: parseFloat(e.target.value) || 0 })
                      }
                    />
                  </td>
                  <td className="px-4 py-2">
                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) =>
                        updateItem(item.id, { unitPrice: parseFloat(e.target.value) || 0 })
                      }
                    />
                  </td>
                  <td className="px-4 py-2">
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={item.taxPercent}
                      onChange={(e) =>
                        updateItem(item.id, { taxPercent: parseFloat(e.target.value) || 0 })
                      }
                    />
                  </td>
                  <td className="px-4 py-2 text-right font-medium">
                    {formatCurrency(total, invoice.currency)}
                  </td>
                  <td className="px-4 py-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
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
            <div key={item.id} className="rounded-lg border bg-card p-4 shadow-soft space-y-3">
              <Input
                value={item.description}
                onChange={(e) => updateItem(item.id, { description: e.target.value })}
                placeholder="Description"
              />
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label className="text-xs text-muted-foreground">Qty</Label>
                  <Input
                    type="number"
                    min={0}
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(item.id, { quantity: parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Price</Label>
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
                <div>
                  <Label className="text-xs text-muted-foreground">Tax %</Label>
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
                <span className="text-sm font-medium">{formatCurrency(total, invoice.currency)}</span>
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
