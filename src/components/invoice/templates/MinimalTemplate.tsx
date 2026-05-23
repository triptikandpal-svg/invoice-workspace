import { AddressBlock, ItemsTable, MetaDates, TotalsBlock, type TemplateProps } from "./shared";

export function MinimalTemplate({ invoice, className = "" }: TemplateProps) {
  return (
    <div className={`bg-white p-8 md:p-12 text-foreground ${className}`}>
      <header className="mb-10 flex flex-col gap-6 sm:flex-row sm:justify-between">
        <div>
          {invoice.business.logo && (
            <img src={invoice.business.logo} alt="" className="mb-4 h-10 object-contain" />
          )}
          <h1 className="text-2xl font-semibold tracking-tight">{invoice.business.name}</h1>
          <AddressBlock text={[invoice.business.email, invoice.business.phone].filter(Boolean).join("\n")} />
        </div>
        <div className="text-right">
          <p className="text-3xl font-light tracking-tight text-muted-foreground">Invoice</p>
          <p className="mt-2 text-lg font-medium">{invoice.invoiceNumber}</p>
        </div>
      </header>

      <div className="mb-10 grid gap-8 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Bill to
          </p>
          <p className="font-medium">{invoice.client.name || "—"}</p>
          {invoice.client.company && (
            <p className="text-sm text-muted-foreground">{invoice.client.company}</p>
          )}
          <AddressBlock text={invoice.client.address || invoice.client.email} />
        </div>
        <MetaDates invoice={invoice} />
      </div>

      <ItemsTable invoice={invoice} />

      <div className="mt-8 flex flex-col gap-8 sm:flex-row sm:justify-between">
        {invoice.notes && (
          <p className="max-w-md text-sm text-muted-foreground whitespace-pre-line">{invoice.notes}</p>
        )}
        <TotalsBlock invoice={invoice} />
      </div>
    </div>
  );
}
