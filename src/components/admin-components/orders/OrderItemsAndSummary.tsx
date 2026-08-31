"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { MoreVertical } from "lucide-react";

export interface OrderItemsAndSummaryProps {
  order?: any;
  orderItems: any[];
  totalItemsCount: number;
  discountAmount: number;
  subtotalAmount: number;
  shippingFeeAmount: number;
  grandTotalAmount: number;
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
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ── Order Items Table (Left ~8 cols) ── */}
        <div className="lg:col-span-8 space-y-4">
          <h3 className="text-sm font-MontserratSemiBold">Order items</h3>

          <div className="overflow-x-auto ">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#7F56D9] text-white  text-xs font-MontserratMedium h-10">
                  <th className="px-4 py-2 font-MontserratMedium">SKU</th>
                  <th className="px-4 py-2 font-MontserratMedium">Items</th>
                  <th
                    className="px-4 py-2 font-MontserratMedium"
                    style={{ whiteSpace: "nowrap", minWidth: "110px", width: "110px" }}
                  >
                    Unit price
                  </th>
                  <th className="px-4 py-2 font-MontserratMedium text-center">Qty</th>
                  <th className="px-4 py-2 font-MontserratMedium">Total</th>
                  <th className="px-4 py-2 w-8"></th>
                </tr>
              </thead>
              <tbody className=" text-sm font-MontserratNormal">
                {orderItems.length > 0 ? (
                  orderItems.map((item: any, idx: number) => {
                    const itemSku =
                      item.variation_sku ||
                      item.product_sku ||
                      item.sku ||
                      item.product?.sku ||
                      (typeof item.product === "string"
                        ? item.product.slice(0, 8).toUpperCase()
                        : item.product?.id?.slice(0, 8)) ||
                      item.id?.slice(0, 8).toUpperCase() ||
                      "N/A";

                    const itemName =
                      item.product_name ||
                      item.name ||
                      item.title ||
                      item.product?.name ||
                      item.product?.title ||
                      "Item";

                    const variationText = item.variation_name
                      ? ` (${item.variation_name})`
                      : "";

                    const rawImg =
                      item.product_image ||
                      item.image ||
                      item.thumbnail ||
                      item.product?.product_image ||
                      item.product?.image ||
                      item.product?.thumbnail ||
                      (Array.isArray(item.product?.images)
                        ? typeof item.product.images[0] === "string"
                          ? item.product.images[0]
                          : item.product.images[0]?.image
                        : null);

                    const itemImg = rawImg || "";
                    const itemUnitPrice = Number(
                      item.price_at_purchase ??
                        item.unit_price ??
                        item.price ??
                        0,
                    );
                    const itemQty = Number(
                      item.quantity ??
                        item.qty ??
                        1,
                    );
                    const itemTotal = Number(
                      item.total_price ??
                        item.total ??
                        itemUnitPrice * itemQty,
                    );

                    const isOrderRejected =
                      (order?.status ?? "").toUpperCase() === "REJECTED" ||
                      (order?.order_timeline_stage ?? "").toUpperCase() === "REJECTED";
                    const isOrderCancelled =
                      (order?.status ?? "").toUpperCase() === "CANCELLED" ||
                      (order?.order_timeline_stage ?? "").toUpperCase() === "CANCELLED";

                    let acceptedQty = 0;
                    let rejectedQty = 0;

                    if (isOrderRejected) {
                      acceptedQty = 0;
                      rejectedQty = Number(
                        item.rejected_quantity ??
                          (orderItems.length === 1 ? order?.rejected_quantity : itemQty) ??
                          itemQty,
                      );
                    } else if (isOrderCancelled) {
                      acceptedQty = 0;
                      rejectedQty = 0;
                    } else {
                      acceptedQty =
                        item.accepted_quantity !== undefined && item.accepted_quantity !== null
                          ? Number(item.accepted_quantity)
                          : order?.accepted_quantity !== undefined && order?.accepted_quantity !== null && orderItems.length === 1
                          ? Number(order.accepted_quantity)
                          : order?.accepted_at
                          ? Number(item.fulfilled_quantity ?? itemQty)
                          : 0;

                      rejectedQty =
                        item.rejected_quantity !== undefined && item.rejected_quantity !== null
                          ? Number(item.rejected_quantity)
                          : order?.rejected_quantity !== undefined && order?.rejected_quantity !== null && orderItems.length === 1
                          ? Number(order.rejected_quantity)
                          : 0;
                    }

                    const productId =
                      typeof item.product === "string"
                        ? item.product
                        : item.product?.id || item.product_id || item.id;

                    return (
                      <tr
                        key={item.id || idx}
                        onClick={() => productId && handleItemClick(productId)}
                        className={`transition-colors text-sm h-16 ${
                          productId
                            ? "hover:bg-gray-50 cursor-pointer"
                            : "hover:bg-gray-50/60"
                        }`}
                      >
                        <td className="px-4 py-2 font-MontserratMedium text-xs">
                          {itemSku}
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 overflow-hidden flex-shrink-0 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-100">
                              {itemImg ? (
                                <img
                                  src={itemImg}
                                  alt={itemName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-xs text-gray-400">
                                  N/A
                                </span>
                              )}
                            </div>
                            <span
                              className="font-MontserratNormal line-clamp-1 max-w-[200px]"
                              title={`${itemName}${variationText}`}
                            >
                              {itemName}
                              {variationText}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-2 font-MontserratNormal">
                          {formatCurrencyShort(itemUnitPrice)}
                        </td>
                        <td className="px-4 py-2 text-center font-MontserratNormal">
                          <div className="flex flex-col items-center">
                            <span>{itemQty}</span>
                            {(acceptedQty > 0 || rejectedQty > 0) && (
                              <div className="text-[10px] flex flex-col items-center leading-tight">
                                {acceptedQty > 0 && (
                                  <span className="text-green-600 font-MontserratMedium">
                                    Acc: {acceptedQty}
                                  </span>
                                )}
                                {rejectedQty > 0 && (
                                  <span className="text-red-500 font-MontserratMedium">
                                    Rej: {rejectedQty}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-2 font-MontserratSemiBold">
                          <div className="flex flex-col">
                            <span
                              className={
                                acceptedQty < itemQty && (acceptedQty > 0 || rejectedQty > 0)
                                  ? "line-through text-gray-400 text-xs font-MontserratNormal"
                                  : ""
                              }
                            >
                              {formatCurrencyShort(itemTotal)}
                            </span>
                            {acceptedQty < itemQty && (acceptedQty > 0 || rejectedQty > 0) && (
                              <span
                                className={`${acceptedQty > 0 ? "text-green-600" : "text-red-500"} font-MontserratSemiBold`}
                              >
                                {formatCurrencyShort(itemUnitPrice * acceptedQty)}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-2 text-center cursor-pointer">
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

        {/* ── Order Summary Card (Right ~4 cols) ── */}
        <div className="lg:col-span-4 space-y-6 pt-0 lg:pt-12">
          <h3 className="text-sm font-MontserratSemiBold">Order Summary</h3>

          <div className="space-y-3 text-sm font-MontserratNormal ">
            <div className="space-y-3 pb-4 border-b border-b-000000/4">
              <div className="flex justify-between">
                <span>Total items</span>
                <span className="">
                  {totalItemsCount}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Discounts</span>
                <span className=" text-[#FF6D5B]">
                  {discountAmount > 0
                    ? `-${formatCurrencyShort(discountAmount)}`
                    : "₦0"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="">
                  {formatCurrencyShort(subtotalAmount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="">
                  {formatCurrencyShort(shippingFeeAmount)}
                </span>
              </div>
            </div>

            {/* Grand Total */}
            <div className="flex justify-between border-b items-center border-b-000000/4">
              <span className="text-sm ">Grand Total</span>
              <span className="text-2xl md:text-c32 font-MontserratSemiBold text-black">
                {formatCurrencyShort(grandTotalAmount)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
