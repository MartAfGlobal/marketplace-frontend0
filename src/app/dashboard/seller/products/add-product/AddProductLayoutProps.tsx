"use client";

import stackPlus from "@/assets/icons/StackPlus.svg";
import navBack from "@/assets/icons/navBacksmall.png";
import Image from "next/image";
import { useRouter } from "next/navigation";

export interface AddProductLayoutProps {
  children: React.ReactNode;
  stage: 1 | 2 | 3|4|5;
  title: string;
}

export default function AddProductLayout({
  children,
  stage,
  title
}: AddProductLayoutProps) {
  const router = useRouter();

  return (
    <main className="w-full pb-c56">
      {/* Header */}
      <div className="w-full">
        <button onClick={() => router.back()} className="flex items-center">
          <span className="h-6 w-6 flex items-center justify-center mr-4">
            <Image src={navBack} width={9} height={16.5} alt="Back" />
          </span>
          <span className="h-6 w-6 flex items-center justify-center mr-3">
            <Image src={stackPlus} width={20.25} height={21} alt="Add" />
          </span>
         { stage !==4 ? <span className="text-base font-MontserratSemiBold">
            Add New Product
          </span> :  <span className="text-base font-MontserratSemiBold">
            Update Product
          </span>}
        </button>
      </div>

      {/* Body */}
      <div className="w-full mt-c48 bg-ffffff p-c32 pb-c48 rounded-c12">
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
        <div className="text-c18 font-MontserratSemiBold">{title}</div>
        <div>{children}</div>
      </div>
    </main>
  );
}
