"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { MoreVertical } from "lucide-react";

export interface OrderItemsAndSummaryProps {
  order?: any;
  orderItems: any[];
  totalItemsCount?: number;
  discountAmount?: number;
  subtotalAmount?: number;
  shippingFeeAmount?: number;
  grandTotalAmount?: number;
  depatureEvidence?: any[];
  departureEvidence?: any[];
  deliveryEvidence?: any[];
  onProductClick?: (productId: string) => void;
}

function formatCurrencyShort(val: any) {
  if (val == null || val === "" || isNaN(Number(val))) return "₦0";
  return `₦${Number(val).toLocaleString()}`;
}

export default function OrderItemsAndSummary({
  order,
  orderItems,
  totalItemsCount,
  discountAmount,
  subtotalAmount,
  shippingFeeAmount,
  grandTotalAmount,
  onProductClick,
}: OrderItemsAndSummaryProps) {
  const router = useRouter();

  const handleItemClick = (productId: string) => {
    if (onProductClick) {
      onProductClick(productId);
    } else if (productId) {
      router.push(`/dashboard/admin/products/listings/${productId}`);
    }
  };

  return (
    <div className="w-full flex flex-col items-start justify-center">
      {/* ── Order Items Table Card ── */}
      <div className="w-full rounded-c16 py-6 px-8 bg-ffffff max-w-[1104px] border border-000000/4 shadow-sm">
        <h3 className="text-sm font-MontserratNormal text-000000/68 mb-6 leading-[21px] tracking-[1%]">
          Order items
        </h3>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#7F56D9] text-white text-xs font-MontserratSemiBold h-10">
                <th className="p-3 font-MontserratMedium">SKU</th>
                <th className="p-3 font-MontserratMedium">Items</th>
                <th
                  className="p-3 font-MontserratMedium"
                  style={{
                    whiteSpace: "nowrap",
                    minWidth: "110px",
                    width: "110px",
                  }}
                >
                  Unit price
                </th>
                <th className="p-3 font-MontserratMedium text-center">Qty</th>
                <th className="p-3 font-MontserratMedium">Total</th>
                <th className="p-3 w-8"></th>
              </tr>
            </thead>
            <tbody className="text-sm font-MontserratNormal">
              {orderItems.length > 0 ? (
                orderItems.map((item: any, idx: number) => {
                  const itemSku = item.variation_sku;
                  const itemName = item.product_name;
                  const variationText = item.variation_name
                    ? ` (${item.variation_name})`
                    : "";
                  const itemUnitPrice = Number(item.price_at_purchase) || 0;
                  const itemQuantity = Number(item.quantity) || 1;
                  const itemTotal = Number(item.total_price) || itemUnitPrice * itemQuantity;

                  const sellerOrders = Array.isArray(order?.seller_orders)
                    ? order.seller_orders
                    : [];

                  let soItem: any = null;
                  for (const so of sellerOrders) {
                    if (Array.isArray(so.items)) {
                      const found = so.items.find(
                        (i: any) =>
                          i.id === item.id ||
                          (i.product_id && i.product_id === item.product_id) ||
                          (i.variation_sku && i.variation_sku === item.variation_sku),
                      );
                      if (found) {
                        soItem = found;
                        break;
                      }
                    }
                  }

                  const rawStatus = (
                    soItem?.status ||
                    item.seller_order_status ||
                    item.status ||
                    ""
                  ).toUpperCase();

                  const isRejected =
                    rawStatus === "REJECTED" ||
                    rawStatus === "CANCELLED" ||
                    Boolean(soItem?.rejection_reason) ||
                    Boolean(item.rejection_reason);

                  const isPartiallyAccepted =
                    rawStatus === "PARTIALLY_ACCEPTED";

                  const acceptedQty =
                    soItem?.accepted_quantity != null
                      ? Number(soItem.accepted_quantity)
                      : item.accepted_quantity != null
                        ? Number(item.accepted_quantity)
                        : null;

                  const rejectedQty =
                    soItem?.rejected_quantity != null
                      ? Number(soItem.rejected_quantity)
                      : item.rejected_quantity != null
                        ? Number(item.rejected_quantity)
                        : null;

                  return (
                    <tr
                      key={item.id || idx}
                      className="border-b border-[#000000]/12 last:border-b-0 hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="p-3 font-MontserratNormal text-xs text-000000/68">
                        {itemSku || "—"}
                      </td>
                      <td className="p-3">
                        <div
                          className="flex items-center gap-3 cursor-pointer group"
                          onClick={() => handleItemClick(item.product_id || item.product)}
                        >
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                            {item.product_image ? (
                              <img
                                src={item.product_image}
                                alt={itemName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                                IMG
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-MontserratMedium text-xs text-000000 group-hover:text-primary transition-colors">
                              {itemName}
                            </p>
                            {variationText && (
                              <p className="text-c10 font-MontserratNormal text-gray-500">
                                {variationText}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-3 font-MontserratNormal text-xs text-000000/68">
                        {formatCurrencyShort(itemUnitPrice)}
                      </td>
                      <td className="p-3 font-MontserratNormal text-xs text-000000/68 text-center">
                        <div className="flex flex-col items-center">
                          <span>{itemQuantity}</span>
                          {isPartiallyAccepted && acceptedQty != null && (
                            <span className="text-[10px] text-green-600 font-MontserratMedium">
                              ({acceptedQty} accepted)
                            </span>
                          )}
                          {isPartiallyAccepted && rejectedQty != null && (
                            <span className="text-[10px] text-red-500 font-MontserratMedium">
                              ({rejectedQty} rejected)
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3 font-MontserratNormal text-xs text-000000/68">
                        <div className="flex flex-col">
                          <span
                            className={
                              isRejected
                                ? "line-through text-red-400"
                                : isPartiallyAccepted
                                  ? "line-through text-gray-400 text-[11px]"
                                  : ""
                            }
                          >
                            {formatCurrencyShort(itemTotal)}
                          </span>
                          {isPartiallyAccepted && acceptedQty != null && (
                            <span
                              className={`${
                                acceptedQty > 0 ? "text-green-600" : "text-red-500"
                              } font-MontserratSemiBold`}
                            >
                              {formatCurrencyShort(itemUnitPrice * acceptedQty)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="w-15 flex justify-center items-center h-16 text-center cursor-pointer">
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center font-MontserratNormal text-sm text-gray-500"
                  >
                    No order items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
