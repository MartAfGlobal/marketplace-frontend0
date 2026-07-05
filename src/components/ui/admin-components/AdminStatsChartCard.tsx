"use client";

import StatusFrame from "@/components/admin-components/users/status-frame";
import activeUserIcon from "@/assets/admin/Vector.svg"
import activeIcon from "@/assets/admin/active.svg"
import inActiveIcon from "@/assets/admin/inactive.svg"
import suspendedUserIcon from "@/assets/admin/suspend.svg"

interface ChartBar {
  day: string;
  height?: string;
  activeHeight?: string;
  inactiveHeight?: string;
}

interface AdminStatsChartCardProps {
  title: string;
  activeUserType: string;
  active: string;
  inactive: string;
  quantity: number;
  suspended: string;
}

export default function AdminStatsChartCard({
  title,
  activeUserType,
  suspended,
  quantity,
  active,
  inactive,
}: AdminStatsChartCardProps) {
  return (
    <div className="">
      {/* Header */}

      <h2 className="text-sm font-MontserratBold text-000000/68 capitalize">
        {title}
      </h2>
      <div className= "justify-between items-center">
        <StatusFrame title={activeUserType} quantity={quantity} icon={activeUserIcon} />
        <StatusFrame title={active} quantity={quantity} icon={activeIcon} />
        <StatusFrame title={inactive} quantity={quantity} icon={inActiveIcon} />
        <StatusFrame title={suspended} quantity={quantity} icon={suspendedUserIcon} />
      </div>
    </div>
  );
}
