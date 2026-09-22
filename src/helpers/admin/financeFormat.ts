import type { FinancePeriod, LedgerStatus } from "@/types/finance";

export const PERIOD_LABELS: Record<FinancePeriod, string> = {
  today: "Today",
  this_week: "This week",
  this_month: "This month",
  last_month: "Last month",
  this_year: "This year",
};

export const PERIOD_OPTIONS = Object.values(PERIOD_LABELS);

export const periodFromLabel = (label: string): FinancePeriod =>
  (Object.keys(PERIOD_LABELS) as FinancePeriod[]).find((k) => PERIOD_LABELS[k] === label) ?? "this_month";

// The ₦ glyph is the design's own (`N` in mockups is just the font fallback).
export const formatNaira = (value: number | string | null | undefined, decimals = 2) =>
  `₦${Number(value ?? 0).toLocaleString("en-NG", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;

export const formatCompact = (value: number | string) =>
  Number(value).toLocaleString("en-NG", { notation: "compact", maximumFractionDigits: 1 });

export const formatDate = (iso: string | null | undefined) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }).replace(/\//g, "-");
};

export const formatTime = (iso: string | null | undefined) => {
  if (!iso) return "";
  const d = new Date(iso);
  return isNaN(d.getTime()) ? "" : d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
};

export const formatDateTime = (iso: string | null | undefined) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return `${formatDate(iso)}  ${d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
};

export const LEDGER_STATUS_STYLES: Record<LedgerStatus | string, string> = {
  COMPLETED: "text-[#00BE5C] bg-[#00BE5C]/12",
  PENDING: "text-[#FFAC06] bg-[#FFAC06]/12",
  IN_PROGRESS: "text-[#FFAC06] bg-[#FFAC06]/12",
  FAILED: "text-[#CA0202] bg-[#CA0202]/12",
};

/** Client-side CSV of the rows on screen — what the header's download button exports. */
export const downloadCsv = (filename: string, headers: string[], rows: (string | number)[][]) => {
  const escape = (cell: string | number) => `"${String(cell).replace(/"/g, '""')}"`;
  const csv = [headers, ...rows].map((r) => r.map(escape).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};
