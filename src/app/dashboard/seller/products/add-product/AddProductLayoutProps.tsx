"use client";

import stackPlus from "@/assets/icons/StackPlus.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";

export interface AddProductLayoutProps {
  children: React.ReactNode;
  stage: 1 | 2 | 3|4|5;
  title: string;
}

import { SellerMobileHeader } from "@/components/ui/seller-components/header-components/SellerMobileHeader";

export default function AddProductLayout({
  children,
  stage,
  title
}: AddProductLayoutProps) {
  const router = useRouter();

  return (
    <main className="w-full pb-c56 py-6 lg:py-0">
      {/* Header */}
      <SellerMobileHeader 
        title={stage !== 4 ? "Add New Product" : "Update Product"} 
      />

      {/* Body */}
      <div className="w-full mt-6 lg:mt-c48 bg-ffffff lg:p-c32 py-8 px-6 md:pb-c48 rounded-c12">
        {/* Progress Indicator */}
        { stage !==4 && stage !==5 && <div className="flex  w-full items-center mb-c48">
          <div className="flex justify-center items-center w-full max-w-60.75 h-c32 gap-3">

            {/* Step 1 */}
            <div
              className={`w-c32 h-c32 rounded-full flex items-center justify-center
              ${stage === 1 ? "bg-ff715b text-ffffff" : "border border-ff715b text-ff715b"}`}
            >
              1
            </div>

            <div className="w-full max-w-11.5 border-1 border-000000/12" />

            {/* Step 2 */}
            <div
              className={`w-c32 h-c32 rounded-full flex items-center justify-center
              ${stage === 2 ? "bg-ff715b text-ffffff" : "border border-ff715b text-ff715b"}`}
            >
              2
            </div>

            <div className="w-full max-w-11.5 border-1 border-000000/12" />

            {/* Step 3 */}
            <div
              className={`w-c32 h-c32 rounded-full flex items-center justify-center
              ${stage === 3 ? "bg-ff715b text-ffffff" : "border border-ff715b text-ff715b"}`}
            >
              3
            </div>
          </div>
        </div>}
        <div className="md:text-c18 text-c16 font-MontserratSemiBold">{title}</div>
        <div>{children}</div>
      </div>
    </main>
  );
}
