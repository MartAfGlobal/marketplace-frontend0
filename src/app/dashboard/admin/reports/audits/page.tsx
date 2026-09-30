"use client";

import AuditsSection from "@/components/admin-components/reports/sections/AuditsSection";

export default function AuditsReportPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="px-1">
        <h1 className="text-xl md:text-c18 font-MontserratSemiBold">Audits</h1>
        <p className="text-c12 text-000000/44 font-MontserratNormal mt-1">
          Compliance audits logged against the marketplace -- immutable once created.
        </p>
      </div>
      <AuditsSection />
    </div>
  );
}
