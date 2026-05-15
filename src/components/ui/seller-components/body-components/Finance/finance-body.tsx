"use client";

import { useState, useRef, useEffect } from "react";
import OrderSectionSelector from "../side-selector";
import AnalyticsIcon from "@/assets/Seller/analytics.png";
import TransactionIcon from "@/assets/Seller/Transaction.png";
import PayeOutIon from "@/assets/Seller/payout.png";
import FinanceOverview from "./Finance-Overview/finance-overview";
import SearchInput from "@/components/ui/landindPage/Header/SearchInput";
import { SellerMobileHeader } from "@/components/ui/seller-components/header-components/SellerMobileHeader";
import FinanceTransaction from "./finance-transactions";
import Payout from "./payout";
import DashboardTableSkeleton from "@/components/reloadSpinner/DashboardTableSkeleton";

export default function FinanceSecions() {
  const [activeId, setActiveId] = useState("overview");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const sections = [
    {
      id: "overview",
      label: "Overview",
      icon: AnalyticsIcon,
      content: <FinanceOverview />,
    },
    {
      id: "transactions",
      label: "Transactions",
      icon: TransactionIcon,
      content: <FinanceTransaction/>,
    },
    {
      id: "payouts",
      label: "Payouts",
      icon: PayeOutIon,
      content:  <Payout/>,
    },
  ];

  if (loading) return <DashboardTableSkeleton />;

  return (
    <div className="max-w-[1600px] mx-auto">
      {/* Header Area */}
      <SellerMobileHeader 
        title="Finance"
        showBackButton={false}
        rightElement={
          <div className="hidden md:block w-[400px]">
            <SearchInput placeholder="Search transactions, payout ID..." />
          </div>
        }
      />

      {/* Mobile Search Area */}
      <div className="md:hidden px-4 mt-4">
        <SearchInput placeholder="Search transactions, payout ID..." />
      </div>

      <div className="flex flex-col lg:flex-row gap-8 mt-6" ref={containerRef}>
        {/* Sidebar Navigation */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className=" h-fit sticky top-20 ">
            <OrderSectionSelector
              sections={sections}
              onSectionClick={setActiveId}
              hideOnMobile={false}
            />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-h-[70vh]">
          <div className="bg-white rounded-2xl  p-6 transition-all duration-300">
            {sections.find((s) => s.id === activeId)?.content}
          </div>
        </div>
      </div>
    </div>
  );
}

