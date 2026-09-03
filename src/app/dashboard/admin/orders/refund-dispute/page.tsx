"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { toast } from "sonner";

import AdminListHeader from "@/components/ui/admin-components/AdminListHeader";
import Pagination from "@/components/ui/seller-components/body-components/products/pignation-button";
import { Button } from "@/components/ui/Button/Button";
import { Input } from "@/components/ui/forms/Input";
import { AdminDetails } from "@/helpers/admin/adminHelper";
import AdminOrdersAndDisputesSummaryCards, {
  OrdersSummaryStats,
} from "@/components/admin-components/orders/AdminOrdersAndDisputesSummaryCards";
import DisputeTabs, {
  DisputeStatusTabKey,
} from "@/components/admin-components/disputes/DisputeTabs";
import DisputesTable from "@/components/admin-components/disputes/DisputesTable";
import type { AdminDisputeItem, AdminDisputeStats, DisputeTableRow } from "@/types/admin";

const PAGE_SIZE = 20;

function mapToDisputeRow(raw: any): DisputeTableRow {
  const buyer = raw.buyer ?? {};
  const buyerName =
    raw.buyer_name ||
    (buyer.first_name || buyer.last_name
      ? `${buyer.first_name ?? ""} ${buyer.last_name ?? ""}`.trim()
      : null) ||
    raw.buyer_email ||
    raw.initiated_by ||
    raw.initiator ||
    "—";

  const seller = raw.seller ?? raw.vendor ?? {};
  const vendorName =
    raw.vendor_name ||
    raw.seller_name ||
    seller.store_name ||
    seller.business_name ||
    seller.name ||
    (seller.first_name ? `${seller.first_name} ${seller.last_name ?? ""}`.trim() : null) ||
    "—";

  const orderId =
    raw.order_number ||
    raw.order_no ||
    raw.order_id ||
    (raw.order ? String(raw.order.id || raw.order) : null) ||
    "—";

  const rawAmount =
    raw.requested_refund_amount ??
    raw.amount ??
    raw.total_amount ??
    raw.total ??
    null;

  const amount =
    rawAmount != null && rawAmount !== "" && !isNaN(Number(rawAmount))
      ? `₦${Number(rawAmount).toLocaleString()}`
      : typeof raw.amount === "string" && raw.amount
      ? raw.amount
      : "—";

  const disputeType =
    raw.dispute_type_display ||
    raw.dispute_type ||
    raw.type ||
    "Refund";

  const reason =
    raw.cancellation_reason_title ||
    raw.reason_title ||
    raw.reason ||
    raw.description ||
    "—";

  const date = raw.created_at
    ? new Date(raw.created_at).toLocaleDateString("en-GB")
    : raw.date ?? "—";

  return {
    id: String(raw.id ?? ""),
    disputeNumber: raw.dispute_number || undefined,
    orderId: String(orderId),
    buyer: buyerName,
    buyerEmail: raw.buyer?.email || raw.buyer_email,
    vendor: vendorName,
    vendorEmail: raw.seller?.email || raw.vendor_email,
    disputeType,
    reason,
    amount,
    status: raw.status_display || raw.status || "REQUESTED",
    date,
    quantity: raw.affected_quantity ?? undefined,
    raw,
  };
}

