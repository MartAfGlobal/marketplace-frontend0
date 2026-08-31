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
import OrdersTabs, { OrdersTabKey } from "@/components/admin-components/orders/OrdersTabs";
import CancellationRequestsTable, {
  CancellationRequestRow,
  mapCancellationRequest,
} from "@/components/admin-components/orders/CancellationRequestsTable";
import CancellationDetailModal from "@/components/ui/Modals/admin/CancellationDetailModal";
import RejectCancellationModal from "@/components/ui/Modals/admin/RejectCancellationModal";
import ResultModal from "@/components/ui/forms/resultModal";
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

  // Extract state for location column
  const extractState = (val: any): string => {
    if (!val) return "";
    if (typeof val === "string") return val.trim();
    if (typeof val === "object") {
      return val.name || val.state_name || val.title || val.code || "";
    }
    return String(val).trim();
  };

  const stateVal =
    extractState(raw.delivery_address?.state) ||
    extractState(raw.shipping_address?.state) ||
    extractState(raw.shipping_address_snapshot?.state) ||
    extractState(raw.shipping_info?.state) ||
    extractState(raw.buyer?.state) ||
    extractState(raw.buyer?.shipping_address?.state) ||
    extractState(raw.buyer?.default_address?.state) ||
    extractState(raw.delivery_state) ||
    extractState(raw.shipping_state) ||
    extractState(raw.state);

  const location = stateVal || raw.location || raw.buyer_location || "—";

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

  // ── Filter Tabs ──────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<OrdersTabKey>("all");

  // ── Cancellation Requests ────────────────────────────────────────────────
  const [cancellationRequests, setCancellationRequests] = useState<CancellationRequestRow[]>([]);
  const [cancellationLoading, setCancellationLoading] = useState(false);
  const [cancellationSubTab, setCancellationSubTab] = useState<"pending" | "approved" | "rejected">("pending");

  // ── Cancellation Modals State ─────────────────────────────────────────────
  const [selectedCancellation, setSelectedCancellation] =
    useState<CancellationRequestRow | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isApproveConfirmOpen, setIsApproveConfirmOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [targetCancellation, setTargetCancellation] =
    useState<CancellationRequestRow | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [resultModalState, setResultModalState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    result: "success" | "warning" | "error";
  }>({
    isOpen: false,
    title: "",
    message: "",
    result: "success",
  });

  const {
    fetchOrdersList,
    fetchOrdersSummary,
    fetchCancellationRequests,
    approveCancellationRequest,
    rejectCancellationRequest,
    loading,
  } = AdminDetails();

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

  // Fetch on mount, page change, or tab change
  useEffect(() => {
    if (!token) return;
    if (activeTab === "cancel_request") {
      setCancellationLoading(true);
      fetchCancellationRequests(
        cancellationSubTab,
        (data: any[]) => {
          setCancellationRequests(data.map(mapCancellationRequest));
          setCancellationLoading(false);
        },
        () => setCancellationLoading(false),
      );
    } else {
      const statusMap: Record<string, string | undefined> = {
        all: undefined,
        unprocessed: "UNPROCESSED",
        processed: "PROCESSED",
        shipped: "SHIPPED_TO_BUYER",
        delivered: "DELIVERED",
        completed: "COMPLETED",
        cancelled: "CANCELLED",
      };
      fetchOrdersList(currentPage, statusMap[activeTab]);
    }
  }, [token, currentPage, activeTab, cancellationSubTab]);

  // Fetch summary on mount
  useEffect(() => {
    if (token) {
      fetchOrdersSummary(
        getRangeParam(selectedMonth),
        parseSummaryData,
        () => { setSummaryStats({}); },
      );
    }
  }, [token]);

  // Reset page when search or tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchVal, activeTab]);

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

  const loadCancellationRequests = () => {
    setCancellationLoading(true);
    fetchCancellationRequests(
      cancellationSubTab,
      (data: any[]) => {
        setCancellationRequests(data.map(mapCancellationRequest));
        setCancellationLoading(false);
      },
      () => setCancellationLoading(false),
    );
  };

  const handleViewCancellationDetails = (row: CancellationRequestRow) => {
    setSelectedCancellation(row);
    setIsDetailsModalOpen(true);
  };

  const handleInitiateApprove = (row: CancellationRequestRow) => {
    setTargetCancellation(row);
    setIsApproveConfirmOpen(true);
  };

  const handleInitiateReject = (row: CancellationRequestRow) => {
    setTargetCancellation(row);
    setIsRejectModalOpen(true);
  };

  const handleConfirmApprove = () => {
    if (!targetCancellation) return;
    setActionLoading(true);
    approveCancellationRequest(
      targetCancellation.id,
      () => {
        setActionLoading(false);
        setIsApproveConfirmOpen(false);
        setResultModalState({
          isOpen: true,
          title: "Cancellation Approved",
          message: "The cancellation request has been successfully approved.",
          result: "success",
        });
        loadCancellationRequests();
      },
      (err: any) => {
        setActionLoading(false);
        setIsApproveConfirmOpen(false);
        const errMsg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Failed to approve cancellation request. Super-admin permission is required.";
        setResultModalState({
          isOpen: true,
          title: "Approval Failed",
          message: errMsg,
          result: "error",
        });
      }
    );
  };

  const handleConfirmReject = (notes: string) => {
    if (!targetCancellation) return;
    setActionLoading(true);
    rejectCancellationRequest(
      targetCancellation.id,
      { rejection_notes: notes },
      () => {
        setActionLoading(false);
        setIsRejectModalOpen(false);
        setResultModalState({
          isOpen: true,
          title: "Cancellation Rejected",
          message: "The cancellation request has been rejected successfully.",
          result: "success",
        });
        loadCancellationRequests();
      },
      (err: any) => {
        setActionLoading(false);
        setIsRejectModalOpen(false);
        const errMsg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Failed to reject cancellation request.";
        setResultModalState({
          isOpen: true,
          title: "Rejection Failed",
          message: errMsg,
          result: "error",
        });
      }
    );
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

        {/* ── Tab Filter Bar ── */}
        <OrdersTabs activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab)} />

        {activeTab === "cancel_request" ? (
          <>
            {/* Sub-tabs for cancellation status */}
            <div className="flex items-center gap-4 mb-5">
              {(["pending", "approved", "rejected"] as const).map((sub) => (
                <button
                  key={sub}
                  onClick={() => setCancellationSubTab(sub)}
                  className={`capitalize text-c12 font-MontserratSemiBold pb-1 border-b-2 transition-colors ${
                    cancellationSubTab === sub
                      ? "text-6a0dad border-b-6a0dad"
                      : "text-000000/44 border-b-transparent hover:text-6a0dad"
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>

            <CancellationRequestsTable
              rows={cancellationRequests}
              loading={cancellationLoading}
              activeRowId={activeRowId}
              onSetActiveRowId={setActiveRowId}
              onViewDetails={handleViewCancellationDetails}
              onApprove={handleInitiateApprove}
              onReject={handleInitiateReject}
            />
          </>
        ) : (
          <>
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
          </>
        )}
      </div>

      {/* ── Cancellation Request Details Modal ── */}
      <CancellationDetailModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedCancellation(null);
        }}
        request={selectedCancellation}
        onApprove={(req) => {
          setIsDetailsModalOpen(false);
          handleInitiateApprove(req);
        }}
        onReject={(req) => {
          setIsDetailsModalOpen(false);
          handleInitiateReject(req);
        }}
      />

      {/* ── Approve Confirmation Warning Modal ── */}
      <ResultModal
        isOpen={isApproveConfirmOpen}
        result="warning"
        title="Approve Order Cancellation"
        message={`Are you sure you want to approve this cancellation request for order #${targetCancellation?.orderId}? This will cancel the order.`}
        buttenText="Yes, Approve"
        onConfirm={handleConfirmApprove}
        onCancel={() => {
          if (!actionLoading) setIsApproveConfirmOpen(false);
        }}
        loading={actionLoading}
      />

      {/* ── Reject Cancellation Modal with Notes ── */}
      <RejectCancellationModal
        isOpen={isRejectModalOpen}
        onClose={() => {
          if (!actionLoading) setIsRejectModalOpen(false);
        }}
        onConfirm={handleConfirmReject}
        loading={actionLoading}
        requestOrderId={targetCancellation?.orderId}
      />

      {/* ── Result Modal for Success / Error ── */}
      <ResultModal
        isOpen={resultModalState.isOpen}
        result={resultModalState.result}
        title={resultModalState.title}
        message={resultModalState.message}
        buttenText="Done"
        onConfirm={() =>
          setResultModalState((prev) => ({ ...prev, isOpen: false }))
        }
        onCancel={() =>
          setResultModalState((prev) => ({ ...prev, isOpen: false }))
        }
      />
    </div>
  );
}

