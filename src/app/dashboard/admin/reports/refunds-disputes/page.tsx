"use client";

import RefundsDisputesSection from "@/components/admin-components/reports/sections/RefundsDisputesSection";

export default function RefundsDisputesReportPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="px-1">
        <h1 className="text-xl md:text-c18 font-MontserratSemiBold">Refunds &amp; Disputes</h1>
        <p className="text-c12 text-000000/44 font-MontserratNormal mt-1">
          Refund cases and buyer/seller disputes, with breakdowns by seller and product.
        </p>
      </div>
      <RefundsDisputesSection />
    </div>
  );
}
