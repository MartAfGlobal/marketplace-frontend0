function formatCell(value: unknown) {
  const text =
    value === null || value === undefined
      ? ""
      : typeof value === "object"
        ? JSON.stringify(value)
        : String(value);
  const safeText = /^[\s]*[=+\-@]/.test(text) ? `'${text}` : text;
  return `"${safeText.replace(/"/g, '""')}"`;
}

export function downloadTableRows<T extends object>(rows: T[], filename: string) {
  if (rows.length === 0) return;

  const records = rows as Record<string, unknown>[];
  const columns = Array.from(new Set(records.flatMap((row) => Object.keys(row))));
  const csv = [
    columns.map(formatCell).join(","),
    ...records.map((row) => columns.map((column) => formatCell(row[column])).join(",")),
  ].join("\r\n");
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
