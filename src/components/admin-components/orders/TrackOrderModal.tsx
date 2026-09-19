"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { toast } from "sonner";
import { AdminDetails } from "@/helpers/admin/adminHelper";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/Button/Button";

interface TrackOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultOrderId?: string;
}

export default function TrackOrderModal({
  isOpen,
  onClose,
  defaultOrderId = "",
}: TrackOrderModalProps) {
  const router = useRouter();
  const [orderId, setOrderId] = useState(defaultOrderId);
  const [isTrackingId, setIsTrackingId] = useState(false);
  const [searching, setSearching] = useState(false);

  const { searchAdminOrder } = AdminDetails();

  useEffect(() => {
    if (isOpen) {
      setOrderId(defaultOrderId);
    }
  }, [isOpen, defaultOrderId]);

  if (!isOpen) return null;

  const handleSearch = () => {
    const trimmed = orderId.trim();
    if (!trimmed) {
      toast.info(`Please enter a ${isTrackingId ? "Tracking ID" : "Order ID"}`);
      return;
    }

    setSearching(true);
    searchAdminOrder(
      trimmed,
      (res: any) => {
        setSearching(false);
        const order = Array.isArray(res)
          ? res[0]
          : Array.isArray(res?.results)
          ? res.results[0]
          : (res?.data ?? res);

        const targetId = order?.id || order?.order_id || trimmed;
        onClose();
        router.push(
          `/dashboard/admin/orders/${encodeURIComponent(targetId)}?from=Orders`
        );
      },
      () => {
        setSearching(false);
        onClose();
        router.push(
          `/dashboard/admin/orders/${encodeURIComponent(trimmed)}?from=Orders`
        );
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div
        className="bg-white rounded-[20px] w-full max-w-[440px] p-7 shadow-2xl relative transform transition-all duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <h2 className="text-lg font-MontserratSemiBold text-[#161616]">
            Track order
          </h2>
          <p className="text-xs text-[#8c8c8c] font-MontserratNormal mt-1">
            Input a tracking number for quick updates
          </p>
        </div>

        {/* Form Fields */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-MontserratMedium text-[#161616] mb-1.5">
              {isTrackingId ? "Tracking ID" : "Order ID"}
            </label>
            <input
              type="text"
              autoFocus
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isTrackingId ? "e.g. TRK123456789" : "ORD23512353535"}
              className="w-full h-11 px-4 text-sm text-[#161616] placeholder:text-gray-400 border border-gray-200 rounded-[10px] outline-none focus:border-[#FF715B] transition-colors"
            />
          </div>

          {/* Tracking ID Toggle */}
          <div className="flex items-center gap-2.5 pt-1">
            <button
              type="button"
              role="switch"
              aria-checked={isTrackingId}
              onClick={() => setIsTrackingId((prev) => !prev)}
              className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors duration-200 ease-in-out cursor-pointer ${
                isTrackingId ? "bg-[#FF715B]" : "bg-gray-200"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-200 ease-in-out ${
                  isTrackingId ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
            <span
              onClick={() => setIsTrackingId((prev) => !prev)}
              className="text-xs font-MontserratNormal text-gray-600 select-none cursor-pointer"
            >
              Tracking ID
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-7">
          <Button
            type="button"
            onClick={onClose}
            variant="secondary"
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSearch}
            disabled={searching}
            className="flex-1"
          >
            {searching ? <LoadingSpinner size={16} color="border-white" /> : "Search"}
          </Button>
        </div>
      </div>
    </div>
  );
}
