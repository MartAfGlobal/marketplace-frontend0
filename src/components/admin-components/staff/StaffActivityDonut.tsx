"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import type { AdminStaffByRole } from "@/types/admin";

interface StaffActivityDonutProps {
  data: AdminStaffByRole[];
}

// Purple family matching the admin brand palette used elsewhere
// (sidebar active state, AdminStatsChartCard's line/fill).
const COLORS = ["#6A0DAD", "#947FFF", "#B79CFF", "#D8CCFF", "#FF715B", "#FFAC06"];

// Rendered when there's no role data yet — a single flat gray ring rather
// than an empty box, so the card always shows the chart it's named after.
const EMPTY_SEGMENT = [{ role: "No data", count: 1 }];

export default function StaffActivityDonut({ data }: StaffActivityDonutProps) {
  const rows = data.slice(0, COLORS.length);
  const hasData = rows.some((row) => row.count > 0);
  const chartData = hasData ? rows : EMPTY_SEGMENT;

  return (
    <div>
      <h2 className="text-base font-MontserratNormal text-000000/68 mb-6">Staff activity</h2>

      <div className="flex items-center gap-8">
        <div className="w-32 h-32 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="count"
                nameKey="role"
                cx="50%"
                cy="50%"
                innerRadius="58%"
                outerRadius="100%"
                // An open ring with a gap at the top, not a full closed
                // circle — a 290° sweep leaves a ~70° gap centered on
                // 12 o'clock (90°): drawn from 55° clockwise to -235°.
                startAngle={55}
                endAngle={-235}
                paddingAngle={hasData && rows.length > 1 ? 4 : 0}
                cornerRadius={8}
              >
                {hasData ? (
                  rows.map((row, i) => <Cell key={row.role} fill={COLORS[i % COLORS.length]} />)
                ) : (
                  <Cell fill="#EEF0F3" />
                )}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-col gap-3">
          {hasData ? (
            rows.map((row, i) => (
              <div key={row.role} className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                />
                <span className="text-xs text-gray-500 font-MontserratNormal">{row.role}</span>
                <span className="text-xs font-MontserratSemiBold text-[#161616]">{row.count}</span>
              </div>
            ))
          ) : (
            <span className="text-xs text-gray-400 font-MontserratMedium">No role assignments yet.</span>
          )}
        </div>
      </div>
    </div>
  );
}
