"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import HandBug from "@/assets/Seller/handBug.png";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export interface FinanceColumn<T> {
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
}

interface FinanceTableProps<T> {
  rows: T[];
  columns: FinanceColumn<T>[];
  loading: boolean;
  rowKey: (row: T) => string | number;
  /** ⋮ menu entries; the actions column is omitted when there are none. */
  actions?: { label: string; onSelect: (row: T) => void }[];
  emptyMessage: string;
  /** Short, non-paginated tables shouldn't reserve a paginated table's height. */
  compact?: boolean;
}

/**
 * The purple-header list table shared by the Finance screens (Transactions,
 * Payouts). The ⋮ menu carries the per-row actions (usually "More Details").
 */
export default function FinanceTable<T>({ rows, columns, loading, rowKey, actions = [], emptyMessage, compact = false }: FinanceTableProps<T>) {
  const [activeRowKey, setActiveRowKey] = useState<string | number | null>(null);
  const hasActions = actions.length > 0;
  const colSpan = columns.length + (hasActions ? 1 : 0);

  return (
    <div className={`overflow-x-auto ${compact ? "" : "min-h-[250px]"}`}>
      <table className="w-full text-left">
        <thead>
          <tr className="h-10.5 bg-947fff text-ffffff text-nowrap">
            {columns.map((col) => (
              <th key={col.header} className={`p-3 font-MontserratNormal text-sm ${col.className ?? ""}`}>
                {col.header}
              </th>
            ))}
            {hasActions && <th className="p-3 w-10" />}
          </tr>
        </thead>
        <tbody className="text-sm text-000000/68 font-MontserratNormal">
          {loading ? (
            <tr>
              <td colSpan={colSpan} className="py-12 text-center">
                <div className="flex justify-center items-center">
                  <LoadingSpinner size={32} color="border-ff715b" />
                </div>
              </td>
            </tr>
          ) : rows.length > 0 ? (
            rows.map((row) => {
              const key = rowKey(row);
              return (
                <tr key={key} className="transition-colors h-10.5 text-nowrap">
                  {columns.map((col) => (
                    <td key={col.header} className={`p-3 ${col.className ?? ""}`}>
                      {col.cell(row)}
                    </td>
                  ))}
                  {hasActions && (
                    <td className="py-3 px-4 text-center relative">
                      <button
                        className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                        onClick={() => setActiveRowKey(activeRowKey === key ? null : key)}
                      >
                        <Image src={HandBug} alt="actions" width={16} height={16} />
                      </button>
                      <AnimatePresence>
                        {activeRowKey === key && (
                          <motion.div
                            initial={{ opacity: 0, y: -8, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="absolute right-0 text-c12 font-MontserratNormal top-full px-4 mt-2 w-39.75 rounded-c8 bg-white shadow-custom border border-000000/4 overflow-hidden z-50"
                          >
                            {actions.map((action, i) => (
                              <button
                                key={action.label}
                                onClick={() => {
                                  setActiveRowKey(null);
                                  action.onSelect(row);
                                }}
                                className={`w-full py-2 text-left transition-colors ${
                                  i === 0 ? "text-[#ff715b] hover:text-[#ff715b]/80" : "text-000000/68 hover:text-000000"
                                }`}
                              >
                                {action.label}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </td>
                  )}
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={colSpan} className="py-8 text-center text-000000/68 text-xs">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
