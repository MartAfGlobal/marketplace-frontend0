"use client";

import ActivityLogSection from "@/components/admin-components/reports/sections/ActivityLogSection";

export default function ActivityLogReportPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="px-1">
        <h1 className="text-xl md:text-c18 font-MontserratSemiBold">Activity Log</h1>
        <p className="text-c12 text-000000/44 font-MontserratNormal mt-1">
          Admin login history and every logged admin action, with IP and device detail.
        </p>
      </div>
      <ActivityLogSection />
    </div>
  );
}
