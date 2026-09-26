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
import TotalReturn from "@/assets/admin/disputetotal.svg";

import FilterDropdown from "@/components/ui/seller-components/body-components/over-view/Filter-components/filterButton";
import AdminOrdersAndDisputesSummaryCards from "@/components/admin-components/orders/AdminOrdersAndDisputesSummaryCards";
import type { AdminDisputeStats } from "@/types/admin";

import OrdersTable, {
  OrderRow,
} from "@/components/admin-components/orders/OrdersTable";
import OrdersTabs, {
  OrdersTabKey,
} from "@/components/admin-components/orders/OrdersTabs";
import CancellationRequestsTable, {
  CancellationRequestRow,
  mapCancellationRequest,
} from "@/components/admin-components/orders/CancellationRequestsTable";
import CancellationDetailModal from "@/components/ui/Modals/admin/CancellationDetailModal";
import RejectCancellationModal from "@/components/ui/Modals/admin/RejectCancellationModal";
import ResultModal from "@/components/ui/forms/resultModal";
import Image from "next/image";
import { getOrderDisplayStatus } from "@/helpers/admin/orderStatusHelper";
import StatusFrame from "@/components/admin-components/users/status-frame";
import QuickTrackDropdown from "@/components/admin-components/orders/QuickTrackDropdown";
import TrackOrderModal from "@/components/admin-components/orders/TrackOrderModal";
import RequestPickupModal from "@/components/admin-components/orders/RequestPickupModal";
import { useOrderRefresh } from "@/hooks/useOrderRefresh";

const PAGE_SIZE = 20;

/** Map a raw API order object to the shape OrdersTable expects */
function mapToOrderRow(raw: any): OrderRow {
  const status = getOrderDisplayStatus(raw);

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
    id: String(raw.id ?? raw.order_id ?? raw.order_number ?? ""),
    orderId: raw.order_id ?? "",
    trackingNumber:
      raw.tracking_number ||
      raw.tracking_no ||
      raw.seller_tracking_id_to_hub ||
      raw.admin_tracking_id_to_buyer ||
      "",
    buyer: buyerName,
    vendors: vendorName,
    amount,
    location,
    status,
    date,
    hasDispute: status.toLowerCase().includes("dispute") ||
      Boolean(raw.has_dispute || raw.dispute || raw.dispute_status),
  };
}

