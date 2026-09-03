"use client";

import React from "react";
import Image from "next/image";
import FilterDropdown from "@/components/ui/seller-components/body-components/over-view/Filter-components/filterButton";
import OrdersIcon from "@/assets/icons/admin/orders.svg";
import RevenueIcon from "@/assets/admin/TotalRevenue.svg";
import TotalReturn from "@/assets/admin/disputetotal.svg";
import type { AdminDisputeStats } from "@/types/admin";

export interface OrdersSummaryStats {
  totalCount?: number;
  totalAmount?: string;
  completed?: { count: number; formatted_amount: string };
  delivered?: { count: number; formatted_amount: string };
  fulfilled?: { count: number; formatted_amount: string };
  pending?: { count: number; formatted_amount: string };
  ongoing?: { count: number; formatted_amount: string };
  returned?: { count: number; formatted_amount: string };
  cancelled?: { count: number; formatted_amount: string };
  disputed?: { count: number; formatted_amount?: string };
  NG?: number;
  US?: number;
  GH?: number;
  CN?: number;
}

interface AdminOrdersAndDisputesSummaryCardsProps {
  selectedMonth?: string;
  onMonthChange?: (val: string) => void;
  summaryStats: OrdersSummaryStats;
  disputeStats?: AdminDisputeStats | null;
}

