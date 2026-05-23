import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { RecentInvoicesTable } from "@/components/dashboard/RecentInvoicesTable";
import { PaymentSummary } from "@/components/dashboard/PaymentSummary";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { useInvoice } from "@/context/InvoiceContext";

export function DashboardPage() {
  const navigate = useNavigate();
  const { stats, drafts, loadDraft } = useInvoice();

  const handleOpen = (inv: Parameters<typeof loadDraft>[0]) => {
    loadDraft(inv);
    navigate("/create");
  };

  const today = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());

  return (
    <div className="page-shell space-y-10">
      <PageHeader
        eyebrow={today}
        title="Dashboard"
        description="Track revenue, outstanding payments, and recent invoice activity at a glance."
        actions={
          <>
            <Button
              variant="outline"
              className="border-border/80 bg-card"
              onClick={() => navigate("/drafts")}
            >
              View drafts
            </Button>
            <Button onClick={() => navigate("/create")}>
              <Plus className="h-4 w-4" strokeWidth={2} />
              New invoice
            </Button>
          </>
        }
      />

      <DashboardSection label="Overview" title="Key metrics">
        <StatsCards stats={stats} />
      </DashboardSection>

      <DashboardSection label="Performance" title="Revenue & cash flow">
        <div className="grid gap-5 lg:grid-cols-3 lg:gap-6">
          <div className="lg:col-span-2">
            <RevenueChart drafts={drafts} />
          </div>
          <div className="min-h-[380px] lg:min-h-0">
            <PaymentSummary stats={stats} />
          </div>
        </div>
      </DashboardSection>

      <DashboardSection label="Workspace" title="Latest activity">
        <RecentInvoicesTable drafts={drafts} onOpen={handleOpen} />
      </DashboardSection>
    </div>
  );
}
