"use client"

import { useSelector } from "react-redux";
import CategoryRanking from "./category-ranking";
import Charts from "./chat-section/chat-section";
import OverviewOder from "./oders";
import OverviewCards from "./overview-cards";
import OverviewHeader from "./overview-header";
import ProductInventory from "./product-inventory";

export default function OverviewBody() {
 
 
  return (
    <div className="space-y-6 pb-c32">
      
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
