"use client"

import { useState, useRef, useEffect } from "react";
import OrderSectionSelector from "../side-selector";

import AnalyticsIcon from "@/assets/Seller/analytics.png";
import TransactionIcon from "@/assets/Seller/Transaction.png";
import PayeOutIon from "@/assets/Seller/payout.png";
import FinanceOverview from "./Finance-Overview/finance-overview";
import SearchInput from "@/components/ui/landindPage/Header/SearchInput";
import FinanceTransaction from "./finance-transactions";
import Payout from "./payout";
import DashboardTableSkeleton from "@/components/reloadSpinner/DashboardTableSkeleton";

export default function FinanceSecions() {
  const [activeId, setActiveId] = useState("overview");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
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
    <div>
      <div className="flex items-center gap-c48 w-full justify-between">
        <p className="text-c18 font-MontserratMedium">Finance</p>
        <div className="w-full max-w-87">
          <SearchInput placeholder="Search by order ID, items, date..." />
        </div>
      </div>
      <div className="flex gap-8 mt-6 pb-8" ref={containerRef}>
        <div className="w-full max-w-66.25 ">
          <OrderSectionSelector
            sections={sections}
            onSectionClick={setActiveId}
            hideOnMobile={false}
          />
        </div>
        <div className="flex-1 h-[70vh] overflow-y-auto custom-scroll /">
          {sections.find((s) => s.id === activeId)?.content}
        </div>
      </div>
    </div>
  );
}
