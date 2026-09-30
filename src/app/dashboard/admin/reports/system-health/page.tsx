"use client";

import SystemHealthSection from "@/components/admin-components/reports/sections/SystemHealthSection";

export default function SystemHealthReportPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="px-1">
        <h1 className="text-xl md:text-c18 font-MontserratSemiBold">System Health</h1>
        <p className="text-c12 text-000000/44 font-MontserratNormal mt-1">
          Platform uptime and error monitoring.
        </p>
      </div>
      <SystemHealthSection />
    </div>
  );
}
