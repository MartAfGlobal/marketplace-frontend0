"use client";

import MarketplaceOperationsSection from "@/components/admin-components/reports/sections/MarketplaceOperationsSection";

export default function MarketplaceOperationsReportPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="px-1">
        <h1 className="text-xl md:text-c18 font-MontserratSemiBold">Marketplace Operations</h1>
        <p className="text-c12 text-000000/44 font-MontserratNormal mt-1">
          Delivery performance and live alerts on orders that need attention.
        </p>
      </div>
      <MarketplaceOperationsSection />
    </div>
  );
}
