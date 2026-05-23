import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

export function RevenueChart({ drafts }: { drafts: Invoice[] }) {
  const data = buildChartData(drafts);

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle>Revenue overview</CardTitle>
        <CardDescription>Paid vs pending amounts over the last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1e293b" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#1e293b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis
                tick={{ fontSize: 12 }}
                stroke="#94a3b8"
                tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid #e2e8f0",
                  fontSize: 12,
                }}
                formatter={(value: number, name: string) => [
                  formatCurrency(value),
                  name === "revenue" ? "Paid" : "Pending",
                ]}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#1e293b"
                fill="url(#revenueFill)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="pending"
                stroke="#94a3b8"
                fill="transparent"
                strokeWidth={2}
                strokeDasharray="4 4"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
