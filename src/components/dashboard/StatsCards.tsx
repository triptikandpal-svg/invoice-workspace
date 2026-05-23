import { DollarSign, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { DashboardStats } from "@/types/invoice";
import { cn } from "@/lib/utils";

interface StatsCardsProps {
  stats: DashboardStats;
}

const cardStyles = [
  {
    icon: DollarSign,
    iconClass: "text-emerald-600",
    iconBg: "bg-emerald-500/10 border-emerald-500/15",
  },
  {
    icon: Clock,
    iconClass: "text-amber-600",
    iconBg: "bg-amber-500/10 border-amber-500/15",
  },
  {
    icon: CheckCircle2,
    iconClass: "text-sky-600",
    iconBg: "bg-sky-500/10 border-sky-500/15",
  },
  {
    icon: AlertCircle,
    iconClass: "text-rose-600",
    iconBg: "bg-rose-500/10 border-rose-500/15",
  },
];

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Total revenue",
      value: formatCurrency(stats.revenue),
      sub: "From paid invoices",
    },
    {
      title: "Pending payments",
      value: formatCurrency(stats.pendingAmount),
      sub: `${stats.pendingCount + stats.overdueCount} open invoices`,
    },
    {
      title: "Paid invoices",
      value: String(stats.paidCount),
      sub: "Marked as paid",
    },
    {
      title: "Overdue",
      value: String(stats.overdueCount),
      sub: "Requires follow-up",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ title, value, sub }, index) => {
        const { icon: Icon, iconClass, iconBg } = cardStyles[index];
        return (
          <div
            key={title}
            className="dashboard-panel group px-6 py-5 transition-colors hover:border-border"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-[13px] font-medium leading-none text-muted-foreground">
                {title}
              </p>
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border",
                  iconBg
                )}
              >
                <Icon className={cn("h-4 w-4", iconClass)} strokeWidth={1.75} />
              </div>
            </div>
            <p className="mt-5 text-[28px] font-semibold leading-none tracking-tight tabular-nums text-foreground">
              {value}
            </p>
            <p className="mt-2.5 text-[12px] leading-relaxed text-muted-foreground">{sub}</p>
          </div>
        );
      })}
    </div>
  );
}
