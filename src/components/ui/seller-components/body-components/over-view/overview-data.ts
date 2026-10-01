export type OverviewMetricName = "sales" | "orders" | "products" | "customers";

export function toMetricNumber(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value.replace(/[^\d.-]/g, ""));
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

export function getMetricSection(analytics: any, metric: OverviewMetricName) {
  const candidates = [
    analytics?.[metric],
    analytics?.[`${metric}_stats`],
    analytics?.[`${metric}_card`],
    analytics?.overview?.[metric],
    analytics?.stats?.[metric],
  ];
  return candidates.find((candidate) => candidate && typeof candidate === "object") ?? {};
}

export function getMetricTotal(
  analytics: any,
  metric: OverviewMetricName,
  aliases: string[] = [],
): number {
  const section = getMetricSection(analytics, metric);
  const values = [
    section.total,
    section.count,
    section.value,
    ...aliases.map((alias) => section[alias]),
    analytics?.[`${metric}_total`],
    analytics?.[`${metric}_count`],
    analytics?.[`total_${metric}`],
    ...aliases.map((alias) => analytics?.[alias]),
  ];
  const value = values.find((candidate) => candidate !== undefined && candidate !== null);
  return toMetricNumber(value);
}

export function getMetricChange(analytics: any, metric: OverviewMetricName) {
  const section = getMetricSection(analytics, metric);
  return (
    section.change ??
    analytics?.changes?.[metric] ??
    analytics?.change?.[metric] ??
    analytics?.[`${metric}_change`] ??
    {}
  );
}

export function getChangeValue(change: any): number {
  return toMetricNumber(change?.value ?? change?.amount ?? change?.percentage);
}

export function getChangeDirection(change: any): "up" | "down" {
  return String(change?.direction ?? "up").toLowerCase() === "down" ? "down" : "up";
}

export function getMetricArray(section: any, ...keys: string[]): any[] {
  for (const key of keys) {
    if (Array.isArray(section?.[key])) return section[key];
  }
  return [];
}

export function getWeekdayCounts(section: any): { label: string; count: number }[] {
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const series = getMetricArray(
    section,
    "current_week",
    "weekly_orders",
    "weekly_order_counts",
    "orders_by_day",
    "week",
  );
  const keyedSeries = section?.current_week ?? section?.weekly_orders ?? section?.orders_by_day;

  return labels.map((label, index) => {
    const item = series.find((entry: any) => {
      const itemLabel = String(entry?.day ?? entry?.label ?? entry?.weekday ?? entry?.name ?? "");
      return itemLabel.toLowerCase().startsWith(label.toLowerCase());
    });
    const keyedValue = keyedSeries && !Array.isArray(keyedSeries)
      ? keyedSeries[label] ?? keyedSeries[label.toLowerCase()]
      : undefined;
    return {
      label,
      count: toMetricNumber(
        item?.count ??
          item?.orders ??
          item?.value ??
          keyedValue ??
          series[index]?.count ??
          series[index]?.orders ??
          series[index]?.value,
      ),
    };
  });
}