"use client";

import React from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import CopyIcon from "@/assets/icons/copy.svg";
import { Button } from "@/components/ui/Button/Button";

function formatCurrency(val: any) {
  if (val == null || val === "" || isNaN(Number(val))) return "₦0.00";
  return `₦${Number(val).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

interface Props {
  shippingMethod: string;
  discout:string;
  subtotal:string;
  shippingFee: string;
  displayOrderId: string;
  totalItems: number;
  orderDate: string;
  shippingAddress: string;
  rawTotal: number;
  displayStatus: string;
  transactionId: string;
  trackingId: string;
  paymentDate: string;
  paymentMethod: string;
  rawPaymentStatus: string;
  displayPaymentStatus: string;
  hasTracking: boolean;
  isCancelled: boolean;
  isExpired: boolean;
  copiedOrder: boolean;
  copiedTxn: boolean;
  onCopyOrderId: () => void;
  onCopyTxnId: () => void;
  onTrackOrder: () => void;
  onCancelOrder: () => void;
}

export default function OrderSummaryCards({
  displayOrderId,
  orderDate,
  shippingFee,
  subtotal,
  discout,
  totalItems,
  rawTotal,
  displayStatus,
  transactionId,
  paymentDate,
  paymentMethod,
  shippingMethod,
  rawPaymentStatus,
  shippingAddress,
  displayPaymentStatus,
  hasTracking,
  isCancelled,
  isExpired,
  copiedOrder,
  trackingId,
  copiedTxn,
  onCopyOrderId,
  onCopyTxnId,
  onTrackOrder,
  onCancelOrder,
}: Props) {
  const statusColor =
    displayStatus.toLowerCase() === "dispute closed" ||
    displayStatus.toLowerCase() === "closed"
      ? "bg-[#6A0DAD]/12 text-[#6A0DAD]"
      : displayStatus.toLowerCase() === "disputed" ||
        displayStatus.toLowerCase() === "dispute raised" ||
        displayStatus.toLowerCase() === "dispute ongoing" ||
        displayStatus.toLowerCase() === "rejected" ||
        displayStatus.toLowerCase() === "cancelled"
        ? "bg-[#CA0202]/12 text-[#CA0202]"
        : displayStatus.toLowerCase() === "delivered" ||
            displayStatus.toLowerCase() === "completed"
          ? "bg-[#00BE5C]/12 text-[#00BE5C]"
          : displayStatus.toLowerCase().includes("transit") ||
              displayStatus.toLowerCase() === "shipped" ||
              displayStatus.toLowerCase() === "received at hub"
            ? "bg-[#947FFF]/12 text-[#947FFF]"
            : "bg-[#FFAC06]/12 text-[#FFAC06]";

  return (
    <div className="w-[344px] h-[565px] bg-ffffff py-6 px-8 rounded-c16 space-y-3">
      <h1 className="text-sm font-MontserratNormal leading-[21px]  text-000000/68">
        Order details
      </h1>
      <div className="flex justify-between w-full">
        <div className=" space-y-1 flex flex-col w-full">
          <span className="text-c12 font-MontserratNormal leading-c20 tracking-[2%] text-000000/44">
            Order date
          </span>
          <span className="text-base font-MontserratNormal leading-c24 tracking-[1%] text-000000/68">
            {orderDate}
          </span>
        </div>
        <div className=" space-y-1 flex flex-col w-full max-w-31.25">
          <span className="text-c12 font-MontserratNormal leading-c20 tracking-[2%] text-000000/44">
            Transaction ID
          </span>
          <span
            className="text-base font-MontserratNormal leading-c24 tracking-[1%] text-ff715b w-full truncate "
            title={transactionId}
          >
            {transactionId}
          </span>
        </div>
      </div>
      <div className=" space-y-1 flex flex-col w-full">
        <span className="text-c12 font-MontserratNormal leading-c20 tracking-[2%] text-000000/44">
          Shipping address
        </span>
        <span className="text-base font-MontserratNormal leading-c24 tracking-[1%] text-000000/68">
          {shippingAddress}
        </span>
      </div>
      <div className=" space-y-1 flex flex-col w-full">
        <span className="text-c12 font-MontserratNormal leading-c20 tracking-[2%] text-000000/44">
          Shipping method
        </span>
        <span className="text-base font-MontserratNormal leading-c24 tracking-[1%] text-000000/68">
          {shippingMethod}
        </span>
      </div>
      <div className=" space-y-1 flex flex-col w-full">
        <span className="text-c12 font-MontserratNormal leading-c20 tracking-[2%] text-000000/44">
          Tracking number
        </span>
        <span className="text-base font-MontserratNormal leading-c24 tracking-[1%] text-ff715b">
          {trackingId}
        </span>
      </div>
      <div className="space-y-3 text-sm font-MontserratNormal w-full">
        <div className="w-full h-13 flex items-center justify-between text-xs font-MontserratNormal text-000000/68 leading-c20 tracking-[1%] border-b border-b-000000/4">
          <span className="">Order summary</span>
          <span>Amount</span>
        </div>

        <div className="  flex justify-between w-full">
          <span className="text-c12 font-MontserratNormal leading-c20 tracking-[2%] text-000000/44">
            Total items
          </span>
          <span className="text-base font-MontserratNormal leading-c24 tracking-[1%] text-000000/68">
            {totalItems}
          </span>
        </div>
        <div className="  flex justify-between w-full">
          <span className="text-c12 font-MontserratNormal leading-c20 tracking-[2%] text-000000/44">
            Discounts
          </span>
          <span className="text-base font-MontserratNormal leading-c24 tracking-[1%] text-000000/68">
            {discout}
          </span>
        </div>
        <div className="  flex justify-between w-full">
          <span className="text-c12 font-MontserratNormal leading-c20 tracking-[2%] text-000000/44">
            Subtotal
          </span>
          <span className="text-base font-MontserratNormal leading-c24 tracking-[1%] text-000000/68">
            {subtotal}
          </span>
        </div>
        <div className="  flex justify-between w-full">
          <span className="text-c12 font-MontserratNormal leading-c20 tracking-[2%] text-000000/44">
            Shipping fees
          </span>
          <span className="text-base font-MontserratNormal leading-c24 tracking-[1%] text-000000/68">
            {shippingFee}
          </span>
        </div>
        <div className="flex justify-between w-full font-MontserratMedium text-c20 leading-c28">
          <span>Total </span>
          <span className="">
            {formatCurrency(rawTotal)}
          </span>
        </div>
     
      </div>

      {/* Column 2: Payment Info */}
     

      {/* Column 3: Action Buttons */}
      {/* <div className="space-y-6 flex flex-col justify-center w-full md:col-span-2 lg:col-span-1">
        {hasTracking && <Button onClick={onTrackOrder}>Track Order</Button>}

        {isExpired && (
          <div className="flex flex-col gap-3">
            <span className="inline-flex items-center justify-center px-4 py-2 rounded-2xl text-xs font-MontserratSemiBold bg-[#FF6D5B]/12 text-[#C00000]">
              Expired — acceptance deadline passed
            </span>
            <Button
              onClick={onCancelOrder}
              className="bg-[#C00000] hover:bg-[#a60000]"
            >
              Cancel order
            </Button>
          </div>
        )}

        {!isCancelled && !isExpired && (
          <Button
            onClick={onCancelOrder}
            className="bg-[#C00000] hover:bg-[#a60000]"
          >
            Cancel order
          </Button>
        )}
      </div> */}
    </div>
  );
}
