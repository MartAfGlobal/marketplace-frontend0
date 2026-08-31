"use client";

import React from "react";
import UnProccessedIcon from "@/assets/icons/admin/orders-progress/unprocessed.svg";
import ProccessedIcon from "@/assets/icons/admin/orders-progress/processed.svg";
import FulfildIcon from "@/assets/icons/admin/orders-progress/fufiled.svg";
import ShippedIcon from "@/assets/icons/admin/orders-progress/shipped.svg";
import DeliveredIcon from "@/assets/icons/admin/orders-progress/delivered.svg";


import Image, { StaticImageData } from "next/image";

export interface ProgressStep {
  key: string;
  label: string;
  icon: StaticImageData;
}

export const ORDER_PROGRESS_STEPS: ProgressStep[] = [
  { key: "unprocessed", label: "Unprocessed", icon: UnProccessedIcon },
  { key: "processed", label: "Processed", icon: ProccessedIcon },
  { key: "fulfilled", label: "Fulfilled", icon: FulfildIcon },
  { key: "shipped", label: "Shipped", icon: ShippedIcon },
  { key: "delivered", label: "Delivered", icon: DeliveredIcon },
];

export function getProgressIndex(status: string | null | undefined): number {
  const s = (status || "").toLowerCase().trim();
  // Step 4: Delivered
  if (s.includes("deliver") || s.includes("complet")) return 4;

  // Step 3: Shipped to buyer
  if (
    s === "shipped" ||
    s.includes("shipped_to_buyer") ||
    s.includes("shipped_from_warehouse") ||
    s.includes("out_for_delivery") ||
    (s.includes("ship") && !s.includes("seller") && !s.includes("to_hub"))
  )
    return 3;

  // Step 2: Fulfilled by seller / in transit to hub / received at hub
  if (
    s.includes("fulfil") ||
    s.includes("in_transit_to_hub") ||
    s.includes("received_at_hub") ||
    s.includes("at_hub") ||
    s.includes("warehouse") ||
    s === "in_transit"
  )
    return 2;

  // Step 1: Processed / Accepted
  if (s.includes("process") || s.includes("accept")) return 1;

  // Step 0: Unprocessed / Pending
  return 0;
}

export interface OrderProgressBarProps {
  status?: string | null;
  currentStep?: number;
  steps?: ProgressStep[];
  title?: string;
  className?: string;
}

export default function OrderProgressBar({
  status,
  currentStep,
  steps = ORDER_PROGRESS_STEPS,
  title = "Order progress",
  className = "",
}: OrderProgressBarProps) {
  const activeIndex =
    typeof currentStep === "number" ? currentStep : getProgressIndex(status);

  return (
    <div className={`space-y-4 ${className}`}>
      {title && (
        <h3 className="text-sm font-MontserratSemiBold text-black">{title}</h3>
      )}

      <div className="w-full py-2 overflow-x-auto">
        <div className="flex items-start min-w-[500px]">
          {steps.map((step, index) => {
            const isFirst = index === 0;
            const isLast = index === steps.length - 1;
            const isCurrentOrPassed = index <= activeIndex;
            const StepIcon = step.icon;

            // Line segment dimensions:
            // Step 0 (First): 89px right line
            // Middle steps (1, 2, 3): 58px left line and 58px right line
            // Step 4 (Last): 64px left line
            const leftLineWidth = isFirst
              ? null
              : isLast
                ? "w-[64px]"
                : "w-[58px]";
            const rightLineWidth = isLast
              ? null
              : isFirst
                ? "w-[89px]"
                : "w-[58px]";

            // Active line coloring:
            const isLeftLineActive = index <= activeIndex;
            const isRightLineActive = index <= activeIndex;

            return (
              <div
                key={step.key}
                className={`flex flex-col ${
                  isFirst
                    ? "items-start"
                    : isLast
                      ? "items-end"
                      : "items-center"
                }`}
              >
                {/* Row: Left Line (0 gap) + Circle (40px) + Right Line (0 gap) */}
                <div className="flex items-center">
                  {/* Left line (touches left edge of circle with 0 gap) */}
                  {!isFirst && (
                    <div
                      className={`h-[1.5px] ${leftLineWidth} flex-shrink-0 transition-colors ${
                        isLeftLineActive ? "bg-[#6A0DAD]" : "bg-[#EAECF0]"
                      }`}
                    />
                  )}

                  {/* Step Circle */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                      isCurrentOrPassed
                        ? "bg-[#6A0DAD]/68 text-white shadow-sm"
                        : "bg-[#EAECF0] text-[#98A2B3]"
                    }`}
                  >
                    <Image
                      src={StepIcon}
                      alt={step.label}
                      width={20}
                      height={20}
                    />
                  </div>

                  {/* Right line (touches right edge of circle with 0 gap) */}
                  {!isLast && (
                    <div
                      className={`h-[1.5px] ${rightLineWidth} flex-shrink-0 transition-colors ${
                        isRightLineActive ? "bg-[#6A0DAD]" : "bg-[#EAECF0]"
                      }`}
                    />
                  )}
                </div>

                {/* Step Label: Unprocessed is text-left and aligned with the circle */}
                <span
                  className={`mt-2 text-xs font-MontserratMedium whitespace-nowrap ${
                    isFirst
                      ? "text-left pl-0"
                      : isLast
                        ? "text-right pr-0.5"
                        : "text-center"
                  } ${
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
