"use client";

import DashBoardHeader from "@/components/ui/seller-components/dashboard-header";
import { usePathname } from "next/navigation";

export default function SellerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isRegistrationProgress =
    pathname === "/dashboard/seller/registration-progress";

  return (
    <div className="min-h-screen flex flex-col w-full">
      {!isRegistrationProgress && <DashBoardHeader />}
      <main className="flex-1  w-full pt-c32 px-c32 bg-947fff/10 mt-18">
        {children}
      </main>
    </div>
  );
}
