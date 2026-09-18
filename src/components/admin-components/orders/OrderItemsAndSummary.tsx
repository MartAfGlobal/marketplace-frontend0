"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MoreVertical, X, ExternalLink, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

interface OrderDocumentItem {
  id: string;
  name: string;
  kind: "DEPARTURE" | "DELIVERY";
  imageUrl: string;
  uploadedAt: string;
  uploadedByName?: string;
  dateFormatted: string;
  extension: string;
}

function getFileExtension(url?: string): string {
  if (!url) return "jpg";
  try {
    const clean = url.split("?")[0].split("#")[0];
    const match = clean.match(/\.([a-zA-Z0-9]+)$/);
    if (match && match[1]) {
      return match[1].toLowerCase();
    }
  } catch {
    // fallback
  }
  return "jpg";
}

function formatDocumentDate(dateStr?: string): string {
  if (!dateStr) return "N/A";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = d.getDate();
    const j = day % 10;
    const k = day % 100;
    let suffix = "th";
    if (j === 1 && k !== 11) suffix = "st";
    else if (j === 2 && k !== 12) suffix = "nd";
    else if (j === 3 && k !== 13) suffix = "rd";

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day}${suffix} ${month}, ${year}`;
  } catch {
    return dateStr;
  }
}

function DocumentFileIcon({ type }: { type: string }) {
  const ext = (type || "jpg").toUpperCase().slice(0, 4);
  return (
    <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center text-[#343330]">
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6 3C4.89543 3 4 3.89543 4 5V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V9.5L13.5 3H6Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M13.5 3V9.5H20"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <text
          x="12"
          y="17.5"
          textAnchor="middle"
          fontSize="6"
          fontWeight="bold"
          fontFamily="Montserrat, sans-serif"
          fill="currentColor"
          letterSpacing="0.4"
        >
          {ext}
        </text>
      </svg>
    </div>
  );
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
  depatureEvidence,
  departureEvidence,
  deliveryEvidence,
  onProductClick,
}: OrderItemsAndSummaryProps) {
  const router = useRouter();
  const [selectedDoc, setSelectedDoc] = useState<OrderDocumentItem | null>(null);

  const handleItemClick = (productId: string) => {
    if (onProductClick) {
      onProductClick(productId);
    } else if (productId) {
      router.push(`/dashboard/admin/products/listings/${productId}`);
    }
  };

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedDoc(null);
    };
    if (selectedDoc) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedDoc]);

  // Extract and normalize departure & delivery documents
  const rawDepartures: any[] =
    (depatureEvidence && Array.isArray(depatureEvidence) && depatureEvidence.length > 0
      ? depatureEvidence
      : departureEvidence && Array.isArray(departureEvidence) && departureEvidence.length > 0
      ? departureEvidence
      : Array.isArray(order?.departure_evidence)
      ? order.departure_evidence
      : []) || [];

  const rawDeliveries: any[] =
    (deliveryEvidence && Array.isArray(deliveryEvidence) && deliveryEvidence.length > 0
      ? deliveryEvidence
      : Array.isArray(order?.delivery_evidence)
      ? order.delivery_evidence
      : []) || [];

  const sellerDepartures = Array.isArray(order?.seller_orders)
    ? order.seller_orders.flatMap((so: any) => so?.departure_evidence || [])
    : [];
  const sellerDeliveries = Array.isArray(order?.seller_orders)
    ? order.seller_orders.flatMap((so: any) => so?.delivery_evidence || [])
    : [];

  const combinedDepartures = [...rawDepartures, ...sellerDepartures].filter(
    (item, idx, self) =>
      item &&
      self.findIndex(
        (t) => (t.id && t.id === item.id) || (t.image_url && t.image_url === item.image_url),
      ) === idx,
  );

  const combinedDeliveries = [...rawDeliveries, ...sellerDeliveries].filter(
    (item, idx, self) =>
      item &&
      self.findIndex(
        (t) => (t.id && t.id === item.id) || (t.image_url && t.image_url === item.image_url),
      ) === idx,
  );

  const documents: OrderDocumentItem[] = [];

  combinedDepartures.forEach((item: any, idx: number) => {
    const rawUrl = item.image_url || item.url || "";
    if (!rawUrl && !item.id) return;
    const ext = getFileExtension(rawUrl) || "jpg";
    const name =
      item.name ||
      item.file_name ||
      (combinedDepartures.length > 1
        ? `Order outgoing ${idx + 1}.${ext}`
        : `Order outgoing.${ext}`);

    documents.push({
      id: item.id || `departure-${idx}`,
      name,
      kind: "DEPARTURE",
      imageUrl: rawUrl,
      uploadedAt: item.uploaded_at || order?.shipped_at || order?.created_at,
      uploadedByName: item.uploaded_by_name || "Super Admin",
      dateFormatted: formatDocumentDate(item.uploaded_at || order?.shipped_at || order?.created_at),
      extension: ext,
    });
  });

  combinedDeliveries.forEach((item: any, idx: number) => {
    const rawUrl = item.image_url || item.url || "";
    if (!rawUrl && !item.id) return;
    const ext = getFileExtension(rawUrl) || "jpg";
    const name =
      item.name ||
      item.file_name ||
      (combinedDeliveries.length > 1
        ? `Order delivered ${idx + 1}.${ext}`
        : `Order delivered.${ext}`);

    documents.push({
      id: item.id || `delivery-${idx}`,
      name,
      kind: "DELIVERY",
      imageUrl: rawUrl,
      uploadedAt: item.uploaded_at || order?.delivered_at || order?.created_at,
      uploadedByName: item.uploaded_by_name || "Super Admin",
      dateFormatted: formatDocumentDate(item.uploaded_at || order?.delivered_at || order?.created_at),
      extension: ext,
    });
  });

  return (
    <>
      <div className="w-full flex flex-col lg:flex-row gap-6 items-start  justify-center">
        {/* ── Order Items Table Card ── */}
        <div className="flex-1 min-w-0 w-full rounded-c16 py-6 px-8 bg-ffffff max-w-[744px]">
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
                    const rawImg = item.product_image;
                    const itemImg = rawImg || "";
                    const itemUnitPrice = Number(
                      item.price_at_purchase ??
                        item.unit_price ??
                        item.price ??
                        0,
                    );
                    const itemQty = Number(item.quantity ?? item.qty ?? 1);
                    const itemTotal = Number(
                      item.total_price ?? item.total ?? itemUnitPrice * itemQty,
                    );

                    const isOrderRejected =
                      (order?.status ?? "").toUpperCase() === "REJECTED" ||
                      (order?.order_timeline_stage ?? "").toUpperCase() ===
                        "REJECTED";
                    const isOrderCancelled =
                      (order?.status ?? "").toUpperCase() === "CANCELLED" ||
                      (order?.order_timeline_stage ?? "").toUpperCase() ===
                        "CANCELLED";

                    let acceptedQty = 0;
                    let rejectedQty = 0;

                    if (isOrderRejected) {
                      acceptedQty = 0;
                      rejectedQty = Number(
                        item.rejected_quantity ??
                          (orderItems.length === 1
                            ? order?.rejected_quantity
                            : itemQty) ??
                          itemQty,
                      );
                    } else if (isOrderCancelled) {
                      acceptedQty = 0;
                      rejectedQty = 0;
                    } else {
                      acceptedQty =
                        item.accepted_quantity !== undefined &&
                        item.accepted_quantity !== null
                          ? Number(item.accepted_quantity)
                          : order?.accepted_quantity !== undefined &&
                              order?.accepted_quantity !== null &&
                              orderItems.length === 1
                            ? Number(order.accepted_quantity)
                            : order?.accepted_at
                              ? Number(item.fulfilled_quantity ?? itemQty)
                              : 0;

                      rejectedQty =
                        item.rejected_quantity !== undefined &&
                        item.rejected_quantity !== null
                          ? Number(item.rejected_quantity)
                          : order?.rejected_quantity !== undefined &&
                              order?.rejected_quantity !== null &&
                              orderItems.length === 1
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
                        className={`border-separate border-spacing-y-4 transition-colors text-sm font-MontserratNormal leading-[16px] h-16 py-4`}
                      >
                        <td
                          className="px-3 font-MontserratMedium max-w-25 truncate" 
                          title={itemSku}
                        >
                          {itemSku}
                        </td>
                        <td>
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 overflow-hidden flex-shrink-0 flex items-center justify-center">
                              {itemImg ? (
                                <img
                                  src={itemImg}
                                  alt={itemName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-xs">N/A</span>
                              )}
                            </div>
                            <span
                              className="font-MontserratNormal line-clamp-1 max-w-[150px]  truncate"
                              title={`${itemName}${variationText}`}
                            >
                              {itemName}
                              {variationText}
                            </span>
                          </div>
                        </td>
                        <td
                          className="font-MontserratNormal px-6  truncate max-w-25"
                          title={formatCurrencyShort(itemUnitPrice)}
                        >
                          {formatCurrencyShort(itemUnitPrice)}
                        </td>
                        <td className="text-center font-MontserratNormal w-15">
                          <div className="flex flex-col items-center">
                            <span>{itemQty}</span>
                            {(acceptedQty > 0 || rejectedQty > 0) && (
                              <div className="text-[10px] flex flex-col items-center leading-tight">
                                {acceptedQty > 0 && (
                                  <span className="text-green-600 font-MontserratNormal">
                                    Acc: {acceptedQty}
                                  </span>
                                )}
                                {rejectedQty > 0 && (
                                  <span className="text-red-500 font-MontserratNormal">
                                    Rej: {rejectedQty}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="font-MontserratSemiBold text-sm">
                          <div className="flex flex-col">
                            <span
                              className={
                                acceptedQty < itemQty &&
                                (acceptedQty > 0 || rejectedQty > 0)
                                  ? "line-through text-000000 max-w-25 truncate text-xs font-MontserratNormal"
                                  : ""
                              }
                            >
                              {formatCurrencyShort(itemTotal)}
                            </span>
                            {acceptedQty < itemQty &&
                              (acceptedQty > 0 || rejectedQty > 0) && (
                                <span
                                  className={`${acceptedQty > 0 ? "text-green-600" : "text-red-500"} font-MontserratSemiBold`}
                                >
                                  {formatCurrencyShort(
                                    itemUnitPrice * acceptedQty,
                                  )}
                                </span>
                              )}
                          </div>
                        </td>
                        <td className="w-15 flex justify-center items-center h-16 text-center cursor-pointer">
                          <MoreVertical className="w-4 h-4" />
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

        {/* ── Order documents Card ── */}
        <div className="w-full lg:w-[344px] xl:w-[344px] flex-shrink-0 rounded-c16 py-6 px-8  bg-ffffff">
          <h3 className="text-sm font-MontserratNormal text-000000/68 mb-6 leading-[21px] tracking-[1%]">
            Order documents
          </h3>

          {documents.length > 0 ? (
            <div className="space-y-2">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between px-3 py-2 border-[0.5px] border-000000/12 rounded-c8 h-[53px] bg-white hover:border-[#D0D5DD] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <DocumentFileIcon type={doc.extension}  />
                    <div className="min-w-0">
                      <p
                        className="text-xs font-MontserratNormal leading-[20px] text-000000/68 truncate"
                        title={doc.name}
                      >
                        {doc.name}
                      </p>
                      <p className="text-c10 font-MontserratNormal leading-[16px] text-000000/68 mt-0.5">
                        {doc.dateFormatted}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedDoc(doc)}
                    className="text-c10 font-MontserratNormal text-[#FF6D5B] hover:text-[#e05a49] hover:underline cursor-pointer flex-shrink-0 px-1"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs font-MontserratNormal text-gray-400">
              No documents available
            </div>
          )}
        </div>
      </div>

      {/* ── Document View Modal ── */}
      <AnimatePresence>
        {selectedDoc && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in"
            onClick={() => setSelectedDoc(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl relative space-y-4 max-h-[90vh] flex flex-col"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="min-w-0 pr-4">
                  <div className="flex items-center gap-2">
                    
                    <span
                      className={`text-[10px] font-MontserratMedium px-2 py-0.5 rounded-full ${
                        selectedDoc.kind === "DEPARTURE"
                          ? "bg-blue-50 text-blue-600 border border-blue-200"
                          : "bg-green-50 text-green-600 border border-green-200"
                      }`}
                    >
                      {selectedDoc.kind === "DEPARTURE" ? "Departure" : "Delivered"}
                    </span>
                  </div>
                  
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedDoc(null)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-auto flex items-center justify-center p-2  ">
                {selectedDoc.imageUrl ? (
                  <img
                    src={selectedDoc.imageUrl}
                    alt={selectedDoc.name}
                    className="max-h-[60vh] w-auto max-w-full object-contain rounded-lg shadow-sm"
                  />
                ) : (
                  <p className="text-sm font-MontserratNormal text-gray-400">
                    Image preview not available
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                {selectedDoc.imageUrl ? (
                  <a
                    href={selectedDoc.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-MontserratMedium text-[#FF6D5B] hover:text-[#e05a49] hover:underline"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Open full image in new tab
                  </a>
                ) : (
                  <span />
                )}
                <button
                  type="button"
                  onClick={() => setSelectedDoc(null)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-MontserratMedium rounded-lg transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
