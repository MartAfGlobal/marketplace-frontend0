"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button/Button";
import { Input } from "@/components/ui/forms/Input";
import { Label } from "@/components/ui/forms/Label";
import { Textarea } from "@/components/ui/forms/auth/text-area";

export interface ReturnRequestDetailsProps {
  requestDate: string;
  itemReturnedDate?: string;
  returnType: string;
  returnMethod: string;
  deliveryStationAddress: string;
  reasonForReturn: string;
  moreDetails?: string;
  evidenceImages: (string | { url?: string; image?: string; file_url?: string })[];

  showRefundActions?: boolean;
  onApproveRefund?: () => void;
  onRejectRefund?: () => void;
  onPartialRefund?: () => void;
  onRequestRefund?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  loading?: boolean;
}

export default function ReturnRequestDetails({
  requestDate,
  itemReturnedDate,
  returnType,
  returnMethod,
  deliveryStationAddress,
  reasonForReturn,
  moreDetails,
  evidenceImages = [],
  showRefundActions = false,
  onApproveRefund,
  onRejectRefund,
  onPartialRefund,
  onRequestRefund,
  onApprove,
  onReject,
  loading = false,
}: ReturnRequestDetailsProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleApproveRefundClick = onApproveRefund || onRequestRefund || onPartialRefund;
  const handleRejectRefundClick = onRejectRefund || onReject;

  const getImageUrl = (item: any): string => {
    if (typeof item === "string") return item;
    return item?.url || item?.image || item?.file_url || "/placeholder.png";
  };

  return (
    <div className="space-y-12 pt-4 ">
      {/* ── Section Title & Item Returned Date ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h3 className="text-sm font-MontserratSemiBold text-000000/68">
          Request Details
        </h3>
        {itemReturnedDate && (
          <span className="text-xs font-MontserratNormal">
            Item Returned: {itemReturnedDate}
          </span>
        )}
      </div>

      {/* ── 2-Column Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        {/* Left Column */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-xs font-MontserratMedium text-gray-500 block">
              Request Date
            </Label>
            <Input
              type="text"
              readOnly
              value={requestDate || "—"}
              className=""
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-MontserratMedium text-gray-500 block">
              Return Type
            </Label>
            <Input
              type="text"
              readOnly
              value={returnType || "Return & Refund"}
              className=""
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-MontserratMedium text-gray-500 block">
              Return Method
            </Label>
            <Input
              type="text"
              readOnly
              value={returnMethod || "Drop-off"}
              className=""
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-MontserratMedium text-gray-500 block">
              Delivery Station Address
            </Label>
            <Input
              type="text"
              readOnly
              value={deliveryStationAddress || "—"}
              className=""
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          <div className="space-y-2">
            <Label className="text-xs font-MontserratMedium text-gray-500 block">
              Reason for the Return
            </Label>
            <Input
              type="text"
              readOnly
              value={reasonForReturn || "—"}
              className=""
            />
          </div>

          {moreDetails && moreDetails.trim() && (
            <div className="space-y-2">
              <Label className="text-xs font-MontserratMedium text-gray-500 block">
                More Details
              </Label>
              <Textarea
                readOnly
                rows={4}
                value={moreDetails}
                className=""
              />
            </div>
          )}

          {/* Evidence gallery */}
          <div className="space-y-2">
            <Label className="text-sm font-MontserratNormal text-000000/68">
              Evidence (optional)
            </Label>
            <div className="py-2.5 px-4 border border-000000/12 rounded-c8">
              {evidenceImages.length > 0 ? (
                <div className="flex flex-wrap gap-4">
                  {evidenceImages.map((img, idx) => {
                    const src = getImageUrl(img);
                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedImage(src)}
                        className="w-16 h-16 overflow-hidden  cursor-pointer hover:opacity-90 hover:scale-105 transition-all shadow-sm relative"
                      >
                        <img
                          src={src}
                          alt={`Evidence ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-gray-400 font-MontserratNormal italic">
                  No evidence uploaded
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Action Buttons ── */}
      <div className="flex flex-wrap items-center justify-end gap-6 pt-6">
        {showRefundActions ? (
          <>
            {handleApproveRefundClick && (
              <Button
                type="button"
                variant="primary"
                disabled={loading}
                onClick={handleApproveRefundClick}
                className="w-[150px] bg-[#2D7565] text-white hover:bg-[#235d50]"
              >
                Approve Refund
              </Button>
            )}

            {handleRejectRefundClick && (
              <Button
                type="button"
                variant="danger"
                disabled={loading}
                onClick={handleRejectRefundClick}
                className="w-[150px]"
              >
                Reject Refund
              </Button>
            )}
          </>
        ) : (
          <>
            {onApprove && (
              <Button
                type="button"
                disabled={loading}
                onClick={onApprove}
                className="bg-2d7565 w-[146px]"
              >
                Approve Return
              </Button>
            )}

            {onReject && (
              <Button
                type="button"
                variant="danger"
                disabled={loading}
                onClick={onReject}
                className="w-[146px]"
              >
                Reject
              </Button>
            )}
          </>
        )}
      </div>

      {/* ── Lightbox Image Modal ── */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl max-h-[85vh] bg-white rounded-2xl p-2 overflow-hidden shadow-2xl"
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 bg-black/60 hover:bg-black text-white rounded-full flex items-center justify-center transition-colors"
            >
              <X size={18} />
            </button>
            <img
              src={selectedImage}
              alt="Evidence preview"
              className="max-h-[80vh] w-auto object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
