"use client";

import React from "react";
import { Button } from "@/components/ui/Button/Button";

export interface ReturnPartyDetailsProps {
  buyerName: string;
  buyerAvatar?: string;
  buyerEmail: string;
  buyerAddress: string;
  buyerPhone: string;
  onMessageBuyer?: () => void;
  onViewBuyerProfile?: () => void;

  sellerName: string;
  sellerAvatar?: string;
  sellerEmail: string;
  sellerAddress: string;
  sellerPhone: string;
  onMessageSeller?: () => void;
  onViewSellerProfile?: () => void;
}

export default function ReturnPartyDetails({
  buyerName,
  buyerAvatar,
  buyerEmail,
  buyerAddress,
  buyerPhone,
  onMessageBuyer,
  onViewBuyerProfile,

  sellerName,
  sellerAvatar,
  sellerEmail,
  sellerAddress,
  sellerPhone,
  onMessageSeller,
  onViewSellerProfile,
}: ReturnPartyDetailsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 pt-2">
      {/* ── Buyer Card (Left) ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-[#333333] flex items-center justify-center text-white font-MontserratSemiBold text-base">
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
            <div className="flex items-baseline gap-4">
              <h3 className="text-base font-MontserratBold text-[#161616]">
                {buyerName || "Buyer"}
              </h3>
              <span className="text-xs font-MontserratMedium text-gray-400">
                Buyer
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2 text-xs font-MontserratNormal text-gray-500">
          <p className="flex items-baseline">
            <span className="w-32 flex-shrink-0">Email address:</span>
            <span className="text-[#161616] font-MontserratMedium break-all">
              {buyerEmail || "—"}
            </span>
          </p>
          <p className="flex items-baseline">
            <span className="w-32 flex-shrink-0">Contact address:</span>
            <span className="text-[#161616] font-MontserratMedium">
              {buyerAddress || "—"}
            </span>
          </p>
          <p className="flex items-baseline">
            <span className="w-32 flex-shrink-0">Phone No:</span>
            <span className="text-[#161616] font-MontserratMedium">
              {buyerPhone || "—"}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onMessageBuyer}
            className="flex-1 max-w-[170px] h-10 border border-[#FF6D5B] text-[#FF6D5B] text-xs font-MontserratSemiBold rounded-xl hover:bg-[#FF6D5B]/5 transition-colors"
          >
            Message Buyer
          </button>
          <button
            type="button"
            onClick={onViewBuyerProfile}
            className="flex-1 max-w-[170px] h-10 bg-[#FF6D5B] text-white text-xs font-MontserratSemiBold rounded-xl hover:bg-[#FF6D5B]/90 transition-colors shadow-sm"
          >
            View Profile
          </button>
        </div>
      </div>

      {/* ── Seller Card (Right) ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-[#E68A00] flex items-center justify-center text-white font-MontserratSemiBold text-xs text-center p-1 uppercase">
              {sellerAvatar ? (
                <img
                  src={sellerAvatar}
                  alt={sellerName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{(sellerName || "XYZ").slice(0, 5)}</span>
              )}
            </div>
            <div className="flex items-baseline gap-4">
              <h3 className="text-base font-MontserratBold text-[#161616]">
                {sellerName || "Seller"}
              </h3>
              <span className="text-xs font-MontserratMedium text-gray-400">
                Seller
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2 text-xs font-MontserratNormal text-gray-500">
          <p className="flex items-baseline">
            <span className="w-32 flex-shrink-0">Email address:</span>
            <span className="text-[#161616] font-MontserratMedium break-all">
              {sellerEmail || "—"}
            </span>
          </p>
          <p className="flex items-baseline">
            <span className="w-32 flex-shrink-0">Contact address:</span>
            <span className="text-[#161616] font-MontserratMedium">
              {sellerAddress || "—"}
            </span>
          </p>
          <p className="flex items-baseline">
            <span className="w-32 flex-shrink-0">Phone No:</span>
            <span className="text-[#161616] font-MontserratMedium">
              {sellerPhone || "—"}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onMessageSeller}
            className="flex-1 max-w-[170px] h-10 border border-[#FF6D5B] text-[#FF6D5B] text-xs font-MontserratSemiBold rounded-xl hover:bg-[#FF6D5B]/5 transition-colors"
          >
            Message Seller
          </button>
          <button
            type="button"
            onClick={onViewSellerProfile}
            className="flex-1 max-w-[170px] h-10 bg-[#FF6D5B] text-white text-xs font-MontserratSemiBold rounded-xl hover:bg-[#FF6D5B]/90 transition-colors shadow-sm"
          >
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
}
