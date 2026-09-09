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
    <div className="space-y-8 ">
      <h3 className="text-sam font-MontserratSemiBold text-000000/68">Returned Item</h3>

      <div className="overflow-x-auto ">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#947FFF] text-white text-xs text-nowrap font-MontserratSemiBold h-10">
              <th className="p-3 font-MontserratMedium">SKU</th>
              <th className="p-3 font-MontserratMedium min-w-[220px]">items</th>
              <th className="p-3 font-MontserratMedium">Unit price</th>
              <th className="p-3 font-MontserratMedium text-center">Qty</th>
              <th className="p-3 font-MontserratMedium">Variants</th>
              <th className="p-3 font-MontserratMedium">Shipping Fee</th>
              <th className="p-3 font-MontserratMedium">Total</th>
            </tr>
          </thead>
          <tbody className="text-sm bg-white divide-y divide-gray-100">
            {items.length > 0 ? (
              items.map((item, idx) => (
                <tr key={idx} className="h-20 hover:bg-gray-50/50 transition-colors">
                  <td className="p-3 text-sm">
                    {item.sku || "—"}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-c64 h-c64   flex-shrink-0 relative overflow-hidden ">
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
                      <span className="text-sm line-clamp-2">
                        {item.name}
                      </span>
                    </div>
                  </td>
                  <td className="p-3 text-sm">
                    {formatAmount(item.unitPrice)}
                  </td>
                  <td className="p-3 text-sm text-center ]">
                    {item.quantity}
                  </td>
                  <td className="p-3 text-sm font-MontserratNormal ">
                    {item.variants || "—"}
                  </td>
                  <td className="p-3 text-sm font-MontserratSemiBold ]">
                    {formatAmount(item.shippingFee)}
                  </td>
                  <td className="p-3p-3 text-sm font-MontserratSemiBold ]">
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
      {/* {onTrackOrder && (
        <div className="flex justify-end pt-3">
          <button
            type="button"
            onClick={onTrackOrder}
            className="w-full sm:w-auto h-11 px-8 border border-[#FF6D5B] text-[#FF6D5B] text-xs font-MontserratSemiBold rounded-xl hover:bg-[#FF6D5B]/5 transition-colors whitespace-nowrap cursor-pointer"
          >
            Track order
          </button>
        </div>
      )} */}
    </div>
  );
}
