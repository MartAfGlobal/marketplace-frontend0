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

import FilterDropdown from "@/components/ui/seller-components/body-components/over-view/Filter-components/filterButton";

import OrdersTable, {
  OrderRow,
} from "@/components/admin-components/orders/OrdersTable";
import StatusFrame from "@/components/admin-components/users/status-frame";

const PAGE_SIZE = 20;

/** Map a raw API order object to the shape OrdersTable expects */
function mapToOrderRow(raw: any): OrderRow {
  // Normalise status — the API may return lowercase or different casing
  const rawStatus = (raw.status ?? raw.order_status ?? "").toLowerCase();
  let status: OrderRow["status"] = "Ongoing";
  if (rawStatus === "delivered" || rawStatus === "completed") status = "Delivered";
  else if (rawStatus === "disputed" || rawStatus === "dispute") status = "Disputed";

  const buyerFullName = raw.buyer
    ? `${raw.buyer.first_name ?? ""} ${raw.buyer.last_name ?? ""}`.trim()
    : "";
  const buyerName =
    (raw.buyer_name || buyerFullName || raw.buyer_email || "—");

  const vendorFromObj = raw.vendor
    ? (raw.vendor.business_name || raw.vendor.name || "")
    : "";
  const vendorName =
    (raw.vendor_name ||
    raw.business_name ||
    vendorFromObj ||
    raw.seller_name ||
    "—");

  const amount =
    raw.total_amount != null
      ? `₦${Number(raw.total_amount).toLocaleString()}`
      : (raw.amount ?? "—");

  const location =
    raw.delivery_address?.city ??
    raw.delivery_address?.state ??
    raw.location ??
    "—";

  const date = raw.created_at
    ? new Date(raw.created_at).toLocaleDateString("en-GB")
    : raw.date ?? "—";

  return {
    id: String(raw.id ?? raw.order_id ?? raw.order_number ?? ""),
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
    total?: number;
    delivered?: number;
    ongoing?: number;
    disputed?: number;
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

  const onMonthChange = (value: string) => {
    setSelectedMonth(value);
    if (token) {
      fetchOrdersSummary(
        getRangeParam(value),
        (data: any) => {
          setSummaryStats({
            total: data?.total_orders ?? data?.total,
            delivered: data?.delivered_orders ?? data?.delivered,
            ongoing: data?.ongoing_orders ?? data?.ongoing,
            disputed: data?.disputed_orders ?? data?.disputed,
          });
        },
        () => {
          setSummaryStats({});
        }
      );
    }
  };

  // Read from Redux store
  const rawOrders = useSelector(
    (state: RootState) => (state as any).adminOrders?.adminOrders ?? []
  );
  const apiTotalCount = useSelector(
    (state: RootState) => (state as any).adminOrders?.totalCount ?? 0
  );

  // Fetch on mount and page change
  useEffect(() => {
    if (token) {
      fetchOrdersList(currentPage);
      fetchOrdersSummary(
        getRangeParam(selectedMonth),
        (data: any) => {
          setSummaryStats({
            total: data?.total_orders ?? data?.total,
            delivered: data?.delivered_orders ?? data?.delivered,
            ongoing: data?.ongoing_orders ?? data?.ongoing,
            disputed: data?.disputed_orders ?? data?.disputed,
          });
        },
        () => {
          setSummaryStats({});
        }
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
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleTrackOrder = () => {
    if (!trackingNo.trim()) {
      toast.info("Please enter a tracking number");
      return;
    }
    toast.info(`Tracking order: ${trackingNo}`);
  };

  // Derive stats from current page results
  const deliveredCount = rows.filter((r) => r.status === "Delivered").length;
  const ongoingCount = rows.filter((r) => r.status === "Ongoing").length;
  const disputedCount = rows.filter((r) => r.status === "Disputed").length;

  return (
    <div className="space-y-8 bg-white rounded-2xl p-6 animate-in fade-in duration-300">
      {/* Page Title & Track Order */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full">
        <h1 className="text-xl md:text-c18 font-MontserratSemiBold">
          Order Management
        </h1>
        <div className="flex items-center gap-4 w-full max-w-66.25">
          <Button
            variant="secondary"
            onClick={handleTrackOrder}
            className="max-w-37.5"
          >
            Track Order
          </Button>
          <FilterDropdown
            options={["This Week", "This Month", "This Year"]}
            defaultValue="This Month"
            onChange={onMonthChange}
            className="!rounded-c8 !h-10 !py-0 !px-3 !gap-4 !shadow-custom"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="justify-between flex items-center w-full">
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
      </div>

      {/* Orders List Table */}
      <div className="bg-white rounded-2xl p-6 border border-000000/4">
        <h2 className="text-base font-MontserratNormal text-000000/68 mb-6">
          Orders table
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
