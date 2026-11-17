"use client";

import React, { useEffect, useState } from "react";
import {
  ChevronDown,
  Plane,
  Users2,
  Headset,
  FileText,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import NextImage from "next/image";
import Link from "next/link";
import FilterDropdown from "@/components/ui/seller-components/body-components/over-view/Filter-components/filterButton";
import UsersIcon from "@/assets/icons/admin/usersIcon.svg";
import Image from "next/image";
import HelpIcon from "@/assets/icons/admin/helpcenter.svg";
import pendingFile from "@/assets/icons/admin/pendingFile.svg";
import { AdminDetails } from "@/helpers/admin/adminHelper";
import {
  formatSupportDate,
  parseSupportTicketResponse,
} from "@/components/admin-components/support/supportTickets";
import type { SupportTicket } from "@/components/admin-components/support/supportTickets";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";

type SummaryMetric = {
  count?: number | string;
  amount?: number | string;
  formatted_amount?: string;
};

type OrdersSummary = {
  totalOrders: SummaryMetric | null;
  completed: SummaryMetric | null;
  ongoing: SummaryMetric | null;
  pending: SummaryMetric | null;
  returned: SummaryMetric | null;
  countries: Record<string, unknown>;
};

type UsersSummary = {
  activeUsers: number | string | null;
  buyers: number | string | null;
  sellers: number | string | null;
  weeklyUsers: number[] | null;
};

const userChartDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function parseUserCount(value: unknown): number | string | null {
  if (typeof value === "number" || typeof value === "string") return value;
  const record = asRecord(value);
  if (!record) return null;
  const count = record.count ?? record.total;
  return typeof count === "number" || typeof count === "string" ? count : null;
}

function parseWeeklyUsers(value: unknown): number[] | null {
  const counts = Array<number>(7).fill(0);
  const dayIndexes: Record<string, number> = {
    mon: 0,
    monday: 0,
    tue: 1,
    tues: 1,
    tuesday: 1,
    wed: 2,
    wednesday: 2,
    thu: 3,
    thur: 3,
    thurs: 3,
    thursday: 3,
    fri: 4,
    friday: 4,
    sat: 5,
    saturday: 5,
    sun: 6,
    sunday: 6,
  };
  let hasCounts = false;

  if (Array.isArray(value)) {
    value.slice(0, 7).forEach((item, index) => {
      const record = asRecord(item);
      const count = parseUserCount(
        record?.count ??
          record?.users ??
          record?.user_count ??
          record?.total ??
          item,
      );
      if (count === null || !Number.isFinite(Number(count))) return;
      const day = record?.day ?? record?.weekday ?? record?.label;
      const dayIndex =
        typeof day === "string"
          ? dayIndexes[day.trim().toLowerCase()]
          : index;
      if (dayIndex === undefined) return;
      counts[dayIndex] = Number(count);
      hasCounts = true;
    });
  } else {
    const record = asRecord(value);
    if (!record) return null;
    Object.entries(record).forEach(([day, value]) => {
      const dayIndex = dayIndexes[day.trim().toLowerCase()];
      const count = parseUserCount(value);
      if (
        dayIndex === undefined ||
        count === null ||
        !Number.isFinite(Number(count))
      ) {
        return;
      }
      counts[dayIndex] = Number(count);
      hasCounts = true;
    });
  }

  return hasCounts ? counts : null;
}

function parseUsersSummary(data: unknown): UsersSummary | null {
  let payload = data;
  for (let depth = 0; depth < 2; depth += 1) {
    const envelope = asRecord(payload);
    if (!envelope || envelope.data === undefined) break;
    payload = envelope.data;
  }

  const response = asRecord(payload);
  if (!response) return null;
  const stats = asRecord(response.stats) ?? asRecord(response.summary) ?? response;
  const getCount = (...keys: string[]) => {
    for (const key of keys) {
      const count = parseUserCount(stats[key]);
      if (count !== null) return count;
    }
    return null;
  };
  const trendKeys = [
    "weekly",
    "weekly_users",
    "weekly_user_stats",
    "weekly_breakdown",
    "users_weekly",
    "weekly_trend",
    "weekly_data",
    "weekly_stats",
    "daily_users",
    "daily_stats",
    "users_by_day",
    "user_trend",
  ];
  const weeklyUsers = parseWeeklyUsers(
    trendKeys.map((key) => stats[key] ?? response[key]).find((value) => value !== undefined),
  );

  return {
    activeUsers: getCount("active_users", "active_users_count", "active_user_count", "total_active_users", "active"),
    buyers: getCount("buyers", "total_buyers", "buyers_count", "buyer_count"),
    sellers: getCount("sellers", "total_sellers", "sellers_count", "seller_count"),
    weeklyUsers,
  };
}

function parseSummaryMetric(value: unknown): SummaryMetric | null {
  if (typeof value === "number" || typeof value === "string") {
    return { count: value };
  }
  const record = asRecord(value);
  if (!record) return null;

  return {
    count:
      typeof record.count === "number" || typeof record.count === "string"
        ? record.count
        : undefined,
    amount:
      typeof record.amount === "number" || typeof record.amount === "string"
        ? record.amount
        : undefined,
    formatted_amount:
      typeof record.formatted_amount === "string"
        ? record.formatted_amount
        : undefined,
  };
}

function parseOrdersSummary(data: unknown): OrdersSummary | null {
  let payload = data;
  for (let depth = 0; depth < 2; depth += 1) {
    const envelope = asRecord(payload);
    if (!envelope || envelope.data === undefined) break;
    payload = envelope.data;
  }

  const response = asRecord(payload);
  if (!response) return null;
  const summary = asRecord(response.summary) ?? response;
  const countries =
    asRecord(response.country_breakdown) ??
    asRecord(summary.country_breakdown) ??
    {};

  return {
    totalOrders: parseSummaryMetric(summary.total_orders),
    completed: parseSummaryMetric(summary.completed),
    ongoing: parseSummaryMetric(summary.ongoing),
    pending: parseSummaryMetric(summary.pending),
    returned: parseSummaryMetric(summary.returned),
    countries,
  };
}

function formatSummaryCount(value: unknown): string {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value.toLocaleString();
  }
  if (typeof value === "string" && value.trim()) {
    const numericValue = Number(value);
    return Number.isFinite(numericValue)
      ? numericValue.toLocaleString()
      : value;
  }
  return "—";
}

