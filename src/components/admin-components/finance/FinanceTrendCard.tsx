"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import FilterDropdown from "@/components/ui/seller-components/body-components/over-view/Filter-components/filterButton";
import { formatCompact, formatNaira, PERIOD_LABELS, PERIOD_OPTIONS } from "@/helpers/admin/financeFormat";
import type { DashboardFigure } from "@/types/finance";

interface FinanceTrendCardProps {
  title: string;
  figure: DashboardFigure | undefined;
  /** Line + headline colour — green for revenue, red for expenses. */
  color: string;
  period: string;
  onPeriodChange: (label: string) => void;
}

const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

// The "25% increase from last month" chip. A missing comparison (no prior
// figure) is shown as nothing rather than an invented 0%.
function ChangeChip({ percent }: { percent: number | null | undefined }) {
  if (percent == null) return null;
  return (
    <div className="flex items-center gap-2 mt-3">
      <span className="text-[10px] font-MontserratNormal text-[#1A6FE0] bg-[#1A6FE0]/10 px-2 py-1 rounded-c8">
        {Math.abs(percent)}% {percent >= 0 ? "increase" : "decrease"}
      </span>
      <span className="text-[10px] text-000000/44 font-MontserratNormal">from previous period</span>
    </div>
  );
}

export default function FinanceTrendCard({ title, figure, color, period, onPeriodChange }: FinanceTrendCardProps) {
  const series = (figure?.series ?? []).map((p) => ({ x: shortDate(p.date), value: Number(p.amount) }));

  return (
    <div className="rounded-2xl border border-000000/8 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-c18 font-MontserratNormal">{title}</h2>
        <FilterDropdown
          options={PERIOD_OPTIONS}
          defaultValue={PERIOD_LABELS[period as keyof typeof PERIOD_LABELS] ?? PERIOD_LABELS.this_month}
          onChange={onPeriodChange}
          className="!rounded-c8 !h-9 !py-0 !px-3 !gap-4"
        />
      </div>

      <p className="mt-4 text-c32 font-MontserratMedium" style={{ color }}>
        {formatNaira(figure?.total, 0)}
      </p>
      <ChangeChip percent={figure?.change_percent} />

      <div className="border-t border-000000/8 mt-6 pt-6 h-64">
        {series.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={series} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#EEF0F3" />
              <XAxis dataKey="x" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "#00000068" }} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10, fill: "#00000068" }}
                tickFormatter={(v) => formatCompact(v)}
              />
              <Line type="linear" dataKey="value" stroke={color} strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-xs text-000000/44 font-MontserratNormal">
            No {title.toLowerCase()} recorded in this period.
          </div>
        )}
      </div>
    </div>
  );
}
