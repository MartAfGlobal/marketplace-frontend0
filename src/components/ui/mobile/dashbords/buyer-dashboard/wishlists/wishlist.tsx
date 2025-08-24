"use client";

import { useState } from "react";
import OrdersNav from "@/components/ui/buyer-components/orders/order-status-bar";
import SearchInput from "@/components/ui/landindPage/Header/SearchInput";


import { motion } from "framer-motion";
import AllWishlist from "@/app/dashboard/buyer/wishlist/all-wishlist";



const tabs = [
  "All",
  "List",

];

export default function     WishList() {
  const [activeTab, setActiveTab] = useState("All");




  return (
    <div className="w-full   flex flex-col">
  
      <div className="flex justify-between pb-3">
        <OrdersNav
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <SearchInput
          placeholder="Order ID, Store name, Product name"
          className="border border-000000/18 focus:ring-ff715b shadow-neutral-50 hidden md:block"
        />
      </div>

      {/* Scrollable content section */}
      <div className="flex-1   overflow-y-auto no-scrollbar">
        <div className="md:pt-c32 md:pb-c60 ">
          {activeTab === "All" && <AllWishlist/>}
            {activeTab === "List" && (
                <div className=""><p>List is empty</p></div>
            )}
        </div>
      </div>
    
    </div>
  );
}
