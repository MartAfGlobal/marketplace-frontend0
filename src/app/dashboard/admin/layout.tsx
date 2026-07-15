"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { StaticImageData } from "next/image";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Headset,
  FileText,
  UserSquare2,
  ChevronDown,
  Search,
  Bell,
  Menu,
  X,
  User,
  LogOut,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { useLogout } from "@/utils/logout";
import Image from "next/image";
import LogoPurple from "@/assets/images/logo-purple.svg";
import SearchInput from "@/components/ui/landindPage/Header/SearchInput";
import DefaultNofication from "@/assets/icons/bellNotification.svg";
import UserIcon from "@/assets/icons/userIcon.svg";
import BuyerIcon from "@/assets/admin/activeBuyerIcon.svg";
import InactiveBuyerIcon from "@/assets/admin/inActiveBuyerIcon.svg";
import activeSellerIcon from "@/assets/admin/activeSellerIcon.svg";
import SellerIcon from "@/assets/icons/sellerIcon.svg";
import OverviewIcon from "@/assets/icons/admin/overviewIcon.svg";
import ActiveOverviewIcon from "@/assets/icons/admin/activeOverviewIcon.svg";
import UsersIcon from "@/assets/icons/admin/usersIcon.svg";
import VerificationsIcon from "@/assets/icons/admin/verificatioIcon.svg";
import ActiveVerificationsIcon from "@/assets/admin/activeKYC.svg";
import ProductsIcon from "@/assets/icons/admin/products.svg";
import OrdersIcon from "@/assets/icons/admin/orders.svg";
import RefundIcon from "@/assets/icons/refund.svg";
import SupportIcon from "@/assets/icons/admin/supportIcon.svg";
import ReportsIcon from "@/assets/icons/admin/ReportIcon.svg";
import StaffIcon from "@/assets/icons/admin/staffIcon.svg";
import ProductBoxIcon from "@/assets/icons/productBox.svg";
import ProductListin from "@/assets/admin/productlistings.svg";
import Categories from "@/assets/admin/Prodcategories.svg";
import ActiveCategories from "@/assets/admin/activeProductCategory.svg";
import { LayoutGrid } from "lucide-react";

interface SidebarItem {
  name: string;
  activeIcon?: React.ComponentType<any> | StaticImageData;
  icon: React.ComponentType<any> | StaticImageData;
  path: string;
  subItems?: {
    name: string;
    path: string;
    activeIcon?: React.ComponentType<any> | StaticImageData;
    icon?: React.ComponentType<any> | StaticImageData;
  }[];
}

const isIconComponent = (
  icon: React.ComponentType<any> | StaticImageData,
): icon is React.ComponentType<any> => typeof icon === "function";

const renderSidebarIcon = (
  icon: React.ComponentType<any> | StaticImageData,
  alt: string,
  className?: string,
  width = 18,
  height = 18,
) => {
  if (isIconComponent(icon)) {
    const Icon = icon;
    return <Icon className={className} />;
  }

  return (
    <Image
      src={icon}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  );
};

