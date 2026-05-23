import { ItemsTable, MetaDates, TotalsBlock, type TemplateProps } from "./shared";

export function FreelancerTemplate({ invoice, className = "" }: TemplateProps) {
  return (
    <div className={`bg-white p-8 md:p-12 text-foreground ${className}`}>
      <div className="mb-8 border-l-4 border-slate-900 pl-6">
        <div className="flex items-start gap-4">
          {invoice.business.logo && (
            <img src={invoice.business.logo} alt="" className="h-14 w-14 rounded-full object-cover" />
          )}
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{invoice.business.name}</h1>
            <p className="text-muted-foreground">{invoice.business.email}</p>
          </div>
        </div>
      </div>

      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Invoice for</p>
          <p className="text-xl font-semibold">{invoice.client.name || "Client"}</p>
          {invoice.client.company && (
            <p className="text-sm text-muted-foreground">{invoice.client.company}</p>
          )}
        </div>
        <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium">
          {invoice.invoiceNumber}
        </div>
      </div>

      <div className="mb-8 max-w-xs">
        <MetaDates invoice={invoice} />
      </div>

      <ItemsTable invoice={invoice} compact />

      <div className="mt-10 border-t-2 border-slate-900 pt-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          {invoice.notes && (
            <p className="max-w-sm text-sm italic text-muted-foreground whitespace-pre-line">
              {invoice.notes}
            </p>
          )}
          <TotalsBlock invoice={invoice} />
        </div>
      </div>

      <p className="mt-12 text-center text-xs text-muted-foreground">
        {invoice.business.phone} · {invoice.business.website}
      </p>
    </div>
  );
}
