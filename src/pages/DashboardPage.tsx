import { useNavigate } from "react-router-dom";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { RecentInvoicesTable } from "@/components/dashboard/RecentInvoicesTable";
import { Button } from "@/components/ui/button";
import { useInvoice } from "@/context/InvoiceContext";
import { PlusCircle } from "lucide-react";

export function DashboardPage() {
  const navigate = useNavigate();
  const { stats, drafts, loadDraft } = useInvoice();

  const handleOpen = (inv: Parameters<typeof loadDraft>[0]) => {
    loadDraft(inv);
    navigate("/create");
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Overview of revenue, payments, and recent activity
          </p>
        </div>
        <Button onClick={() => navigate("/create")}>
          <PlusCircle className="h-4 w-4" />
          New invoice
        </Button>
      </div>

      <StatsCards stats={stats} />
      <RevenueChart drafts={drafts} />
      <RecentInvoicesTable drafts={drafts} onOpen={handleOpen} />
    </div>
  );
}
