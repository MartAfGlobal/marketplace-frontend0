"use client";

import React, { useState } from "react";
import Image from "next/image";

export interface ReturnedItemData {
  sku: string;
  name: string;
  image?: string;
  unitPrice: number | string;
  quantity: number | string;
  variants?: string;
  shippingFee?: number | string;
  total: number | string;
}

interface ReturnedItemsTableProps {
  items: ReturnedItemData[];
  currentStatus: string;
  onUpdateStatus?: (newStatus: string) => void;
  onTrackOrder?: () => void;
  loading?: boolean;
}

function formatAmount(val: any) {
  if (val == null || val === "" || isNaN(Number(val))) {
    if (typeof val === "string" && val.startsWith("₦")) return val;
    if (typeof val === "string" && val.startsWith("N")) return `₦${val.slice(1)}`;
    return "₦0";
  }
  return `₦${Number(val).toLocaleString()}`;
}

export default function ReturnedItemsTable({
  items,
  currentStatus,
  onUpdateStatus,
  onTrackOrder,
  loading = false,
}: ReturnedItemsTableProps) {
  const [selectedStatus, setSelectedStatus] = useState(
    currentStatus?.charAt(0).toUpperCase() + currentStatus?.slice(1).toLowerCase() || "Pending"
  );

  return (
    <div className="space-y-4 pt-4">
      <h3 className="text-base font-MontserratBold text-[#161616]">Returned Item</h3>

      <div className="overflow-x-auto rounded-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#7F56D9] text-white text-xs font-MontserratMedium h-11">
              <th className="px-5 py-3 font-MontserratMedium">SKU</th>
              <th className="px-5 py-3 font-MontserratMedium min-w-[220px]">items</th>
              <th className="px-5 py-3 font-MontserratMedium">Unit price</th>
              <th className="px-5 py-3 font-MontserratMedium text-center">Qty</th>
              <th className="px-5 py-3 font-MontserratMedium">Variants</th>
              <th className="px-5 py-3 font-MontserratMedium">Shipping Fee</th>
              <th className="px-5 py-3 font-MontserratMedium">Total</th>
            </tr>
          </thead>
          <tbody className="text-sm font-MontserratNormal bg-white divide-y divide-gray-100">
            {items.length > 0 ? (
              items.map((item, idx) => (
                <tr key={idx} className="h-20 hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3 text-xs font-MontserratMedium text-[#161616]">
                    {item.sku || "—"}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex-shrink-0 relative overflow-hidden border border-gray-200">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            IMG
                          </div>
                        )}
                      </div>
                      <span className="text-xs font-MontserratMedium text-[#161616] line-clamp-2">
                        {item.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-xs font-MontserratMedium text-[#161616]">
                    {formatAmount(item.unitPrice)}
                  </td>
                  <td className="px-5 py-3 text-xs font-MontserratMedium text-center text-[#161616]">
                    {item.quantity}
                  </td>
                  <td className="px-5 py-3 text-xs font-MontserratNormal text-gray-600">
                    {item.variants || "—"}
                  </td>
                  <td className="px-5 py-3 text-xs font-MontserratSemiBold text-[#161616]">
                    {formatAmount(item.shippingFee)}
                  </td>
                  <td className="px-5 py-3 text-xs font-MontserratBold text-[#161616]">
                    {formatAmount(item.total)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-8 text-center text-xs text-gray-400">
                  No items listed for this return
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Action bar beneath Returned Item Table ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative min-w-[200px]">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full h-11 px-4 text-xs font-MontserratMedium text-gray-700 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6D5B] appearance-none cursor-pointer"
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="In Review">In Review</option>
              <option value="Item Returned">Item Returned</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={() => onUpdateStatus?.(selectedStatus)}
            className="h-11 px-6 bg-[#FF6D5B] text-white text-xs font-MontserratSemiBold rounded-xl hover:bg-[#FF6D5B]/90 transition-colors disabled:opacity-50 whitespace-nowrap shadow-sm"
          >
            {loading ? "Updating..." : "Update Status"}
          </button>
        </div>

        {onTrackOrder && (
          <button
            type="button"
            onClick={onTrackOrder}
            className="w-full sm:w-auto h-11 px-8 border border-[#FF6D5B] text-[#FF6D5B] text-xs font-MontserratSemiBold rounded-xl hover:bg-[#FF6D5B]/5 transition-colors whitespace-nowrap"
          >
            Track order
          </button>
        )}
      </div>
    </div>
  );
}
