import { Link } from "react-router-dom";
import { ArrowRight, FileText, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import type { DashboardStats } from "@/types/invoice";

interface PaymentSummaryProps {
  stats: DashboardStats;
}

export function PaymentSummary({ stats }: PaymentSummaryProps) {
  const openCount = stats.pendingCount + stats.overdueCount;
  const collectionRate =
    stats.paidCount + openCount > 0
      ? Math.round((stats.paidCount / (stats.paidCount + openCount)) * 100)
      : 0;

  const rows = [
    {
      label: "Collected",
      value: formatCurrency(stats.revenue),
      hint: `${stats.paidCount} paid`,
    },
    {
      label: "Outstanding",
      value: formatCurrency(stats.pendingAmount),
      hint: `${openCount} open`,
    },
  ];

  return (
    <div className="dashboard-panel flex h-full flex-col p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Cash flow
          </p>
          <h3 className="mt-1.5 text-lg font-semibold tracking-tight">Payment summary</h3>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/80 bg-muted/40">
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {rows.map((row) => (
          <div
            key={row.label}
            className="rounded-lg border border-border/60 bg-muted/20 px-4 py-3.5"
          >
            <p className="text-[12px] font-medium text-muted-foreground">{row.label}</p>
            <p className="mt-1 text-xl font-semibold tracking-tight tabular-nums">{row.value}</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">{row.hint}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-lg border border-dashed border-border/80 px-4 py-3.5">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-[12px] font-medium text-muted-foreground">Collection rate</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight tabular-nums">
              {collectionRate}%
            </p>
          </div>
          <p className="text-[11px] text-muted-foreground">Paid vs open</p>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-foreground/80 transition-all duration-500"
            style={{ width: `${collectionRate}%` }}
          />
        </div>
      </div>

      <div className="mt-auto pt-6">
        <Button variant="outline" size="sm" className="w-full justify-between" asChild>
          <Link to="/drafts">
            <span className="flex items-center gap-2">
              <FileText className="h-3.5 w-3.5" />
              Manage invoices
            </span>
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
