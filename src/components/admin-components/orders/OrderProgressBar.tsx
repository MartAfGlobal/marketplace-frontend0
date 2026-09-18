"use client";

import React from "react";
import UnProccessedIcon from "@/assets/icons/admin/orders-progress/unprocessed.svg";
import ProccessedIcon from "@/assets/icons/admin/orders-progress/processed.svg";
import FulfildIcon from "@/assets/icons/admin/orders-progress/fufiled.svg";
import ShippedIcon from "@/assets/icons/admin/orders-progress/shipped.svg";
import DeliveredIcon from "@/assets/icons/admin/orders-progress/delivered.svg";
import PaymentIcon from "@/assets/icons/pendingPayment.svg"
import Unprocessed from "@/assets/icons/unprocessed.svg"
import ProccessingIcon from "@/assets/icons/proccessingIcon.svg"
import IntransitIcon from "@/assets/icons/IntransitIcon.svg"
import ClosedIcon from "@/assets/icons/CloseIcon.svg"



import Image, { StaticImageData } from "next/image";

export interface ProgressStep {
  key: string;
  label: string;
  icon: StaticImageData;
}

export const ORDER_PROGRESS_STEPS: ProgressStep[] = [
  { key: "payemenpending", label: "Payment pending", icon: PaymentIcon },
  { key: "unprocessed", label: "Awaiting seller’s confirmation", icon: Unprocessed },
  { key: "processing", label: "Processing", icon: ProccessingIcon },
  { key: "fulfilled", label: "In transit to Hub", icon: IntransitIcon },
  { key: "recieved", label: "Received at hub", icon: ShippedIcon },
  { key: "shipped", label: "Sent from Hub", icon: DeliveredIcon },
  { key: "delivered", label: "Received by buyer", icon: DeliveredIcon },
  { key: "Completed", label: "Closed", icon: ClosedIcon },
];

export function getStepWidthConfig(key: string): { flex: string; minWidth: string } {
  switch (key) {
    case "unprocessed": // Awaiting seller’s confirmation: needs highest width
      return { flex: "1.6 1 0%", minWidth: "115px" };
    case "processing": // Processed: needs lesser width
      return { flex: "0.7 1 0%", minWidth: "60px" };
    case "Completed": // Closed: needs lesser width
      return { flex: "0.6 1 0%", minWidth: "50px" };
    case "fulfilled": // In transit to Hub
      return { flex: "1.1 1 0%", minWidth: "82px" };
    case "delivered": // Received by buyer
      return { flex: "1.1 1 0%", minWidth: "82px" };
    case "recieved": // Received at hub
      return { flex: "1.0 1 0%", minWidth: "75px" };
    case "shipped": // Sent from Hub
      return { flex: "0.95 1 0%", minWidth: "72px" };
    case "payemenpending": // Payment pending
    default:
      return { flex: "1.0 1 0%", minWidth: "75px" };
  }
}

export function getProgressIndex(status: string | null | undefined): number {
  const s = (status || "").toLowerCase().trim();

  // Step 7: Completed / Closed
  if (s.includes("complet") || s === "closed" || s.includes("close")) return 7;

  // Step 6: Delivered / Received by buyer
  if (
    s.includes("deliver") ||
    s.includes("received by buyer") ||
    s.includes("received_by_buyer") ||
    s.includes("received by customer") ||
    s.includes("received_by_customer") ||
    s.includes("buyer received")
  )
    return 6;

  // Step 5: Shipped from Hub / Sent from Hub
  if (
    s === "shipped" ||
    s.includes("sent from hub") ||
    s.includes("sent_from_hub") ||
    s.includes("shipped_to_buyer") ||
    s.includes("shipped to buyer") ||
    s.includes("shipped_from_hub") ||
    s.includes("shipped from hub") ||
    s.includes("shipped_from_warehouse") ||
    s.includes("out_for_delivery")
  )
    return 5;

  // Step 4: Received at Hub
  if (
    s.includes("received_at_hub") ||
    s.includes("received at hub") ||
    s.includes("at_hub") ||
    s.includes("at hub") ||
    s.includes("recieved")
  )
    return 4;

  // Step 3: Fulfilled / In transit to Hub
  if (
    s.includes("fulfil") ||
    s.includes("in_transit_to_hub") ||
    s.includes("in transit to hub") ||
    s.includes("tracking_submitted") ||
    s.includes("warehouse") ||
    s === "in_transit"
  )
    return 3;

  // Step 2: Processing — seller accepted (fully or partially) or order is being processed
  if (
    s.includes("process") ||
    s.includes("accept") ||
    s === "partially_accepted"
  )
    return 2;

  // Step 1: Unprocessed / Pending / Awaiting seller
  if (s.includes("unprocess") || s === "pending" || s === "awaiting acceptance")
    return 1;

  // Step 0: Payment pending
  return 0;
}

