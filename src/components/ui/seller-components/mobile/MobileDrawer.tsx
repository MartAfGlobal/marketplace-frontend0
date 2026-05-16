"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  User, 
  Settings, 
  CreditCard, 
  FileText, 
  Bell, 
  Globe, 
  Lock, 
  Shield, 
  Info,
  LogOut 
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { useLogout } from "@/utils/logout";

import Logo from "@/assets/Logos/authLogo.svg";
import OverviewIcon from "@/assets/Seller/overview.png";
import ProductIcon from "@/assets/Seller/product.png";
import OrderIcon from "@/assets/Seller/orders.png";
import FinanceIcon from "@/assets/Seller/finance.png";
import CustomerIcon from "@/assets/Seller/customers.png";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { id: "overview", label: "Overview", icon: OverviewIcon, href: "/dashboard/seller/overview" },
  { id: "products", label: "Products", icon: ProductIcon, href: "/dashboard/seller/products" },
  { id: "orders", label: "Orders", icon: OrderIcon, href: "/dashboard/seller/orders" },
  { id: "finance", label: "Finance", icon: FinanceIcon, href: "/dashboard/seller/finance" },
  { id: "customers", label: "Customers", icon: CustomerIcon, href: "/dashboard/seller/customers" },
];

const settingsItems = [
  { label: "Profile", Icon: User, href: "/dashboard/seller/settings?section=Profile" },
  { label: "Account", Icon: Settings, href: "/dashboard/seller/settings?section=Account" },
  { label: "Payout", Icon: CreditCard, href: "/dashboard/seller/settings?section=Payout" },
  { label: "Documents", Icon: FileText, href: "/dashboard/seller/settings?section=Documents" },
  { label: "Notifications", Icon: Bell, href: "/dashboard/seller/settings?section=Notifications" },
  { label: "Language & regions", Icon: Globe, href: "/dashboard/seller/settings?section=Language" },
  { label: "Password & security", Icon: Lock, href: "/dashboard/seller/settings?section=Password" },
  { label: "Privacy policy", Icon: Shield, href: "/dashboard/seller/settings?section=Privacy" },
  { label: "Legal information", Icon: Info, href: "/dashboard/seller/settings?section=Legal" },
];

function LogoutButton({ logout, onClose }: { logout: () => void; onClose: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={() => {
        logout();
        onClose();
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="w-full flex items-center justify-center gap-3 p-3 rounded-xl font-MontserratMedium transition-colors"
      style={{
        backgroundColor: hovered ? "rgba(255,113,91,0.08)" : "transparent",
        cursor: "pointer",
      }}
    >
      
      <span className="text-sm text-ff715b font-MontserratSemiBold">
        Log out
      </span>
    </button>
  );
}

export default function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const logout = useLogout(dispatch);
  const seller = useSelector((state: RootState) => state.seller.data);
  const token = useSelector((state: RootState) => state.token.token);

    const profile = seller?.profile;

  // const profilePicture = seller?.profile?.profile_picture || null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[60] lg:hidden"
          />

          {/* Drawer Content */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-[85%] max-w-[320px] bg-white z-[70] lg:hidden overflow-y-auto"
          >
            <div className="flex flex-col h-full p-6 md:p-8">
              {/* Header */}
              <div className="flex justify-between items-center mb-11">
                <Link href="/" className="flex items-center  gap-2">
                  <Image src={Logo} alt="Logo" width={39.27} height={32} />
                </Link>
                <button onClick={onClose} className="p-2 -mr-2">
                  <X size={38} className="text-black" />
                </button>
              </div>

              {/* User Info */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 border border-gray-100">
                  {/* {profile? (
                    <Image src={profile.} alt="User" width={48} height={48} className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-6a0dad text-white text-lg font-bold">
                      {seller?.company_name?.charAt(0) || "S"}
                    </div>
                  )} */}
                </div>
                <div>
                  <h3 className="font-MontserratBold text-sm text-[#161616]">
                    {/* {seller?.company_name || "Ankara shoes LTD"} */}
                  </h3>
                  <p className="text-[10px] text-gray-500 font-MontserratMedium">
                    {/* {seller?.email || "frankalex022@gmail.com"} */}
                  </p>
                </div>
              </div>

              {/* Navigation Menu */}
              <div className="mb-8">
                <h4 className="text-c20 font-MontserratSemiBold text-000000  mb-6">Menu</h4>
                <div className="space-y-1">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        onClick={onClose}
                        className={`flex items-center gap-4 py-3 rounded-xl transition-colors ${
                          isActive
                            ? "font-MontserratSemiBold"
                            : "font-MontserratNormal"
                        }`}
                        style={{
                          backgroundColor: isActive ? "rgba(106,13,173,0.08)" : "transparent",
                        }}
                      >
                        <Image
                          src={item.icon}
                          alt={item.label}
                          width={20}
                          height={20}
                          style={{
                            filter: isActive
                              ? "invert(9%) sepia(96%) saturate(7484%) hue-rotate(276deg) brightness(70%) contrast(120%)"
                              : "brightness(0)",
                          }}
                        />
                        <span
                          className={`${ isActive ? "text-6a0dad font-MontserratSemiBold text-base" : "text-000000 font-MontserratNormal text-sm"}`}
                        
                        >
                          {item.label}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Settings Section */}
              <div className="pb-14 md:mb-8">
                <h4 className="text-c20 font-MontserratSemiBold text-000000  mb-6">Settings</h4>
                <div className="space-y-1">
                  {settingsItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    const iconColor = isActive ? "#6A0DAD" : "#000000";
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={onClose}
                        className={`flex items-center gap-4 py-2 rounded-xl transition-colors ${
                          isActive ? "font-MontserratSemiBold" : "font-MontserratMedium"
                        }`}
                        style={{
                          backgroundColor: isActive ? "rgba(106,13,173,0.08)" : "transparent",
                        }}
                      >
                        <item.Icon size={18} color={iconColor} />
                        <span
                          className="text-xs"
                          style={{ color: isActive ? "#6A0DAD" : "#000000" }}
                        >
                          {item.label}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Logout Button */}
              <div className="flex justify-center fixed bottom-0 w-full left-0 h-13 bg-ffffff  " >
                <LogoutButton logout={logout} onClose={onClose} />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
