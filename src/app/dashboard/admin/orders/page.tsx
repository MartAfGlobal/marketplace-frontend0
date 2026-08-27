"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AdminListHeader from "@/components/ui/admin-components/AdminListHeader";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { toast } from "sonner";

import { AdminDetails } from "@/helpers/admin/adminHelper";
import Pagination from "@/components/ui/seller-components/body-components/products/pignation-button";

import OrdersIcon from "@/assets/icons/admin/orders.svg";

import { Button } from "@/components/ui/Button/Button";
import activeIcon from "@/assets/admin/active.svg";
import suspendedUserIcon from "@/assets/admin/inactive.svg";
import inActiveIcon from "@/assets/admin/suspend.svg";
import TotalReturn from "@/assets/admin/disputetotal.svg"

import RevenueIcon from "@/assets/admin/TotalRevenue.svg";

import FilterDropdown from "@/components/ui/seller-components/body-components/over-view/Filter-components/filterButton";

import OrdersTable, {
  OrderRow,
} from "@/components/admin-components/orders/OrdersTable";
import StatusFrame from "@/components/admin-components/users/status-frame";
import Image from "next/image";
import { Input } from "@/components/ui/forms/Input";

const PAGE_SIZE = 20;

/** Map a raw API order object to the shape OrdersTable expects */
function mapToOrderRow(raw: any): OrderRow {
  // Normalise status — the API may return lowercase, uppercase, or snake_case
  const rawStatus = (
    raw.status ??
    raw.order_timeline_stage ??
    raw.order_status ??
    ""
  )
    .toUpperCase()
    .trim();

  let status = "Ongoing";
  if (rawStatus === "DELIVERED" || rawStatus === "COMPLETED") {
    status = "Delivered";
  } else if (rawStatus === "REJECTED") {
    status = "Rejected";
  } else if (rawStatus === "CANCELLED" || rawStatus === "CANCELED") {
    status = "Cancelled";
  } else if (rawStatus === "DISPUTED" || rawStatus === "DISPUTE") {
    status = "Disputed";
  } else if (rawStatus === "PENDING" || rawStatus === "UNPROCESSED") {
    status = "Pending";
  } else if (rawStatus === "PROCESSING" || rawStatus === "PROCESSED") {
    status = "Processing";
  } else if (rawStatus === "SHIPPED") {
    status = "Shipped";
  } else if (rawStatus === "PARTIALLY_ACCEPTED") {
    status = "Partially Accepted";
  } else if (rawStatus === "ONGOING") {
    status = "Ongoing";
  } else if (rawStatus) {
    status = rawStatus
      .toLowerCase()
      .split("_")
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  const buyerFullName = raw.buyer
    ? `${raw.buyer.first_name ?? ""} ${raw.buyer.last_name ?? ""}`.trim()
    : "";
  const buyerName =
    raw.buyer_name ||
    buyerFullName ||
    raw.buyer?.email ||
    raw.buyer_email ||
    "—";

  const vendorFromObj = raw.vendor
    ? raw.vendor.business_name || raw.vendor.name || raw.vendor.shop_name || ""
    : "";
  const firstSeller =
    Array.isArray(raw.sellers) && raw.sellers.length > 0
      ? raw.sellers[0]
      : null;
  const vendorFromSellers = firstSeller
    ? firstSeller.business_name ||
      firstSeller.shop_name ||
      firstSeller.store_name ||
      firstSeller.name ||
      firstSeller.seller_name ||
      `${firstSeller.first_name ?? ""} ${firstSeller.last_name ?? ""}`.trim()
    : "";

  const vendorName =
    raw.vendor_name ||
    raw.business_name ||
    vendorFromObj ||
    vendorFromSellers ||
    raw.seller_name ||
    "—";

  const rawAmount =
    raw.total_price ??
    raw.total_amount ??
    raw.amount ??
    raw.total ??
    (raw.subtotal != null && raw.shipping_cost != null
      ? Number(raw.subtotal) + Number(raw.shipping_cost)
      : null);

  const amount =
    rawAmount != null && rawAmount !== "" && !isNaN(Number(rawAmount))
      ? `₦${Number(rawAmount).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
      : typeof raw.amount === "string" && raw.amount
        ? raw.amount
        : "—";

  // Extract buyer country / location
  const buyerCountry =
    typeof raw.buyer?.country === "object" && raw.buyer?.country !== null
      ? raw.buyer.country.name || raw.buyer.country.code || ""
      : typeof raw.buyer?.country === "string"
        ? raw.buyer.country
        : "";

  const buyerLocationParts = [
    raw.buyer?.city,
    raw.buyer?.state,
    buyerCountry,
  ].filter(Boolean);

  // Extract delivery / shipping country
  const deliveryCountry =
    typeof raw.delivery_address?.country === "object" &&
    raw.delivery_address?.country !== null
      ? raw.delivery_address.country.name ||
        raw.delivery_address.country.code ||
        ""
      : typeof raw.delivery_address?.country === "string"
        ? raw.delivery_address.country
        : typeof raw.shipping_address?.country === "object" &&
            raw.shipping_address?.country !== null
          ? raw.shipping_address.country.name ||
            raw.shipping_address.country.code ||
            ""
          : typeof raw.shipping_address?.country === "string"
            ? raw.shipping_address.country
            : "";

  const deliveryLocationParts = [
    raw.delivery_address?.city || raw.shipping_address?.city,
    raw.delivery_address?.state || raw.shipping_address?.state,
    deliveryCountry,
  ].filter(Boolean);

  const location =
    (deliveryLocationParts.length > 0
      ? deliveryLocationParts.join(", ")
      : null) ||
    (buyerLocationParts.length > 0 ? buyerLocationParts.join(", ") : null) ||
    raw.location ||
    raw.buyer_location ||
    buyerCountry ||
    "—";

  const date = raw.created_at
    ? new Date(raw.created_at).toLocaleDateString("en-GB")
    : (raw.date ?? "—");

  return {
    id: String(
      raw.id ?? raw.order_id ?? raw.order_number ?? raw.payment_no ?? "",
    ),
    buyer: buyerName,
    vendors: vendorName,
    amount,
    location,
    status,
    date,
  };
}

export default function AdminOrdersPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [selectedMonth, setSelectedMonth] = useState("This Month");
  const [summaryStats, setSummaryStats] = useState<{
    // total orders
    totalCount?: number;
    totalAmount?: string;
    // individual statuses
    completed?: { count: number; formatted_amount: string };
    delivered?: { count: number; formatted_amount: string };
    fulfilled?: { count: number; formatted_amount: string };
    pending?: { count: number; formatted_amount: string };
    ongoing?: { count: number; formatted_amount: string };
    returned?: { count: number; formatted_amount: string };
    cancelled?: { count: number; formatted_amount: string };
    disputed?: { count: number };
    // country breakdown
    NG?: number;
    US?: number;
    GH?: number;
    CN?: number;
  }>({});

  const token = useSelector((state: RootState) => state.token.token);

  const [searchVal, setSearchVal] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [trackingNo, setTrackingNo] = useState("");

  const { fetchOrdersList, fetchOrdersSummary, loading } = AdminDetails();

  const getRangeParam = (val: string) => {
    switch (val) {
      case "This Week":
        return "this_week";
      case "This Year":
        return "this_year";
      case "This Month":
      default:
        return "this_month";
    }
  };

  /** Parse the raw API summary response into typed summaryStats */
  const parseSummaryData = (data: any) => {
    const s = data?.summary ?? data;
    const cb = data?.country_breakdown ?? {};
    setSummaryStats({
      totalCount: s?.total_orders?.count ?? 0,
      totalAmount: s?.total_orders?.formatted_amount ?? "₦0.00",
      completed: s?.completed,
      delivered: s?.delivered,
      fulfilled: s?.fulfilled,
      pending: s?.pending,
      ongoing: s?.ongoing,
      returned: s?.returned,
      cancelled: s?.cancelled,
      disputed: s?.disputed,
      NG: cb?.NG ?? 0,
      US: cb?.US ?? 0,
      GH: cb?.GH ?? 0,
      CN: cb?.CN ?? 0,
    });
  };

  const onMonthChange = (value: string) => {
    setSelectedMonth(value);
    if (token) {
      fetchOrdersSummary(
        getRangeParam(value),
        parseSummaryData,
        () => { setSummaryStats({}); },
      );
    }
  };

  // Read from Redux store
  const rawOrders = useSelector(
    (state: RootState) => (state as any).adminOrders?.adminOrders ?? [],
  );
  const apiTotalCount = useSelector(
    (state: RootState) => (state as any).adminOrders?.totalCount ?? 0,
  );

  // Fetch on mount and page change
  useEffect(() => {
    if (token) {
      fetchOrdersList(currentPage);
      fetchOrdersSummary(
        getRangeParam(selectedMonth),
        parseSummaryData,
        () => { setSummaryStats({}); },
      );
    }
  }, [token, currentPage]);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchVal]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = () => setActiveRowId(null);
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  // Map raw API data to table rows, then apply client-side search
  const query = searchVal.trim().toLowerCase();
  const rows: OrderRow[] = rawOrders
    .map(mapToOrderRow)
    .filter((row: OrderRow) => {
      if (!query) return true;
      return (
        row.id.toLowerCase().includes(query) ||
        row.buyer.toLowerCase().includes(query) ||
        row.vendors.toLowerCase().includes(query) ||
        row.location.toLowerCase().includes(query)
      );
    });

  const handleSelectAll = () => {
    if (selectedIds.length === rows.length && rows.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(rows.map((r) => r.id));
    }
  };

  const handleToggleRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleTrackOrder = () => {
    if (!trackingNo.trim()) {
      toast.info("Please enter a tracking number or order ID");
      return;
    }
    router.push(`/dashboard/admin/orders/track/${encodeURIComponent(trackingNo.trim())}`);
  };

  // Derive stats from current page results
  const deliveredCount = rows.filter((r) => r.status === "Delivered").length;
  const ongoingCount = rows.filter((r) => r.status === "Ongoing").length;
  const disputedCount = rows.filter((r) => r.status === "Disputed").length;

  return (
    <div className="space-y-8 duration-300">
      {/* Page Title & Track Order */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full">
        <h1 className="text-xl md:text-c18 font-MontserratSemiBold">
          Order Management
        </h1>
        <div className="flex items-center gap-4 w-full max-w-101.5">
          <Input
            placeholder="Enter Tracking No."
            className="max-w-60"
            value={trackingNo}
            onChange={(e) => setTrackingNo(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleTrackOrder();
            }}
          />
          <Button
            variant="secondary"
            onClick={handleTrackOrder}
            className="max-w-37.5"
          >
            Track Order
          </Button>
        </div>
      </div>

      {/* Stats */}
      {/* <div className="justify-between flex items-center w-full">
        <StatusFrame
          title="Total Orders"
          quantity={summaryStats.total ?? apiTotalCount}
          icon={OrdersIcon}
          width={26}
          height={22}
        />
        <StatusFrame
          title="Delivered Orders"
          quantity={summaryStats.delivered ?? deliveredCount}
          icon={activeIcon}
          width={26}
          height={26}
        />
        <StatusFrame
          title="Ongoing Orders"
          quantity={summaryStats.ongoing ?? ongoingCount}
          icon={inActiveIcon}
          width={18}
          height={26}
        />
        <StatusFrame
          title="Disputed Orders"
          quantity={summaryStats.disputed ?? disputedCount}
          icon={suspendedUserIcon}
          width={26}
          height={26}
        />
      </div> */}
      <div className="flex flex-col md:flex-row flex-wrap  gap-6 md:gap-8">
        {/* ── Orders card ── */}
        <div className="w-full max-w-135 bg-ffffff p-6 rounded-c16">
          <div className="flex items-center  justify-between pb-4 border-b border-000000/4">
            <p>orders</p>
            <FilterDropdown
              options={["This Week", "This Month", "This Year"]}
              defaultValue="This Month"
              onChange={onMonthChange}
              className="!rounded-c8 !h-10 !py-0 !px-3 !gap-4 !shadow-custom"
            />
          </div>
          <div className="mt-8 flex  align-baseline gap-c42 h-42.5 ">
            <div className="flex flex-col justify-between  h-full ">
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
                    {(summaryStats.totalCount ?? 0).toLocaleString()}
                  </p>
                  <span className="text-c12 font-MontserratMedium text-000000/44">
                    {summaryStats.totalAmount ?? "₦0.00"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 ">
                <div className=" min-w-[51px]">
                  <p className="text-c18 font-MontserratSemiBold">NG</p>
                  <span className="text-c12 font-MontserratMedium text-000000/44">
                    {(summaryStats.NG ?? 0).toLocaleString()}
                  </span>
                </div>
                <div className=" min-w-[51px]">
                  <p className="text-c18 font-MontserratSemiBold">US</p>
                  <span className="text-c12 font-MontserratMedium text-000000/44">
                    {(summaryStats.US ?? 0).toLocaleString()}
                  </span>
                </div>
                <div className=" min-w-[51px]">
                  <p className="text-c18 font-MontserratSemiBold">GH</p>
                  <span className="text-c12 font-MontserratMedium text-000000/44">
                    {(summaryStats.GH ?? 0).toLocaleString()}
                  </span>
                </div>
                <div className=" min-w-[51px]">
                  <p className="text-c18 font-MontserratSemiBold">CN</p>
                  <span className="text-c12 font-MontserratMedium text-000000/44">
                    {(summaryStats.CN ?? 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="h-full ">
              <div className="grid grid-cols-2  gap-6">
                <div className=" min-w-[51px] flex flex-col">
                  <p className="text-c18 font-MontserratSemiBold">
                    {(summaryStats.completed?.count ?? 0).toLocaleString()}
                  </p>
                  <span className="text-c12 font-MontserratMedium text-000000/44">
                    {summaryStats.completed?.formatted_amount ?? "₦0.00"}
                  </span>
                  <span className="text-[#28A745]  bg-[#28A745]/12 rounded-c4 text-c10 mt-1 h-5 w-fit flex items-center justify-center font-MontserratMedium py-0.5 px-2">
                    Completed
                  </span>
                </div>
                <div className=" min-w-[51px] flex flex-col">
                  <p className="text-c18 font-MontserratSemiBold">
                    {(summaryStats.fulfilled?.count ?? 0).toLocaleString()}
                  </p>
                  <span className="text-c12 font-MontserratMedium text-000000/44">
                    {summaryStats.fulfilled?.formatted_amount ?? "₦0.00"}
                  </span>
                  <span className="text-[#0070E9]  bg-[#0070E9]/12 rounded-c4 text-c10 mt-1 h-5 w-fit flex items-center justify-center font-MontserratMedium py-0.5 px-2">
                    Fulfilled
                  </span>
                </div>
                <div className=" min-w-[51px] flex flex-col">
                  <p className="text-c18 font-MontserratSemiBold">
                    {(summaryStats.pending?.count ?? 0).toLocaleString()}
                  </p>
                  <span className="text-c12 font-MontserratMedium text-000000/44">
                    {summaryStats.pending?.formatted_amount ?? "₦0.00"}
                  </span>
                  <span className="text-[#FFAC06]  bg-[#FFAC06]/12 rounded-c4 text-c10 mt-1 h-5 w-fit flex items-center justify-center font-MontserratMedium py-0.5 px-2">
                    Pending
                  </span>
                </div>
                <div className=" min-w-[51px] flex flex-col">
                  <p className="text-c18 font-MontserratSemiBold">
                    {(summaryStats.returned?.count ?? 0).toLocaleString()}
                  </p>
                  <span className="text-c12 font-MontserratMedium text-000000/44">
                    {summaryStats.returned?.formatted_amount ?? "₦0.00"}
                  </span>
                  <span className="text-[#CC0000]  bg-[#CC0000]/12 rounded-c4 text-c10 mt-1 h-5 w-fit flex items-center justify-center font-MontserratMedium py-0.5 px-2">
                    Returned
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Revenue & Dispute card ── */}
        <div className="w-full max-w-135 bg-ffffff p-6 rounded-c16 ">
          <div className="flex items-center justify-between pb-4 border-b border-000000/4">
            <p>Revenue &amp; Dispute</p>
            <FilterDropdown
              options={["This Week", "This Month", "This Year"]}
              defaultValue="This Month"
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
                    alt="Orders"
                    width={25}
                    height={25}
                    className="opacity-56"
                  />
                </div>
                <div className="space-y-4">
                  <p className="text-c12 font-MontserratMedium text-000000/44">
                    Total Revenue
                  </p>
                  <span className="text-c28 font-MontserratSemiBold pt-4 ">
                    {summaryStats.totalAmount ?? "₦0.00"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-6.75 ">
                <div className=" min-w-[51px] ">
                  <span className="text-c12  font-MontserratMedium text-000000/44">
                    Delivered
                  </span>
                  <p className="text-c18 mt-3 font-MontserratSemiBold">
                    {summaryStats.delivered?.formatted_amount ?? "₦0.00"}
                  </p>
                </div>
                <div className=" min-w-[51px] ">
                  <span className="text-c12  font-MontserratMedium text-000000/44">
                    Ongoing
                  </span>
                  <p className="text-c18 mt-3 font-MontserratSemiBold">
                    {summaryStats.ongoing?.formatted_amount ?? "₦0.00"}
                  </p>
                </div>
              </div>
            </div>
            <div  className="flex flex-col justify-between">
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
                  <span className="text-c28 font-MontserratSemiBold pt-4 ">
                    {(summaryStats.disputed?.count ?? 0).toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="flex gap-[16.5px]">
                <div className=" min-w-[51px] flex flex-col">
                  <p className="text-c18 font-MontserratSemiBold">
                    {(summaryStats.cancelled?.count ?? 0).toLocaleString()}
                  </p>
                  <span className="text-c12 font-MontserratMedium text-000000/44">
                    {summaryStats.cancelled?.formatted_amount ?? "₦0.00"}
                  </span>
                  <span className="text-[#28A745]  bg-[#28A745]/12 rounded-c4 text-c10 mt-1 h-5 w-fit flex items-center justify-center font-MontserratMedium py-0.5 px-2">
                    Cancelled
                  </span>
                </div>
                <div className=" min-w-[51px] flex flex-col">
                  <p className="text-c18 font-MontserratSemiBold">
                    {(summaryStats.disputed?.count ?? 0).toLocaleString()}
                  </p>
                  <span className="text-c12 font-MontserratMedium text-000000/44">
                    —
                  </span>
                  <span className="text-[#0070E9]  bg-[#0070E9]/12 rounded-c4 text-c10 mt-1 h-5 w-fit flex items-center justify-center font-MontserratMedium py-0.5 px-2">
                    Disputed
                  </span>
                </div>
                <div className=" min-w-[51px] flex flex-col">
                  <p className="text-c18 font-MontserratSemiBold">
                    {(summaryStats.returned?.count ?? 0).toLocaleString()}
                  </p>
                  <span className="text-c12 font-MontserratMedium text-000000/44">
                    {summaryStats.returned?.formatted_amount ?? "₦0.00"}
                  </span>
                  <span className="text-[#CC0000]  bg-[#CC0000]/12 rounded-c4 text-c10 mt-1 h-5 w-fit flex items-center justify-center font-MontserratMedium py-0.5 px-2">
                    Returned
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Orders List Table */}
      <div className="bg-white rounded-2xl p-6 border border-000000/4">
        <h2 className="text-base font-MontserratNormal text-000000/68 mb-6">
          List of Orders
        </h2>

        {/* Filters Header */}
        <AdminListHeader
          searchVal={searchVal}
          setSearchVal={setSearchVal}
          placeholder="Search orders by ID, buyer or vendor..."
          searchExpandable={true}
        />

        {/* Data Table */}
        <OrdersTable
          rows={rows}
          selectedIds={selectedIds}
          activeRowId={activeRowId}
          loading={loading}
          onSelectAll={handleSelectAll}
          onToggleRow={handleToggleRow}
          onSetActiveRowId={setActiveRowId}
        />

        {/* Pagination */}
        {apiTotalCount > PAGE_SIZE && (
          <div className="flex justify-end mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(apiTotalCount / PAGE_SIZE)}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
