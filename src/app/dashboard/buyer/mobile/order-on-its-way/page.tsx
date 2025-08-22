"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import NavBack from "@/assets/icons/navBacksmall.png";

export default function OrderOnTheWayPage() {
  const router = useRouter();

  return (
    <div className="px-6">
      <div className="pb-7 ">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-4 mt-3 md:mt-c32"
        >
          <Image
            src={NavBack}
            alt="<"
            width={9}
            height={16.5}
            className="brightness-20 w-2.25 h-[16.5px]"
          />
          <p className="font-MontserratSemiBold text-c16 text-161616">
            Payment methods
          </p>
        </button>
      </div>
      <div>
        <div>
            
        </div>
      </div>
    </div>
  );
}
