"use client";

import { useState, useEffect } from "react";
import OrderSecions from "./Order-section-body/order-section-body";
import DashboardTableSkeleton from "@/components/reloadSpinner/DashboardTableSkeleton";
import { useFetchProducts } from "@/helpers/sellers/fetchProducts";

import SellerSearch from "../over-view/Filter-components/SellerSearch";

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
    <div className="w-full ">
      <div className="w-full flex flex-col md:flex-row md:justify-between items-start md:items-center gap-6 md:gap-c48 px-3">
        <div className="flex items-center gap-2">
          {/* Back button visible only on mobile */}
          <button className="md:hidden block" onClick={() => window.history.back()}>
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="#161616" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <p className="text-c18 font-MontserratSemiBold">Orders</p>
        </div>

        <div className="w-full md:w-auto ">
          <SellerSearch 
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by order ID, items, date..." 
            alwaysOpen={true}
          />
        </div>
      </div>
      <OrderSecions searchQuery={searchQuery} />
    </div>
  );
}
