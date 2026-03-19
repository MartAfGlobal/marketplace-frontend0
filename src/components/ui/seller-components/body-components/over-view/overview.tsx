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

export default function OverviewBody() {
 
  
       const { fetchdDraft } = useFetchProducts();
       const { fetchProducts } = useFetchProducts();
       const token = useSelector((state:RootState)=>state.token?.token)
    
        useEffect(() => {
          fetchdDraft;
          fetchProducts();
        }, []);
 
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
