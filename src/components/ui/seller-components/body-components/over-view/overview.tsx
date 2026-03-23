"use client"

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

export default function OverviewBody() {
  const [initialLoading, setInitialLoading] = useState(true);
  
       const { fetchProducts, fetchdDraft, loading } = useFetchProducts();
       const product = useSelector((state:RootState)=>state.sellerProduct.product)
    
        useEffect(() => {
          fetchdDraft();
          fetchProducts();
          const timer = setTimeout(() => setInitialLoading(false), 800);
          return () => clearTimeout(timer);
        }, []);
 
  if (initialLoading || (loading && (!product || product.length === 0))) return <OverviewSkeleton />;
 
  return (
    <div className="space-y-6 pb-c32 ">
      
      <OverviewHeader />
      <div>
        <OverviewCards />
      </div>
      <div className="w-full">
        <Charts />
      </div>
      <div className="flex gap-c32">
        <ProductInventory />
        <CategoryRanking />
      </div>
      <div>
        <OverviewOder />
      </div>
    </div>
  );
}
