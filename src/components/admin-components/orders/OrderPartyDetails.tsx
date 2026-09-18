"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SquarePen } from "lucide-react";
import { Button } from "@/components/ui/Button/Button";
import VerifiedIcon from "@/assets/icons/verifiedIcon.svg";
import MessageIcon from "@/assets/icons/message.svg";

export interface OrderPartyDetailsProps {
  buyerId?: string;
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

  sellerId?: string;
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
  buyerId,
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

  sellerId,
  sellerName,
  sellerAvatar,
  isSellerVerified = true,
  sellerEmail,
  sellerPhone,
  sellerAddress,
  onViewSellerProfile,
  onMessageSeller,
}: OrderPartyDetailsProps) {
  const router = useRouter();

  const handleViewBuyerProfile = () => {
    if (onViewBuyerProfile) {
      onViewBuyerProfile();
      return;
    }
    if (buyerId) {
      router.push(
        `/dashboard/admin/users/buyers/${buyerId}?from=Order+details`,
      );
    } else {
      router.push(
        `/dashboard/admin/users?type=buyers${buyerName ? `&search=${encodeURIComponent(buyerName)}` : ""}`,
      );
    }
  };

  const handleViewSellerProfile = () => {
    if (onViewSellerProfile) {
      onViewSellerProfile();
      return;
    }
    if (sellerId) {
      router.push(
        `/dashboard/admin/users/sellers/${sellerId}?from=Order+details`,
      );
    } else {
      router.push(
        `/dashboard/admin/users?type=sellers${sellerName ? `&search=${encodeURIComponent(sellerName)}` : ""}`,
      );
    }
  };
  return (
    <div className="flex gap-4 max-w-[744px]">
      {/* ── 1. Buyer Details Card ── */}
      <div className="space-y-6 bg-ffffff rounded-c16 p-6 w-full max-w-[364px] h-[397px] min-w-[300px]">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-MontserratNormal leading-[21px] tracking-[1%] text-000000/68">
            Buyer Details
          </h3>
        </div>

        {/* Buyer Profile */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-[#6A0DAD]/10 flex items-center justify-center text-[#6A0DAD] font-MontserratSemiBold border border-gray-100">
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
            <span className="text-base font-MontserratNormal leading-[24px] tracking-[1%] text-ff715b">
              {buyerName}
            </span>
          </div>

          <button className="flex-shrink-0">
            <Image src={MessageIcon} alt="message" width={19.5} height={15} />
          </button>
        </div>

        <p className="flex flex-col gap-1">
          <span className="text-000000/44 text-xs leading-c20 tracking-[2%] font-MontserratNormal">
            Address
          </span>
          <span className="text-000000/68 text-xs leading-c20 tracking-[2%] font-MontserratNormal">
            {buyerAddress}
          </span>
        </p>
        <p className="flex flex-col gap-1">
          <span className="text-000000/44 text-xs leading-c20 tracking-[2%] font-MontserratNormal">
            Phone
          </span>
          <span className="text-000000/68 text-xs leading-c20 tracking-[2%] font-MontserratNormal">
            {buyerPhone}
          </span>
        </p>
        <p className="flex flex-col gap-1">
          <span className="text-000000/44 text-xs leading-c20 tracking-[2%] font-MontserratNormal">
            Email
          </span>
          <span className="text-000000/68 text-xs leading-c20 tracking-[2%] font-MontserratNormal">
            {buyerEmail}
          </span>
        </p>

       

      
      </div>
      <div className="space-y-6 bg-ffffff rounded-c16 p-6 w-full max-w-[364px] h-[397px] min-w-[300px]">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-MontserratNormal leading-[21px] tracking-[1%] text-000000/68">
             Seller Details
          </h3>
        </div>

        {/* Buyer Profile */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-[#6A0DAD]/10 flex items-center justify-center text-[#6A0DAD] font-MontserratSemiBold border border-gray-100">
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
            <span className="text-base font-MontserratNormal leading-[24px] tracking-[1%] text-ff715b">
              {sellerName}
            </span>
          </div>

          <button className="flex-shrink-0">
            <Image src={MessageIcon} alt="message" width={19.5} height={15} />
          </button>
        </div>

        <p className="flex flex-col gap-1">
          <span className="text-000000/44 text-xs leading-c20 tracking-[2%] font-MontserratNormal">
            Address
          </span>
          <span className="text-000000/68 text-xs leading-c20 tracking-[2%] font-MontserratNormal">
            {sellerAddress}
          </span>
        </p>
        <p className="flex flex-col gap-1">
          <span className="text-000000/44 text-xs leading-c20 tracking-[2%] font-MontserratNormal">
            Phone
          </span>
          <span className="text-000000/68 text-xs leading-c20 tracking-[2%] font-MontserratNormal">
            {sellerPhone}
          </span>
        </p>
        <p className="flex flex-col gap-1">
          <span className="text-000000/44 text-xs leading-c20 tracking-[2%] font-MontserratNormal">
            Email
          </span>
          <span className="text-000000/68 text-xs leading-c20 tracking-[2%] font-MontserratNormal">
            {sellerEmail}
          </span>
        </p>

       

      
      </div>

      {/* ── 3. Seller Details Card ── */}
    
    </div>
  );
}
