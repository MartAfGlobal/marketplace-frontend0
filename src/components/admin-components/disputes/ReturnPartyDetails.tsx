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
  const [buyerImgError, setBuyerImgError] = React.useState(false);
  const [sellerImgError, setSellerImgError] = React.useState(false);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:justify-between lg:flex w-full  pt-2">
      {/* ── Buyer Card (Left) ── */}
      <div className="space-y-6 w-full max-w-[343px]">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-[#333333] flex items-center justify-center text-white font-MontserratSemiBold text-base">
              {buyerAvatar && !buyerImgError ? (
                <img
                  src={buyerAvatar}
                  alt={buyerName}
                  onError={() => setBuyerImgError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{(buyerName || "BU").slice(0, 2).toUpperCase()}</span>
              )}
            </div>
            <div className="flex items-center">
              <h3 className="text-base font-MontserratSemiBold">
                {buyerName || "Buyer"}
              </h3>
            </div>
          </div>
          <span className="text-base font-MontserratSemiBold text-000000/68">
            Buyer
          </span>
        </div>

        <div className="space-y-3 text-sm font-MontserratNormal">
          <p className="flex items-center gap-6">
            <span className="w-30 text-000000/68 flex-shrink-0">
              Email address:
            </span>
            <span className=" font-MontserratNormal break-all">
              {buyerEmail || "—"}
            </span>
          </p>
          <p className="flex items-center gap-6">
            <span className="w-30 text-000000/68  flex-shrink-0">
              Contact address:
            </span>
            <span className=" font-MontserratNormal">
              {buyerAddress || "—"}
            </span>
          </p>
          <p className="flex items-center gap-6">
            <span className="w-30 text-000000/68  flex-shrink-0">
              Phone No:
            </span>
            <span className=" font-MontserratNormal">{buyerPhone || "—"}</span>
          </p>
        </div>

        <div className="flex items-center gap-4 pt-3">
          <Button
            type="button"
            onClick={onMessageBuyer}
            className="w-[159.5px]"
          >
            Message Buyer
          </Button>
          <Button
            variant="secondary"
            type="button"
            onClick={onViewBuyerProfile}
            className="w-[159.5px]"
          >
            View Profile
          </Button>
        </div>
      </div>

      {/* ── Seller Card (Right) ── */}
      <div className="space-y-6 w-full max-w-[343px]">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-[#E68A00] flex items-center justify-center text-white font-MontserratSemiBold text-xs text-center p-1 uppercase">
              {sellerAvatar && !sellerImgError ? (
                <img
                  src={sellerAvatar}
                  alt={sellerName}
                  onError={() => setSellerImgError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{(sellerName || "XYZ").slice(0, 5)}</span>
              )}
            </div>
            <div className="flex items-center ">
              <h3 className="text-base font-MontserratSemiBold">
                {sellerName || "Seller"}
              </h3>
            </div>
          </div>
          <span className="text-base font-MontserratSemiBold text-000000/68">
            Seller
          </span>
        </div>

        <div className="space-y-3 text-sm font-MontserratNormal">
          <p className="flex items-center gap-6">
            <span className="w-30 text-000000/68  flex-shrink-0">
              Email address:
            </span>
            <span className=" font-MontserratNormal break-all">
              {sellerEmail || "—"}
            </span>
          </p>
          <p className="flex items-center gap-6">
            <span className="w-30 text-000000/68  flex-shrink-0">
              Contact address:
            </span>
            <span className=" font-MontserratNormal">
              {sellerAddress || "—"}
            </span>
          </p>
          <p className="flex items-center gap-6">
            <span className="w-30 text-000000/68  flex-shrink-0">
              Phone No:
            </span>
            <span className=" font-MontserratNormal">{sellerPhone || "—"}</span>
          </p>
        </div>

        <div className="flex items-center gap-4 pt-2">
          <Button
            variant="secondary"
            type="button"
            onClick={onMessageSeller}
            className=""
          >
            Message Seller
          </Button>
          <Button
            variant="primary"
            type="button"
            onClick={onViewSellerProfile}
            className=""
          >
            View Profile
          </Button>
        </div>
      </div>
    </div>
  );
}
