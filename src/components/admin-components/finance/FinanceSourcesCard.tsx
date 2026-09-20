"use client";

import FilterDropdown from "@/components/ui/seller-components/body-components/over-view/Filter-components/filterButton";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import DonutBreakdown, { DONUT_COLORS } from "@/components/admin-components/DonutBreakdown";
import { formatCompact, formatNaira, PERIOD_LABELS, PERIOD_OPTIONS } from "@/helpers/admin/financeFormat";
import type { DashboardSlice, SourceGrouping } from "@/types/finance";

interface FinanceSourcesCardProps {
  title: string;
  sources: DashboardSlice[] | undefined;
  grouping: SourceGrouping;
  onGroupingChange: (grouping: SourceGrouping) => void;
  period: string;
  onPeriodChange: (label: string) => void;
}

const TABS: { key: SourceGrouping; label: string }[] = [
  { key: "category", label: "Categories" },
  { key: "region", label: "Region" },
  { key: "service", label: "Services" },
];

const shortDate = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

// One row per date, one column per source, so recharts can draw a line each.
function toChartRows(sources: DashboardSlice[]) {
  const rows = new Map<string, Record<string, number | string | null>>();
  sources.forEach((source) =>
    source.series.forEach((point) => {
      // Every source starts as null so recharts can bridge dates it has no value for.
      const row = rows.get(point.date) ?? { x: point.date, ...Object.fromEntries(sources.map((s) => [s.label, null])) };
      row[source.label] = Number(point.amount);
      rows.set(point.date, row);
    }),
  );
  return [...rows.values()]
    .sort((a, b) => String(a.x).localeCompare(String(b.x)))
    .map((row) => ({ ...row, x: shortDate(String(row.x)) }));
}

export default function FinanceSourcesCard({
  title,
  sources,
  grouping,
  onGroupingChange,
  period,
  onPeriodChange,
}: FinanceSourcesCardProps) {
  // Same cap as the donut, so line colours line up with the legend dots.
  const visibleSources = (sources ?? []).slice(0, DONUT_COLORS.length);
  const chartRows = toChartRows(visibleSources);

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

      <div className="flex gap-3 mt-6 mb-8">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onGroupingChange(tab.key)}
            className={`h-9 px-5 rounded-c32 text-c12 font-MontserratNormal transition-colors cursor-pointer ${
              grouping === tab.key ? "bg-[#6A0DAD]/80 text-white" : "bg-000000/4 text-000000/68 hover:bg-000000/8"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <DonutBreakdown
        rows={(sources ?? []).map((s) => ({ label: s.label, value: Number(s.amount), display: formatNaira(s.amount, 0) }))}
        emptyMessage="Nothing recorded in this period."
      />

      {chartRows.length > 0 && (
        <div className="h-40 mt-8">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartRows} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#EEF0F3" />
              <XAxis dataKey="x" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "#00000068" }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "#00000068" }} tickFormatter={(v) => formatCompact(v)} />
              {visibleSources.map((source, i) => (
                <Line
                  key={source.label}
                  type="linear"
                  dataKey={source.label}
                  stroke={DONUT_COLORS[i % DONUT_COLORS.length]}
                  strokeWidth={1.2}
                  dot={{ r: 2 }}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
