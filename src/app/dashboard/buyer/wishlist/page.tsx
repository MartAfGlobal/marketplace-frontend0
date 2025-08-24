"use client";

import NavBack from "@/assets/icons/navBacksmall.png";
import Image from "next/image";
import { useRouter } from "next/navigation";

import SearchBtn from "@/assets/mobile/searchBtn.png"
import WishList from "@/components/ui/mobile/dashbords/buyer-dashboard/wishlists/wishlist";

export default function UserWishlist() {
  const router = useRouter();

  

  return (
    <div className="w-full">
      <div className="pb-7 pt-6  h-c32 px-6 flex justify-between items-center">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-4  md:mt-c32"
        >
          <Image
            src={NavBack}
            alt="<"
            width={9}
            height={16.5}
            className="brightness-20 w-2.25 h-[16.5px]"
          />
          <p className="font-MontserratSemiBold text-c16 text-161616">
           Wishlist
          </p>
        </button>
        <button>
            <Image src={SearchBtn} alt="Search" width={19.52} height={19.52} />
        </button>
      </div>
      <div>
        <WishList/>
      </div>
    </div>
  );
}