type AdminRole = "Super Admin" | "Operational" | "IT" | "Support" | "Finance";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const logout = useLogout(dispatch);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<
    Record<string, boolean | undefined>
  >({});

  // Automatically detect the role based on the route path
  const getRoleFromPath = (path: string): AdminRole => {
    if (path.includes("/dashboard/admin/operational")) return "Operational";
    if (path.includes("/dashboard/admin/it")) return "IT";
    if (path.includes("/dashboard/admin/support-department")) return "Support";
    if (path.includes("/dashboard/admin/finance")) return "Finance";
    return "Super Admin";
  };

  const currentRole = getRoleFromPath(pathname);

  // Define sidebar navigation configuration for each role
  const roleNavigation: Record<AdminRole, string[]> = {
    "Super Admin": [
      "Overview",
      "Users",
      "Verifications",
      "Products",
      "Orders",
      "Support",
      "Reports",
      "Staff",
    ],
    Operational: ["Overview", "Users", "Verifications", "Products", "Orders"],
    IT: ["Overview", "Support", "Staff"],
    Support: ["Overview", "Users", "Support"],
    Finance: ["Overview", "Orders", "Reports"],
  };

  const sidebarItems: SidebarItem[] = [
    {
      name: "Overview",
      icon: OverviewIcon,
      activeIcon: ActiveOverviewIcon,
      path: "/dashboard/admin",
    },
    {
      name: "Users",
      icon: UsersIcon,
      activeIcon: UsersIcon,
      path: "/dashboard/admin/users",
      subItems: [
        {
          name: "Buyers",
          path: "/dashboard/admin/users?type=buyers",
          icon: InactiveBuyerIcon,
          activeIcon: BuyerIcon,
        },

        {
          name: "Sellers",
          path: "/dashboard/admin/users?type=sellers",
          icon: SellerIcon,
          activeIcon: activeSellerIcon,
        },
      ],
    },
    {
      name: "Verifications",
      icon: VerificationsIcon,
      activeIcon: ActiveVerificationsIcon,
      path: "/dashboard/admin/verifications",
    },
    {
      name: "Products",
      icon: ProductsIcon,
      path: "/dashboard/admin/products",
      subItems: [
        {
          name: "Product Listings",
          path: "/dashboard/admin/products?type=listings",
          icon: InactiveBuyerIcon,
          activeIcon: BuyerIcon,
        },
        {
          name: "Categories",
          path: "/dashboard/admin/categories",
          icon: Categories,
          activeIcon: ActiveCategories,
        },
      ],
    },
    {
      name: "Orders",
      icon: OrdersIcon,
      path: "/dashboard/admin/orders",
      subItems: [
        {
          name: "All Orders",
          path: "/dashboard/admin/orders?type=all-orders",
          icon: InactiveBuyerIcon,
          activeIcon: BuyerIcon,
        },
        {
          name: "Refund & Dispute",
          path: "/dashboard/admin/orders?type=refund-dispute",
          icon: Categories,
          activeIcon: ActiveCategories,
        },
      ],
    },
    { name: "Support", icon: SupportIcon, path: "/dashboard/admin/support" },
    { name: "Reports", icon: ReportsIcon, path: "/dashboard/admin/reports" },
    { name: "Staff", icon: StaffIcon, path: "/dashboard/admin/staff" },
  ];

  // Filter sidebar items dynamically based on selected role
  const activeRoleItems = roleNavigation[currentRole] || [];
  const filteredSidebarItems = sidebarItems.filter((item) =>
    activeRoleItems.includes(item.name),
  );

  const toggleExpand = (name: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const normalizePath = (path: string) => path.split("?")[0];

  const isItemActive = (item: SidebarItem) => {
    if (item.name === "Overview") {
      // Check if it is exact /dashboard/admin or operational/it/finance/support-department index pages
      return (
        pathname === "/dashboard/admin" ||
        pathname === "/dashboard/admin/operational" ||
        pathname === "/dashboard/admin/it" ||
        pathname === "/dashboard/admin/support-department" ||
        pathname === "/dashboard/admin/finance"
      );
    }

    if (pathname.startsWith(item.path)) return true;

    if (item.subItems) {
      return item.subItems.some((sub) => {
        const normalizedSubPath = normalizePath(sub.path);
        return normalizePath(pathname).startsWith(normalizedSubPath);
      });
    }

    return false;
  };

  const sidebarContent = (
    <div className="flex flex-col h-full  w-full max-w-56 ">
      <p className="text-sm font-MontserratSemiBold pl-6 pb-4">Menu</p>

      {/* Navigation Items */}
      <nav className="flex-1  space-y-4 overflow-y-auto scrollbar-hide px-1">
        {filteredSidebarItems.map((item) => {
          const hasSubItems = !!item.subItems;
          const active = isItemActive(item);
          const isExpanded = expandedItems[item.name];
          const isOpen = isExpanded ?? active;

          return (
            <div key={item.name} className="space-y-1 ">
              {hasSubItems ? (
                <div>
                  <button
                    onClick={() => toggleExpand(item.name)}
                    className={`w-full flex items-center  truncate justify-between text-sm px-6 py-3.5 text-nowrap  hover:bg-6a0dad/20 bg-ffffff rounded-c24 transition-all font-MontserratSemiBold ${
                      active ? "  " : "text-000000/68   "
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-6 h-6 flex-shrink-0">
                        {renderSidebarIcon(
                          item.icon,
                          `${item.name} Icon`,
                          "w-4.5 h-4.5",
                        )}
                      </div>

                      <span className="">{item.name}</span>
                    </div>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-black transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Subitems */}
                  {isOpen && (
                    <div className="pl-8 mt-2 space-y-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
                      {item.subItems!.map((sub) => {
                        const queryType = searchParams.get("type");
                        let isSubActive = false;

                        if (pathname.startsWith("/dashboard/admin/users")) {
                          if (sub.path.includes("buyers")) {
                            isSubActive =
                              pathname === "/dashboard/admin/users"
                                ? queryType === "buyers" || !queryType
                                : pathname.includes("/buyers/");
                          } else if (sub.path.includes("sellers")) {
                            isSubActive =
                              pathname === "/dashboard/admin/users"
                                ? queryType === "sellers"
                                : pathname.includes("/sellers/");
                          }
                        } else if (
                          pathname.startsWith("/dashboard/admin/orders")
                        ) {
                          if (sub.path.includes("all-orders")) {
                            isSubActive =
                              pathname === "/dashboard/admin/orders"
                                ? queryType === "all-orders" || !queryType
                                : true;
                          } else if (sub.path.includes("refund-dispute")) {
                            isSubActive =
                              pathname === "/dashboard/admin/orders"
                                ? queryType === "refund-dispute"
                                : false;
                          }
                        } else if (
                          pathname.startsWith("/dashboard/admin/products") ||
                          pathname.startsWith("/dashboard/admin/categories")
                        ) {
                          if (sub.path.includes("listings")) {
                            isSubActive =
                              pathname.startsWith(
                                "/dashboard/admin/products/listings",
                              ) ||
                              (pathname === "/dashboard/admin/products" &&
                                (queryType === "listings" || !queryType));
                          } else if (sub.path.includes("categories")) {
                            isSubActive = pathname.startsWith(
                              "/dashboard/admin/categories",
                            );
                          }
                        }

                        return (
                          <Link
                            key={sub.name}
                            href={sub.path}
                            className={`flex items-center text-nowrap truncate  gap-2 px-3 py-3.5 rounded-c24 text-sm font-MontserratSemiBold transition-all  ${
                              isSubActive
                                ? "text-white bg-[#6A0DAD] font-MontserratBold shadow-md shadow-[#6A0DAD]/15"
                                : "text-gray-600 bg-ffffff hover:bg-6a0dad/20"
                            }`}
                          >
                            {isSubActive ? (
                              <div className="h-6 w-6 flex-shrink-0 flex justify-center items-center">
                                {sub.icon &&
                                  renderSidebarIcon(
                                    sub.activeIcon || sub.icon,
                                    sub.name,
                                    "w-4.5 h-4.5 flex-shrink-0",
                                  )}
                              </div>
                            ) : (
                              <div className="h-6 w-6 flex-shrink-0 flex justify-center items-center">
                                {sub.icon &&
                                  renderSidebarIcon(
                                    sub.icon,
                                    sub.name,
                                    "w-4.5 h-4.5 flex-shrink-0",
                                  )}
                              </div>
                            )}

                            <span>{sub.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.path}
                  className={`flex items-center justify-between px-6 py-3.5 rounded-c24 text-nowrap transition-all text-sm font-MontserratSemiBold ${
                    active
                      ? "bg-[#6A0DAD] text-white shadow-md shadow-[#6A0DAD]/15"
                      : "text-gray-600  bg-ffffff"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    {active ? (
                      <div>
                        {item.activeIcon
                          ? renderSidebarIcon(
                              item.activeIcon,
                              `${item.name} Active Icon`,
                              "w-4.5 h-4.5 text-white",
                            )
                          : renderSidebarIcon(
                              item.icon,
                              `${item.name} Icon`,
                              "w-4.5 h-4.5 text-white",
                            )}
                      </div>
                    ) : (
                      renderSidebarIcon(
                        item.icon,
                        `${item.name} Icon`,
                        "w-4.5 h-4.5 text-gray-400",
                      )
                    )}

                    <span>{item.name}</span>
                  </div>
                  <ChevronDown
                    className={`w-3.5 h-3.5 ${active ? "text-white" : "text-gray-400"}`}
                  />
                </Link>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );

  return (
    <div
      className="min-h-screen flex  w-full px-6 pb-[35.19px] "
      style={{
        background:
          "linear-gradient(0deg, rgba(255, 255, 255, 0.92) 0%, rgba(255, 255, 255, 0.92) 100%), linear-gradient(0deg, #947FFF 0%, #947FFF 100%)",
      }}
    >
      <header
        className=" fixed top-0  h-16 md:h-26 flex items-center justify-between px-4 md:px-8 z-20"
        style={{
          background:
            "linear-gradient(0deg, rgba(255, 255, 255, 0.92) 0%, rgba(255, 255, 255, 0.92) 100%), linear-gradient(0deg, #947FFF 0%, #947FFF 100%)",
        }}
      >
        <div className="h-16 md:h-20 flex items-center px-8  ">
          <Link href="/dashboard/admin" className="flex items-center gap-3">
            <Image
              src={LogoPurple}
              alt="Logo"
              width={32}
              height={26}
              className="object-contain"
            />
            <span className="text-c18 font-MontserratBold text-6a0dad">
              MARTAF
            </span>
          </Link>
        </div>
        <div className=" lg:hidden flex items-center gap-4 flex-1">
          {/* Mobile Hamburger menu */}
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>

          {/* Desktop Brand Label in Mobile header */}
          <span className="lg:hidden text-lg font-MontserratBold text-[#6A0DAD] tracking-wider">
            MARTAF
          </span>

          {/* Central Search Bar exactly matching second image */}
        </div>
        <div className="hidden md:block w-full max-w-116">
          <SearchInput placeholder="Search for products" className="h-12" />
        </div>

        {/* Right Header Actions exactly matching Image 2 */}
        <div className="flex items-center gap-3 text-gray-600">
          {/* Notifications Bell */}
          <button className="relative bg-ffffff rounded-full transition-colors h-12 w-12 flex items-center justify-center hover:bg-gray-50">
            <Image
              src={DefaultNofication}
              alt="Notification"
              width={18}
              height={19.5}
            />
            {/* <Bell className="w-6 h-6 text-000000" /> */}
            <span className="absolute -top-2 right-0 w-5 h-5 bg-ca0202 text-white rounded-full flex items-center justify-center text-c10 font-MontserratSemiBold">
              1
            </span>
          </button>

          {/* User Profile Outline Dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserOpen((prev) => !prev)}
              className="flex items-center gap-1 cursor-pointer hover:bg-gray-50 p-1 rounded-lg transition-colors"
            >
              <div className="relative bg-ffffff rounded-full transition-colors h-12 w-12 flex items-center justify-center hover:bg-gray-50">
                <Image
                  src={UserIcon}
                  alt="User"
                  width={18}
                  height={19.5}
                />
              </div>
              <ChevronDown
                className={`w-4 h-4 text-000000 transition-transform duration-200 ${
                  userOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>

            <AnimatePresence>
              {userOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-14 w-40 py-3 font-normal text-sm rounded-lg z-50 shadow-lg bg-white border border-gray-100"
                >
                  <ul className="text-gray-700 flex flex-col gap-1">
                    <li>
                      <button
                        onClick={() => {
                          setUserOpen(false);
                          logout();
                        }}
                        className="flex items-center gap-2.5 text-gray-500 hover:text-red-500 hover:bg-red-50 px-4 py-2 w-full text-left transition-colors rounded-md"
                      >
                        <LogOut className="w-4 h-4" />
                        Log out
                      </button>
                    </li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>
      {/* Desktop Sidebar */}

      {/* Main Container */}
      <div className="flex-1 flex mt-28 gap-8 min-w-0">
        {/* Top Header */}
        <aside
          className=" lg:block w-64 sticky top-30 border-r-[0.5px] border-6a0dad/44  self-start h-[calc(100vh-120px)] flex-shrink-0 flex flex-col"
          style={{ width: "16rem" }}
        >
          {/* Brand / Logo exactly aligned with sidebar */}

          {sidebarContent}
        </aside>

        {/* Page Content View */}
        <main className="flex-1 min-w-0 w-full mx-auto">{children}</main>
      </div>

      {/* Mobile Drawer Backdrop */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        />
      )}

      {/* Mobile Drawer Sidebar */}
      <aside
        className={`
          lg:hidden fixed inset-y-0 left-0 w-64 bg-white z-50 transform transition-transform duration-300 ease-in-out
          ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        style={{ width: "16rem" }}
      >
        {/* Close Button Inside Mobile Drawer */}
        <button
          onClick={() => setMobileSidebarOpen(false)}
          className="absolute top-4 right-4 p-1 hover:bg-gray-50 rounded-full text-gray-400"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="h-16 flex items-center px-6 border-b border-[#eef0f3]">
          <Link href="/dashboard/admin" className="flex items-center gap-3">
            <Image
              src={LogoPurple}
              alt="Logo"
              width={32}
              height={26}
              className="object-contain"
            />
            <span className="text-xl font-MontserratBold text-[#6A0DAD] tracking-wider">
              MARTAF
            </span>
          </Link>
        </div>
        {sidebarContent}
      </aside>
    </div>
  );
}
