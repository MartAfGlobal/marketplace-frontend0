"use client";

import { useState } from "react";
import OrdersNav from "./order-status-bar";
import SearchInput from "../../landindPage/Header/SearchInput";
import Orders from "./Component-ui/all-orders";
import AwaitingOrders from "./Component-ui/Awaiting-payment";
import ToShip from "./Component-ui/toship";
import Shipped from "./Component-ui/shipped";
import Proccessed from "./Component-ui/processed";

const tabs = [
  "All",
  "Awaiting Payment",
  "To Ship",
  "Shipped",
  "Processed",
  "In Dispute",
];

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("All");

  return (
    <div className="w-full  h-screen flex flex-col">
      {/* Top section (Nav + Search) */}
      <div className="flex justify-between pt-c32 border-b border-black/10">
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
        <div className="md:pt-c32 pb-c60">
          {activeTab === "All" && <Orders />}
          {activeTab === "Awaiting Payment" && (
            <div className=""><AwaitingOrders/></div>
          )}
          {activeTab === "To Ship" && (
            <div className=""><ToShip/></div>
          )}
          {activeTab === "Shipped" && (
            <div className=""><Shipped/></div>
          )}
          {activeTab === "Processed" && (
            <div className=""><Proccessed/></div>
          )}
          {activeTab === "In Dispute" && (
            <div className="p-4 bg-red-100 rounded">In Dispute UI</div>
          )}
        </div>

      </div>
    </div>
  );
}
