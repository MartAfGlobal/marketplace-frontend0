"use client";

import SellersSection from "@/components/admin-components/reports/sections/SellersSection";

export default function SellersReportPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="px-1">
        <h1 className="text-xl md:text-c18 font-MontserratSemiBold">Sellers</h1>
        <p className="text-c12 text-000000/44 font-MontserratNormal mt-1">
          Seller performance, verification status and underperformance flags.
        </p>
      </div>
      <SellersSection />
    </div>
  );
}
