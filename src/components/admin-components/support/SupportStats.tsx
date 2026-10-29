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
  isSupportAgent?: boolean;
  selectedMonth?: string;
  onMonthChange?: (month: string) => void;
  periodOptions?: string[];
}

function formatAverageHours(hours: number[]) {
  if (!hours.length) return "—";
  const average = hours.reduce((total, value) => total + value, 0) / hours.length;
  return `${Number.isInteger(average) ? average : average.toFixed(1)} hrs`;
}

export default function SupportStats({
  count,
  tickets,
  isSupportAgent = false,
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
  const statusStats = [
    { label: "Closed tickets", value: closedCount, color: "#2ea37d" },
    { label: "Open tickets", value: openCount, color: "#e7a22a" },
    { label: "Pending tickets", value: pendingCount, color: "#e00000" },
  ];
  const categoryStats = Array.from(
    tickets.reduce((totals, ticket) => {
      totals.set(ticket.category, (totals.get(ticket.category) ?? 0) + 1);
      return totals;
    }, new Map<string, number>()),
    ([label, value]) => ({ label, value }),
  ).sort((left, right) => right.value - left.value);
  const categoryTotal = categoryStats.reduce(
    (total, category) => total + category.value,
    0,
  );
  const categoryColors = ["#947fff", "#a46be3", "#be8cff", "#d4b8ff"];
  const categoryGradient =
    categoryTotal > 0
      ? `conic-gradient(${categoryStats
          .map((category, index) => {
            const start =
              (categoryStats
                .slice(0, index)
                .reduce((total, item) => total + item.value, 0) /
                categoryTotal) *
              100;
            const end = (start + (category.value / categoryTotal) * 100);
            return `${categoryColors[index % categoryColors.length]} ${start}% ${end}%`;
          })
          .join(", ")})`
      : "#eeeeee";
  const responseHours = tickets.flatMap((ticket) => {
    if (!ticket.firstResponseAt || !ticket.createdAt) return [];
    const hours =
      (new Date(ticket.firstResponseAt).getTime() -
        new Date(ticket.createdAt).getTime()) /
      3_600_000;
    return Number.isFinite(hours) && hours >= 0 ? [hours] : [];
  });
  const resolutionHours = tickets.flatMap((ticket) => {
    if (!ticket.resolvedAt || !ticket.createdAt) return [];
    const hours =
      (new Date(ticket.resolvedAt).getTime() -
        new Date(ticket.createdAt).getTime()) /
      3_600_000;
    return Number.isFinite(hours) && hours >= 0 ? [hours] : [];
  });

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

  if (isSupportAgent) {
    return (
      <section className="w-full min-w-0">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-MontserratNormal tracking-[1%] leading-[24px]">
            Statistics
          </h2>
          <FilterDropdown
            options={periodOptions}
            defaultValue={selectedMonth}
            onChange={onMonthChange}
            className="!rounded-c8 !h-10 !py-0 !px-3 !gap-4 !shadow-custom"
          />
        </div>
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1px_0.8fr] lg:items-center">
          <div className="flex min-w-0 items-center gap-6">
            <div className="shrink-0">
              <p className="text-xs text-000000/68">Tickets assigned to me</p>
              <p className="pt-2 text-3xl font-MontserratMedium text-000000">
                {count}
              </p>
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-3">
              {statusStats.map((stat) => (
                <div
                  key={stat.label}
                  className="grid grid-cols-[6rem_1fr_auto] items-center gap-3 text-[10px] text-000000/68"
                >
                  <span>{stat.label}</span>
                  <span className="h-1.5 overflow-hidden rounded-full bg-000000/5">
                    <span
                      className="block h-full rounded-full"
                      style={{
                        width: `${(stat.value / maxStatusCount) * 100}%`,
                        backgroundColor: stat.color,
                      }}
                    />
                  </span>
                  <span>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden h-full bg-000000/5 lg:block" />

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-[10px] text-000000/68">KPIs</p>
                <p className="pt-1 text-2xl font-MontserratMedium text-000000">
                  {formatAverageHours(responseHours)}
                </p>
                <p className="text-[10px] text-000000/60">
                  Average response time
                </p>
              </div>
              <div>
                <p className="text-2xl font-MontserratMedium text-000000">
                  {formatAverageHours(resolutionHours)}
                </p>
                <p className="text-[10px] text-000000/60">
                  Average resolution time
                </p>
              </div>
            </div>
            <div className="flex min-w-0 items-center gap-3">
              <div
                aria-label="Ticket categories"
                className="h-20 w-20 shrink-0 rounded-full"
                style={{
                  background: categoryGradient,
                  mask: "radial-gradient(farthest-side, transparent 62%, #000 64%)",
                  WebkitMask:
                    "radial-gradient(farthest-side, transparent 62%, #000 64%)",
                }}
              />
              <ul className="min-w-0 space-y-1">
                {categoryStats.slice(0, 3).map((category, index) => (
                  <li
                    key={category.label}
                    className="flex items-center gap-1.5 text-[9px] text-000000/68"
                  >
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{
                        backgroundColor:
                          categoryColors[index % categoryColors.length],
                      }}
                    />
                    <span className="truncate">{category.label}</span>
                    <span>{category.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    );
  }

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
