"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { RootState } from "@/store";
import { useHttp } from "@/hooks/use-http";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/Button/Button";
import { DropdownInput } from "@/components/ui/forms/auth/sellers/registrastionSteps/registered-business/modals/business-type";

export interface AdminCancelOrderModalProps {
  isOpen: boolean;
  orderId: string | null;
  displayOrderId?: string;
  items?: any[];
  onClose: () => void;
  onSuccess?: (res?: any) => void;
  paymentId?: string | null;
}

interface CancellationReason {
  id: string;
  title: string;
  code?: string;
  requires_additional_info?: boolean;
}

export default function AdminCancelOrderModal({
  isOpen,
  orderId,
  displayOrderId,
  items = [],
  onClose,
  onSuccess,
  paymentId,
}: AdminCancelOrderModalProps) {
  const token = useSelector((state: RootState) => state.token.token);

  const { sendHttpRequest: fetchReasonsReq, loading: loadingReasons } = useHttp();
  const { sendHttpRequest: cancelReq, loading: submitting } = useHttp();

  const [reasons, setReasons] = useState<CancellationReason[]>([]);
  const [selectedReason, setSelectedReason] = useState<CancellationReason | null>(null);
  const [isPartial, setIsPartial] = useState(false);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);

  // Fetch admin cancellation reasons when modal opens
  useEffect(() => {
    if (!isOpen || !token) return;

    fetchReasonsReq({
      requestConfig: {
        url: "/cancellation/reasons/for_admin",
        method: "GET",
        token,
        isAuth: true,
        userType: "admin",
      },
      successRes: (res: any) => {
        const rawList = res?.data?.results ?? res?.data ?? res ?? [];
        if (Array.isArray(rawList) && rawList.length > 0) {
          const mapped = rawList.map((r: any) => ({
            id: String(r.id ?? r.uuid ?? r.code ?? r.name ?? r.title),
            title: r.title || r.name || r.reason || r.code || "Cancellation Reason",
            code: r.code || "",
            requires_additional_info: Boolean(r.requires_additional_info),
          }));
          setReasons(mapped);
          setSelectedReason((prev) => prev || mapped[0]);
        } else {
          setFallbackReasons();
        }
      },
      errorRes: () => {
        setFallbackReasons();
      },
    });
  }, [isOpen, token]);

  const setFallbackReasons = () => {
    const fallback: CancellationReason[] = [
      { id: "buyer_requested", title: "Buyer requested" },
      { id: "out_of_stock", title: "Out of stock" },
      { id: "fraudulent", title: "Fraudulent transaction" },
      { id: "seller_unable_fulfill", title: "Seller unable to fulfill" },
      { id: "address_issue", title: "Customer address issue" },
      { id: "pricing_error", title: "Pricing or inventory error" },
    ];
    setReasons(fallback);
    setSelectedReason((prev) => prev || fallback[0]);
  };

  const handleToggleItem = (itemId: string) => {
    setSelectedItemIds((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleClose = () => {
    setIsPartial(false);
    setSelectedItemIds([]);
    onClose();
  };

  const handleSubmit = () => {
    const targetOrderId = orderId || paymentId;
    if (!token || !targetOrderId) {
      toast.error("Order ID is missing.");
      return;
    }

    if (!selectedReason) {
      toast.error("Please select a cancellation reason.");
      return;
    }

    if (isPartial && selectedItemIds.length === 0) {
      toast.error("Please select at least one item to cancel for partial refund.");
      return;
    }

    // Direct cancel payload:
    // Full cancel: { cancellation_reason_id: "" }
    // Partial cancel: { cancellation_reason_id: "", item_ids: [ "" ] }
    const payload: { cancellation_reason_id: string; item_ids?: string[] } = {
      cancellation_reason_id: selectedReason.id,
    };

    if (isPartial && selectedItemIds.length > 0) {
      payload.item_ids = selectedItemIds;
    }

    cancelReq({
      requestConfig: {
        url: `/orders/admin/orderslist/${targetOrderId}/direct-cancel/`,
        method: "POST",
        token,
        isAuth: true,
        userType: "admin",
        body: payload,
      },
      successRes: (res: any) => {
        const data = res?.data ?? res;
        const wholeOrderCancelled = data?.whole_order_cancelled ?? !isPartial;
        toast.success(
          wholeOrderCancelled
            ? "Order cancelled successfully."
            : "Selected items cancelled successfully."
        );
        handleClose();
        if (onSuccess) onSuccess(data);
      },
      errorRes: (err: any) => {
        if (err?.response?.status === 403) {
          toast.error("Permission denied. Your role lacks orders modify permission.");
        } else {
          toast.error(
            err?.response?.data?.detail ||
              err?.response?.data?.message ||
              err?.response?.data?.error ||
              "Failed to cancel order. Please check if the order can still be cancelled."
          );
        }
      },
    });
  };

  if (!isOpen) return null;

  const activeOrderId = displayOrderId || orderId || "ORD-2452463";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200 overflow-y-auto">
      <div
        className={`bg-white rounded-2xl w-full p-8 shadow-2xl relative transform transition-all duration-200 overflow-visible ${
          isPartial ? "max-w-[691px]" : "max-w-[517px]"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full z-10 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1 mb-8">
          <h2 className="text-c18 font-MontserratMedium text-000000 leading-[26px]">
            Cancel order
          </h2>
          <p className="text-xs text-000000/68 font-MontserratNormal leading-[16px]">
            Select a cancellation reason for order {activeOrderId}
          </p>
        </div>

        <div
          className={`${
            isPartial ? "flex items-end justify-between gap-4 mb-4" : "mb-4"
          }`}
        >
          <div
          className={`space-y-1.5 mb-4 ${
            isPartial ? "w-[244px]" : "w-[418px]"
          }`}
        >
          <label className="text-xs font-MontserratMedium text-gray-700 block">
            Reason for cancellation
          </label>

          <DropdownInput
            placeholder={loadingReasons ? "Loading reasons..." : "Select a reason"}
            options={reasons.map((reason) => ({
              label: reason.title,
              value: reason.id,
            }))}
            value={selectedReason?.id || ""}
            onChange={(val) => {
              const reason = reasons.find((item) => item.id === val);
              if (reason) setSelectedReason(reason);
            }}
            loading={loadingReasons}
            disabled={loadingReasons}
          />
        </div>

        <div className={`flex items-center gap-2.5 pt-1 ${isPartial ? "pb-2" : "mt-4"}`}>
            <button
              type="button"
              role="switch"
                 aria-checked={isPartial}
            onClick={() => setIsPartial((prev) => !prev)}
              className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors duration-200 ease-in-out cursor-pointer ${
                isPartial ? "bg-[#FF715B]" : "bg-gray-200"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-200 ease-in-out ${
                  isPartial ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
            <span
              onClick={() => setIsPartial((prev) => !prev)}
              className="text-xs font-MontserratNormal text-gray-600 select-none cursor-pointer"
            >
              Partial refund
            </span>
          </div>
        </div>

        {/* Conditional body: Helper note or Items table */}
        {!isPartial ? (
          <p className="text-xs font-MontserratNormal text-gray-500 mt-3">
            Refund will be triggered automatically by the system to the buyer
          </p>
        ) : (
          <div className="w-full mt-4  pr-2 h-fit max-h-[360px] overflow-y-auto">
            <table className="w-full text-left ">
              <thead>
                <tr className="bg-[#947FFF] text-white text-[12px] font-MontserratSemiBold h-10">
                  
                  <th className="p-3">Items</th>
                  <th className="p-3">Unit price</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3">Total</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody className="text-sm font-MontserratNormal">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-000000/44 font-MontserratMedium">
                    No items (N/A)
                  </td>
                </tr>
              ) : (
                items.map((item: any, idx: number) => {
                  const itemId = String(
                    item.id || item.order_item_id || item.product_id || idx
                  );
               
                  const itemName =
                    item.name ||
                    item.title ||
                    item.product_name ||
                    item.product?.title ||
                    item.product?.name ||
                    "N/A";
                  const itemImage =
                    item.product_image 
                  const unitPrice = item.unit_price ?? item.price ?? item.price_at_purchase;
                  const quantity = item.quantity ?? item.qty ?? item.fulfilled_quantity;
                  const totalPrice = item.total_price ?? item.total;
                  const isChecked = selectedItemIds.includes(itemId);

                  return (
                    <tr
                      key={itemId}
                      onClick={() => handleToggleItem(itemId)}
                      className={`h-16 hover:bg-gray-50/80 cursor-pointer transition-colors ${
                        isChecked ? "bg-purple-50/30" : ""
                      }`}
                    >
                     
                      <td className="px-3">
                        <div className="flex items-center gap-4 text-sm font-MontserratNormal">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleItem(itemId)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-3.75 h-3.75 rounded border-[#343330] text-ff715b focus:ring-ff715b cursor-pointer flex-shrink-0"
                        />
                        <div className="w-12 h-12 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
                          {itemImage ? (
                            <img
                              src={itemImage}
                              alt={itemName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-[10px] text-gray-400">N/A</span>
                          )}
                        </div>
                        <span>{itemName}</span>
                        </div>
                      </td>
                      <td className="px-3">
                        {unitPrice != null && unitPrice !== "" && !isNaN(Number(unitPrice))
                          ? `₦${Number(unitPrice).toLocaleString()}`
                          : "N/A"}
                      </td>
                      <td className="px-3 text-center">{quantity != null ? quantity : "N/A"}</td>
                      <td className="px-3 font-MontserratSemiBold">
                        {totalPrice != null && totalPrice !== "" && !isNaN(Number(totalPrice))
                          ? `₦${Number(totalPrice).toLocaleString()}`
                          : unitPrice != null && quantity != null && !isNaN(Number(unitPrice)) && !isNaN(Number(quantity))
                            ? `₦${(Number(unitPrice) * Number(quantity)).toLocaleString()}`
                            : "N/A"}
                      </td>
                      <td className="px-3"></td>
                    </tr>
                  );
                })
              )}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer Buttons */}
        <div className="flex items-center gap-3 mt-6">
          <Button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            variant="secondary"
            className=" w-[193px]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={
              submitting ||
              !selectedReason ||
              (isPartial && selectedItemIds.length === 0)
            }
            variant="danger"
            className="w-full"
          >
            {submitting ? (
              <LoadingSpinner color="border-white" size={16} />
            ) : (
              "Confirm cancellation"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
