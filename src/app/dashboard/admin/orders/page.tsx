"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AdminListHeader from "@/components/ui/admin-components/AdminListHeader";
import { useHttp } from "@/hooks/use-http";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { toast } from "sonner";

import HandBug from "@/assets/Seller/handBug.png";

import Pagination from "@/components/ui/seller-components/body-components/products/pignation-button";

import OrdersIcon from "@/assets/icons/admin/orders.svg";

import { Button } from "@/components/ui/Button/Button";
import activeUserIcon from "@/assets/admin/Vector.svg";
import activeIcon from "@/assets/admin/active.svg";
import suspendedUserIcon from "@/assets/admin/inactive.svg";
import inActiveIcon from "@/assets/admin/suspend.svg";

import { Input } from "@/components/ui/forms/Input";

import FilterDropdown from "@/components/ui/seller-components/body-components/over-view/Filter-components/filterButton";

import OrdersTable, {
  OrderRow,
} from "@/components/admin-components/orders/OrdersTable";
import StatusFrame from "@/components/admin-components/users/status-frame";

type MockProductRow = {
  id: string;
  name: string;
  seller: string;
  category: string;
  price: string;
  stock: number;
  status: "Pending" | "Approved" | "Rejected";
  date: string;
};

const mockOrders: OrderRow[] = [
  {
    id: "B000001",
    buyer: "John Doe",
    vendors: "Tech Store",
    extraVendors: 2,
    amount: "₦150,000",
    location: "Abuja",
    status: "Delivered",
    date: "20/06/2026",
  },
  {
    id: "B000002",
    buyer: "Jane Smith",
    vendors: "Fashion Hub",
    amount: "₦45,000",
    location: "Lagos",
    status: "Ongoing",
    date: "19/06/2026",
  },
  {
    id: "B000003",
    buyer: "Alice Johnson",
    vendors: "Home Goods",
    extraVendors: 1,
    amount: "₦220,000",
    location: "Lagos",
    status: "Ongoing",
    date: "18/06/2026",
  },
  {
    id: "B000004",
    buyer: "Bob Williams",
    vendors: "Sports Gear",
    amount: "₦30,000",
    location: "Lagos",
    status: "Disputed",
    date: "17/06/2026",
  },
];
const mockProducts: MockProductRow[] = Array.from({ length: 25 }, (_, i) => {
  const id = `PRD-${String(i + 1).padStart(3, "0")}`;
  const statuses: ("Pending" | "Approved" | "Rejected")[] = [
    "Pending",
    "Approved",
    "Rejected",
  ];
  return {
    id,
    name: `Product ${id}`,
    seller: `Seller ${Math.floor(Math.random() * 10) + 1}`,
    category: ["Fashion", "Electronics", "Home", "Beauty"][i % 4],
    price: `₦${(Math.random() * 50000 + 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
    stock: Math.floor(Math.random() * 500),
    status: statuses[i % 3],
    date: new Date(
      Date.now() - Math.floor(Math.random() * 10000000000),
    ).toLocaleDateString("en-GB"),
  };
});

export default function AdminOrdersPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [selectedMonth, setSelectedMonth] = useState("This Month");
  const onMonthChange = (value: string) => {
    setSelectedMonth(value);
    // filter your orders by the selected period
  };
  // Default to all-orders if no type param exists
  const type = searchParams.get("type") || "all-orders";
  const isAllOrders = type === "all-orders";

  const [searchVal, setSearchVal] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rows, setRows] = useState<OrderRow[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [trackingNo, setTrackingNo] = useState("");

  const loading = false;

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

  // Reset page when search or type changes
  useEffect(() => {
    setCurrentPage(1);
  }, [type, searchVal]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleOutsideClick = () => {
      setActiveRowId(null);
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  useEffect(() => {
    let filtered = mockOrders;
    if (searchVal) {
      filtered = mockOrders.filter(
        (o) =>
          o.id.toLowerCase().includes(searchVal.toLowerCase()) ||
          o.buyer.toLowerCase().includes(searchVal.toLowerCase()) ||
          o.vendors.toLowerCase().includes(searchVal.toLowerCase()),
      );
    }
    setRows(filtered);
    setTotalCount(filtered.length);
  }, [type, searchVal]);

  const handleTrackOrder = () => {
    if (!trackingNo.trim()) {
      toast.info("Please enter a tracking number");
      return;
    }
    toast.info(`Tracking order: ${trackingNo}`);
  };

  return (
    <div className="space-y-8 bg-white rounded-2xl p-6   animate-in fade-in duration-300">
      {/* Page Title & Track Order */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between  w-full ">
        <h1 className="text-xl md:text-c18 font-MontserratSemiBold">
          Order Management
        </h1>
        <div className="flex items-center gap-4 justif w-full max-w-66.25 ">
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

      <div className="justify-between flex items-center w-full">
        <StatusFrame
          title="Total Orders"
          quantity={totalCount}
          icon={OrdersIcon}
          width={26}
          height={22}
        />
        <StatusFrame
          title="Delivered Orders"
          quantity={mockProducts.filter((p) => p.status === "Approved").length}
          icon={activeIcon}
          width={26}
          height={26}
        />
        <StatusFrame
          title="Ongoing Orders"
          quantity={mockProducts.filter((p) => p.status === "Pending").length}
          icon={inActiveIcon}
          width={18}
          height={26}
        />
        <StatusFrame
          title="Disputed Orders"
          quantity={mockProducts.filter((p) => p.status === "Rejected").length}
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

        {/* Filters Header (Reusable) */}
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

        {/* Pagination Section */}
        {totalCount > 20 && (
          <div className="flex justify-end mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(totalCount / 20)}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
