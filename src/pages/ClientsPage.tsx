import { useNavigate } from "react-router-dom";
import { Mail, Building2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useInvoice } from "@/context/InvoiceContext";

export function ClientsPage() {
  const navigate = useNavigate();
  const { clients, selectClient } = useInvoice();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Recent clients</h1>
        <p className="text-sm text-muted-foreground">
          Clients saved from the invoice form appear here for quick reuse
        </p>
      </div>

      {clients.length === 0 ? (
        <Card className="shadow-soft">
          <CardContent className="py-12 text-center text-muted-foreground">
            Save a client from the invoice form using &quot;Save client for later&quot;.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((client) => (
            <Card key={client.id} className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <User className="h-4 w-4 text-muted-foreground" />
                  {client.name}
                </CardTitle>
                {client.company && (
                  <CardDescription className="flex items-center gap-1">
                    <Building2 className="h-3.5 w-3.5" />
                    {client.company}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                {client.email && (
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" />
                    {client.email}
                  </p>
                )}
                {client.phone && <p className="text-sm text-muted-foreground">{client.phone}</p>}
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    selectClient(client);
                    navigate("/create");
                  }}
                >
                  Use in new invoice
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
