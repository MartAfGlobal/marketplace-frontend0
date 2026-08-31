"use client";

import React from "react";
import Image from "next/image";
import { SquarePen } from "lucide-react";
import { Button } from "@/components/ui/Button/Button";
import VerifiedIcon from "@/assets/icons/verifiedIcon.svg";

export interface OrderPartyDetailsProps {
  buyerName: string;
  buyerAvatar?: string;
  buyerEmail: string;
  buyerPhone: string;
  buyerAddress: string;
  onEditAddress?: () => void;
  onViewBuyerProfile?: () => void;
  onMessageBuyer?: () => void;

  shippingAddress: string;
  shippingMethod: string;
  trackingNumber: string;

  sellerName: string;
  sellerAvatar?: string;
  isSellerVerified?: boolean;
  sellerEmail: string;
  sellerPhone: string;
  sellerAddress: string;
  onViewSellerProfile?: () => void;
  onMessageSeller?: () => void;
}

export default function OrderPartyDetails({
  buyerName,
  buyerAvatar,
  buyerEmail,
  buyerPhone,
  buyerAddress,
  onEditAddress,
  onViewBuyerProfile,
  onMessageBuyer,

  shippingAddress,
  shippingMethod,
  trackingNumber,

  sellerName,
  sellerAvatar,
  isSellerVerified = true,
  sellerEmail,
  sellerPhone,
  sellerAddress,
  onViewSellerProfile,
  onMessageSeller,
}: OrderPartyDetailsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs font-MontserratNormal">
      {/* ── 1. Buyer Details Card ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-MontserratSemiBold text-black">Buyer Details</h3>
          <button
            type="button"
            onClick={onEditAddress}
            className="flex items-center gap-1 text-xs text-[#FF6D5B] font-MontserratMedium hover:opacity-80 transition-opacity cursor-pointer"
          >
            <span>Edit Address</span>
            <SquarePen className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Buyer Profile */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 bg-[#6A0DAD]/10 flex items-center justify-center text-[#6A0DAD] font-MontserratSemiBold border border-gray-100">
            {buyerAvatar ? (
              <img
                src={buyerAvatar}
                alt={buyerName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{(buyerName || "BU").slice(0, 2).toUpperCase()}</span>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-MontserratSemiBold text-black">{buyerName}</span>
            <span className="inline-flex items-center gap-1 text-[11px] text-[#027A48] bg-[#ECFDF3] px-2 py-0.5 rounded-full font-MontserratMedium">
              <span>Verified</span>
              <Image
                src={VerifiedIcon}
                alt="Verified"
                width={12}
                height={12}
              />
            </span>
          </div>
        </div>

        {/* Buyer Contact Text */}
        <div className="space-y-2 text-xs">
          <p className="text-gray-600">
            <span className="text-gray-500 font-MontserratNormal">Email Address:</span>{" "}
            <span className="text-gray-900">{buyerEmail}</span>
          </p>
          <p className="text-gray-600">
            <span className="text-gray-500 font-MontserratNormal">Phone:</span>{" "}
            <span className="text-gray-900">{buyerPhone}</span>
          </p>
          <p className="text-gray-600">
            <span className="text-gray-500 font-MontserratNormal">Delivery Address:</span>{" "}
            <span className="text-gray-900">{buyerAddress}</span>
          </p>
        </div>

        {/* Action Buttons */}
       <div className="flex items-center gap-3 ">
          <Button
            type="button"
            variant="secondary"
            onClick={onViewBuyerProfile}
            className=" w-[137.33px]"
          >
            View Profile
          </Button>
          <Button
            type="button"
            onClick={onMessageBuyer}
            className="flex-1  text-nowrap py-2 px-3 bg-[#0070E9] text-white rounded-lg text-xs font-MontserratMedium hover:bg-[#0062df] transition-colors text-center"
          >
            Message Buyer
          </Button>
        </div>
      </div>

      {/* ── 2. Shipping Details Card ── */}
      <div className="space-y-4">
        <h3 className="text-sm font-MontserratSemiBold text-black">Shipping details</h3>

        <div className="space-y-3 text-xs pt-1">
          <p className="text-gray-600">
            <span className="text-gray-500 font-MontserratNormal">Shipping Address:</span>{" "}
            <span className="text-gray-900">{shippingAddress}</span>
          </p>
          <p className="text-gray-600">
            <span className="text-gray-500 font-MontserratNormal">Shipping Method:</span>{" "}
            <span className="text-gray-900">{shippingMethod}</span>
          </p>
          <p className="text-gray-600">
            <span className="text-gray-500 font-MontserratNormal">Tracking Number:</span>{" "}
            <span className="text-[#FF6D5B] font-MontserratMedium">
              {trackingNumber || "N/A"}
            </span>
          </p>
        </div>
      </div>

      {/* ── 3. Seller Details Card ── */}
      <div className="space-y-4">
        <h3 className="text-sm font-MontserratSemiBold text-black">Seller Details</h3>

        {/* Seller Profile */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 bg-[#FFAC06] flex items-center justify-center text-white text-xs font-MontserratBold border border-gray-100">
            {sellerAvatar ? (
              <img
                src={sellerAvatar}
                alt={sellerName}
                className="w-full h-full object-cover"
              />
            ) : (
              (sellerName || "SE").slice(0, 2).toUpperCase()
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-MontserratSemiBold text-black">{sellerName}</span>
            {isSellerVerified && (
              <span className="inline-flex items-center gap-1 text-[11px] text-[#027A48] bg-[#ECFDF3] px-2 py-0.5 rounded-full font-MontserratMedium">
                <span>Verified</span>
                <Image
                  src={VerifiedIcon}
                  alt="Verified"
                  width={12}
                  height={12}
                />
              </span>
            )}
          </div>
        </div>

        {/* Seller Contact Text */}
        <div className="space-y-2 text-xs">
          <p className="text-gray-600">
            <span className="text-gray-500 font-MontserratNormal">Email Address:</span>{" "}
            <span className="text-gray-900">{sellerEmail}</span>
          </p>
          <p className="text-gray-600">
            <span className="text-gray-500 font-MontserratNormal">Phone:</span>{" "}
            <span className="text-gray-900">{sellerPhone}</span>
          </p>
          <p className="text-gray-600">
            <span className="text-gray-500 font-MontserratNormal">Contact Address:</span>{" "}
            <span className="text-gray-900">{sellerAddress}</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 ">
          <Button
            type="button"
            variant="secondary"
            onClick={onViewSellerProfile}
            className=" w-[137.33px]"
          >
            View Profile
          </Button>
          <Button
            type="button"
            onClick={onMessageSeller}
            className="flex-1  text-nowrap py-2 px-3 bg-[#0070E9] text-white rounded-lg text-xs font-MontserratMedium hover:bg-[#0062df] transition-colors text-center"
          >
            Message Seller
          </Button>
        </div>
      </div>
    </div>
  );
}
