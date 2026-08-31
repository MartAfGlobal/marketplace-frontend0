"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";

import DropIcon from "@/assets/headerIcon/CaretDown.svg";
import User from "@/assets/headerIcon/User.png";
import NigeriaFlag from "@/assets/headerIcon/Nigeria.svg";
import Message from "@/assets/Seller/message.png";
import Notification from "@/assets/Seller/Notification.png";
import Gear from "@/assets/icons/Gear.svg";
import LogOut from "@/assets/icons/ArrowBendDownRight.svg";

import { useLogout } from "@/utils/logout";
import LogoutConfirmModal from "@/components/ui/Modals/LogoutConfirmModal";

export default function EndNav() {
  const [userOpen, setUserOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const token = useSelector((state: any) => state.token?.token);
  const seller = useSelector((state: any) => state.seller.data);
  const dispatch = useDispatch();
  const logout = useLogout(dispatch);

  // Prioritise company logo; fall back to profile picture, then default icon
  const profilePicture = seller?.profile?.company_logo_url || seller?.profile?.profile_picture || User;

  return (
    <nav className="flex items-center gap-6">
      <div className="md:flex items-center gap-2 hidden ">
        <h1 className="text-ffffff font-MontserratMedium text-base">EN</h1>
        <Image src={NigeriaFlag} alt="NigeriaFlag" width={24} height={24} />
        <button>
          <Image src={DropIcon} alt="DropIcon" width={16.5} height={9} />
        </button>
      </div>
      <div className="md:flex items-center gap-3 hidden">
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
      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            onClick={() => setUserOpen((prev) => !prev)}
            className="flex items-center gap-2"
          >
            {token ? (
              <div className="h-7.5 w-7.5 border-1 border-fffff rounded-full flex justify-center items-center overflow-hidden">
                <Image src={profilePicture} alt="User" width={30} height={30} />
              </div>
            ) : (
              <>
                <Image src={User} alt="User" width={30} height={30} className="hidden md:block" />
                <Image src={User} alt="User" width={19.52} height={18.77} className="md:hidden" />
              </>
            )}
            <Image
              src={DropIcon}
              alt="Dropdown"
              width={16}
              height={16}
              className={`w-4 h-4 lg:block hidden ${userOpen ? "rotate-180" : "rotate-0"}`}
            />
          </button>

          <AnimatePresence>
            {userOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 w-38.75 top-12 py-3 font-normal text-c12 rounded-c8 z-40 custom-shadow bg-white border h-20.5"
              >
                <ul className="text-gray-700 flex flex-col gap-2.5">
                  <li>
                    {token ? (
                      <Link
                        href="/dashboard/seller/settings?section=Profile"
                        onClick={() => setUserOpen(false)}
                        className="gap-2.5 items-baseline-last text-ff715b px-4 h-6 flex"
                      >
                        <Image src={Gear} alt="gear" width={12} height={12} />
                        Settings
                      </Link>
                    ) : (
                      <Link
                        href="/auth/seller/login"
                        onClick={() => setUserOpen(false)}
                        className="block px-4 py-2 h-6"
                      >
                        Login
                      </Link>
                    )}
                  </li>
                  <li>
                    {token ? (
                      <button
                        onClick={() => { setUserOpen(false); setLogoutModalOpen(true); }}
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
        <div className="flex items-center gap-2 md:hidden">
          <h1 className="text-ffffff font-MontserratMedium text-sm md:text-base">EN</h1>
          <Image src={NigeriaFlag} alt="NigeriaFlag" width={20} height={20} />
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={logoutModalOpen}
        onConfirm={() => { setLogoutModalOpen(false); logout(); }}
        onCancel={() => setLogoutModalOpen(false)}
      />
    </nav>
  );
}
