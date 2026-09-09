"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Input } from "@/components/ui/forms/Input";
import { Label } from "@/components/ui/forms/Label";
import { Button } from "@/components/ui/Button/Button";
import { toast } from "sonner";

// ─── Shared Drawer Wrapper ─────────────────────────────────────────────────────
function DrawerWrapper({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      const w = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      if (w > 0) document.body.style.paddingRight = `${w}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 flex items-center justify-end z-[9998] p-4 sm:pr-[29px]"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, x: 160 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 160 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white shadow-xl flex flex-col p-8 w-full max-w-[426px] max-h-[92vh] rounded-[16px] relative overflow-hidden"
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Items Table (shared between Approve modals) ───────────────────────────────
interface ModalItem {
  image?: string;
  name: string;
  unitPrice: number;
  quantity: number;
  total: number;
}

function ModalItemsTable({ items }: { items: ModalItem[] }) {
  return (
    <table className="w-full text-sm mb-0">
      <thead>
        <tr className="bg-[#7F56D9] text-white">
          <th className="py-2.5 px-4 text-left font-MontserratNormal text-xs">
            Items
          </th>
          <th className="py-2.5 px-4 text-right font-MontserratNormal text-xs">
            Unit price
          </th>
          <th className="py-2.5 px-4 text-right font-MontserratNormal text-xs">
            Quantity
          </th>
          <th className="py-2.5 px-4 text-right font-MontserratNormal text-xs">
            Total
          </th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, idx) => (
          <tr key={idx} className="border-b border-gray-100">
            <td className="py-3 px-4">
              <div className="flex items-center gap-3">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={40}
                    height={40}
                    className="rounded w-10 h-10 object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-100 rounded flex-shrink-0" />
                )}
                <span className=" leading-tight">{item.name}</span>
              </div>
            </td>
            <td className="py-3 px-4 text-right text-xs font-MontserratNormal text-[#161616]">
              ₦{item.unitPrice.toLocaleString()}
            </td>
            <td className="py-3 px-4 text-right text-xs font-MontserratNormal text-[#161616]">
              {item.quantity}
            </td>
            <td className="py-3 px-4 text-right text-xs font-MontserratSemiBold text-[#161616]">
              ₦{item.total.toLocaleString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ─── Summary Row ──────────────────────────────────────────────────────────────
function SummaryRow({
  label,
  value,
  isOrderId,
  highlight,
}: {
  label: string;
  value: string;
  isOrderId?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-xs font-MontserratMedium text-000000/68">
        {label}
      </span>
      <span
        className={`text-xs ${
          isOrderId
            ? "text-[#FF6D5B] font-MontserratSemiBold"
            : highlight
              ? "text-000000 font-MontserratSemiBold"
              : "text-000000 font-MontserratSemiBold"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

// ─── 1. Approve Full Refund Drawer ────────────────────────────────────────────
export interface ApproveFullRefundDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  adminName?: string;
  requestedBy?: string;
  requestedByRole?: string;
  date?: string;
  time?: string;
  reasonForRefund?: string;
  moreInformation?: string;
  items?: ModalItem[];
  itemPrice?: number;
  deliveryFee?: number;
  orderTotal?: number;
  refundAmount?: number;
  onApprove?: () => void;
  onReject?: () => void;
  loading?: boolean;
}

export function ApproveFullRefundDrawer({
  isOpen,
  onClose,
  orderId,
  adminName,
  requestedBy,
  requestedByRole,
  date,
  time,
  reasonForRefund,
  moreInformation,
  items = [],
  itemPrice = 0,
  deliveryFee = 0,
  orderTotal = 0,
  refundAmount = 0,
  onApprove,
  onReject,
  loading = false,
}: ApproveFullRefundDrawerProps) {
  const [confirmed, setConfirmed] = useState(false);

  // Reset checkbox when drawer reopens
  useEffect(() => {
    if (isOpen) setConfirmed(false);
  }, [isOpen]);

  return (
    <DrawerWrapper isOpen={isOpen} onClose={onClose}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 flex-shrink-0">
        <div>
          <h2 className="text-base font-MontserratSemiBold text-[#161616]">
            Approve Full Refund
          </h2>
          <p className="text-xs font-MontserratNormal text-gray-400 mt-0.5">
            Please review the refund amount and confirm to approve this partial
            refund request.
          </p>
        </div>
        <button
          onClick={onClose}
          className="ml-4 text-[#343330] hover:bg-gray-100 rounded-full p-1 transition-colors flex-shrink-0"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 no-scrollbar">
        {/* Order ID + Admin */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-xs font-MontserratNormal text-[#161616]/60">
              Order ID:{" "}
            </span>
            <span className="text-xs font-MontserratSemiBold text-[#161616]">
              {orderId}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-MontserratSemiBold text-[#161616]">
              Admin:
            </span>
            <div className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-MontserratNormal text-[#161616]/60 min-w-[160px]">
              {adminName || "Auto-filled Admin Name - Super Admin"}
            </div>
          </div>
        </div>

        {/* Requested by + Date */}
        <div className="grid grid-cols-2 gap-4 py-3 border-t border-b border-gray-100">
          <div>
            <p className="text-xs font-MontserratSemiBold text-[#161616] mb-1">
              Requested by:
            </p>
            <p className="text-xs font-MontserratNormal text-[#161616]/60">
              {requestedBy || "Auto-filled Admin Name"} -{" "}
              {requestedByRole || "Role"}
            </p>
          </div>
          <div>
            <p className="text-xs font-MontserratSemiBold text-[#161616] mb-1">
              Date:
            </p>
            <div className="flex items-center justify-between">
              <p className="text-xs font-MontserratNormal text-[#161616]/60">
                {date || "—"}
              </p>
              <p className="text-xs font-MontserratNormal text-[#161616]/60">
                {time || ""}
              </p>
            </div>
          </div>
        </div>

        {/* Reason + More Information */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-MontserratSemiBold text-[#161616] mb-1">
              Reason for Refund
            </p>
            <p className="text-xs font-MontserratNormal text-[#161616]/60">
              {reasonForRefund || "—"}
            </p>
          </div>
          <div>
            <p className="text-xs font-MontserratSemiBold text-[#161616] mb-1">
              More Information
            </p>
            <p className="text-xs font-MontserratNormal text-[#161616]/60">
              {moreInformation || "—"}
            </p>
          </div>
        </div>

        {/* Order Items */}
        <div>
          <p className="text-xs font-MontserratSemiBold text-[#161616] mb-3">
            Order items ({items.length})
          </p>
          <div className="rounded-lg overflow-hidden border border-gray-100">
            <ModalItemsTable items={items} />
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <p className="text-xs font-MontserratSemiBold text-[#161616] mb-2">
            Order Summary
          </p>
          <div className="space-y-0.5">
            <SummaryRow label="Order ID:" value={orderId} isOrderId />
            <SummaryRow
              label="Item Price"
              value={`₦${itemPrice.toLocaleString()}`}
            />
            <SummaryRow
              label="Delivery Fee"
              value={`₦${deliveryFee.toLocaleString()}`}
            />
            <SummaryRow
              label="Order Total"
              value={`₦${orderTotal.toLocaleString()}`}
            />
            <SummaryRow
              label="Refund Amount"
              value={`₦${refundAmount.toLocaleString()}`}
              highlight
            />
          </div>
        </div>

        {/* Confirm checkbox */}
        <Label className="flex items-center gap-2 cursor-pointer">
          <Input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="w-4 h-4 accent-[#FF6D5B] cursor-pointer"
          />
          <span className="text-xs font-MontserratNormal text-[#161616]/70">
            I confirm that the refund details are correct and approve this full
            refund.
          </span>
        </Label>
      </div>

      {/* Footer Buttons */}
      <div className="flex items-center gap-3 px-6 py-5 border-t border-gray-100 flex-shrink-0">
        <button
          onClick={onApprove}
          disabled={!confirmed || loading}
          className="flex-1 h-11 bg-[#2D7565] hover:bg-[#245f52] text-white text-xs font-MontserratSemiBold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? <LoadingSpinner size={16} color="border-white" /> : null}
          Approve Full Refund
        </button>
        <button
          onClick={onReject}
          disabled={loading}
          className="flex-1 h-11 bg-[#CA0202] hover:bg-[#a80101] text-white text-xs font-MontserratSemiBold rounded-xl transition-colors disabled:opacity-50"
        >
          Reject Request
        </button>
      </div>
    </DrawerWrapper>
  );
}

// ─── 2. Approve Partial Refund Drawer ─────────────────────────────────────────
export interface ApprovePartialRefundDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  adminName?: string;
  requestedBy?: string;
  requestedByRole?: string;
  date?: string;
  time?: string;
  reasonForRefund?: string;
  moreInformation?: string;
  items?: ModalItem[];
  itemPrice?: number;
  deliveryFee?: number;
  orderTotal?: number;
  deductionAmount?: number;
  refundAmount?: number;
  onApprove?: () => void;
  onReject?: () => void;
  loading?: boolean;
}

export function ApprovePartialRefundDrawer({
  isOpen,
  onClose,
  orderId,
  adminName,
  requestedBy,
  requestedByRole,
  date,
  time,
  reasonForRefund,
  moreInformation,
  items = [],
  itemPrice = 0,
  deliveryFee = 0,
  orderTotal = 0,
  deductionAmount = 0,
  refundAmount = 0,
  onApprove,
  onReject,
  loading = false,
}: ApprovePartialRefundDrawerProps) {
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (isOpen) setConfirmed(false);
  }, [isOpen]);

  return (
    <DrawerWrapper isOpen={isOpen} onClose={onClose}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 flex-shrink-0">
        <div>
          <h2 className="text-base font-MontserratSemiBold text-[#161616]">
            Approve Partial Refund
          </h2>
          <p className="text-xs font-MontserratNormal text-gray-400 mt-0.5">
            Please review the refund amount and confirm to approve this partial
            refund request.
          </p>
        </div>
        <button
          onClick={onClose}
          className="ml-4 text-[#343330] hover:bg-gray-100 rounded-full p-1 transition-colors flex-shrink-0"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 no-scrollbar">
        {/* Order ID + Admin */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-xs font-MontserratNormal text-[#161616]/60">
              Order ID:{" "}
            </span>
            <span className="text-xs font-MontserratSemiBold text-[#161616]">
              {orderId}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-MontserratSemiBold text-[#161616]">
              Admin:
            </span>
            <div className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-MontserratNormal text-[#161616]/60 min-w-[160px]">
              {adminName || "Auto-filled Admin Name - Super Admin"}
            </div>
          </div>
        </div>

        {/* Requested by + Date */}
        <div className="grid grid-cols-2 gap-4 py-3 border-t border-b border-gray-100">
          <div>
            <p className="text-xs font-MontserratSemiBold text-[#161616] mb-1">
              Requested by:
            </p>
            <p className="text-xs font-MontserratNormal text-[#161616]/60">
              {requestedBy || "Auto-filled Admin Name"} -{" "}
              {requestedByRole || "Role"}
            </p>
          </div>
          <div>
            <p className="text-xs font-MontserratSemiBold text-[#161616] mb-1">
              Date:
            </p>
            <div className="flex items-center justify-between">
              <p className="text-xs font-MontserratNormal text-[#161616]/60">
                {date || "—"}
              </p>
              <p className="text-xs font-MontserratNormal text-[#161616]/60">
                {time || ""}
              </p>
            </div>
          </div>
        </div>

        {/* Reason + More Information */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-MontserratSemiBold text-[#161616] mb-1">
              Reason for Partial Refund
            </p>
            <p className="text-xs font-MontserratNormal text-[#161616]/60">
              {reasonForRefund || "—"}
            </p>
          </div>
          <div>
            <p className="text-xs font-MontserratSemiBold text-[#161616] mb-1">
              More Information
            </p>
            <p className="text-xs font-MontserratNormal text-[#161616]/60">
              {moreInformation || "—"}
            </p>
          </div>
        </div>

        {/* Order Items */}
        <div>
          <p className="text-xs font-MontserratSemiBold text-[#161616] mb-3">
            Order items ({items.length})
          </p>
          <div className="rounded-lg overflow-hidden border border-gray-100">
            <ModalItemsTable items={items} />
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <p className="text-xs font-MontserratSemiBold text-[#161616] mb-2">
            Order Summary
          </p>
          <div className="space-y-0.5">
            <SummaryRow label="Order ID:" value={orderId} isOrderId />
            <SummaryRow
              label="Item Price"
              value={`₦${itemPrice.toLocaleString()}`}
            />
            <SummaryRow
              label="Delivery Fee"
              value={`₦${deliveryFee.toLocaleString()}`}
            />
            <SummaryRow
              label="Order Total"
              value={`₦${orderTotal.toLocaleString()}`}
            />
            <SummaryRow
              label="Deduction Amount"
              value={`₦${deductionAmount.toLocaleString()}`}
            />
            <SummaryRow
              label="Refund Amount"
              value={`₦${refundAmount.toLocaleString()}`}
              highlight
            />
          </div>
        </div>

        {/* Confirm checkbox */}
        <Label className="flex items-center gap-2 cursor-pointer">
          <Input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="w-4 h-4 accent-[#FF6D5B] cursor-pointer"
          />
          <span className="text-xs font-MontserratNormal text-[#161616]/70">
            I confirm that the refund details are correct and approve this
            partial refund.
          </span>
        </Label>
      </div>

      {/* Footer Buttons */}
      <div className="flex items-center gap-3 px-6 py-5 border-t border-gray-100 flex-shrink-0">
        <button
          onClick={onApprove}
          disabled={!confirmed || loading}
          className="flex-1 h-11 bg-[#2D7565] hover:bg-[#245f52] text-white text-xs font-MontserratSemiBold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? <LoadingSpinner size={16} color="border-white" /> : null}
          Approve Partial Refund
        </button>
        <button
          onClick={onReject}
          disabled={loading}
          className="flex-1 h-11 bg-[#CA0202] hover:bg-[#a80101] text-white text-xs font-MontserratSemiBold rounded-xl transition-colors disabled:opacity-50"
        >
          Reject Request
        </button>
      </div>
    </DrawerWrapper>
  );
}

// ─── 3. Confirm Refund Request Drawer ─────────────────────────────────────────
export interface ConfirmRefundRequestDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  itemPrice?: number;
  deliveryFee?: number;
  orderTotal?: number;
  refundAmount?: number;
  onConfirm?: () => void;
  loading?: boolean;
}

export function ConfirmRefundRequestDrawer({
  isOpen,
  onClose,
  orderId,
  itemPrice = 0,
  deliveryFee = 0,
  orderTotal = 0,
  refundAmount = 0,
  onConfirm,
  loading = false,
}: ConfirmRefundRequestDrawerProps) {
  return (
    <DrawerWrapper isOpen={isOpen} onClose={onClose}>
      {/* Header */}
      <div className="flex items-center justify-between pb-8 flex-shrink-0">
        <div>
          <div>
            <h2 className="text-C18 font-MontserratMedium text-center">
              Approve Refund
            </h2>
            <button
              onClick={onClose}
              className="text-000000 hover:bg-gray-100 rounded-full absolute right-8 top-8 transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs font-MontserratMedium text-center mt-3">
            Confirm the refund details and approve this refund request.
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto space-y-4 no-scrollbar">
        <div className="space-y-1">
          <SummaryRow label="Order ID:" value={orderId} isOrderId />
          <SummaryRow
            label="Item Price"
            value={`₦${itemPrice.toLocaleString()}`}
          />
          <SummaryRow
            label="Delivery Fee"
            value={`₦${deliveryFee.toLocaleString()}`}
          />
          <SummaryRow
            label="Order Total"
            value={`₦${orderTotal.toLocaleString()}`}
          />
          <SummaryRow
            label="Refund Amount"
            value={`₦${refundAmount.toLocaleString()}`}
            highlight
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-4 pt-8 border-t border-gray-100 flex-shrink-0">
        <Button
          variant="secondary"
          onClick={onClose}
          className="w-full"
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          disabled={loading}
          className=""
        >
          {loading ? <LoadingSpinner size={16} color="border-white" /> : "Approve Refund"}
        </Button>
      </div>
    </DrawerWrapper>
  );
}

// ─── 4. Request Partial Refund Drawer ─────────────────────────────────────────
export interface RequestPartialRefundDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  itemPrice?: number;
  deliveryFee?: number;
  orderTotal?: number;
  onConfirm?: (data: {
    includeDelivery: boolean;
    reason: string;
    moreInfo: string;
    deductionAmount: string;
    refundAmount: string;
  }) => void;
  loading?: boolean;
}

export function RequestPartialRefundDrawer({
  isOpen,
  onClose,
  orderId,
  itemPrice = 0,
  deliveryFee = 0,
  orderTotal = 0,
  onConfirm,
  loading = false,
}: RequestPartialRefundDrawerProps) {
  const [includeDelivery, setIncludeDelivery] = useState(false);
  const [reason, setReason] = useState("");
  const [moreInfo, setMoreInfo] = useState("");
  const [deductionAmount, setDeductionAmount] = useState("");

  // Auto-calculate refund amount
  const base = includeDelivery ? orderTotal : itemPrice;
  const deduction = Number(deductionAmount) || 0;
  const isDeductionExceeded = deduction > base;
  const computedRefund = Math.max(0, base - deduction);

  useEffect(() => {
    if (isOpen) {
      setIncludeDelivery(false);
      setReason("");
      setMoreInfo("");
      setDeductionAmount("");
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!onConfirm) return;
    if (isDeductionExceeded) {
      toast.error(
        `Deduction amount cannot exceed the refund amount (₦${base.toLocaleString()})`
      );
      return;
    }
    if (deduction < 0) {
      toast.error("Deduction amount cannot be negative");
      return;
    }
    onConfirm({
      includeDelivery,
      reason,
      moreInfo,
      deductionAmount,
      refundAmount: String(computedRefund),
    });
  };

  return (
    <DrawerWrapper isOpen={isOpen} onClose={onClose}>
      {/* Header */}
      <div className="flex items-center justify-between pb-8 flex-shrink-0 ">
        <div>
          <div className="">
            <h2 className="text-C18 font-MontserratMedium text-center">
              Request Partial Refund
            </h2>
            <button
              onClick={onClose}
              className=" text-000000 hover:bg-gray-100 rounded-full absolute right-8 top-8 s transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs font-MontserratMedium text-center mt-3">
            Confirm the refund amount and submit this partial refund request for
            approval.
          </p>
        </div>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto  space-y-4 no-scrollbar">
        {/* Include delivery fee toggle */}
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <span className="relative flex-shrink-0">
            <input
              type="checkbox"
              checked={includeDelivery}
              onChange={(e) => setIncludeDelivery(e.target.checked)}
              className="sr-only"
            />
            <span
              className={`flex items-center justify-center w-5 h-5 rounded border-1 transition-colors ${
                includeDelivery
                  ? "bg-ff715b border-ff715b"
                  : "bg-white border-ff715b"
              }`}
            >
              {includeDelivery && (
                <svg
                  viewBox="0 0 12 10"
                  fill="none"
                  className="w-3 h-3"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 5l3.5 3.5L11 1" />
                </svg>
              )}
            </span>
          </span>
          <span className="text-xs font-MontserratMedium text-000000/68">Include delivery fee refund</span>
        </label>

        {/* Order summary */}
        <div className="space-y-1">
          <SummaryRow label="Order ID:" value={orderId} isOrderId />
          <SummaryRow
            label="Item Price"
            value={`₦${itemPrice.toLocaleString()}`}
          />
          <SummaryRow
            label="Delivery Fee"
            value={`₦${deliveryFee.toLocaleString()}`}
          />
          <SummaryRow
            label="Order Total"
            value={`₦${orderTotal.toLocaleString()}`}
          />
        </div>


        {/* Reason for deduction */}
        <div className="pt-4">
          <Label className="">Reason for the Deduction</Label>
          <Input
            type="text"
            placeholder="Write reason for the deduction"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className=""
          />
        </div>

        {/* More information */}
        <div className="space-y-1.5">
          <Label className="">More Information</Label>
          <Input
            type="text"
            placeholder="Write reason for the deduction"
            value={moreInfo}
            onChange={(e) => setMoreInfo(e.target.value)}
            className=""
          />
        </div>

        {/* Deduction amount */}
        <div className="space-y-1.5">
          <Label className="">Deduction Amount</Label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-MontserratNormal text-[#161616]/60 pointer-events-none z-10">
              ₦
            </span>
            <Input
              type="number"
              placeholder="0.00"
              min={0}
              max={base}
              valid={!isDeductionExceeded}
              value={deductionAmount}
              onChange={(e) => setDeductionAmount(e.target.value)}
              className="pl-7"
            />
          </div>
          {isDeductionExceeded && (
            <p className="text-[11px] text-[#CA0202] font-MontserratMedium mt-1">
              Deduction amount cannot exceed the refund amount (₦{base.toLocaleString()})
            </p>
          )}
        </div>

        {/* Refund amount (read-only / automated) */}
        <div className="space-y-1.5">
          <Label className="">
            Refund Amount{" "}
            <span className="text-[#161616]/50 font-MontserratNormal">
              (Automated)
            </span>
          </Label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-MontserratNormal text-[#161616]/60 pointer-events-none z-10">
              ₦
            </span>
            <Input
              readOnly
              value={computedRefund.toLocaleString()}
              className="pl-7"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-4 pt-8 border-t border-gray-100 flex-shrink-0">
        <Button
          variant="secondary"
          onClick={onClose}
          className="w-full"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading || !reason.trim() || isDeductionExceeded || deduction < 0}
          className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <LoadingSpinner size={16} color="border-white" /> : "Request Refund"}
        </Button>
      </div>
    </DrawerWrapper>
  );
}
