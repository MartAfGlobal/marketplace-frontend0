"use client";

import { useMemo } from "react";
import { useSelector } from "react-redux";

// Matches the Sales chart bucket labels exactly
const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sept", "Oct", "Nov", "Dec",
];
const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const COLORS = ["#947FFF", "#6A0DAD", "#947FFF80", "#6A0DAD80", "#E1D5FF"];

function filterOrdersByPeriod(orders: any[], period: string): any[] {
  const now = new Date();
  return orders.filter((order: any) => {
    const d = new Date(order.created_at);
    if (period === "This Week") {
      return (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24) <= 7;
    }
    if (period === "This Month") {
      return (
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      );
    }
    // "This Year" (default)
    return d.getFullYear() === now.getFullYear();
  });
}

export interface TrendPoint {
  label: string;
  orders: number;
}

export interface CategoryPoint {
  label: string;
  value: number;
  color: string;
}

export function useOrdersChartData(period: string): {
  trend: TrendPoint[];
  categoryBreakdown: CategoryPoint[];
} {
  const orders: any[] = useSelector(
    (state: any) => state.orders.orders ?? []
  );

  return useMemo(() => {
    const filtered = filterOrdersByPeriod(orders, period);

    // ── Trend: zero-filled, bucketed identically to the Sales chart ──────────
    let trend: TrendPoint[];

    if (period === "This Week") {
      // Weekly: bucket by weekday Mon(0)…Sun(6)
      const counts: Record<string, number> = {};
      DAY_LABELS.forEach((d) => (counts[d] = 0));

      filtered.forEach((order: any) => {
        const d = new Date(order.created_at);
        // JS getDay(): 0=Sun,1=Mon…6=Sat → shift so Mon=0
        const idx = (d.getDay() + 6) % 7;
        counts[DAY_LABELS[idx]] = (counts[DAY_LABELS[idx]] || 0) + 1;
      });

      trend = DAY_LABELS.map((label) => ({ label, orders: counts[label] }));
    } else {
      // Monthly / Yearly: bucket by month label (same as Sales chart)
      const counts: Record<string, number> = {};
      MONTH_LABELS.forEach((m) => (counts[m] = 0));

      filtered.forEach((order: any) => {
        const d = new Date(order.created_at);
        const month = MONTH_LABELS[d.getMonth()];
        if (month) counts[month] = (counts[month] || 0) + 1;
      });

      trend = MONTH_LABELS.map((label) => ({
        label,
        orders: counts[label],
      }));
    }

    // ── Category breakdown: qty sold per category, same window ───────────────
    const categoryMap: Record<string, number> = {};

    filtered.forEach((order: any) => {
      (order.order_items || []).forEach((item: any) => {
        let cat: string =
          item.product_category || item.category || item.product_type;
        if (cat) {
          cat =
            typeof cat === "object"
              ? (cat as any).name || "Unknown"
              : String(cat);
        } else {
          cat = "Uncategorized";
        }
        categoryMap[cat] = (categoryMap[cat] || 0) + (item.quantity || 1);
      });
    });

    const sorted = Object.entries(categoryMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const categoryBreakdown: CategoryPoint[] =
      sorted.length > 0
        ? sorted.map(([label, value], i) => ({
            label,
            value,
            color: COLORS[i % COLORS.length],
          }))
        : [
            // Placeholder data when there are no real orders yet
            { label: "Fashion & shoes", value: 2500, color: COLORS[0] },
            { label: "Electronics",     value: 250,  color: COLORS[1] },
            { label: "Beverages",       value: 400,  color: COLORS[2] },
          ];

    return { trend, categoryBreakdown };
  }, [orders, period]);
}
