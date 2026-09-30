"use client";

import PaymentsRevenueSection from "@/components/admin-components/reports/sections/PaymentsRevenueSection";

export default function PaymentsRevenueReportPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="px-1">
        <h1 className="text-xl md:text-c18 font-MontserratSemiBold">Payments &amp; Revenue</h1>
        <p className="text-c12 text-000000/44 font-MontserratNormal mt-1">
          GMV, platform revenue, payouts and transaction-level detail.
        </p>
      </div>
      <PaymentsRevenueSection />
    </div>
  );
}
