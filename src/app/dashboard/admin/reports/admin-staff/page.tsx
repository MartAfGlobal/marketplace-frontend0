"use client";

import AdminStaffSection from "@/components/admin-components/reports/sections/AdminStaffSection";

export default function AdminStaffReportPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="px-1">
        <h1 className="text-xl md:text-c18 font-MontserratSemiBold">Admin Staff</h1>
        <p className="text-c12 text-000000/44 font-MontserratNormal mt-1">
          Staff headcount, roles and activity across the admin team.
        </p>
      </div>
      <AdminStaffSection />
    </div>
  );
}
