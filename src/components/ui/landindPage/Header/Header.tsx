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
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import OtherSearchInput from "../../others/Search";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import DropdownModal from "../../mobile/modal/header-drop-modal";
import { useEffect, useState } from "react";
import CartButton from "../../cart/cartButton";
import Gear from "@/assets/icons/Gear.svg";
import LogOut from "@/assets/icons/ArrowBendDownRight.svg";

import { useSearchParams } from "next/navigation";
import { useLogout } from "@/utils/logout";
import AuthModal from "../../mobile/auth/sign-up";

export default function Header() {

  const [showModal, setShowModal] = useState(false);
  const pathname = usePathname();
  const changeSearch = pathname?.startsWith("/others") ?? false;
  const searchParams = useSearchParams();
  const showLogin = searchParams.get("showLogin");
  const token = useSelector((state: RootState) => state.token?.token);
  const buyer = useSelector((state: any) => state.buyer.BuyerData);
  const dispatch = useDispatch();
  const logout = useLogout(dispatch);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authStep, setAuthStep] = useState<
    "signup" | "verify" | "signin" | "forgot" | "resetVerify"
  >("signup");

  const [userOpen, setUserOpen] = useState(false);

  useEffect(() => {
    if (showLogin === "true") {
      setShowModal(true); // auto open login modal
    }
  }, [showLogin]);

  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="w-full relative">
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
              <Image src={DropIcon} alt="DropIcon" width={16.5} height={9} />
            </button>
          </div>

          {cartCount > 0 && <CartButton />}

          <button
            onClick={() => setUserOpen((prev) => !prev)}
            className="flex items-center gap-2"
          >
            <Image src={User} alt="User" width={30} height={30} />

            {token && (
              <span className="text-base font-MontserratSemiBold text-ffffff">
                Hi, {buyer.first_name || "not set"}
              </span>
            )}
            <Image
              src={DropIcon}
              alt="Dropdown"
              width={16}
              height={16}
              className={`w-4 h-4 ${userOpen ? "rotate-180" : "rotate-0"}`}
            />
          </button>
        </div>
      </motion.header>

      {/* mobile screen */}
      <div className="w-full md:hidden">
        <DropdownModal
          open={openDropdown}
          onClose={() => setOpenDropdown(false)}
          onOpenAuth={(step) => {
            setAuthStep(step);
            setAuthOpen(true);
            setOpenDropdown(false);
          }}
        />
        <AuthModal
          open={authOpen || showModal}
          onClose={() => {
            setAuthOpen(false);
            setShowModal(false);
          }}
          defaultStep={
            authOpen ? authStep : showLogin === "true" ? "signin" : "signup"
          }
        />
      </div>
      <motion.header
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full bg-[#6A0DAD] md:hidden h-[80px] pl-4 pr-6 flex items-center justify-between"
      >
        <div className="flex gap-3 items-center">
          <button
            onClick={() => setOpenDropdown(true)}
            className=" px-1 py-1.75"
          >
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

          <div className="flex items-center gap-2">
            <Image src={User} alt="User" width={19.52} height={18.77} />
          </div>

          <div className="flex items-center gap-2">
            <h1 className="text-ffffff font-MontserratMedium text-c14">EN</h1>
            <Image src={NigeriaFlag} alt="NigeriaFlag" width={20} height={20} />
          </div>
        </div>
      </motion.header>
      {/* <div className="w-full px-3.75">
        <div className="w-full px-3.75">
          <AuthModal
            open={showModal}
            onClose={() => setShowModal(false)}
            defaultStep={showLogin === "true" ? "signin" : "signup"} // 👈 auto decide
          />
        </div>
      </div> */}
      <AnimatePresence>
        {userOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-12.75 w-38.75 top-15.25 py-3 font-normal text-c12 rounded-c8 z-40 custom-shadow bg-white border h-20.5 "
          >
            <ul className="  text-gray-700 flex flex-col gap-2.5">
              <li>
                {token ? (
                  <Link
                    href="/dashboard/buyer"
                    className="gap-2.5 items-baseline-last text-ff715b px-4 h-6 flex "
                  >
                    <Image src={Gear} alt="gear" width={12} height={12} />
                    Settings
                  </Link>
                ) : (
                  <Link href="/auth/login" className="block px-4 py-2  h-6">
                    Login
                  </Link>
                )}
              </li>
              <li>
                {token ? (
                  <button
                    onClick={logout}
                    className="gap-2.5 items-baseline-last text-000000/50 px-4 py-2 flex"
                  >
                    <Image src={LogOut} alt="gear" width={12} height={12} />
                    Log out
                  </button>
                ) : (
                  <Link
                    href="/auth/register"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Sign Up
                  </Link>
                )}
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
