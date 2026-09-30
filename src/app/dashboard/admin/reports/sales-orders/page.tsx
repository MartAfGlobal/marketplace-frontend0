"use client";

import SalesOrdersSection from "@/components/admin-components/reports/sections/SalesOrdersSection";

export default function SalesOrdersReportPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="px-1">
        <h1 className="text-xl md:text-c18 font-MontserratSemiBold">Sales &amp; Orders</h1>
        <p className="text-c12 text-000000/44 font-MontserratNormal mt-1">
          Order volume, revenue and fulfillment performance across the marketplace.
        </p>
      </div>
      <SalesOrdersSection />
    </div>
  );
}
