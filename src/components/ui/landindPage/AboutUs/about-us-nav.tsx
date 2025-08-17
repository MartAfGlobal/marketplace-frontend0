"use client";
import Image from "next/image";
import DropdownBtn from "@/assets/icons/dropDown.svg";
import Link from "next/link";

export default function AboutNav() {
  return (
    <div className="h-c64 w-full flex items-center justify-between px-c60">
      <div className="flex gap-c64">
        <div className="flex gap-c32 items-center">
          <button className="flex items-center gap-2.5">
            <p className="text-c18 font-MontserratSemiBold text-161616">
              All categories
            </p>
            <Image
              src={DropdownBtn}
              alt="DropdownBtn"
              width={18}
              height={10.91}
            />
          </button>
          <button className="flex items-center gap-2.5">
            <p className="text-c18 font-MontserratSemiBold text-161616">
              Showing products in all countries
            </p>
            <Image
              src={DropdownBtn}
              alt="DropdownBtn"
              width={18}
              height={10.91}
            />
          </button>
        </div>
        <div className="flex items-center gap-c32">
          <p className="font-MontserratSemiBold text-c18 text-161616">
            Top Brands
          </p>
          <p className="font-MontserratSemiBold text-c18 text-161616">
            Best Sellers
          </p>
          <p className="font-MontserratBold text-c18 text-161616">Brands</p>
        </div>
      </div>
      <div className="relative group inline-block">
  <Link
    href="/auth/login"
    className="text-c18 font-MontserratBold text-6a0dad relative after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:h-[2px] after:w-0 after:bg-6a0dad after:transition-all after:duration-300 group-hover:after:w-full"
  >
    Become a Seller
  </Link>
</div>

    </div>
  );
}