function formatSummaryAmount(metric: SummaryMetric | null | undefined): string {
  if (!metric) return "—";
  if (metric.formatted_amount) return metric.formatted_amount;
  if (metric.amount !== undefined) {
    const amount = Number(metric.amount);
    return Number.isFinite(amount)
      ? `₦${amount.toLocaleString()}`
      : String(metric.amount);
  }
  return "—";
}

function getCountryCount(
  countries: Record<string, unknown> | undefined,
  countryCode: string,
): string {
  if (!countries) return "—";
  const value = countries[countryCode];
  const country = asRecord(value);
  return formatSummaryCount(country?.count ?? value);
}

export default function AdminOverviewPage() {
  const [timeFilter, setTimeFilter] = useState("Today");
  const [ordersSummary, setOrdersSummary] = useState<OrdersSummary | null>(null);
  const [usersSummary, setUsersSummary] = useState<UsersSummary | null>(null);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
  const [totalSupportTickets, setTotalSupportTickets] = useState(0);
  const [pendingSupportTicketCount, setPendingSupportTicketCount] = useState(0);
  const token = useSelector((state: RootState) => state.token?.token);
  const kycDetails = useSelector(
    (state: RootState) => state.adminKycDetails?.adminKycDetails ?? [],
  );
  const totalVerifications = useSelector(
    (state: RootState) => state.adminKycDetails?.totalCount ?? 0,
  );
  const {
    fetchOrdersSummary,
    fetchAdminUserStats,
    fetchAdminSellersKycList,
    fetchAdminSupportTickets,
  } = AdminDetails();

  const getRangeParam = (range: string) => {
    switch (range) {
      case "This Week":
        return "this_week";
      case "This Year":
        return "this_year";
      case "This Month":
      default:
        return "this_month";
    }
  };

  const loadOrdersSummary = (range: string) => {
    setOrdersSummary(null);
    fetchOrdersSummary(
      range,
      (data: unknown) => {
        console.log("Admin overview orders summary response:", data);
        const summary = parseOrdersSummary(data);
        if (!summary) {
          console.error("Admin overview received an unreadable orders summary.");
          return;
        }
        setOrdersSummary(summary);
      },
      (error: unknown) => {
        console.error("Failed to fetch admin overview orders summary:", error);
      },
    );
  };

  useEffect(() => {
    if (!token) return;
    loadOrdersSummary("this_month");
    fetchAdminSellersKycList(1);
    fetchAdminSupportTickets(
      1,
      (data: unknown) => {
        const response = parseSupportTicketResponse(data);
        if (!response) {
          console.error("Admin overview received an unreadable support tickets response.");
          return;
        }
        setSupportTickets(response.tickets);
        setTotalSupportTickets(response.count);
        setPendingSupportTicketCount(
          response.tickets.filter(
            (ticket) => ticket.status.toLowerCase() === "pending",
          ).length,
        );
      },
      (error: unknown) => {
        console.error("Failed to fetch admin overview support tickets:", error);
      },
    );
    fetchAdminUserStats(
      (data: unknown) => {
        const summary = parseUsersSummary(data);
        if (!summary) {
          console.error("Admin overview received unreadable user stats.");
          return;
        }
        setUsersSummary(summary);
      },
      (error: unknown) => {
        console.error("Failed to fetch admin overview user stats:", error);
      },
    );
    // AdminDetails returns fresh helper functions per render; requests depend on authentication.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const pendingKYBs = kycDetails
    .filter((kyb) => kyb.status.toUpperCase() === "PENDING")
    .slice(-4);
  const pendingKYBCount = kycDetails.filter(
    (kyb) => kyb.status.toUpperCase() === "PENDING",
  ).length;

  const chartBars = userChartDays.map((day, index) => ({
    day,
    height: `${Math.min(((usersSummary?.weeklyUsers?.[index] ?? 0) / 500) * 100, 100)}%`,
  }));

  return (
    <div className="space-y-6">
      {/* Top Header Row with Time Filters */}
      <div className="flex flex-col gap-6">
        <h1 className="text-c18 font-MontserratSemiBold text-000000">
          Overview
        </h1>

        {/* Pills Date Filter Toggle */}
        <div className="flex items-center  overflow-hidden rounded-[16px]">
          {["Today", "This week", "Total"].map((filter, index) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={` text-xs font-MontserratMedium px-4 py-2 transition-all ${
                timeFilter === filter
                  ? "bg-[#6A0DAD] text-white shadow-sm"
                  : "bg-white text-gray-500 hover:text-gray-800"
              }
      ${index === 0 ? "rounded-l-[16px] " : ""}
      ${index === 2 ? "rounded-r-[16px]" : ""}
      `}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Dashboard Cards */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 justify-center">
        {/* 1. ORDERS CARD */}
        <div className="bg-ffffff max-w-137.25 rounded-c16 p-6 flex flex-col  h-fit  ">
          {/* Header */}
          <div className="flex justify-between items-start mb-8 h-c48 border-b border-gray-000000/2">
            <h2 className="text-sm font-MontserratBold text-000000/68">
              Orders
            </h2>
            <FilterDropdown
              options={["This Week", "This Month", "This Year"]}
              defaultValue="This Month"
              onChange={(range) => loadOrdersSummary(getRangeParam(range))}
              className="border border-ff715b !rounded-lg !h-fit !py-1.5 !px-3 !gap-1.5 !shadow-none"
            />
          </div>

          {/* Stats Breakdown Grid */}
          <div className="  flex justify-between gap-9 items-stretch   ">
            {/* Left Primary Stat */}
            <div className="flex flex-col gap-14.75  h-full min-h-39.25 ">
              <div className="flex items-center gap-3  ">
                <div className="w-14 h-14 flex-shrink-0 rounded-full bg-000000/4 flex items-center justify-center text-gray-400">
                  <Plane className="w-6.25 h-6.25 text-000000/44 " />
                </div>
                <div className="">
                  <p className="text-xl md:text-c28 font-MontserratSemiBold ">
                    {formatSummaryCount(ordersSummary?.totalOrders?.count)}
                  </p>
                  <p className="text-c12 text-000000/44 font-MontserratMedium">
                    {formatSummaryAmount(ordersSummary?.totalOrders)}
                  </p>
                </div>{" "}
              </div>

              <div className="col-span-1 md:col-span-2 flex flex-wrap gap-x-4 gap-y-2">
                {["NG", "US", "GH", "CN"].map((c) => (
                  <div
                    key={c}
                    className="text-left flex  flex-col items-start gap-2"
                  >
                    <span className="text-c18 font-MontserratSemiBold ">
                      {c}{" "}
                    </span>
                    <span className="text-c12 text-000000/44 font-MontserratMedium">
                      {getCountryCount(ordersSummary?.countries, c)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Middle Stats Badges */}
            <div className="flex flex-col justify-between min-h-39.25">
              <div className=" flex justify-between gap-6 ">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-c18 font-MontserratSemiBold">
                      {formatSummaryCount(ordersSummary?.completed?.count)}
                    </p>
                    <p className="text-c12 text-000000/44 font-MontserratMedium">
                      {formatSummaryAmount(ordersSummary?.completed)}
                    </p>
                    <span className="text-[10px] font-MontserratBold bg-[#28A745]/12 text-[#4DBEA7]  px-2 py-0.5 rounded-c4 leading-[16px] h-5">
                      Completed
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-c18 font-MontserratSemiBold">
                      {formatSummaryCount(ordersSummary?.ongoing?.count)}
                    </p>
                    <p className="text-c12 text-000000/44 font-MontserratMedium">
                      {formatSummaryAmount(ordersSummary?.ongoing)}
                    </p>
                    <span className="text-[10px] font-MontserratBold bg-[#FFAC06]/12 text-[#FFAC06]  px-2 py-0.5 rounded-c4 leading-[16px] h-5">
                      Ongoing
                    </span>
                  </div>
                </div>
              </div>
              <div className=" flex items-center justify-between gap-6 ">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-c18 font-MontserratSemiBold">
                      {formatSummaryCount(ordersSummary?.pending?.count)}
                    </p>
                    <p className="text-c12 text-000000/44 font-MontserratMedium">
                      {formatSummaryAmount(ordersSummary?.pending)}
                    </p>
                    <span className="text-[10px] font-MontserratBold bg-[#0070E9]/12 text-[#0070E9]  px-2 py-0.5 rounded-c4 leading-[16px] h-5">
                      Pending
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-c18 font-MontserratSemiBold">
                      {formatSummaryCount(ordersSummary?.returned?.count)}
                    </p>
                    <p className="text-c12 text-000000/44 font-MontserratMedium">
                      {formatSummaryAmount(ordersSummary?.returned)}
                    </p>
                    <span className="text-[10px] font-MontserratBold bg-[#CC0000]/12 text-[#CA0202]  px-2 py-0.5 rounded-c4 leading-[16px] h-5">
                      Returned
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Details Row */}
        </div>

        {/* 2. USERS CARD */}
        <div className="bg-white rounded-2xl p-6 flex flex-col justify-between min-h-full items-stretch ">
          {/* Header */}
          <div className="flex justify-between items-start mb-6 h-12 border-b border-000000/4 ">
            <h2 className="text-sm font-MontserratBold text-000000/68">
              Users
            </h2>
            <FilterDropdown
              options={["This Week", "This Month", "This Year"]}
              defaultValue="This Week"
              className="border border-ff715b !rounded-c8 !h-fit !py-1.5 !px-3 !gap-1.5 !shadow-none"
            />
          </div>

          {/* Stats & Bar Chart Row */}
          <div className="flex justify-between gap-4 ">
            {/* Left Total Active Stat */}
            <div className="flex  flex-col gap-c48 w-full  ">
              <div className="flex  gap-3">
                <div className="w-13.5  h-13.5 rounded-full bg-000000/4 flex items-center justify-center text-gray-400">
                  <Image
                    width={27}
                    height={27}
                    src={UsersIcon}
                    alt="Users Icon"
                    className="w-6.75 h-6.75 opacity-44"
                  />
                </div>
                <div>
                  <p className="text-xl md:text-c28 font-MontserratSemiBold ">
                    {formatSummaryCount(usersSummary?.activeUsers)}
                  </p>
                  <p className="text-[12px] text-000000/44 font-MontserratMedium">
                    Active
                  </p>
                </div>
              </div>
              <div className=" flex  gap-4">
                <div className=" justify-start">
                  <p className="text-base md:text-lg font-MontserratSemiBold text-000000">
                    {formatSummaryCount(usersSummary?.buyers)}
                  </p>
                  <span className="text-c10 text-[#947FFF] font-MontserratMedium py-0.5 px-2 bg-947fff/10 rounded-c4 mt-1">
                    Buyers
                  </span>
                </div>
                <div className="">
                  <p className="text-base md:text-lg font-MontserratSemiBold text-000000">
                    {formatSummaryCount(usersSummary?.sellers)}
                  </p>
                  <span className="text-c10 text-[#947FFF] font-MontserratMedium py-0.5 px-2 bg-947fff/10 rounded-c4 mt-1">
                    Sellers
                  </span>
                </div>
              </div>
            </div>

            {/* Right Stacked Bar Chart */}
            <div className="w-full  h-full flex items-end justify-between relative pl-3.75 ">
              {/* Y Axis Grid/Legends */}
              <div className="absolute left-0 top-0 bottom-3.75 flex flex-col justify-between text-[8px] text-000000/44 font-MontserratMedium">
                <span>500</span>
                <span>400</span>
                <span>300</span>
                <span>200</span>
                <span>100</span>
                <span>0</span>
              </div>
              {/* Bars */}
              <div className=" flex items-end gap-4.5 h-full w-full pr-3.5 ">
                {chartBars.map((bar) => (
                  <div
                    key={bar.day}
                    className="flex flex-col items-center gap-1 h-full justify-end w-4 group"
                  >
                    <div className="relative h-full   flex justify-center w-2">
                      <div
                        style={{ height: bar.height }}
                        className="absolute bottom-0 left-0 w-2 bg-[#947fff]/50 group-hover:bg-[#7f00ff] transition-all"
                      />
                      <div className="absolute w-0.25 h-full bg-000000/4 transition-all" />
                    </div>

                    <span className="text-[8px] text-000000/44 font-MontserratMedium">
                      {bar.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Details Row */}
        </div>

        {/* 3. TICKETS CARD */}
        <div className="bg-ffffff rounded-c16 p-6 border border-000000/4 flex flex-col justify-between min-h-[376px] w-full  max-w-137.25 ">
          {/* Header */}
          <div className="flex justify-between h-10 border-b border-b-000000/4  mb-4">
            <h2 className="text-base font-MontserratNormal text-000000/68">
              Tickets
            </h2>
            <Link
              href="/dashboard/admin/support"
              className="text-c12 font-MontserratMedium text-ff715b hover:underline  "
            >
              <span>View all</span>
            </Link>
          </div>

          {/* Stats Header Box */}
          <div className="flex items-center justify-between mb-c32">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-000000/4 flex items-center justify-center text-gray-400">
                <Image src={HelpIcon} alt="Help" width={26} height={28} />
              </div>
              <p className="text-c28 font-MontserratSemiBold">
                {totalSupportTickets}
              </p>
            </div>
            <span
              className="max-w-[55%] truncate whitespace-nowrap text-sm font-MontserratNormal text-[#FFAC06] bg-[#FFAC06]/12 px-3 py-2"
              title={`Total pending: ${pendingSupportTicketCount}`}
            >
              Total pending: {pendingSupportTicketCount}
            </span>
          </div>

          {/* Tickets Table */}
          <div className="flex-1 overflow-x-auto lg:overflow-x-hidden">
            <table className="w-full table-fixed text-left border-collapse">
              <thead className="pb-6">
                <tr className="text-c12  tex t-000000/44 font-MontserratSemiBold  ">
                  <th className="w-[24%] pb-6">Ticket ID</th>
                  <th className="w-[29%] pb-6">Subject</th>
                  <th className="w-[14%] pb-6">Priority</th>
                  <th className="w-[15%] pb-6">Status</th>
                  <th className="w-[18%] pb-6">Date created</th>
                </tr>
              </thead>
              <tbody className="space-x-4 text-sm font-MontserratMedium">
                {supportTickets.slice(0, 4).map((ticket) => (
                  <tr key={ticket.id} className=" transition-colors">
                    <td className="truncate whitespace-nowrap pb-6" title={ticket.reference}>
                      {ticket.reference}
                    </td>
                    <td
                      className="truncate whitespace-nowrap pb-6"
                      title={ticket.subject}
                    >
                      {ticket.subject}
                    </td>
                    <td className="truncate whitespace-nowrap pb-6" title={ticket.priority}>
                      {ticket.priority}
                    </td>
                    <td className="truncate whitespace-nowrap pb-6" title={ticket.status}>
                      {ticket.status}
                    </td>
                    <td className="truncate whitespace-nowrap pb-6" title={formatSupportDate(ticket.createdAt)}>
                      {formatSupportDate(ticket.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. PENDING KYBS CARD */}
        <div className="bg-ffffff rounded-c16 p-6 border border-000000/4 flex flex-col justify-between min-h-[376px] w-full max-w-130.75">
          {/* Header */}
          <div className="flex justify-between h-10 border-b border-b-000000/4  mb-4">
            <h2 className="text-base font-MontserratNormal text-gray-400">
              Pending KYBs
            </h2>
            <Link
              href="/dashboard/admin/verifications"
              className="text-c12 font-MontserratMedium text-ff715b hover:underline "
            >
              <span>View all</span>
            </Link>
          </div>

          {/* Stats Header Box */}
          <div className="flex items-center justify-between mb-c32">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-000000/4 flex items-center justify-center text-gray-400">
                <Image
                  src={pendingFile}
                  alt="Pending File"
                  width={22}
                  height={26}
                />
              </div>
              <p className="text-c28 font-MontserratSemiBold">
                {totalVerifications}
              </p>
            </div>
            <span className="text-sm font-MontserratNormal text-[#FFAC06] bg-[#FFAC06]/12 px-3 py-2">
              Total pending: {pendingKYBCount}
            </span>
          </div>

          {/* Pending KYBs Table */}
          <div className="flex-1 overflow-x-auto lg:overflow-x-hidden">
            <table className="w-full text-left border-collapse min-w-[450px]">
              <thead>
                <tr className="text-c12  tex t-000000/44 font-MontserratSemiBold ">
                  <th className=" pb-6">Business name</th>
                  <th className=" pb-6">Business type</th>
                  <th className=" pb-6">Country</th>
                </tr>
              </thead>
              <tbody className="space-x-4 text-sm font-MontserratMedium">
                {pendingKYBs.map((kyb) => (
                  <tr key={kyb.user_id} className="pb-6">
                    <td className="pb-6">{kyb.business_name ?? ""}</td>
                    <td className="pb-6">{kyb.business_type}</td>
                    <td className="pb-6 ">{kyb.business_location ?? ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
