"use client";

import Image from "next/image";
import Logo from "@/assets/images/logo.svg";
import handburger from "@/assets/headerIcon/mobileHandB.svg";
import Link from "next/link";
import SearchInput from "@/components/ui/landindPage/Header/SearchInput";
import NigeriaFlag from "@/assets/headerIcon/Nigeria.svg";
import DropIcon from "@/assets/headerIcon/CaretDown.svg";
import User from "@/assets/headerIcon/User.png";
import Cart from "@/assets/headerIcon/cart.svg";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import OtherSearchInput from "../../others/Search";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import DropdownModal from "../../mobile/modal/header-drop-modal";
import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  const pathname = usePathname();
  const changeSearch = pathname?.startsWith("/others") ?? false;

  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="w-full">
      <motion.header
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full bg-[#6A0DAD] hidden h-[80px] px-[56px] md:flex items-center justify-between"
      >
        <Link href="/" className="flex items-center gap-3">
          <Image src={Logo} alt="Logo" width={40} height={33} />
          <h1 className="font-MontserratBold text-2xl text-ffffff">MARTAF</h1>
        </Link>
        <div></div>
        {changeSearch ? <OtherSearchInput /> : <SearchInput />}
        <div className="flex gap-6 items-center">
          <div className="flex items-center gap-2">
            <h1 className="text-ffffff font-MontserratMedium text-[18px]">
              EN
            </h1>
            <Image src={NigeriaFlag} alt="NigeriaFlag" width={24} height={24} />
            <button>
              <Image src={DropIcon} alt="DropIcon" />
            </button>
          </div>

          {cartCount > 0 && (
            <div className="w-fit h-fit relative">
              <Link href="/cart">
                <button className="h-[25.32px] w-[25.32px] ">
                  <Image
                    src={Cart}
                    alt="Cart"
                    width={25.32}
                    height={25.32}
                    className="object-cover"
                  />
                </button>
                <span className="bg-[#CA0202] text-ffffff absolute -top-2 -right-2 flex items-center justify-center w-4 h-4 rounded-full font-MontserratSemiBold text-[8px]">
                  {cartCount}
                </span>
              </Link>
            </div>
          )}

          <Link href="/auth/login" className="flex items-center gap-2">
            <Image src={User} alt="User" width={30} height={30} />
            <Image src={DropIcon} alt="Dropdown" width={16} height={16} />
          </Link>
        </div>
      </motion.header>

      {/* mobile screen */}
      <div className="w-full md:hidden">
         <DropdownModal open={open} onClose={() => setOpen(false)} />
      </div>
      <motion.header
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full bg-[#6A0DAD] md:hidden h-[80px] pl-4 pr-6 flex items-center justify-between"
      >
       
        <div className="flex gap-3 items-center">
          <button onClick={() => setOpen(true)} className=" px-1 py-1.75">
            <Image src={handburger} alt="categories" width={24} height={18} />
          </button>

          <Link href="/" className="flex items-center gap-2">
            <Image src={Logo} alt="Logo" width={27.04} height={22.03} />
            <h1 className="font-MontserratBold text-c16 text-ffffff">MARTAF</h1>
          </Link>
        </div>

        <div className="flex gap-3 items-center">
          {cartCount > 0 && (
            <div className="w-fit h-fit relative">
              <Link href="/cart">
                <button className="h-[25.32px] w-[25.32px] ">
                  <Image
                    src={Cart}
                    alt="Cart"
                    width={20.25}
                    height={20.25}
                    className="object-cover"
                  />
                </button>
                <span className="bg-[#CA0202] text-ffffff absolute -top-2 -right-2 flex items-center justify-center w-4 h-4 rounded-full font-MontserratSemiBold text-[8px]">
                  {cartCount}
                </span>
              </Link>
            </div>
          )}

          <Link href="/auth/login" className="flex items-center gap-2">
            <Image src={User} alt="User" width={19.52} height={18.77} />
          </Link>

          <button className="flex items-center gap-2">
            <h1 className="text-ffffff font-MontserratMedium text-c14">
              EN
            </h1>
            <Image src={NigeriaFlag} alt="NigeriaFlag" width={20} height={20} />
          </button>
        </div>
      </motion.header>
    </div>
  );
}
