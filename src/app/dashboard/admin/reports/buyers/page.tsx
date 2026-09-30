"use client";

import BuyersSection from "@/components/admin-components/reports/sections/BuyersSection";

export default function BuyersReportPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="px-1">
        <h1 className="text-xl md:text-c18 font-MontserratSemiBold">Buyers</h1>
        <p className="text-c12 text-000000/44 font-MontserratNormal mt-1">
          Buyer growth, engagement and spend across the marketplace.
        </p>
      </div>
      <BuyersSection />
    </div>
  );
}
