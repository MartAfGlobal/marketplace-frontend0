"use client";

import { useState, useEffect } from "react";
import OrderSecions from "./Order-section-body/order-section-body";
import DashboardTableSkeleton from "@/components/reloadSpinner/DashboardTableSkeleton";
import { useFetchProducts } from "@/helpers/sellers/fetchProducts";

import SellerSearch from "../over-view/Filter-components/SellerSearch";
import { SellerMobileHeader } from "@/components/ui/seller-components/header-components/SellerMobileHeader";

export default function  SelleOrderspage() {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { fetchOrders } = useFetchProducts();

  useEffect(() => {
    fetchOrders()
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
    
  }, []);

  if (loading) return <DashboardTableSkeleton />;

  return (
    <div className="w-full">
      <SellerMobileHeader 
        title="Orders"
        showBackButton={true}
        rightElement={
          <div className="hidden md:block  w-auto">
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

      <div className="mt-6 px-3">
        <OrderSecions searchQuery={searchQuery} />
      </div>
    </div>
  );
}
