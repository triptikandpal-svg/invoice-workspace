import { DollarSign, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { DashboardStats } from "@/types/invoice";

interface StatsCardsProps {
  stats: DashboardStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Total Revenue",
      value: formatCurrency(stats.revenue),
      sub: "From paid invoices",
      icon: DollarSign,
    },
    {
      title: "Pending Payments",
      value: formatCurrency(stats.pendingAmount),
      sub: `${stats.pendingCount + stats.overdueCount} open invoices`,
      icon: Clock,
    },
    {
      title: "Paid Invoices",
      value: String(stats.paidCount),
      sub: "Marked as paid",
      icon: CheckCircle2,
    },
    {
      title: "Overdue",
      value: String(stats.overdueCount),
      sub: "Requires follow-up",
      icon: AlertCircle,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ title, value, sub, icon: Icon }) => (
        <Card key={title} className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            <div className="rounded-md bg-muted p-2">
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tracking-tight">{value}</div>
            <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
