import type { AttributeRow } from "@/components/admin-components/categories/AttributesTable";

/** Maps a raw API attribute object → AttributeRow (+ internal _raw / _valuesArr fields) */
export function mapApiAttribute(
  attr: any
): AttributeRow & { _raw: any; _valuesArr: string[] } {
  let valuesArr: string[] = [];
  if (Array.isArray(attr.values)) {
    valuesArr = attr.values.map((v: any) =>
      typeof v === "string" ? v : v.value || v.name || String(v)
    );
  } else if (typeof attr.values === "string" && attr.values.trim()) {
    valuesArr = attr.values
      .split(",")
      .map((s: string) => s.trim())
      .filter(Boolean);
  }

  let valuesStr = "";
  if (valuesArr.length > 0) {
    valuesStr = valuesArr.join(", ");
  } else if (
    typeof attr.values_summary === "string" &&
    attr.values_summary.trim()
  ) {
    valuesStr = attr.values_summary.trim();
  }

  const valuesCount =
    typeof attr.values_count === "number"
      ? attr.values_count
      : attr.values_count
      ? Number(attr.values_count)
      : valuesArr.length;

  const isActive = attr.is_active !== undefined ? attr.is_active : true;

  const rawDate = attr.created_at || attr.date_created || attr.date;
  const d = rawDate ? new Date(rawDate) : null;
  const dateStr = d && !isNaN(d.getTime()) ? d.toLocaleDateString("en-GB") : "N/A";

  return {
    id: String(attr.id ?? attr.pk ?? ""),
    name: attr.name || "Unnamed",
    values: valuesStr,
    valuesCount,
    status: isActive ? "Active" : "Hidden",
    date: dateStr,
    _raw: attr,
    _valuesArr: valuesArr,
  };
}