export default function AdminOrdersPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryType = searchParams.get("type");

  useEffect(() => {
    if (queryType === "refund-dispute") {
      router.replace("/dashboard/admin/orders/refund-dispute");
    }
  }, [queryType, router]);

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
  const [disputeStats, setDisputeStats] = useState<AdminDisputeStats | null>(
    null,
  );

  const token = useSelector((state: RootState) => state.token.token);

  const [searchVal, setSearchVal] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [isPickupModalOpen, setIsPickupModalOpen] = useState(false);

  // ── Filter Tabs ──────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<OrdersTabKey>("all");

  // ── Cancellation Requests ────────────────────────────────────────────────
  const [cancellationRequests, setCancellationRequests] = useState<
    CancellationRequestRow[]
  >([]);
  const [cancellationLoading, setCancellationLoading] = useState(false);
  const [cancellationSubTab, setCancellationSubTab] = useState<
    "pending" | "approved" | "rejected"
  >("pending");

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
    fetchAdminDisputeStats,
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
      fetchOrdersSummary(getRangeParam(value), parseSummaryData, () => {
        setSummaryStats({});
      });
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
        disputed: "DISPUTED",
        cancelled: "CANCELLED",
      };
      fetchOrdersList(currentPage, statusMap[activeTab]);
    }
  }, [token, currentPage, activeTab, cancellationSubTab]);

  // Fetch summary and dispute stats on mount
  useEffect(() => {
    if (token) {
      fetchOrdersSummary(getRangeParam(selectedMonth), parseSummaryData, () => {
        setSummaryStats({});
      });
      fetchAdminDisputeStats((stats: any) => {
        setDisputeStats(stats);
      });
    }
  }, [token]);

  useOrderRefresh(() => {
    if (!token) return;

    if (activeTab === "cancel_request") {
      fetchCancellationRequests(
        cancellationSubTab,
        (data: any[]) => setCancellationRequests(data.map(mapCancellationRequest)),
      );
    } else {
      const statusMap: Record<string, string | undefined> = {
        all: undefined,
        unprocessed: "UNPROCESSED",
        processed: "PROCESSED",
        shipped: "SHIPPED_TO_BUYER",
        delivered: "DELIVERED",
        completed: "COMPLETED",
        disputed: "DISPUTED",
        cancelled: "CANCELLED",
      };
      fetchOrdersList(currentPage, statusMap[activeTab]);
    }

    fetchOrdersSummary(getRangeParam(selectedMonth), parseSummaryData);
    fetchAdminDisputeStats((stats: any) => setDisputeStats(stats));
  });

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
      },
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
      },
    );
  };

  // Derive stats from current page results
  const deliveredCount = rows.filter((r) => r.status === "Delivered").length;
  const ongoingCount = rows.filter((r) => r.status === "Ongoing").length;
  const disputedCount = rows.filter((r) => r.status === "Disputed").length;

  return (
    <div className="space-y-8 duration-300 bg-white rounded-2xl py-6 px-8 border border-000000/4">
      {/* Page Title & Quick Track */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-4">
        <h1 className="text-xl md:text-c20 font-MontserratMedium">
          Order Management
        </h1>
        <QuickTrackDropdown
          onOpenTrackModal={() => setIsTrackModalOpen(true)}
          onOpenPickupModal={() => setIsPickupModalOpen(true)}
        />
      </div>

      {/* Stats */}
      <div className="h-43 w-full  flex justify-center items-end">
        <div className="justify-between h-29 flex items-center w-full">
          <StatusFrame
            title="Total Orders"
            quantity={summaryStats.totalCount ?? apiTotalCount}
            icon={OrdersIcon}
            width={26}
            height={22}
          />
          <StatusFrame
            title="Delivered Orders"
            quantity={summaryStats.delivered?.count ?? deliveredCount}
            icon={activeIcon}
            width={26}
            height={26}
          />
          <StatusFrame
            title="Ongoing Orders"
            quantity={summaryStats.ongoing?.count ?? ongoingCount}
            icon={inActiveIcon}
            width={18}
            height={26}
          />
          <StatusFrame
            title="Disputed Orders"
            quantity={summaryStats.disputed?.count ?? disputedCount}
            icon={suspendedUserIcon}
            width={26}
            height={26}
          />
        </div>
      </div>
      {/* ── Summary Cards (Orders + Revenue & Dispute from /disputes/admin/stats) ── */}
      {/* <AdminOrdersAndDisputesSummaryCards
        selectedMonth={selectedMonth}
        onMonthChange={onMonthChange}
        summaryStats={summaryStats}
        disputeStats={disputeStats}
      /> */}

      {/* Orders List Table */}
      <div className="p-6 rounded-c16 border border-000000/4">
        <h2 className="text-base font-MontserratNormal text-000000/68 mb-6">
          List of Orders
        </h2>

        {/* ── Tab Filter Bar ── */}
        {/* <OrdersTabs
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
        /> */}

        {/* {activeTab === "cancel_request" ? (
          <>
            
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
            
            <AdminListHeader
              searchVal={searchVal}
              setSearchVal={setSearchVal}
              placeholder="Search orders by ID, buyer or vendor..."
              searchExpandable={true}
            />

           
            <OrdersTable
              rows={rows}
              selectedIds={selectedIds}
              activeRowId={activeRowId}
              loading={loading}
              onSelectAll={handleSelectAll}
              onToggleRow={handleToggleRow}
              onSetActiveRowId={setActiveRowId}
            />

          
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
        )} */}

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
            onViewDispute={(row) =>
              router.push(
                `/dashboard/admin/orders/${row.id}?from=Orders&viewDispute=true`,
              )
            }
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

      {/* ── Track Order Modal ── */}
      <TrackOrderModal
        isOpen={isTrackModalOpen}
        onClose={() => setIsTrackModalOpen(false)}
      />

      {/* ── Request Pickup Modal ── */}
      <RequestPickupModal
        isOpen={isPickupModalOpen}
        onClose={() => setIsPickupModalOpen(false)}
      />
    </div>
  );
}
