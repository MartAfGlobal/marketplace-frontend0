import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { CheckCircle2, EyeOff } from "lucide-react";

export interface AttributeRow {
  id: string;
  name: string;
  values: string;
  valuesCount: number;
  status: "Active" | "Hidden";
  date: string;
}

interface AttributesTableProps {
  rows: AttributeRow[];
  selectedIds: string[];
  activeRowId: string | null;
  loading: boolean;
  onSelectAll: () => void;
  onToggleRow: (id: string) => void;
  onRowClick: (id: string) => void;
  onSetActiveRowId: (id: string | null) => void;
  onToggleHide?: (id: string, currentStatus: "Active" | "Hidden", name: string) => void;
  onDelete?: (id: string, name: string) => void;
}

export default function AttributesTable({
  rows,
  selectedIds,
  activeRowId,
  loading,
  onSelectAll,
  onToggleRow,
  onRowClick,
  onSetActiveRowId,
  onToggleHide,
  onDelete,
}: AttributesTableProps) {
  return (
    <div className="overflow-x-auto min-h-[250px]">
      <table className="w-full text-left">
        <thead>
          <tr className="h-10.5 bg-947fff text-ffffff text-nowrap">
            <th className="font-MontserratNormal text-sm text-center w-10 p-3">
              <button
                type="button"
                aria-label={rows.length > 0 ? "Select all visible attributes" : "No attributes to select"}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectAll();
                }}
                className={`mx-auto flex h-4 w-4 items-center justify-center border duration-200 ${
                  rows.length > 0 && rows.every((row) => selectedIds.includes(row.id))
                    ? "border-[#ff715b] bg-[#ff715b]"
                    : "border-[#161616] hover:border-[#ff715b]"
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`h-2.5 w-2.5 ${
                    rows.length > 0 && rows.every((row) => selectedIds.includes(row.id))
                      ? "text-white"
                      : "text-[#ff715b] opacity-0 group-hover:opacity-100 group-hover:text-white"
                  }`}
                >
                  <path d="M5 12.5 9.5 17 19 7.5" />
                </svg>
              </button>
            </th>
            <th className="p-3 font-MontserratNormal text-sm">Attribute Name</th>
            <th className="p-3 font-MontserratNormal text-sm">Values</th>
            <th className="p-3 font-MontserratNormal text-sm">Values Count</th>
            <th className="p-3 font-MontserratNormal text-sm">Status</th>
            <th className="p-3 font-MontserratNormal text-sm">Date Created</th>
            <th className="p-3 font-MontserratNormal text-sm text-center"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 text-sm text-000000/68 font-MontserratNormal">
          {loading ? (
            <tr>
              <td colSpan={7} className="py-12 text-center">
                <div className="flex justify-center items-center">
                  <LoadingSpinner size={32} color="border-ff715b" />
                </div>
              </td>
            </tr>
          ) : rows.length > 0 ? (
            rows.map((row) => (
              <tr
                key={row.id}
                onClick={() => onRowClick(row.id)}
                className="hover:bg-gray-50/50 transition-colors h-14 cursor-pointer"
              >
                <td className="py-3 px-4 text-gray-400 font-MontserratMedium">
                  <button
                    type="button"
                    aria-label={`Select ${row.name}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleRow(row.id);
                    }}
                    className={`group flex h-4 w-4 items-center justify-center border transition-all duration-200 ${
                      selectedIds.includes(row.id)
                        ? "border-[#ff715b] bg-[#ff715b]"
                        : "border-[#161616] hover:border-[#ff715b]"
                    }`}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`h-2.5 w-2.5 ${
                        selectedIds.includes(row.id)
                          ? "text-white"
                          : "text-[#ff715b] opacity-0 group-hover:opacity-100 group-hover:text-white"
                      }`}
                    >
                      <path d="M5 12.5 9.5 17 19 7.5" />
                    </svg>
                  </button>
                </td>
                <td className="py-3 px-4 text-000000/68 text-sm font-MontserratNormal">
                  <span className="block truncate" title={row.name}>{row.name}</span>
                </td>
                <td className="py-3 px-4 text-gray-700">
                  {(() => {
                    if (!row.values) {
                      return <span className="text-gray-400 font-MontserratNormal text-sm">—</span>;
                    }

                    if (!row.values.includes(",")) {
                      return (
                        <span className="text-sm font-MontserratNormal text-000000/68">
                          {row.values}
                        </span>
                      );
                    }

                    const vals = row.values
                      .split(",")
                      .map((v) => v.trim())
                      .filter(Boolean);
                    const shown = vals.slice(0, 4);
                    const extra = vals.length - shown.length;
                    return (
                      <span className="flex items-center flex-wrap gap-x-1 gap-y-0.5 text-sm font-MontserratNormal text-000000/68">
                        {shown.map((v, i) => (
                          <span key={i} className="flex items-center gap-1">
                            {i > 0 && (
                              <span className="w-[2px] h-[2px] rounded-full bg-000000/44 flex-shrink-0 inline-block" />
                            )}
                            <span>{v}</span>
                          </span>
                        ))}
                        {extra > 0 && (
                          <span className="text-000000/68 font-MontserratNormal ml-0.5">
                            +{extra}
                          </span>
                        )}
                      </span>
                    );
                  })()}
                </td>
                <td className="py-3 px-4 text-000000/68 text-sm font-MontserratNormal">{row.valuesCount}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1.5">
                    {row.status === "Active" && (
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-green-200 text-green-600 bg-green-50 text-[10px] font-MontserratMedium w-fit">
                        <CheckCircle2 className="w-3 h-3" /> Active
                      </div>
                    )}
                    {row.status === "Hidden" && (
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-gray-200 text-gray-600 bg-gray-50 text-[10px] font-MontserratMedium w-fit">
                        <EyeOff className="w-3 h-3" /> Hidden
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4 text-000000/68 text-sm font-MontserratNormal">{row.date}</td>
                <td className="py-3 px-4 text-center relative" onClick={(e) => e.stopPropagation()}>
                  <button
                    className="w-6 h-6 flex flex-col gap-[3px] items-center justify-center rounded-full hover:bg-gray-200 transition-colors cursor-pointer ml-auto mr-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSetActiveRowId(activeRowId === row.id ? null : row.id);
                    }}
                  >
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  </button>
                  <AnimatePresence>
                    {activeRowId === row.id && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute right-8 mt-2 w-36 bg-white border border-[#eef0f3] rounded-xl shadow-lg z-50 py-2 flex flex-col items-start font-MontserratMedium text-xs text-[#161616] overflow-hidden"
                      >
                        <button
                          onClick={() => {
                            onSetActiveRowId(null);
                            onRowClick(row.id);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 transition-colors cursor-pointer"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => {
                            onSetActiveRowId(null);
                            if (onToggleHide) {
                              onToggleHide(row.id, row.status, row.name);
                            }
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 transition-colors cursor-pointer"
                        >
                          {row.status === "Active" ? "Hide" : "Activate"}
                        </button>
                        <button
                          onClick={() => {
                            onSetActiveRowId(null);
                            if (onDelete) {
                              onDelete(row.id, row.name);
                            }
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 transition-colors cursor-pointer"
                        >
                          Delete
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="py-8 text-center text-gray-400 font-MontserratMedium text-xs">No records found matching your search.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
