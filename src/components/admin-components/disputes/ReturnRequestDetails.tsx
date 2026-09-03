"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

export interface ReturnRequestDetailsProps {
  requestDate: string;
  itemReturnedDate?: string;
  returnType: string;
  returnMethod: string;
  deliveryStationAddress: string;
  reasonForReturn: string;
  moreDetails: string;
  evidenceImages: (string | { url?: string; image?: string; file_url?: string })[];

  onPartialRefund?: () => void;
  onRequestRefund?: () => void;
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
  onPartialRefund,
  onRequestRefund,
  onReject,
  loading = false,
}: ReturnRequestDetailsProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const getImageUrl = (item: any): string => {
    if (typeof item === "string") return item;
    return item?.url || item?.image || item?.file_url || "/placeholder.png";
  };

  return (
    <div className="space-y-6 pt-6 border-t border-gray-100">
      {/* ── Section Title & Item Returned Date ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h3 className="text-base font-MontserratBold text-[#161616]">
          Request Details
        </h3>
        {itemReturnedDate && (
          <span className="text-xs font-MontserratMedium text-gray-500">
            Item Returned: {itemReturnedDate}
          </span>
        )}
      </div>

      {/* ── 2-Column Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
        {/* Left Column */}
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-MontserratMedium text-gray-500 block">
              Request Date
            </label>
            <input
              type="text"
              readOnly
              value={requestDate || "—"}
              className="w-full h-12 px-4 text-xs font-MontserratMedium text-[#161616] bg-white border border-gray-200 rounded-xl focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-MontserratMedium text-gray-500 block">
              Return Type
            </label>
            <input
              type="text"
              readOnly
              value={returnType || "Return & Refund"}
              className="w-full h-12 px-4 text-xs font-MontserratMedium text-[#161616] bg-white border border-gray-200 rounded-xl focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-MontserratMedium text-gray-500 block">
              Return Method
            </label>
            <input
              type="text"
              readOnly
              value={returnMethod || "Drop-off"}
              className="w-full h-12 px-4 text-xs font-MontserratMedium text-[#161616] bg-white border border-gray-200 rounded-xl focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-MontserratMedium text-gray-500 block">
              Delivery Station Address
            </label>
            <input
              type="text"
              readOnly
              value={deliveryStationAddress || "—"}
              className="w-full h-12 px-4 text-xs font-MontserratMedium text-[#161616] bg-white border border-gray-200 rounded-xl focus:outline-none"
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-MontserratMedium text-gray-500 block">
              Reason for the Return
            </label>
            <input
              type="text"
              readOnly
              value={reasonForReturn || "—"}
              className="w-full h-12 px-4 text-xs font-MontserratMedium text-[#161616] bg-white border border-gray-200 rounded-xl focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-MontserratMedium text-gray-500 block">
              More Details
            </label>
            <textarea
              readOnly
              rows={4}
              value={moreDetails || "No additional notes provided."}
              className="w-full p-4 text-xs font-MontserratNormal text-gray-700 bg-white border border-gray-200 rounded-xl focus:outline-none resize-none leading-relaxed"
            />
          </div>

          {/* Evidence gallery */}
          <div className="space-y-2">
            <label className="text-xs font-MontserratMedium text-gray-500 block">
              Evidence (optional)
            </label>
            <div className="p-4 bg-white border border-gray-200 rounded-xl">
              {evidenceImages.length > 0 ? (
                <div className="flex flex-wrap gap-4">
                  {evidenceImages.map((img, idx) => {
                    const src = getImageUrl(img);
                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedImage(src)}
                        className="w-18 h-18 rounded-lg overflow-hidden border border-gray-200 cursor-pointer hover:opacity-90 hover:scale-105 transition-all shadow-sm relative"
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
      <div className="flex flex-wrap items-center justify-end gap-4 pt-6">
        {onPartialRefund && (
          <button
            type="button"
            disabled={loading}
            onClick={onPartialRefund}
            className="h-11 px-6 border border-[#FF6D5B] text-[#FF6D5B] text-xs font-MontserratSemiBold rounded-xl hover:bg-[#FF6D5B]/5 transition-colors disabled:opacity-50"
          >
            Partial Refund
          </button>
        )}

        {onRequestRefund && (
          <button
            type="button"
            disabled={loading}
            onClick={onRequestRefund}
            className="h-11 px-8 bg-[#FF6D5B] text-white text-xs font-MontserratSemiBold rounded-xl hover:bg-[#FF6D5B]/90 transition-colors disabled:opacity-50 shadow-sm"
          >
            Request Refund
          </button>
        )}

        {onReject && (
          <button
            type="button"
            disabled={loading}
            onClick={onReject}
            className="h-11 px-8 bg-[#C40000] text-white text-xs font-MontserratSemiBold rounded-xl hover:bg-[#A30000] transition-colors disabled:opacity-50 shadow-sm"
          >
            Reject
          </button>
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
