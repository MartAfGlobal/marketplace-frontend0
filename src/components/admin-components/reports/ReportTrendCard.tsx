"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import FilterDropdown from "@/components/ui/seller-components/body-components/over-view/Filter-components/filterButton";
import { formatCompact } from "@/helpers/admin/reportsFormat";

export interface TrendSeries {
  label: string;
  color: string;
  points: { x: string; value: number }[];
}

interface ReportTrendCardProps {
  title: string;
  series: TrendSeries[];
  rangeOptions: string[];
  selectedRange: string;
  onRangeChange: (label: string) => void;
  emptyMessage: string;
  valueFormatter?: (v: number) => string;
}

/**
 * Generic version of admin-components/finance/FinanceTrendCard -- same
 * visual pattern (title + period dropdown + line chart), but takes an
 * already-normalized series (or several, for a multi-line chart like
 * "successful vs failed logins") instead of Finance's specific
 * DashboardFigure shape, so every report section's trend chart reuses one
 * component instead of N near-duplicates.
 */
export default function ReportTrendCard({
  title, series, rangeOptions, selectedRange, onRangeChange, emptyMessage, valueFormatter,
}: ReportTrendCardProps) {
  const hasData = series.some((s) => s.points.length > 0);
  // Recharts wants one array of objects keyed by x, with one value column per series.
  const merged: Record<string, any> = {};
  series.forEach((s) => {
    s.points.forEach((p) => {
      merged[p.x] = merged[p.x] || { x: p.x };
      merged[p.x][s.label] = p.value;
    });
  });
  const data = Object.values(merged);

  return (
    <div className="rounded-2xl border border-000000/8 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-c18 font-MontserratNormal">{title}</h2>
        <FilterDropdown
          options={rangeOptions}
          defaultValue={selectedRange}
          onChange={onRangeChange}
          className="!rounded-c8 !h-9 !py-0 !px-3 !gap-4"
        />
      </div>

      <div className="border-t border-000000/8 mt-4 pt-6 h-64">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#EEF0F3" />
              <XAxis dataKey="x" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "#00000068" }} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10, fill: "#00000068" }}
                tickFormatter={(v) => (valueFormatter ? valueFormatter(v) : formatCompact(v))}
              />
              {series.map((s) => (
                <Line key={s.label} type="linear" dataKey={s.label} stroke={s.color} strokeWidth={1.5} dot={false} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-xs text-000000/44 font-MontserratNormal text-center px-6">
            {emptyMessage}
          </div>
        )}
      </div>
      {series.length > 1 && (
        <div className="flex items-center gap-4 mt-3">
          {series.map((s) => (
            <div key={s.label} className="flex items-center gap-1.5 text-[10px] text-000000/68 font-MontserratNormal">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
              {s.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
