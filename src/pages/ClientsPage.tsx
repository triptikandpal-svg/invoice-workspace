import { useNavigate } from "react-router-dom";
import { Mail, Building2, User, Users, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/PageHeader";
import { useInvoice } from "@/context/InvoiceContext";

export function ClientsPage() {
  const navigate = useNavigate();
  const { clients, selectClient } = useInvoice();

  return (
    <div className="page-shell space-y-8">
      <PageHeader
        eyebrow="Manage"
        title="Clients"
        description="Saved bill-to contacts for quick reuse when creating invoices."
        actions={
          <Button onClick={() => navigate("/create")}>
            <Plus className="h-4 w-4" />
            New invoice
          </Button>
        }
      />

      {clients.length === 0 ? (
        <div className="app-panel flex flex-col items-center px-6 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border/80 bg-muted/30">
            <Users className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="mt-4 text-sm font-medium">No clients saved</p>
          <p className="mt-1 max-w-sm text-[13px] text-muted-foreground">
            On the invoice form, fill in client details and click &quot;Save client for later&quot;.
          </p>
          <Button size="sm" className="mt-5" onClick={() => navigate("/create")}>
            Go to invoice editor
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {clients.map((client) => (
            <article
              key={client.id}
              className="app-panel flex flex-col p-5 transition-colors hover:border-border"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted/50 text-sm font-semibold text-muted-foreground">
                  {client.name?.charAt(0)?.toUpperCase() || "?"}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-[15px] font-semibold tracking-tight">
                    {client.name}
                  </h3>
                  {client.company && (
                    <p className="mt-0.5 flex items-center gap-1 truncate text-[12px] text-muted-foreground">
                      <Building2 className="h-3 w-3 shrink-0" />
                      {client.company}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4 flex-1 space-y-2 border-t border-border/60 pt-4">
                {client.email && (
                  <p className="flex items-center gap-2 truncate text-[12px] text-muted-foreground">
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    {client.email}
                  </p>
                )}
                {client.phone && (
                  <p className="text-[12px] text-muted-foreground">{client.phone}</p>
                )}
              </div>

              <Button
                size="sm"
                variant="outline"
                className="mt-5 w-full"
                onClick={() => {
                  selectClient(client);
                  navigate("/create");
                }}
              >
                <User className="h-3.5 w-3.5" />
                Use in invoice
              </Button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
