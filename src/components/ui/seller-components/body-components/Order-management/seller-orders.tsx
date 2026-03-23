"use client";

import { useState, useEffect } from "react";
import SearchInput from "../../../landindPage/Header/SearchInput";
import OrderSecions from "./Order-section-body/order-section-body";
import DashboardTableSkeleton from "@/components/reloadSpinner/DashboardTableSkeleton";

export default function SelleOrderspage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <DashboardTableSkeleton />;

  return (
    <div className="w-full">
      <div className="w-full flex justify-between ">
        <p className="text-c18 font-MontserratSemiBold">Orders</p>

        <div className="w-full max-w-87.5">
          <SearchInput placeholder="" className="w-full max-w-87.5" />
        </div>
      </div>
      <OrderSecions />
    </div>
  );
}
