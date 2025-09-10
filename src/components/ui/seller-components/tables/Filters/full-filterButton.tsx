"use client";

import Image from "next/image";
import FilterIcon from "@/assets/Seller/filter.png";
import { useSelector } from "react-redux";

export default function FullFilterButton({
     
  onOpenFilter,
}: {
  onOpenFilter?: () => void;
}) 

{
  const isIncomplete = useSelector((state: any) => state.seller.isIncomplete);
  return (
    <div>
      {onOpenFilter && (
        <button
          onClick={onOpenFilter}  disabled={isIncomplete}   // ✅ attach handler here
          className={`flex circle-shadow text-c12 font-MontserratNormal text-ff715b bg-ffffff items-center w-full max-w-fit p-3 rounded-xl justify-center flex-shrink-0 gap-4.5 h-10 ${isIncomplete? "cursor-not-allowed" : "cursor-pointer"}`}
        >
          <span>Filter</span>
          <Image src={FilterIcon} alt="filter" width={13} height={12} />
        </button>
      )}
    </div>
  );
}
