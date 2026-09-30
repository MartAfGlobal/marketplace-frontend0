// Re-export the generic formatting/export utilities already built for the
// Finance section -- they're not actually finance-specific, no reason to
// duplicate them for Reports.
export { formatNaira, formatCompact, formatDate, formatTime, formatDateTime, downloadCsv } from "./financeFormat";

/**
 * PDF export, same jsPDF + jspdf-autotable combination already used for
 * client-side exports elsewhere in this codebase (see my-orders.tsx) --
 * these are real reports, not just listings, so every table gets a PDF
 * option next to its CSV one, not CSV alone.
 */
export const downloadPdf = async (
  title: string,
  filename: string,
  columns: string[],
  rows: (string | number)[][],
) => {
  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF({ orientation: columns.length > 6 ? "landscape" : "portrait" });
  doc.setFontSize(14);
  doc.text(title, 14, 15);
  doc.setFontSize(9);
  doc.text(`Generated ${new Date().toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}`, 14, 21);

  autoTable(doc, {
    head: [columns],
    body: rows,
    startY: 26,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [148, 127, 255] },
  });

  doc.save(filename);
};

// Reports' own period vocabulary matches the backend exactly
// (?period=week|month|year for summary totals, ?range=weekly|monthly|yearly
// for trend charts) -- deliberately NOT reusing Finance's FinancePeriod
// (today/this_week/this_month/last_month/this_year), which doesn't line up.
export type ReportPeriod = "week" | "month" | "year";
export const REPORT_PERIOD_LABELS: Record<ReportPeriod, string> = {
  week: "This week",
  month: "This month",
  year: "This year",
};
export const REPORT_PERIOD_OPTIONS = Object.values(REPORT_PERIOD_LABELS);
export const reportPeriodFromLabel = (label: string): ReportPeriod =>
  (Object.keys(REPORT_PERIOD_LABELS) as ReportPeriod[]).find((k) => REPORT_PERIOD_LABELS[k] === label) ?? "month";

export type ReportRange = "weekly" | "monthly" | "yearly";
export const REPORT_RANGE_LABELS: Record<ReportRange, string> = {
  weekly: "This week",
  monthly: "This month",
  yearly: "This year",
};
export const REPORT_RANGE_OPTIONS = Object.values(REPORT_RANGE_LABELS);
export const reportRangeFromLabel = (label: string): ReportRange =>
  (Object.keys(REPORT_RANGE_LABELS) as ReportRange[]).find((k) => REPORT_RANGE_LABELS[k] === label) ?? "monthly";