export interface OrderProgressBarProps {
  status?: string | null;
  currentStep?: number;
  steps?: ProgressStep[];
  title?: string;
  className?: string;
  isDisputed?: boolean;
  adminStatus?: string | null;
  disputeStatus?: string | null;
}

export default function OrderProgressBar({
  status,
  currentStep,
  steps = ORDER_PROGRESS_STEPS,
  title = "Order progress",
  className = "",
  isDisputed = false,
  adminStatus,
  disputeStatus,
}: OrderProgressBarProps) {
  const activeIndex =
    typeof currentStep === "number" ? currentStep : getProgressIndex(status);

  // ── Dispute progress bar ────────────────────────────────────────────────────
  if (isDisputed) {
    const norm = (disputeStatus || adminStatus || status || "").trim().toUpperCase();
    const isClosed =
      norm === "CLOSED" ||
      norm.includes("CLOSE") ||
      norm.includes("COMPLET");

    const isOngoing =
      !isClosed &&
      (norm === "RETURN_ACCEPTED" ||
        norm.includes("ONGOING") ||
        norm.includes("ACCEPT") ||
        norm.includes("PROCESSING") ||
        norm.includes("RESOLVE") ||
        norm.includes("PROVE"));

    return (
      <div className={`w-full space-y-4 bg-ffffff p-6 rounded-c16 ${className}`}>
        {title && (
          <h3 className="text-sm font-MontserratSemiBold text-black">{title}</h3>
        )}
        <div className="w-full py-2 overflow-x-auto wno-scrollbar">
          <div className="flex items-start w-full max-w-[360px]">
            {/* Step 1 — Received by buyer (purple, complete, left-aligned) */}
            <div className="flex flex-col items-start" style={{ flex: "1 1 0%", minWidth: "90px" }}>
              <div className="flex items-center w-full">
                <div className="w-6 h-6 flex-shrink-0 rounded-full flex items-center justify-center bg-[#6A0DAD]/68 text-white shadow-sm">
                  <Image src={DeliveredIcon} alt="Received by buyer" width={12} height={12} />
                </div>
                {/* Halfway purple line */}
                <div className="flex-1 h-[1.5px] bg-[#6A0DAD]/68" />
              </div>
              <span className="mt-2 text-[10px] whitespace-nowrap font-MontserratNormal text-[#6A0DAD]/68">
                Received by buyer
              </span>
            </div>

            {/* Step 2 — Dispute raised */}
            <div className="flex flex-col items-center" style={{ flex: "1 1 0%", minWidth: "90px" }}>
              <div className="flex items-center w-full">
                {/* Left line */}
                <div className={`flex-1 h-[1.5px] ${isClosed || isOngoing ? "bg-[#FFAC06]" : "bg-[#FFAC06]"}`} />
                <div className="w-6 h-6 flex-shrink-0 rounded-full flex items-center justify-center bg-[#FFAC06] text-white shadow-sm">
                  <span className="text-white text-[12px] font-MontserratBold leading-none">!</span>
                </div>
                {/* Right line to Step 3 */}
                <div className={`flex-1 h-[1.5px] ${isClosed || isOngoing ? "bg-[#FFAC06]" : "bg-[#EAECF0]"}`} />
              </div>
              <span className="mt-2 text-[10px] whitespace-nowrap text-center font-MontserratNormal text-[#FFAC06]">
                Dispute raised
              </span>
            </div>

            {/* Step 3 — Order closed / Dispute ongoing */}
            <div className="flex flex-col items-center" style={{ flex: "1 1 0%", minWidth: "90px" }}>
              <div className="flex items-center w-full">
                {/* Left line from Step 2 */}
                <div className={`flex-1 h-[1.5px] ${isClosed ? "bg-[#6A0DAD]/68" : isOngoing ? "bg-[#FFAC06]" : "bg-[#EAECF0]"}`} />
                <div className={`w-6 h-6 flex-shrink-0 rounded-full flex items-center justify-center ${isClosed ? "bg-[#6A0DAD]/68 text-white shadow-sm" : isOngoing ? "bg-[#FFAC06] text-white shadow-sm" : "bg-[#EAECF0] text-[#98A2B3]"}`}>
                  {isClosed ? (
                    <Image src={ClosedIcon} alt="Order closed" width={8} height={8} className="brightness-200" />
                  ) : isOngoing ? (
                    <Image src={ProccessingIcon} alt="Dispute ongoing" width={12} height={12} />
                  ) : (
                    <Image src={ClosedIcon} alt="Order closed" width={8} height={8} className="opacity-40" />
                  )}
                </div>
                {/* Trailing line */}
                <div className="flex-1 h-[1.5px] invisible" />
              </div>
              <span className={`mt-2 text-[10px] whitespace-nowrap text-center font-MontserratNormal ${isClosed ? "text-[#6A0DAD]/68" : isOngoing ? "text-[#FFAC06]" : "text-[#98A2B3]"}`}>
                {isClosed ? "Order closed" : isOngoing ? "Dispute ongoing" : "Order closed"}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Normal progress bar ─────────────────────────────────────────────────────
  return (
    <div
      className={`w-full space-y-4 bg-ffffff p-6 rounded-c16 ${className}`}
    >
      {title && (
        <h3 className="text-sm font-MontserratSemiBold text-black">{title}</h3>
      )}

      <div className="w-full py-2 overflow-x-auto wno-scrollbar">
        <div className="w-full flex items-start min-w-[610px]">
          {steps.map((step, index) => {
            const isFirst = index === 0;
            const isLast = index === steps.length - 1;
            const isCurrentOrPassed = index <= activeIndex;
            const StepIcon = step.icon;

            const isLeftLineActive = index <= activeIndex;
            const isRightLineActive = index <= activeIndex;
            const widthConfig = getStepWidthConfig(step.key);

            return (
              <div
                key={step.key}
                className="flex flex-col items-center"
                style={{ flex: widthConfig.flex, minWidth: widthConfig.minWidth }}
              >
                <div className="flex items-center w-full">
                  <div
                    className={`flex-1 h-[1px] transition-colors ${
                      isFirst
                        ? "invisible"
                        : isLeftLineActive
                          ? "bg-[#6A0DAD]"
                          : "bg-[#EAECF0]"
                    }`}
                  />
                  <div
                    className={`w-6 h-6 flex-shrink-0 rounded-full flex items-center justify-center transition-colors ${
                      isCurrentOrPassed
                        ? "bg-[#6A0DAD]/68 text-white shadow-sm"
                        : "bg-[#EAECF0] text-[#98A2B3]"
                    }`}
                  >
                    <Image src={StepIcon} alt={step.label} width={12} height={12} />
                  </div>
                  <div
                    className={`flex-1 h-[1px] transition-colors ${
                      isLast
                        ? "invisible"
                        : isRightLineActive
                          ? "bg-[#6A0DAD]"
                          : "bg-[#EAECF0]"
                    }`}
                  />
                </div>
                <span
                  className={`mt-2 text-[10px] break-words w-full text-center leading-tight font-MontserratNormal tracking-[2%] px-1 ${
                    isCurrentOrPassed ? "text-[#6A0DAD]/68" : "text-[#98A2B3]"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
