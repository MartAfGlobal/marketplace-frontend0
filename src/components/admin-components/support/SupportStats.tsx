"use client";

import React, { useState } from "react";
import Image from "next/image";
import FilterDropdown from "@/components/ui/seller-components/body-components/over-view/Filter-components/filterButton";
import type { SupportTicket } from "./supportTickets";
import TicketIcon from "@/assets/admin/ticketsIcon.svg";
import StaffIcon from "@/assets/admin/stafficon.svg";

interface SupportStatsProps {
  count: number;
  tickets: SupportTicket[];
  selectedMonth?: string;
  onMonthChange?: (month: string) => void;
  periodOptions?: string[];
}

export default function SupportStats({
  count,
  tickets,
  selectedMonth: propSelectedMonth,
  onMonthChange: propOnMonthChange,
  periodOptions = ["Today", "This week", "This Month", "This year"],
}: SupportStatsProps) {
  const [dummyMonth, setDummyMonth] = useState("This Month");

  const selectedMonth =
    propSelectedMonth !== undefined ? propSelectedMonth : dummyMonth;
  const onMonthChange = propOnMonthChange || setDummyMonth;

  const openCount = tickets.filter((ticket) =>
    ["open", "to do"].includes(ticket.status.toLowerCase()),
  ).length;
  const pendingCount = tickets.filter((ticket) =>
    ["pending", "in progress", "under review"].includes(
      ticket.status.toLowerCase(),
    ),
  ).length;
  const closedCount = tickets.filter((ticket) =>
    ["closed", "resolved"].includes(ticket.status.toLowerCase()),
  ).length;
  const maxStatusCount = Math.max(openCount, pendingCount, closedCount, 1);

  const Ticketstats = [
    {
      label: "Closed tickets",
      value: tickets.length,
      width: 100,
      color: "#2ea37d",
    },
    {
      label: "Open tickets",
      value: openCount,
      width: (openCount / maxStatusCount) * 100,
      color: "#2ea37d",
    },
    {
      label: "Pending tickets",
      value: pendingCount,
      width: (pendingCount / maxStatusCount) * 100,
      color: "#e7a22a",
    },
  ];
  const Staffstats = [
    {
      label: "Available",
      value: tickets.length,
      width: 100,
      color: "#2ea37d",
    },
    {
      label: "Busy",
      value: openCount,
      width: (openCount / maxStatusCount) * 100,
      color: "#2ea37d",
    },
    {
      label: "Inactive",
      value: pendingCount,
      width: (pendingCount / maxStatusCount) * 100,
      color: "#e7a22a",
    },
  ];

  return (
    <section className="w-full min-w-0">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-MontserratNormal tracking-[1%] leading-[24px]">
            Statistics
          </h2>
        </div>
        <FilterDropdown
          options={periodOptions}
          defaultValue={selectedMonth}
          onChange={onMonthChange}
          className="!rounded-c8 !h-10 !py-0 !px-3 !gap-4 !shadow-custom"
        />
      </div>
      <div className="flex h-auto w-full flex-col gap-5 lg:h-32 lg:flex-row lg:justify-between lg:gap-5">
        <div className="flex min-w-0 items-center justify-between gap-3 sm:gap-6 lg:flex-1 lg:justify-start lg:gap-c48">
          <div className="shrink-0">
            <h2 className="text-sx font-MontserratNormal leading-[20px] tracking-[2%] text-000000/68">
              Tickets
            </h2>
            <div className="pt-2 flex items-center gap-4">
              <p className="text-c32 text-000000 font-MontserratMedium leading-[40px] tracing-[-2%]">
                100
              </p>
              <Image src={TicketIcon} alt="ticket" width={21} height={15} />
            </div>
          </div>
          <div className="flex min-w-0 flex-1 flex-col space-y-4.5 lg:flex-1">
            {Ticketstats.map((stat) => (
              <div key={stat.label} className="flex min-w-0 items-center gap-2 sm:gap-4">
                <p className="w-20 shrink-0 text-c10 font-MontserratNormal leading-4 tracking-[2%] text-000000/68 sm:w-25">
                  {stat.label}
                </p>
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="h-[6px] w-full max-w-50.5 min-w-0 overflow-hidden rounded-full bg-000000/4">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${stat.width}%`,
                        backgroundColor: stat.color,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="hidden h-full w-[1px] lg:block bg-000000/4" />
         <div className="flex min-w-0 items-center justify-between gap-3 sm:gap-6 lg:flex-1 lg:justify-start lg:gap-c48">
          <div className="shrink-0">
            <h2 className="text-sx font-MontserratNormal leading-[20px] tracking-[2%] text-000000/68">
              Support staff
            </h2>
            <div className="pt-2 flex items-center gap-4">
              <p className="text-c32 text-000000 font-MontserratMedium leading-[40px] tracing-[-2%]">
                100
              </p>
              <Image src={StaffIcon} alt="ticket" width={19.5} height={21} />
            </div>
          </div>
          <div className="flex min-w-0 flex-1 flex-col space-y-4.5 lg:flex-1">
            {Staffstats.map((stat) => (
              <div key={stat.label} className="flex min-w-0 items-center gap-2 sm:gap-4">
                <p className="w-20 shrink-0 text-c10 font-MontserratNormal leading-4 tracking-[2%] text-000000/68 sm:w-25">
                  {stat.label}
                </p>
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="h-[6px] w-full max-w-50.5 min-w-0 overflow-hidden rounded-full bg-000000/4">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${stat.width}%`,
                        backgroundColor: stat.color,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
