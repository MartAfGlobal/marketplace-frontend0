"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

import OverviewIcon from "@/assets/Seller/overview.png";
import ProductIcon from "@/assets/Seller/product.png";
import OrderIcon from "@/assets/Seller/orders.png";
import FinanceIcon from "@/assets/Seller/finance.png";
import CustomerIcon from "@/assets/Seller/customers.png";
import { useSelector } from "react-redux";

const navItems = [
  { id: "overview", label: "Overview", icon: OverviewIcon, href: "/dashboard/seller/overview" },
  { id: "products", label: "Products", icon: ProductIcon, href: "/dashboard/seller/products" },
  { id: "orders", label: "Orders", icon: OrderIcon, href: "/dashboard/seller/orders" },
  { id: "finance", label: "Finance", icon: FinanceIcon, href: "/dashboard/seller/finance" },
  { id: "customers", label: "Customers", icon: CustomerIcon, href: "/dashboard/seller/customers" },
];

export default function NavigationBar() {
  const pathname = usePathname();
  const isIncomplete = useSelector((state: any) => state.seller.isIncomplete);

  return (
    <nav className="text-white font-MontserratSemiBold text-sm flex gap-6 relative">
      {navItems.map((item, index) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
        const isDisabled = isIncomplete && index !== 0; // Only first item active if incomplete

        return (
          <Link
            key={item.id}
            href={isDisabled ? "#" : item.href} // disable link
            className={`relative flex flex-col items-center justify-center h-18
              ${isDisabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "cursor-pointer"}
            `}
          >
            <p className="flex items-center gap-2">
              <Image
                src={item.icon}
                alt={item.label}
                width={20}
                height={20}
                className={`object-contain ${isDisabled ? "grayscale" : ""}`}
              />
              <span>{item.label}</span>
            </p>

            {isActive && !isDisabled && (
              <motion.div
                layoutId="underline"
                className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
