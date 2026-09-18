"use client";

import { useRef } from "react";
import { usePathname } from "next/navigation";
import OrderSectionSelector from "../../side-selector";

import DisputIcon from "@/assets/Seller/disput.png";
import AnalyticsIcon from "@/assets/Seller/analytics.png";
import OrderIcon from "@/assets/Seller/plane.png";

import Analytics from "./Analytics/analytics-body";
import MyOrders from "./My-orders/my-orders";
import DisputeBody from "./dispute-returns/disput-body";

export default function OrderSecions({ 
  searchQuery,
  initialSection,
}: { 
  searchQuery: string;
  initialSection?: string;
}) {
  const pathname = usePathname() || "";
  const containerRef = useRef<HTMLDivElement | null>(null);

  const getActiveSectionId = () => {
    if (pathname.includes("/orders/analytics")) return "analytics";
    if (pathname.includes("/orders/dispute-returns") || pathname.includes("/orders/disputes")) return "dispute/Returns";
    if (initialSection) return initialSection;
    return "myorders";
  };

  const activeId = getActiveSectionId();

  const sections = [
    {
      id: "analytics",
      label: "Analytics",
      icon: AnalyticsIcon,
      href: "/dashboard/seller/orders/analytics",
      content: <Analytics />,
    },
    {
      id: "myorders",
      label: "My orders",
      icon: OrderIcon,
      href: "/dashboard/seller/orders",
      content: <MyOrders externalSearchQuery={searchQuery} />,
    },
    {
      id: "dispute/Returns",
      label: "Dispute/Returns",
      icon: DisputIcon,
      href: "/dashboard/seller/orders/dispute-returns",
      content: <DisputeBody externalSearchQuery={searchQuery} />,
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 mt-6 pb-8 relative " ref={containerRef}>
      <div className="w-full lg:max-w-66.25 sticky top-20 self-start z-10">
        <OrderSectionSelector
          sections={sections}
          activeId={activeId}
          hideOnMobile={false}
        />
      </div>
      <div className="flex-1 w-full min-w-0">
        {sections.find((s) => s.id === activeId)?.content}
      </div>
    </div>
  );
}

