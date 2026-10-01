"use client"
import React from "react";
import { useSelector } from "react-redux";
import CategoryRanking from "./category-ranking";
import Charts from "./chat-section/chat-section";
import OverviewOder from "./oders";
import OverviewCards from "./overview-cards";
import OverviewHeader from "./overview-header";
import ProductInventory from "./product-inventory";
import { useFetchProducts } from "@/helpers/sellers/fetchProducts";
import { RootState } from "@/store";
import { useEffect } from "react";
import OverviewSkeleton from "@/components/reloadSpinner/OverviewSkeleton";

import { useState } from "react";
import { useHttp } from "@/hooks/use-http";

export default function OverviewBody() {
  const [initialLoading, setInitialLoading] = useState(true);
  const [period, setPeriod] = useState<"month" | "year">("month");
  const [overviewAnalytics, setOverviewAnalytics] = useState<any>(null);
  const token = useSelector((state: RootState) => state.token?.token);
  
       const { fetchProducts, fetchdDraft, fetchBalance, loading } = useFetchProducts();
       const product = useSelector((state:RootState)=>state.sellerProduct.product)
       const { sendHttpRequest: fetchOverviewAnalytics } = useHttp();
    
        useEffect(() => {
          fetchdDraft();
          fetchProducts();
          fetchBalance();
          const timer = setTimeout(() => setInitialLoading(false), 800);
          return () => clearTimeout(timer);
        }, []);

        useEffect(() => {
          if (!token) return;

          fetchOverviewAnalytics({
            requestConfig: {
              url: `/orders/manufacturer/analytics?period=${period}`,
              method: "GET",
              token,
              isAuth: true,
              userType: "seller",
            },
            successRes: (response: any) => {
              setOverviewAnalytics(response?.data?.data ?? response?.data ?? {});
            },
            errorRes: (error: any) => {
              console.warn("Seller overview analytics unavailable:", error?.message || error);
              setOverviewAnalytics(null);
            },
          });
        }, [fetchOverviewAnalytics, period, token]);
 
  if (initialLoading || (loading && (!product || product.length === 0))) return <OverviewSkeleton />;
 
  return (
    <div className="space-y-6 pb-c32 ">
      
      <OverviewHeader period={period} onPeriodChange={setPeriod} />
      <div>
        <OverviewCards analytics={overviewAnalytics} />
      </div>
      <div className="w-full ">
        <Charts />
      </div>
      <div className="flex flex-col  lg:flex-row gap-6 lg:gap-c32">
        <div className="w-full lg:flex-1 order-2 lg:order-1 ">
          <ProductInventory />
        </div>
        <div className="w-full  lg:max-w-137.25  lg:flex-1 order-1 lg:order-2 overflow-x-hidden">
          <CategoryRanking />
        </div>
      </div>
      <div className="hidden lg:block">
        <OverviewOder />
      </div>
    </div>
  );
}
