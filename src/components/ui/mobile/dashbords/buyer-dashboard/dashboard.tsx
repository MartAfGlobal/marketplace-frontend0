"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";

import profilePicture from "@/assets/icons/user-dashboard/profile-picture.png";
import NavBack from "@/assets/icons/navBacksmall.png";
import editPen from "@/assets/mobile/cards/editPen.png";
import Heart from "@/assets/mobile/cards/Heart.png";
import Plane from "@/assets/mobile/cards/plane.png";
import Coupon from "@/assets/mobile/cards/coupon.png";
import seller from "@/assets/mobile/cards/sellerIcon.png";
import card from "@/assets/mobile/cards/card.png";
import Address from "@/assets/mobile/cards/address.png";
import SettingsCategories from "../Settings-category";

export default function BuyerDashboard() {
  const router = useRouter();

  const imageVariants = {
    hiddenLeft: { x: -100, opacity: 0 },
    hiddenRight: { x: 100, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.6 } },
  };

  const dashboardRouter = [
    {
      name: "Wishlist",
      icon: Heart,
    },
    {
      name: "Orders",
      icon: Plane,
    },
    {
      name: "Coupons",
      icon: Coupon,
    },
    {
      name: "Sellers",
      icon: seller,
    },
    {
      name: "Cards",
      icon: card,
    },
    {
      name: "Addresses",
      icon: Address,
    },
  ];

  return (
    <div>
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
              Account
            </p>
          </button>
        </div>

        <div className="flex items-center justify-between ">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-300">
              <Image
                src={profilePicture}
                alt="Profile Image"
                width={64}
                height={64}
                className="rounded-full object-cover"
              />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-MontserratSemiBold">Frank Ubara</p>
              <p className="text-c12 font-MontserratNormal">
                frankubi2023@gmail.com
              </p>
            </div>
          </div>
          <button onClick={() => router.push("/dashboard/buyer/edit-user-profile")} className="rounded-full bg-ff715b w-c32 h-c32 flex items-center justify-center">
            <Image
              src={editPen}
              alt="edit profile"
              width={12.5}
              height={12.5}
            />
          </button>
        </div>

        <div className="w-full ">
          <div className="w-full space-y-4 overflow-hidden mt-c32 py-3">
            {Array.from({ length: Math.ceil(dashboardRouter.length / 3) }).map(
              (_, rowIdx) => (
                <div key={rowIdx} className="flex gap-6  w-full justify-center">
                  {dashboardRouter
                    .slice(rowIdx * 3, rowIdx * 3 + 3)
                    .map((item, i) => (
                      <motion.button
                        key={i}
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.2 }}
                        variants={imageVariants}
                        className="w-full max-w-24 h-20  flex gap-2 flex-col rounded-c4 border  border-ff715b justify-center pl-3 pr-1"
                      >
                        <Image
                          src={item.icon}
                          alt={item.name}
                          width={24}
                          height={24}
                        />
                        <span className=" text-sm text-left font-MontserratNormal">
                          {item.name}
                        </span>
                      </motion.button>
                    ))}
                </div>
              )
            )}
          </div>
        </div>
      </div>

      <div>
        <SettingsCategories />
      </div>
    </div>
  );
}
