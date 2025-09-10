"use client"


import { useState, useRef } from "react";
import OrderSectionSelector from "../../side-selector";

import DisputIcon from "@/assets/Seller/disput.png";
import AnalyticsIcon from "@/assets/Seller/analytics.png";
import OrderIcon from "@/assets/Seller/plane.png";

import Analytics from "./Analytics/analytics-body";
import MyOrders from "./My-orders/my-orders";
import DisputeBody from "./dispute-returns/disput-body";
// import ProfileSection from "./ProfileSection";
// import OrdersSection from "./OrdersSection";
// import SettingsSection from "./SettingsSection";

export default function OrderSecions() {
  const [activeId, setActiveId] = useState("analytics");
  const containerRef = useRef<HTMLDivElement | null>(null);

  const sections = [
    { id: "analytics", label: "Analytics", icon: AnalyticsIcon, content: <Analytics/>},
    { id: "myorders", label: "My orders", icon: OrderIcon, content:<MyOrders />},
    { id: "dispute/Returns", label: "Dispute/Returns", icon: DisputIcon , content:< DisputeBody/> },
  ];

  return (
    <div className="flex gap-8 mt-6 pb-8" ref={containerRef}>
   
    <div className="w-full max-w-66.25 ">
          <OrderSectionSelector
        sections={sections}
        onSectionClick={setActiveId}
        hideOnMobile={false}
       
      />
    </div>
      <div className="flex-1 h-[70vh] overflow-y-auto custom-scroll /">
        {sections.find((s) => s.id === activeId)?.content}
      </div>
    </div>
  );
}