export default function AdminOrdersAndDisputesSummaryCards({
  selectedMonth = "This Month",
  onMonthChange,
  summaryStats,
  disputeStats,
}: AdminOrdersAndDisputesSummaryCardsProps) {
  // Derive dispute metrics from /disputes/admin/stats with fallback to summaryStats
  const totalDisputeCount =
    disputeStats?.total_disputes ??
    disputeStats?.total ??
    disputeStats?.count ??
    summaryStats?.disputed?.count ??
    0;

  const cancelledCount =
    (typeof disputeStats?.cancelled === "object"
      ? disputeStats?.cancelled?.count
      : typeof disputeStats?.cancelled === "number"
      ? disputeStats?.cancelled
      : summaryStats?.cancelled?.count) ?? 0;

  const cancelledAmount =
    (typeof disputeStats?.cancelled === "object"
      ? disputeStats?.cancelled?.formatted_amount
      : summaryStats?.cancelled?.formatted_amount) ?? "₦0.00";

  const disputedActiveCount =
    (typeof disputeStats?.disputed === "object"
      ? disputeStats?.disputed?.count
      : typeof disputeStats?.disputed === "number"
      ? disputeStats?.disputed
      : disputeStats?.requested ??
        disputeStats?.open ??
        summaryStats?.disputed?.count) ?? 0;

  const disputedActiveAmount =
    (typeof disputeStats?.disputed === "object"
      ? disputeStats?.disputed?.formatted_amount
      : disputeStats?.total_amount
      ? String(disputeStats?.total_amount)
      : summaryStats?.disputed?.formatted_amount) ?? "—";

  const returnedCount =
    (typeof disputeStats?.returned === "object"
      ? disputeStats?.returned?.count
      : typeof disputeStats?.returned === "number"
      ? disputeStats?.returned
      : summaryStats?.returned?.count) ?? 0;

  const returnedAmount =
    (typeof disputeStats?.returned === "object"
      ? disputeStats?.returned?.formatted_amount
      : summaryStats?.returned?.formatted_amount) ?? "₦0.00";

  return (
    <div className="flex flex-col md:flex-row flex-wrap gap-6 md:gap-8">
      {/* ── 1. Orders card ── */}
      <div className="w-full max-w-135 bg-ffffff p-6 rounded-c16">
        <div className="flex items-center justify-between pb-4 border-b border-000000/4">
          <p className="font-MontserratMedium text-sm text-[#161616]">Orders</p>
          <FilterDropdown
            options={["This Week", "This Month", "This Year"]}
            defaultValue={selectedMonth}
            onChange={onMonthChange}
            className="!rounded-c8 !h-10 !py-0 !px-3 !gap-4 !shadow-custom"
          />
        </div>
        <div className="mt-8 flex align-baseline gap-c42 h-42.5">
          <div className="flex flex-col justify-between h-full">
            <div className="gap-3 flex items-start">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-000000/4">
                <Image
                  src={OrdersIcon}
                  alt="Orders"
                  width={25}
                  height={25}
                  className="opacity-56"
                />
              </div>
              <div className="gap-3">
                <p className="text-c28 font-MontserratSemiBold">
                  {(summaryStats?.totalCount ?? 0).toLocaleString()}
                </p>
                <span className="text-c12 font-MontserratMedium text-000000/44">
                  {summaryStats?.totalAmount ?? "₦0.00"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="min-w-[51px]">
                <p className="text-c18 font-MontserratSemiBold">NG</p>
                <span className="text-c12 font-MontserratMedium text-000000/44">
                  {(summaryStats?.NG ?? 0).toLocaleString()}
                </span>
              </div>
              <div className="min-w-[51px]">
                <p className="text-c18 font-MontserratSemiBold">US</p>
                <span className="text-c12 font-MontserratMedium text-000000/44">
                  {(summaryStats?.US ?? 0).toLocaleString()}
                </span>
              </div>
              <div className="min-w-[51px]">
                <p className="text-c18 font-MontserratSemiBold">GH</p>
                <span className="text-c12 font-MontserratMedium text-000000/44">
                  {(summaryStats?.GH ?? 0).toLocaleString()}
                </span>
              </div>
              <div className="min-w-[51px]">
                <p className="text-c18 font-MontserratSemiBold">CN</p>
                <span className="text-c12 font-MontserratMedium text-000000/44">
                  {(summaryStats?.CN ?? 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          <div className="h-full">
            <div className="grid grid-cols-2 gap-6">
              <div className="min-w-[51px] flex flex-col">
                <p className="text-c18 font-MontserratSemiBold">
                  {(summaryStats?.completed?.count ?? 0).toLocaleString()}
                </p>
                <span className="text-c12 font-MontserratMedium text-000000/44">
                  {summaryStats?.completed?.formatted_amount ?? "₦0.00"}
                </span>
                <span className="text-[#28A745] bg-[#28A745]/12 rounded-c4 text-c10 mt-1 h-5 w-fit flex items-center justify-center font-MontserratMedium py-0.5 px-2">
                  Completed
                </span>
              </div>
              <div className="min-w-[51px] flex flex-col">
                <p className="text-c18 font-MontserratSemiBold">
                  {(summaryStats?.fulfilled?.count ?? 0).toLocaleString()}
                </p>
                <span className="text-c12 font-MontserratMedium text-000000/44">
                  {summaryStats?.fulfilled?.formatted_amount ?? "₦0.00"}
                </span>
                <span className="text-[#0070E9] bg-[#0070E9]/12 rounded-c4 text-c10 mt-1 h-5 w-fit flex items-center justify-center font-MontserratMedium py-0.5 px-2">
                  Fulfilled
                </span>
              </div>
              <div className="min-w-[51px] flex flex-col">
                <p className="text-c18 font-MontserratSemiBold">
                  {(summaryStats?.pending?.count ?? 0).toLocaleString()}
                </p>
                <span className="text-c12 font-MontserratMedium text-000000/44">
                  {summaryStats?.pending?.formatted_amount ?? "₦0.00"}
                </span>
                <span className="text-[#FFAC06] bg-[#FFAC06]/12 rounded-c4 text-c10 mt-1 h-5 w-fit flex items-center justify-center font-MontserratMedium py-0.5 px-2">
                  Pending
                </span>
              </div>
              <div className="min-w-[51px] flex flex-col">
                <p className="text-c18 font-MontserratSemiBold">
                  {(summaryStats?.returned?.count ?? 0).toLocaleString()}
                </p>
                <span className="text-c12 font-MontserratMedium text-000000/44">
                  {summaryStats?.returned?.formatted_amount ?? "₦0.00"}
                </span>
                <span className="text-[#CC0000] bg-[#CC0000]/12 rounded-c4 text-c10 mt-1 h-5 w-fit flex items-center justify-center font-MontserratMedium py-0.5 px-2">
                  Returned
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Revenue & Dispute card ── */}
      <div className="w-full max-w-135 bg-ffffff p-6 rounded-c16">
        <div className="flex items-center justify-between pb-4 border-b border-000000/4">
          <p className="font-MontserratMedium text-sm text-[#161616]">
            Revenue &amp; Dispute
          </p>
          <FilterDropdown
            options={["This Week", "This Month", "This Year"]}
            defaultValue={selectedMonth}
            onChange={onMonthChange}
            className="!rounded-c8 !h-10 !py-0 !px-3 !gap-4 !shadow-custom"
          />
        </div>
        <div className="mt-8 flex align-baseline gap-c42 h-42.5">
          <div className="flex flex-col justify-between">
            <div className="gap-3 flex items-center">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-000000/4">
                <Image
                  src={RevenueIcon}
                  alt="Revenue"
                  width={25}
                  height={25}
                  className="opacity-56"
                />
              </div>
              <div className="space-y-4">
                <p className="text-c12 font-MontserratMedium text-000000/44">
                  Total Revenue
                </p>
                <span className="text-c28 font-MontserratSemiBold pt-4">
                  {summaryStats?.totalAmount ?? "₦0.00"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-6.75">
              <div className="min-w-[51px]">
                <span className="text-c12 font-MontserratMedium text-000000/44">
                  Delivered
                </span>
                <p className="text-c18 mt-3 font-MontserratSemiBold">
                  {summaryStats?.delivered?.formatted_amount ?? "₦0.00"}
                </p>
              </div>
              <div className="min-w-[51px]">
                <span className="text-c12 font-MontserratMedium text-000000/44">
                  Ongoing
                </span>
                <p className="text-c18 mt-3 font-MontserratSemiBold">
                  {summaryStats?.ongoing?.formatted_amount ?? "₦0.00"}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-between">
            <div className="gap-3 flex items-center">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-000000/4">
                <Image
                  src={TotalReturn}
                  alt="returns"
                  width={25}
                  height={25}
                  className="opacity-56"
                />
              </div>
              <div className="space-y-4">
                <p className="text-c12 font-MontserratMedium text-000000/44">
                  Dispute &amp; Refund
                </p>
                <span className="text-c28 font-MontserratSemiBold pt-4">
                  {totalDisputeCount.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="flex gap-[16.5px]">
              <div className="min-w-[51px] flex flex-col">
                <p className="text-c18 font-MontserratSemiBold">
                  {cancelledCount.toLocaleString()}
                </p>
                <span className="text-c12 font-MontserratMedium text-000000/44">
                  {cancelledAmount}
                </span>
                <span className="text-[#28A745] bg-[#28A745]/12 rounded-c4 text-c10 mt-1 h-5 w-fit flex items-center justify-center font-MontserratMedium py-0.5 px-2">
                  Cancelled
                </span>
              </div>
              <div className="min-w-[51px] flex flex-col">
                <p className="text-c18 font-MontserratSemiBold">
                  {disputedActiveCount.toLocaleString()}
                </p>
                <span className="text-c12 font-MontserratMedium text-000000/44">
                  {disputedActiveAmount}
                </span>
                <span className="text-[#0070E9] bg-[#0070E9]/12 rounded-c4 text-c10 mt-1 h-5 w-fit flex items-center justify-center font-MontserratMedium py-0.5 px-2">
                  Disputed
                </span>
              </div>
              <div className="min-w-[51px] flex flex-col">
                <p className="text-c18 font-MontserratSemiBold">
                  {returnedCount.toLocaleString()}
                </p>
                <span className="text-c12 font-MontserratMedium text-000000/44">
                  {returnedAmount}
                </span>
                <span className="text-[#CC0000] bg-[#CC0000]/12 rounded-c4 text-c10 mt-1 h-5 w-fit flex items-center justify-center font-MontserratMedium py-0.5 px-2">
                  Returned
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