export default function AdminRefundAndDisputePage() {
  const router = useRouter();
  const token = useSelector((state: RootState) => state.token.token);

  const [selectedMonth, setSelectedMonth] = useState("This Month");
  const [summaryStats, setSummaryStats] = useState<OrdersSummaryStats>({});
  const [disputeStats, setDisputeStats] = useState<AdminDisputeStats | null>(null);

  const [searchVal, setSearchVal] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [trackingNo, setTrackingNo] = useState("");

  // Default active tab is "REQUESTED" matching /disputes/admin?status=REQUESTED
  const [activeTab, setActiveTab] = useState<DisputeStatusTabKey>("REQUESTED");
  const [rawDisputes, setRawDisputes] = useState<any[]>([]);
  const [disputesTotalCount, setDisputesTotalCount] = useState(0);
  const [disputesLoading, setDisputesLoading] = useState(false);

  const {
    fetchOrdersSummary,
    fetchAdminDisputeStats,
    fetchAdminDisputesList,
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

  const parseOrderSummary = (data: any) => {
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
        parseOrderSummary,
        () => setSummaryStats({})
      );
    }
  };

  // Load dispute stats and order summary stats on mount
  useEffect(() => {
    if (!token) return;

    fetchOrdersSummary(
      getRangeParam(selectedMonth),
      parseOrderSummary,
      () => setSummaryStats({})
    );

    fetchAdminDisputeStats(
      (stats: any) => {
        console.log("dispute stats:", stats);
        setDisputeStats(stats);
      },
      (err: any) => {
        console.error("Dispute stats load error:", err);
      }
    );
  }, [token]);

  // Load dispute table data when tab, page, or search changes
  useEffect(() => {
    if (!token) return;
    setDisputesLoading(true);

    fetchAdminDisputesList(
      {
        status: activeTab,
        page: currentPage,
        search: searchVal,
      },
      (resData: any) => {
        console.log("dispute list:", resData);
        const results =
          resData?.results ??
          resData?.data?.results ??
          resData?.data ??
          (Array.isArray(resData) ? resData : []);
        const total =
          resData?.count ??
          resData?.data?.count ??
          (Array.isArray(results) ? results.length : 0);

        console.log("dispute items:", results, "total:", total);
        setRawDisputes(Array.isArray(results) ? results : []);
        setDisputesTotalCount(total);
        setDisputesLoading(false);
      },
      () => {
        setDisputesLoading(false);
      }
    );
  }, [token, activeTab, currentPage, searchVal]);

  // Close row popup on outside click
  useEffect(() => {
    const handleOutsideClick = () => setActiveRowId(null);
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  const handleSelectAll = () => {
    if (selectedIds.length === rawDisputes.length && rawDisputes.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(rawDisputes.map((r) => String(r.id)));
    }
  };

  const handleToggleRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleTrackOrder = () => {
    if (!trackingNo.trim()) {
      toast.info("Please enter a tracking number or order ID");
      return;
    }
    router.push(
      `/dashboard/admin/orders/track/${encodeURIComponent(trackingNo.trim())}`
    );
  };

  const rows: DisputeTableRow[] = rawDisputes.map(mapToDisputeRow);

  return (
    <div className="space-y-8 duration-300">
      {/* ── Page Title & Track Order ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-4">
        <div>
          <h1 className="text-xl md:text-c18 font-MontserratSemiBold text-[#161616]">
            Dispute &amp; Return Management
          </h1>
          <p className="text-xs text-gray-500 font-MontserratNormal mt-1">
            Review and resolve dispute and refund requests from buyers and sellers.
          </p>
        </div>

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

      {/* ── Shared Summary Cards (Orders + Revenue & Dispute from /disputes/admin/stats) ── */}
      <AdminOrdersAndDisputesSummaryCards
        selectedMonth={selectedMonth}
        onMonthChange={onMonthChange}
        summaryStats={summaryStats}
        disputeStats={disputeStats}
      />

      {/* ── Disputes & Returns Table Section (Without order filter tabs) ── */}
      <div className="bg-white rounded-2xl p-6 border border-000000/4">
        <h2 className="text-base font-MontserratNormal text-000000/68 mb-6">
          List of Disputes &amp; Returns
        </h2>

        {/* Status filter tabs for disputes */}
        <DisputeTabs
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setCurrentPage(1);
          }}
          counts={{
            REQUESTED: disputeStats?.requested ?? disputeStats?.requested_count,
            OPEN: disputeStats?.open ?? disputeStats?.open_count,
            ESCALATED: disputeStats?.escalated ?? disputeStats?.escalated_count,
            RESOLVED: disputeStats?.resolved ?? disputeStats?.resolved_count,
            REJECTED: disputeStats?.rejected ?? disputeStats?.rejected_count,
            ALL: disputeStats?.total_disputes ?? disputeStats?.total,
          }}
        />

        {/* Filter header with search */}
        <AdminListHeader
          searchVal={searchVal}
          setSearchVal={(val) => {
            setSearchVal(val);
            setCurrentPage(1);
          }}
          placeholder="Search disputes by ID, order number, buyer or vendor..."
          searchExpandable={true}
        />

        {/* Dispute Table */}
        <DisputesTable
          rows={rows}
          selectedIds={selectedIds}
          activeRowId={activeRowId}
          loading={disputesLoading}
          onSelectAll={handleSelectAll}
          onToggleRow={handleToggleRow}
          onSetActiveRowId={setActiveRowId}
          onViewDetails={(row) =>
            router.push(`/dashboard/admin/orders/refund-dispute/${row.id}`)
          }
        />

        {/* Pagination */}
        {disputesTotalCount > PAGE_SIZE && (
          <div className="flex justify-end mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(disputesTotalCount / PAGE_SIZE)}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
