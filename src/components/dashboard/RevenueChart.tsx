import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Invoice } from "@/types/invoice";
import { calculateTotals } from "@/lib/calculations";
import { formatCurrency } from "@/lib/utils";

function buildChartData(drafts: Invoice[]) {
  const months: Record<string, { month: string; revenue: number; pending: number }> = {};
  const now = new Date();

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const label = d.toLocaleString("en-US", { month: "short" });
    months[key] = { month: label, revenue: 0, pending: 0 };
  }

  drafts.forEach((inv) => {
    if (!inv.invoiceDate) return;
    const d = new Date(inv.invoiceDate);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    if (!months[key]) return;
    const total = calculateTotals(inv.items, inv.discountPercent).grandTotal;
    if (inv.paymentStatus === "paid") months[key].revenue += total;
    else if (inv.paymentStatus !== "draft") months[key].pending += total;
  });

  return Object.values(months);
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; dataKey: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-border/80 bg-card px-3 py-2.5 shadow-card">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <div className="space-y-1.5">
        {payload.map((entry) => (
          <div key={entry.dataKey} className="flex items-center justify-between gap-6 text-[13px]">
            <span className="flex items-center gap-2 text-muted-foreground">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  entry.dataKey === "revenue" ? "bg-foreground" : "bg-muted-foreground"
                }`}
              />
              {entry.dataKey === "revenue" ? "Paid" : "Pending"}
            </span>
            <span className="font-medium tabular-nums">{formatCurrency(entry.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RevenueChart({ drafts }: { drafts: Invoice[] }) {
  const data = buildChartData(drafts);
  const totalPaid = data.reduce((sum, d) => sum + d.revenue, 0);

  return (
    <div className="dashboard-panel flex h-full flex-col">
      <div className="flex flex-col gap-4 border-b border-border/60 px-6 py-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Analytics
          </p>
          <h3 className="text-lg font-semibold tracking-tight">Revenue overview</h3>
          <p className="text-[13px] text-muted-foreground">
            Paid vs pending over the last 6 months
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-5 sm:justify-end">
          <div className="text-right">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              6-mo paid
            </p>
            <p className="mt-0.5 text-lg font-semibold tabular-nums tracking-tight">
              {formatCurrency(totalPaid)}
            </p>
          </div>
          <div className="flex items-center gap-4 text-[12px] text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="h-0.5 w-4 rounded-full bg-foreground" />
              Paid
            </span>
            <span className="flex items-center gap-2">
              <span className="h-0.5 w-4 rounded-full border border-muted-foreground bg-transparent" />
              Pending
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 pb-5 pt-4 sm:px-6">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 12, right: 4, left: -8, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(222 47% 20%)" stopOpacity={0.12} />
                  <stop offset="100%" stopColor="hsl(222 47% 20%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                stroke="hsl(214 20% 92%)"
                strokeDasharray="0"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "hsl(215 16% 47%)" }}
                dy={8}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "hsl(215 16% 47%)" }}
                tickFormatter={(v) =>
                  `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`
                }
                width={44}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: "hsl(214 20% 88%)" }} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="hsl(222 47% 20%)"
                fill="url(#revenueFill)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0, fill: "hsl(222 47% 20%)" }}
              />
              <Area
                type="monotone"
                dataKey="pending"
                stroke="hsl(215 16% 65%)"
                fill="transparent"
                strokeWidth={1.5}
                strokeDasharray="5 5"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
