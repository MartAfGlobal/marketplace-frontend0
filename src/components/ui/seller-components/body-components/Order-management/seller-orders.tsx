"use client";

import { useState, useEffect } from "react";
import OrderSecions from "./Order-section-body/order-section-body";
import DashboardTableSkeleton from "@/components/reloadSpinner/DashboardTableSkeleton";
import { useFetchProducts } from "@/helpers/sellers/fetchProducts";

import SellerSearch from "../over-view/Filter-components/SellerSearch";
import { SellerMobileHeader } from "@/components/ui/seller-components/header-components/SellerMobileHeader";

export default function SelleOrderspage({
  initialSection = "myorders",
}: {
  initialSection?: string;
} = {}) {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { fetchOrders } = useFetchProducts();

  useEffect(() => {
    fetchOrders();
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <DashboardTableSkeleton />;

  return (
    <div className="w-full">
      <SellerMobileHeader 
        title="Orders"
        showBorder ={false}
        showBackButton={false}
        rightElement={
          <div className="hidden md:block w-[388px]">
            <SellerSearch 
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by order ID, items, date..." 
              alwaysOpen={true}
            />
          </div>
        }
      />

      <div className="md:hidden px-4 mt-4">
        <SellerSearch 
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by order ID, items, date..." 
          alwaysOpen={true}
        />
      </div>

      <div className="mt-6 ">
        <OrderSecions searchQuery={searchQuery} initialSection={initialSection} />
      </div>
    </div>
  );
}
