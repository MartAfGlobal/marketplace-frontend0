"use client";

import React from "react";
import { Button } from "@/components/ui/Button/Button";

interface Props {
  displayStatus: string;
  canUpdateStatus: boolean;
  isRejected: boolean;
  isCancelled: boolean;
  isExpired: boolean;
  isAcceptedOrInTransit: boolean;
  hubComplete: boolean;
  onOpen: () => void;
}

export default function UpdateStatusSection({
  displayStatus,
  canUpdateStatus,
  isRejected,
  isCancelled,
  isExpired,
  isAcceptedOrInTransit,
  hubComplete,
  onOpen,
}: Props) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-MontserratSemiBold">Update Order Status</h3>
      <div className="flex items-start gap-4">
        <div
          className={`flex items-center justify-between w-full max-w-[240px] h-c44 px-4 border rounded-c8 text-sm font-MontserratMedium transition-colors
            ${canUpdateStatus
              ? "border-[#E5E7EB] bg-white text-[#000000]/68 cursor-pointer hover:border-[#FF6D5B]"
              : "border-[#E5E7EB] bg-[#F9FAFB] text-[#000000]/30 cursor-not-allowed"
            }`}
          onClick={() => canUpdateStatus && onOpen()}
        >
          <span>{displayStatus}</span>
        </div>

        <div className="flex flex-col gap-1">
          <Button
            onClick={onOpen}
            disabled={!canUpdateStatus}
            className="w-auto px-6 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Update Status
          </Button>
          {isRejected && (
            <span className="text-xs font-MontserratNormal text-[#E8334A]">Order is rejected</span>
          )}
          {isCancelled && !isRejected && (
            <span className="text-xs font-MontserratNormal text-[#E8334A]">Order is cancelled</span>
          )}
          {isExpired && !isCancelled && !isRejected && (
            <span className="text-xs font-MontserratNormal text-[#E8334A]">Acceptance window expired</span>
          )}
          {!isAcceptedOrInTransit && !isCancelled && !isExpired && !isRejected && (
            <span className="text-xs font-MontserratNormal text-[#000000]/40">
              Available once order is accepted or in transit
            </span>
          )}
          {hubComplete && !isRejected && (
            <span className="text-xs font-MontserratNormal text-[#2ea37d]">All steps completed</span>
          )}
        </div>
      </div>
    </div>
  );
}
