"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useHttp } from "@/hooks/use-http";
import { toast } from "sonner";

interface ProductVariantsProps {
  variations: any[];
}

export default function ProductVariants({ variations }: ProductVariantsProps) {
  const token = useSelector((state: RootState) => state.token?.token);
  const { sendHttpRequest } = useHttp();

  const [stockMap, setStockMap] = useState<Record<string, number>>({});
  const [loadingVariationId, setLoadingVariationId] = useState<string | null>(null);

  useEffect(() => {
    if (variations && variations.length > 0) {
      const initialMap: Record<string, number> = {};
      variations.forEach((v, idx) => {
        const vId = v.id ?? `variant-${idx}`;
        initialMap[vId] = Number(v.stock ?? v.inventory ?? v.quantity ?? 0);
      });
      setStockMap(initialMap);
    }
  }, [variations]);

  if (!variations || variations.length === 0) return null;

  const handleAdjustStock = async (variationId: string, adjustment: number) => {
    if (!variationId || !token) {
      if (!token) toast.error("Please login to adjust inventory");
      return;
    }

    const currentStock = stockMap[variationId] ?? 0;
    const newStock = Math.max(0, currentStock + adjustment);

    if (adjustment < 0 && currentStock <= 0) return;

    // Optimistically update stock count in UI
    setStockMap((prev) => ({
      ...prev,
      [variationId]: newStock,
    }));
    setLoadingVariationId(variationId);

    const payload = {
      adjustment,
      reason: adjustment > 0 ? "Restock from supplier" : "Stock deduction",
    };

    try {
      await sendHttpRequest({
        requestConfig: {
          url: `/products/manufacturer/variations/${variationId}/adjust-stock/`,
          method: "POST",
          body: payload,
          token,
          isAuth: true,
        },
        successRes: (data: any) => {
          if (data?.stock !== undefined || data?.inventory !== undefined) {
            const updated = Number(data.stock ?? data.inventory);
            setStockMap((prev) => ({ ...prev, [variationId]: updated }));
          }
          toast.success(
            adjustment > 0
              ? `Stock increased to ${newStock}`
              : `Stock decreased to ${newStock}`
          );
        },
        errorRes: (err: any) => {
          // Revert optimistic update
          setStockMap((prev) => ({
            ...prev,
            [variationId]: currentStock,
          }));
          toast.error(err?.message || "Failed to adjust stock. Please try again.");
        },
      });
    } catch (err: any) {
      // Revert optimistic update
      setStockMap((prev) => ({
        ...prev,
        [variationId]: currentStock,
      }));
      toast.error("Failed to adjust stock.");
    } finally {
      setLoadingVariationId(null);
    }
  };

  return (
    <div className="w-full">
      <p className="hidden lg:block text-c18 font-MontserratSemiBold mt-c32 mb-6">Variants</p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-8 lg:gap-x-16 lg:gap-y-12 lg:mt-0">
        {variations.map((variant, index) => {
          const vId = variant.id ?? `variant-${index}`;
          const currentStock = stockMap[vId] ?? Number(variant.stock || variant.inventory || variant.quantity || 0);
          const isLoading = loadingVariationId === vId;

          return (
            <div key={vId} className="pb-8 border-b border-gray-100 last:border-0">
              {/* --- MOBILE VIEW --- */}
              <div className="flex flex-col gap-6 lg:hidden">
                {/* Top Section: Image and Core Details */}
                <div className="flex gap-4">
                  <div className="w-24 h-24 flex-shrink-0 relative">
                    <Image
                      src={variant.main_image_url || variant.images?.[0]?.url || "/placeholder.png"}
                      alt={variant.name || `Variant ${index + 1}`}
                      fill
                      unoptimized
                      className="object-cover rounded-md"
                    />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start gap-2">
                      <div className="space-y-1">
                        <h1 className="text-sm text-000000/68 font-MontserratNormal">Variant name</h1>
                        <p className="text-sm font-MontserratNormal text-000000">{variant.name}</p>
                      </div>
                      <div className="space-y-1 text-right">
                        <h1 className="text-sm text-000000/68 font-MontserratNormal">Quantity</h1>
                        <div className="flex items-center justify-end gap-2 pt-0.5">
                          <button
                            type="button"
                            disabled={currentStock <= 0 || isLoading}
                            onClick={() => handleAdjustStock(vId, -1)}
                            className="w-6 h-6 rounded-full flex items-center justify-center border border-[#ff715b] text-[#ff715b] hover:bg-[#ff715b] hover:text-white transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-xs font-MontserratSemiBold"
                          >
                            -
                          </button>
                          <span className="min-w-[18px] text-center text-sm font-MontserratSemiBold text-000000">
                            {currentStock}
                          </span>
                          <button
                            type="button"
                            disabled={isLoading}
                            onClick={() => handleAdjustStock(vId, 1)}
                            className="w-6 h-6 rounded-full flex items-center justify-center bg-[#ff715b] text-white hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-xs font-MontserratSemiBold"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 space-y-1">
                      <h1 className="text-sm text-000000/68 font-MontserratNormal">Price</h1>
                      <p className="text-sm font-MontserratSemiBold text-gray-900">₦{Number(variant.base_price || variant.price || 0).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Bottom Section: Attributes Grid */}
                {variant.attribute_summary && Object.keys(variant.attribute_summary).length > 0 && (
                  <div className="flex gap-4 flex-wrap">
                    {Object.entries(variant.attribute_summary).map(([attribute, value]) => (
                      <div key={attribute} className="flex gap-4 sm:gap-6">
                        <div className="flex flex-col gap-1 min-w-[60px]">
                          <p className="text-[10px] sm:text-xs font-MontserratSemiBold text-000000">Attribute</p>
                          <span className="text-xs sm:text-sm text-000000 capitalize">{attribute}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <p className="text-[10px] sm:text-xs font-MontserratSemiBold text-000000">Value</p>
                          <span className="text-xs sm:text-sm text-000000 capitalize">{String(value)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* --- DESKTOP VIEW --- */}
              <div className="hidden lg:flex flex-row gap-6">
                {/* Left Column: Image and details stacked vertically */}
                <div className="flex flex-col gap-4 w-[120px] flex-shrink-0">
                  <div className="w-[120px] h-[120px] relative">
                    <Image
                      src={variant.main_image_url || variant.images?.[0]?.url || "/placeholder.png"}
                      alt={variant.name || `Variant ${index + 1}`}
                      fill
                      unoptimized
                      className="object-cover rounded-md"
                    />
                  </div>
                  
                  <div className="space-y-1 mt-2">
                    <h1 className="text-xs text-gray-500 font-MontserratNormal">Variant name</h1>
                    <p className="text-sm font-MontserratMedium text-gray-800">{variant.name}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <h1 className="text-xs text-gray-500 font-MontserratNormal">Quantity</h1>
                    <div className="flex items-center gap-2 pt-0.5">
                      <button
                        type="button"
                        disabled={currentStock <= 0 || isLoading}
                        onClick={() => handleAdjustStock(vId, -1)}
                        className="w-6 h-6 rounded-full flex items-center justify-center border border-[#ff715b] text-[#ff715b] hover:bg-[#ff715b] hover:text-white transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-xs font-MontserratSemiBold"
                      >
                        -
                      </button>
                      <span className="min-w-[18px] text-center text-sm font-MontserratSemiBold text-gray-800">
                        {currentStock}
                      </span>
                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() => handleAdjustStock(vId, 1)}
                        className="w-6 h-6 rounded-full flex items-center justify-center bg-[#ff715b] text-white hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-xs font-MontserratSemiBold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <h1 className="text-xs text-gray-500 font-MontserratNormal">Price</h1>
                    <p className="text-sm font-MontserratSemiBold text-gray-900">₦{Number(variant.base_price || variant.price || 0).toLocaleString()}</p>
                  </div>
                </div>

                {/* Right Column: Attributes Grid */}
                <div className="flex-1">
                  {variant.attribute_summary && Object.keys(variant.attribute_summary).length > 0 && (
                    <div className="flex gap-x-8 gap-y-6 flex-wrap">
                      {Object.entries(variant.attribute_summary).map(([attribute, value]) => (
                        <div key={attribute} className="flex gap-4">
                          <div className="flex flex-col gap-1 min-w-[60px]">
                            <p className="text-[10px] font-MontserratSemiBold text-gray-900">Attribute</p>
                            <span className="text-sm text-gray-600 capitalize">{attribute}</span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <p className="text-[10px] font-MontserratSemiBold text-gray-900">Value</p>
                            <span className="text-sm text-gray-600 capitalize">{String(value)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
