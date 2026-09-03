"use client";

import React from "react";

export type DisputeStatusTabKey =
  | "REQUESTED"
  | "OPEN"
  | "ESCALATED"
  | "RESOLVED"
  | "REJECTED"
  | "ALL";

interface Tab {
  key: DisputeStatusTabKey;
  label: string;
}

const DISPUTE_TABS: Tab[] = [
  { key: "REQUESTED", label: "Requested" },
  { key: "OPEN", label: "Open" },
  { key: "ESCALATED", label: "Escalated" },
  { key: "RESOLVED", label: "Resolved" },
  { key: "REJECTED", label: "Rejected" },
  { key: "ALL", label: "All Disputes" },
];

interface DisputeTabsProps {
  activeTab: DisputeStatusTabKey;
  onTabChange: (tab: DisputeStatusTabKey) => void;
  counts?: Partial<Record<DisputeStatusTabKey, number>>;
}

export default function DisputeTabs({
  activeTab,
  onTabChange,
  counts,
}: DisputeTabsProps) {
  return (
    <div className="flex items-center gap-2 mb-6 overflow-x-auto hcustom-scroll border-b border-000000/8">
      {DISPUTE_TABS.map((tab) => {
        const count = counts?.[tab.key];
        return (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`whitespace-nowrap pb-4 px-1 h-12 text-c12 font-MontserratSemiBold transition-colors relative flex items-center gap-1.5 ${
              activeTab === tab.key
                ? "text-6a0dad border-b-2 border-b-6a0dad"
                : "text-000000/68 hover:text-6a0dad border-b-2 border-b-transparent"
            }`}
          >
            <span>{tab.label}</span>
            {count !== undefined && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-MontserratMedium ${
                  activeTab === tab.key
                    ? "bg-6a0dad/10 text-6a0dad"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
