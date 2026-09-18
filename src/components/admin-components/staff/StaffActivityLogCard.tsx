"use client";

import type { AdminStaffActivityLogItem } from "@/types/admin";

interface StaffActivityLogCardProps {
  items: AdminStaffActivityLogItem[];
}

function formatTime(iso: string) {
  const date = new Date(iso);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

export default function StaffActivityLogCard({ items }: StaffActivityLogCardProps) {
  return (
    <div>
      <h2 className="text-base font-MontserratNormal text-000000/68 mb-6">Activity log</h2>

      <div className="overflow-x-auto max-h-64 overflow-y-auto">
        <table className="w-full text-left">
          <thead className="sticky top-0">
            <tr className="h-10.5 bg-947fff text-ffffff text-nowrap">
              <th className="font-MontserratNormal text-sm p-3 w-24">Timestamp</th>
              <th className="font-MontserratNormal text-sm p-3">Activity</th>
              <th className="font-MontserratNormal text-sm p-3 text-right"></th>
            </tr>
          </thead>
          <tbody className="text-sm text-000000/68 font-MontserratNormal">
            {items.length > 0 ? (
              items.map((item) => (
                <tr key={item.id} className="h-10.5 border-b border-000000/4 last:border-0">
                  <td className="p-3 whitespace-nowrap">{formatTime(item.created_at)}</td>
                  <td className="p-3">
                    {item.actor_name} {item.action}
                  </td>
                  {/*
                    No linkable target id comes back from the activity feed
                    yet (target_description is a display string, not an id)
                    — shown as a static label rather than a dead link.
                  */}
                  <td className="p-3 text-right text-[#ff715b] whitespace-nowrap">View details</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="p-6 text-center text-000000/44 text-xs">
                  No recent activity.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
