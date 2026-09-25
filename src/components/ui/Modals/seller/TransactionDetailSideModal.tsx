"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import type { Transaction } from "@/store/finance/transactionsSlice";
import Xicon from "@/assets/icons/X.svg"
import Image from "next/image";
import { Button } from "../../Button/Button";

interface TransactionDetailSideModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

function formatAmount(amount: string | number | undefined): string {
  if (amount === undefined || amount === null || amount === "") return "N0.00";
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return String(amount);
  return `N${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function getStatusBadgeStyle(status: string | undefined): string {
  switch ((status ?? "").toLowerCase().trim()) {
    case "completed":
    case "success":
    case "paid":
    case "approved":
      return "text-[#2D7565] bg-[#2D7565]/20 border border-[#2D7565]/30";
    case "pending":
    case "awaiting approval":
    case "under review":
    case "submitted":
      return "text-[#FFAC06] bg-[#FFAC06]/10 border border-[#FFAC06]/30";
    case "in progress":
    case "processing":
    case "fulfilled":
      return "text-[#0070E9] bg-[#0070E9]/10 border border-[#0070E9]/30";
    case "failed":
    case "reversed":
    case "cancelled":
    case "rejected":
      return "text-[#CA0202] bg-[#CA0202]/10 border border-[#CA0202]/30";
    case "on hold":
    case "disputed":
      return "text-[#E8334A] bg-[#E8334A]/10 border border-[#E8334A]/30";
    default:
      return "text-gray-600 bg-gray-50 border border-gray-200";
  }
}

export default function TransactionDetailSideModal({
  isOpen,
  onClose,
  transaction,
}: TransactionDetailSideModalProps) {
  // Lock body scroll and handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !transaction) return null;

  const txType = (transaction.transaction_type ||
    transaction.type ||
    "Credit") as string;
  const isCredit = txType.toLowerCase().includes("credit");

  // Format linked entity: check linked_entity_id, reference, linked_entity
  let linkedEntity =
    (transaction.linked_entity_id as string) ||
    (transaction.reference as string) ||
    (transaction.linked_entity as string) ||
    (transaction.linked_entity_type as string) ||
    "—";

  // If linked entity is a UUID, check if description has ORD number
  if (linkedEntity.length > 20 && typeof transaction.description === "string") {
    const ordMatch = transaction.description.match(/ORD-?[0-9A-Za-z]+/i);
    if (ordMatch) {
      linkedEntity = ordMatch[0].replace("-", "");
    }
  }

  const handleShareReceipt = () => {
    const receiptSummary = `Transaction Details:
ID: ${transaction.transaction_id}
Amount: ${formatAmount(transaction.amount)}
Type: ${transaction.category || txType} (${txType})
Status: ${transaction.status || "Completed"}
Date: ${transaction.created_at || transaction.date || "—"}
Description: ${transaction.description || "—"}`;

    if (navigator.share) {
      navigator
        .share({
          title: `Receipt - ${transaction.transaction_id}`,
          text: receiptSummary,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(receiptSummary);
      toast.success("Receipt details copied to clipboard!");
    }
  };

  const handleDownload = () => {
    const receiptContent = `====================================
        TRANSACTION RECEIPT
====================================
Transaction ID : ${transaction.transaction_id}
Amount         : ${formatAmount(transaction.amount)}
Type           : ${transaction.category || txType}
C/D            : ${txType}
Status         : ${transaction.status || "Completed"}
Date           : ${transaction.created_at || transaction.date || "—"}
Linked Entity  : ${linkedEntity}
Balance After  : ${formatAmount(transaction.running_balance)}
Fee            : ${formatAmount(transaction.transaction_fee || "0.00")}
Description    : ${transaction.description || "—"}
====================================
Generated from MartAf Global Seller Finance
`;

    const blob = new Blob([receiptContent], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `receipt-${transaction.transaction_id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Receipt downloaded!");
  };

  return (
    <AnimatePresence>
      <div
        key="transaction-detail-modal-backdrop"
        className="fixed inset-0 bg-black/40 flex items-end md:items-center justify-center md:justify-end z-[9998] p-0 md:p-4 md:pr-[29px]"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white flex flex-col w-full md:max-w-[432px] rounded-t-2xl md:rounded-[16px] relative max-h-[92vh] custom-scroll overflow-y-auto p-6 sm:p-8 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center  ">
            <h2 className="text-lg font-MontserratMedium leading-[26px] pb-8">
              Transaction details
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-[4.5px] absolute  top-6 right-6"
              aria-label="Close"
            >
              <Image src={Xicon} alt="close" height={15} width={15} />
            </button>
          </div>

          {/* Amount & Type Hero Card */}
          <div className="flex items-center justify-between  mb-8">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-full border-[0.8px] flex items-center justify-center border-000000/12
                `}
              >
                {isCredit ? (
                  <ArrowDownLeft className="w-6 h-6 stroke-[2.5]" />
                ) : (
                  <ArrowUpRight className="w-6 h-6 stroke-[2.5]" />
                )}
              </div>
              <div className="flex flex-col">
                
                <span className="text-xs font-MontserratNormal leading-[16px] max-w-[89px] text-wrap">
                  {isCredit ? "Credit to" : "Debit from"} Wallet balance
                </span>
              </div>
            </div>

            <div className="text-xl font-MontserratSemiBold ">
              {formatAmount(transaction.amount)}
            </div>
          </div>

          {/* Details Section */}
          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between pb-2">
              <span className="text-sm font-MontserratSemiBold text-000000">
                Details
              </span>
              <span className={`px-4 py-1.5 rounded-full flex items-center justify-center h-fit text-xs font-MontserratSemiBold capitalize ${getStatusBadgeStyle(transaction.status)}`}>
                {transaction.status || "Completed"}
              </span>
            </div>

            <div className="flex flex-col gap-3 text-sm font-MontserratNormal">
              <div className="flex items-center justify-between">
                <span className="text-000000/68 leading-[20px]">Transaction ID:</span>
                <span className="text-000000 leading-[20px]">
                  {transaction.transaction_id}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-000000/68 leading-[20px]">Balance after TXN:</span>
                <span className="text-000000 leading-[20px]">
                  {formatAmount(transaction.running_balance)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-000000/68 leading-[20px]">Type:</span>
                <span className="text-000000 leading-[20px]">
                  {transaction.category || transaction.type || "Sales"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-000000/68 leading-[20px]">C/D:</span>
                <span className="text-000000 leading-[20px]">
                  {txType}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-000000/68 leading-[20px]">Linked entity:</span>
                <span className="text-[#FF715B] font-MontserratBold">
                  {linkedEntity}
                </span>
              </div>

              <div className="flex items-start justify-between gap-4">
                <span className="text-gray-500 whitespace-nowrap">
                  Description
                </span>
                <span
                  className="text-[#161616] font-MontserratNormal text-right max-w-[220px]"
                  title={(transaction.description as string) || "—"}
                >
                  {(transaction.description as string) || "—"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-000000/68 leading-[20px]">Transaction fee:</span>
                <span className="text-000000 leading-[20px]">
                  {formatAmount(transaction.transaction_fee ?? "0.00")}
                </span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 my-8" />

          {/* Action Buttons */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Button
              variant="secondary"
              type="button"
              onClick={handleShareReceipt}
              className="flex-1"
            >
              Share receipt
            </Button>
            <Button
              type="button"
              onClick={handleDownload}
              className="flex-1"
            >
              Download
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
