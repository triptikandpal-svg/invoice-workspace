import { AddressBlock, ItemsTable, TotalsBlock, type TemplateProps } from "./shared";
import { formatDate } from "@/lib/utils";

export function CorporateTemplate({ invoice, className = "" }: TemplateProps) {
  return (
    <div className={`bg-white text-foreground ${className}`}>
      <div className="bg-slate-900 px-8 py-6 text-white md:px-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            {invoice.business.logo ? (
              <img
                src={invoice.business.logo}
                alt=""
                className="h-12 max-w-[120px] object-contain brightness-0 invert"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded bg-white/10 text-lg font-bold">
                {invoice.business.name?.charAt(0) ?? "B"}
              </div>
            )}
            <div>
              <h1 className="text-xl font-semibold">{invoice.business.name}</h1>
              <p className="text-sm text-slate-300">{invoice.business.website}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm uppercase tracking-widest text-slate-400">Tax Invoice</p>
            <p className="text-2xl font-semibold">{invoice.invoiceNumber}</p>
          </div>
        </div>
      </div>

      <div className="p-8 md:p-12">
        <div className="mb-8 grid gap-6 rounded-lg border bg-slate-50/80 p-6 sm:grid-cols-3">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">From</p>
            <p className="font-medium">{invoice.business.name}</p>
            <AddressBlock text={invoice.business.address} />
            <p className="mt-2 text-sm">{invoice.business.taxId}</p>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Bill to</p>
            <p className="font-medium">{invoice.client.name || "—"}</p>
            {invoice.client.company && <p className="text-sm">{invoice.client.company}</p>}
            <AddressBlock text={invoice.client.address} />
          </div>
          <div className="text-sm space-y-2">
            <p>
              <span className="text-muted-foreground">Issued: </span>
              {formatDate(invoice.invoiceDate)}
            </p>
            <p>
              <span className="text-muted-foreground">Due: </span>
              {formatDate(invoice.dueDate)}
            </p>
            <p>
              <span className="text-muted-foreground">Status: </span>
              <span className="capitalize font-medium">{invoice.paymentStatus}</span>
            </p>
          </div>
        </div>

        <ItemsTable invoice={invoice} />

        <div className="mt-8 flex flex-col gap-6 border-t pt-8 sm:flex-row sm:justify-between">
          {invoice.notes && (
            <div className="max-w-sm">
              <p className="mb-1 text-xs font-semibold uppercase text-muted-foreground">Notes</p>
              <p className="text-sm whitespace-pre-line">{invoice.notes}</p>
            </div>
          )}
          <TotalsBlock invoice={invoice} />
        </div>
      </div>
    </div>
  );
}
