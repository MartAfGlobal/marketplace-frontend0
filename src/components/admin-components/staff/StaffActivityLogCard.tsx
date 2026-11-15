"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { AdminStaffActivityLogItem } from "@/types/admin";
import DrawerWrapper from "@/components/ui/Modals/DrawerWrapper";

interface StaffActivityLogCardProps {
  items: AdminStaffActivityLogItem[];
}

function formatTime(iso: string) {
  const date = new Date(iso);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

function formatTimestamp(iso: string) {
  const date = new Date(iso);
  if (isNaN(date.getTime())) return "—";
  return date.toLocaleString();
}

export default function StaffActivityLogCard({ items }: StaffActivityLogCardProps) {
  const [selectedItem, setSelectedItem] =
    useState<AdminStaffActivityLogItem | null>(null);

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
                  <td className="p-3 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => setSelectedItem(item)}
                      aria-label={`View activity details: ${item.action}`}
                      className="text-[#ff715b] hover:underline"
                    >
                      View details
                    </button>
                  </td>
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
      <DrawerWrapper
        isOpen={selectedItem !== null}
        onClose={() => setSelectedItem(null)}
        maxWidthClassName="max-w-[360px]"
      >
        {selectedItem && (
          <div className="flex min-h-0 flex-1 flex-col">
            <header className="flex items-start justify-between gap-4 border-b border-[#000000]/8 pb-4">
              <div className="min-w-0">
                <p className="text-[11px] font-MontserratNormal text-[#999]">
                  Logged event
                </p>
                <h2 className="mt-1 break-words text-sm font-MontserratMedium text-[#111]">
                  {selectedItem.action}
                </h2>
                <p className="mt-1 text-[10px] text-[#999]">
                  {formatTimestamp(selectedItem.created_at)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                aria-label="Close activity log details"
                className="shrink-0 rounded p-1 text-[#999] hover:bg-gray-100 hover:text-[#333]"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto py-5 text-[11px]">
              <section className="grid grid-cols-2 gap-4">
                <div className="min-w-0">
                  <h3 className="mb-3 font-MontserratMedium text-[#111]">
                    Action by
                  </h3>
                  <p className="mb-1 text-[10px] text-[#999]">Initiated by</p>
                  <p className="break-words text-[#444]">
                    {selectedItem.actor_name || "—"}
                  </p>
                </div>
                <div className="min-w-0">
                  <h3 className="mb-3 font-MontserratMedium text-[#111]">
                    Activity
                  </h3>
                  <p className="mb-1 text-[10px] text-[#999]">Category</p>
                  <p className="break-words text-[#444]">
                    {selectedItem.category}
                  </p>
                  <p className="mt-3 text-[10px] text-[#999]">Target entity</p>
                  <p className="mt-1 break-words text-[#444]">
                    {selectedItem.target_description || "—"}
                  </p>
                </div>
              </section>
              <section>
                <h3 className="mb-3 font-MontserratMedium text-[#111]">
                  Metadata
                </h3>
                <p className="text-[10px] text-[#999]">Activity ID</p>
                <p className="mt-1 break-all text-[#444]">
                  {selectedItem.id}
                </p>
              </section>
            </div>
          </div>
        )}
      </DrawerWrapper>
    </div>
  );
}
