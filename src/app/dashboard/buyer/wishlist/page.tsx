"use client";

import NavBack from "@/assets/icons/navBacksmall.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import WnavRight from "@/assets/icons/user-dashboard/CaretRight.svg";
import SearchBtn from "@/assets/mobile/searchBtn.png";
import WishList from "@/components/ui/mobile/dashbords/buyer-dashboard/wishlists/wishlist";
import { motion } from "framer-motion";

export default function UserWishlist() {
  const router = useRouter();

  return (
    <div className="w-full md:px-15">
      <div className="pb-7 md:mb-c32 pt-6  h-c32 px-6 md:px-0 flex justify-between items-center ">
        <div>
          <div>
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className=" hidden z-40 md:flex items-center md w-full mt-48"
              style={{ top: "4rem" }}
            >
              <nav
                aria-label="breadcrumb"
                className="flex h-c32 w-full items-center gap-2"
              >
                <Link
                  href="/"
                  className="opacity-30 font-MontserratMedium text-c12"
                >
                  Home
                </Link>
                <Image src={WnavRight} alt=">" width={16} height={16} />
                <Link
                  href="/dashboard/buyer"
                  className="opacity-30 font-MontserratMedium text-c12"
                >
                  Account
                </Link>
                <Image src={WnavRight} alt=">" width={16} height={16} />
                <span className="font-MontserratSemiBold text-c12 text-1a1a1a">
                  Wishlist
                </span>
              </nav>
            </motion.div>
          </div>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-4  md:mt-c32 mb-30"
          >
            <Image
              src={NavBack}
              alt="<"
              width={9}
              height={16.5}
              className="brightness-20 w-2.25 h-[16.5px]"
            />
            <p className="font-MontserratSemiBold  text-c16 text-161616">
              Wishlist
            </p>
          </button>
        </div>
        <button className="md:hidden">
          <Image src={SearchBtn} alt="Search" width={19.52} height={19.52} />
        </button>
      </div>
      <div >
        <WishList />
      </div>
    </div>
  );
}
