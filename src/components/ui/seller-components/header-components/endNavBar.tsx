"use client";
import Link from "next/link";
import Image from "next/image";

import DropIcon from "@/assets/headerIcon/CaretDown.svg";
import User from "@/assets/headerIcon/User.png";
import NigeriaFlag from "@/assets/headerIcon/Nigeria.svg";
import Message from "@/assets/Seller/message.png";
import Notification from "@/assets/Seller/Notification.png";

export default function EndNav() {
  return (
    <nav className="flex items-center gap-6">
      <div className="flex items-center gap-2">
        <h1 className="text-ffffff font-MontserratMedium text-base">EN</h1>
        <Image src={NigeriaFlag} alt="NigeriaFlag" width={24} height={24}  />
        <button>
          <Image src={DropIcon} alt="DropIcon" width={16.5} height={9} />
        </button>
      </div>
      <div className="flex items-center gap-3">
        <button className="w-fit h-fit flex-shrink-0 relative text-ffffff">
          <Image src={Notification} alt="notification" width={24} height={24} />
          <span className="absolute h-4 flex items-center justify-center font-MontserratSemiBold text-c8 w-4 -top-2.25 z-10 flex-shrink-0 -right-0.25 rounded-full bg-ff715b">
            2
          </span>
        </button>
        <button className="w-fit h-fit flex-shrink-0 relative text-ffffff">
          <Image src={Message} alt="message" width={24} height={24} />
          <span className="absolute h-4 flex items-center justify-center font-MontserratSemiBold text-c8 w-4 -top-3 z-10 flex-shrink-0 -right-2 rounded-full bg-ca0202">
            2
          </span>
        </button>
      </div>
      <div>
        <Link href="/auth/login" className="flex items-center gap-2">
            <Image src={User} alt="User" width={30} height={30} />
            <Image src={DropIcon} alt="Dropdown" width={16} height={16} />
          </Link>
      </div>
    </nav>
  );
}
