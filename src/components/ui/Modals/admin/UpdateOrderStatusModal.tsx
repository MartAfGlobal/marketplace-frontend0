"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button/Button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { X, Check, ChevronDown } from "lucide-react";
import CheckBoxButton from "@/components/ui/Button/checkBoxButton";

/**
 * The statuses the backend accepts for the
 * /orders/admin/seller-orders/{id}/update-status/ endpoint.
 * Required order: IN_TRANSIT → RECEIVED_AT_HUB → SHIPPED_TO_BUYER → DELIVERED
 */
export const HUB_STATUSES = [
  { value: "RECEIVED_AT_HUB", label: "Received at Hub" },
  { value: "SHIPPED_TO_BUYER", label: "Shipped" },
  { value: "DELIVERED", label: "Delivered" },
];

/** Return the index of the current hub status, or -1 if not yet set / NOT_SENT / IN_TRANSIT */
export function getHubStatusIndex(status: string | null | undefined): number {
  if (!status) return -1;
  const s = status.toUpperCase().trim();

  // Index 2: DELIVERED
  if (s.includes("DELIVER") || s.includes("COMPLET")) {
    return 2;
  }

  // Index 1: SHIPPED / SHIPPED_TO_BUYER
  if (
    s === "SHIPPED_TO_BUYER" ||
    s === "SHIPPED" ||
    s.includes("SHIPPED_TO_BUYER") ||
    s.includes("SHIPPED_FROM_WAREHOUSE") ||
    s.includes("OUT_FOR_DELIVERY") ||
    s.includes("SHIPPED") ||
    (s.includes("SHIP") && !s.includes("TO_HUB"))
  ) {
    return 1;
  }

  // Index 0: RECEIVED_AT_HUB
  if (
    s === "RECEIVED_AT_HUB" ||
    s.includes("RECEIVED") ||
    s.includes("AT_HUB") ||
    s.includes("WAREHOUSE") ||
    s.includes("AT_WAREHOUSE")
  ) {
    return 0;
  }

  // Prior to hub receipt (NOT_SENT, IN_TRANSIT, IN_TRANSIT_TO_HUB, FULFILLED, PROCESSED, ACCEPTED, PENDING)
  return -1;
}

interface UpdateOrderStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Called with the raw backend value e.g. "RECEIVED_AT_HUB" */
  onConfirm: (newStatus: string) => void;
  loading?: boolean;
  /** The current hub tracking status stored on the seller_order */
  currentHubStatus?: string | null;
}

export default function UpdateOrderStatusModal({
  isOpen,
  onClose,
  onConfirm,
  loading,
  currentHubStatus,
}: UpdateOrderStatusModalProps) {
  const currentIndex = getHubStatusIndex(currentHubStatus);
  const nextIndex = currentIndex + 1;
  const defaultSelected =
    currentIndex >= 1
      ? "DELIVERED"
      : currentIndex === 0
        ? "SHIPPED_TO_BUYER"
        : HUB_STATUSES[0].value;

  const [selected, setSelected] = useState<string>(defaultSelected);
  const [confirmed, setConfirmed] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      const idx = getHubStatusIndex(currentHubStatus);
      const nextVal =
        idx >= 1
          ? "DELIVERED"
          : idx === 0
            ? "SHIPPED_TO_BUYER"
            : HUB_STATUSES[0].value;
      setSelected(nextVal);
      setConfirmed(false);
      setIsDropdownOpen(false);
    }
  }, [isOpen, currentHubStatus]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = HUB_STATUSES.find((item) => item.value === selected);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
        >
          <div className="fixed inset-0 flex items-center justify-center p-4 z-[9999]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white shadow-xl flex flex-col w-full max-w-[595px] rounded-2xl p-10 sm:p-12 relative"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 text-343330 hover:bg-gray-100 rounded-full p-1 transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-lg font-MontserratMedium leading-[26px] mb-3">
                  Update Order Status
                </h2>
                <p className="text-xs font-MontserratNormal text-[#000000]/68 leading-[16px]">
                  You are about to update the status of this order. Please
                  confirm the new status before proceeding.
                </p>
              </div>

              {/* Status Select Dropdown */}
              <div className="mb-8 relative" ref={dropdownRef}>
                <label className="block text-xs font-MontserratMedium text-[#000000]/68 mb-2">
                  Select Status
                </label>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className={`w-full h-12 bg-white border rounded-lg px-4 flex items-center justify-between text-sm font-MontserratNormal transition-colors cursor-pointer ${
                    isDropdownOpen
                      ? "border-[#FF6D5B] ring-1 ring-[#FF6D5B]"
                      : "border-[#eef0f3] hover:border-[#FF6D5B]/60"
                  }`}
                >
                  <span
                    className={
                      selectedOption
                        ? "text-[#161616] font-MontserratMedium"
                        : "text-[#000000]/40"
                    }
                  >
                    {selectedOption?.label || "Select order status"}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#000000]/56 transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180 text-[#FF6D5B]" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-[#eef0f3] rounded-lg shadow-lg z-50 overflow-hidden py-1"
                    >
                      {HUB_STATUSES.map((hubStatus, idx) => {
                        const isSelected = selected === hubStatus.value;
                        const isCurrent = currentIndex >= 0 && idx === currentIndex;
                        const isPassed = currentIndex >= 0 && idx < currentIndex;
                        const isDisabled = isCurrent || isPassed;

                        return (
                          <button
                            key={hubStatus.value}
                            type="button"
                            disabled={isDisabled}
                            onClick={() => {
                              if (!isDisabled) {
                                setSelected(hubStatus.value);
                                setIsDropdownOpen(false);
                              }
                            }}
                            className={`w-full px-4 py-3 text-left text-sm font-MontserratMedium flex items-center justify-between transition-colors ${
                              isDisabled
                                ? "opacity-50 cursor-not-allowed bg-gray-50 text-gray-400"
                                : isSelected
                                  ? "bg-[#FF6D5B]/10 text-[#FF6D5B] cursor-pointer"
                                  : "text-[#000000]/80 hover:bg-gray-50 cursor-pointer"
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              {hubStatus.label}
                              {isCurrent && (
                                <span className="text-[10px] bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-MontserratNormal">
                                  Current
                                </span>
                              )}
                              {isPassed && (
                                <span className="text-[10px] bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-MontserratNormal">
                                  Completed
                                </span>
                              )}
                            </span>
                            {isSelected && (
                              <Check className="w-4 h-4 text-[#FF6D5B]" />
                            )}
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Confirmation Checkbox */}
              <div className="flex items-start gap-3 mb-8">
                <div className="mt-0.5 shrink-0">
                  <CheckBoxButton
                    checked={confirmed}
                    onChange={(checked) => setConfirmed(checked)}
                  />
                </div>
                <p
                  className="text-xs font-MontserratNormal text-[#000000]/68 cursor-pointer leading-relaxed select-none"
                  onClick={() => setConfirmed((prev) => !prev)}
                >
                  I confirm that the selected order status is correct and
                  should be applied.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  onClick={onClose}
                  disabled={loading}
                  variant="secondary"
                  className="w-1/2"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => selected && onConfirm(selected)}
                  disabled={!confirmed || !selected || loading}
                  variant="primary"
                  className="w-1/2 disabled:cursor-not-allowed"
                >
                  {loading ? <LoadingSpinner /> : "Update Status"}
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
