"use client";

import DonutBreakdown from "@/components/admin-components/DonutBreakdown";
import type { AdminStaffByRole } from "@/types/admin";

interface StaffActivityDonutProps {
  data: AdminStaffByRole[];
}

export default function StaffActivityDonut({ data }: StaffActivityDonutProps) {
  return (
    <div>
      <h2 className="text-base font-MontserratNormal text-000000/68 mb-6">Staff activity</h2>
      <DonutBreakdown
        rows={data.map((row) => ({ label: row.role, value: row.count }))}
        emptyMessage="No role assignments yet."
      />
    </div>
  );
}
