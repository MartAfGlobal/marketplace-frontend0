"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export interface DonutRow {
  label: string;
  value: number;
  /** What the legend shows beside the label; defaults to the raw value. */
  display?: string;
}

interface DonutBreakdownProps {
  rows: DonutRow[];
  emptyMessage: string;
}

// Purple family matching the admin brand palette used elsewhere
// (sidebar active state, AdminStatsChartCard's line/fill).
export const DONUT_COLORS = ["#6A0DAD", "#947FFF", "#B79CFF", "#D8CCFF", "#FF715B", "#FFAC06"];

// Rendered when there's no data yet — a single flat gray ring rather than an
// empty box, so the card always shows the chart it's named after.
const EMPTY_SEGMENT = [{ label: "No data", value: 1 }];

/** Open-ring donut + legend, shared by Staff activity and the Finance overview sources. */
export default function DonutBreakdown({ rows, emptyMessage }: DonutBreakdownProps) {
  const visible = rows.slice(0, DONUT_COLORS.length);
  const hasData = visible.some((row) => row.value > 0);
  const chartData = hasData ? visible : EMPTY_SEGMENT;

  return (
    <div className="flex items-center gap-8">
      <div className="w-32 h-32 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius="58%"
              outerRadius="100%"
              // A full closed ring, starting at 12 o'clock. A previous version
              // left an intentional gap at the top, but with only 2-3 slices the
              // gap plus the rounded segment ends read as a broken chart rather
              // than a style choice.
              startAngle={90}
              endAngle={-270}
              paddingAngle={hasData && visible.length > 1 ? 3 : 0}
              cornerRadius={hasData && visible.length > 1 ? 4 : 0}
            >
              {hasData ? (
                visible.map((row, i) => <Cell key={row.label} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />)
              ) : (
                <Cell fill="#EEF0F3" />
              )}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-col gap-3">
        {hasData ? (
          visible.map((row, i) => (
            <div key={row.label} className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: DONUT_COLORS[i % DONUT_COLORS.length] }} />
              <span className="text-xs text-gray-500 font-MontserratNormal">{row.label}</span>
              <span className="text-xs font-MontserratSemiBold text-[#161616]">{row.display ?? row.value}</span>
            </div>
          ))
        ) : (
          <span className="text-xs text-gray-400 font-MontserratMedium">{emptyMessage}</span>
        )}
      </div>
    </div>
  );
}
