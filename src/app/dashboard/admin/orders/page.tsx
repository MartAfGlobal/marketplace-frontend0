"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AdminListHeader from "@/components/ui/admin-components/AdminListHeader";
import { useHttp } from "@/hooks/use-http";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { toast } from "sonner";
import Image from "next/image";
import HandBug from "@/assets/Seller/handBug.png";
import { AnimatePresence, motion } from "framer-motion";
import Pagination from "@/components/ui/seller-components/body-components/products/pignation-button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ChevronDown, Plane, Camera, ArrowLeftRight } from "lucide-react";
import OrdersIcon from "@/assets/icons/admin/orders.svg";
import TotalRevenue from "@/assets/admin/TotalRevenue.svg";
import TotalDispute from "@/assets/admin/disputetotal.svg";
import { Button } from "@/components/ui/Button/Button";
import { Input } from "@/components/ui/forms/Input";

import FilterDropdown from "@/components/ui/seller-components/body-components/over-view/Filter-components/filterButton";

import OrdersTable, { OrderRow } from "@/components/admin-components/orders/OrdersTable";

const mockOrders: OrderRow[] = [
  {
    id: "B000001",
    buyer: "John Doe",
    vendors: "Tech Store",
    extraVendors: 2,
    amount: "₦150,000",
    payment: "Paid",
    status: "Delivered",
    date: "20/06/2026",
  },
  {
    id: "B000002",
    buyer: "Jane Smith",
    vendors: "Fashion Hub",
    amount: "₦45,000",
    payment: "Pending",
    status: "Processing",
    date: "19/06/2026",
  },
  {
    id: "B000003",
    buyer: "Alice Johnson",
    vendors: "Home Goods",
    extraVendors: 1,
    amount: "₦220,000",
    payment: "Paid",
    status: "Processed",
    date: "18/06/2026",
  },
  {
    id: "B000004",
    buyer: "Bob Williams",
    vendors: "Sports Gear",
    amount: "₦30,000",
    payment: "Failed",
    status: "Cancelled",
    date: "17/06/2026",
  },
];

export default function AdminOrdersPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

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
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
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
      filtered = mockOrders.filter(o => 
        o.id.toLowerCase().includes(searchVal.toLowerCase()) ||
        o.buyer.toLowerCase().includes(searchVal.toLowerCase()) ||
        o.vendors.toLowerCase().includes(searchVal.toLowerCase())
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
    <div className="space-y-8 ">
      {/* Page Title & Track Order */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-xl md:text-c18 font-MontserratSemiBold">
          Order Management
        </h1>
        <div className="flex items-center gap-4  w-full max-w-101.5">
          <Input
            type="text"
            placeholder="Enter Tracking No."
            value={trackingNo}
            onChange={(e) => setTrackingNo(e.target.value)}
            className=" max-w-60 "
          />
          <Button

            onClick={handleTrackOrder}
            className="max-w-37.5"
          >
            Track Order
          </Button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="flex gap-6">
        {/* Orders Stats Card */}
        <div className="bg-ffffff rounded-c16 p-6 border border-000000/4 flex flex-col h-fit animate-in fade-in zoom-in duration-300">
          {/* Header */}
          <div className="flex justify-between items-start mb-8 h-c48 border-b border-gray-000000/2">
            <h2 className="text-c20 font-MontserratMedium text-000000/68">
              Orders
            </h2>
            <FilterDropdown 
              options={["This Week", "This Month", "This Year"]} 
              defaultValue="This Month" 
              className="border border-ff715b !rounded-lg !h-fit !py-1.5 !px-3 !gap-1.5 !shadow-none" 
            />
          </div>

          {/* Stats Breakdown Grid */}
          <div className="flex gap-6  items-stretch">
            {/* Left Primary Stat */}
            <div className="flex flex-col gap-14.75 h-full min-h-39.25">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 flex-shrink-0 rounded-full bg-000000/4 flex items-center justify-center text-gray-400">
                  <Image src={OrdersIcon} alt="orders" height={25} width={25} className="opacity-44"/>
                </div>
                <div>
                  <p className="text-xl md:text-c28 font-MontserratSemiBold">
                    1,500,000
                  </p>
                  <p className="text-c12 text-000000/44 font-MontserratMedium">
                    N55M
                  </p>
                </div>
              </div>

              <div className="col-span-1 md:col-span-2 flex flex-wrap gap-x-4 gap-y-2">
                {["NG", "US", "GH", "CN"].map((c, i) => (
                  <div
                    key={c}
                    className="text-left flex flex-col items-start gap-2"
                  >
                    <span className="text-c18 font-MontserratSemiBold">
                      {c}
                    </span>
                    <span className="text-c12 text-000000/44 font-MontserratMedium">
                      {i === 0 ? "150,000" : "500"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Middle Stats Badges */}
            <div className="flex  gap-6 min-h-39.25">
              <div className="flex flex-col justify-between gap-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-c18 font-MontserratSemiBold">
                      1,500,000
                    </p>
                    <p className="text-c12 text-000000/44 font-MontserratMedium">
                      N54,000
                    </p>
                    <span className="text-[10px] font-MontserratBold bg-[#28A745]/12 text-[#4DBEA7] px-2 py-0.5 rounded-c4 leading-[16px] h-5">
                      Completed
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-c18 font-MontserratSemiBold">750</p>
                    <p className="text-c12 text-000000/44 font-MontserratMedium">
                      N55,000
                    </p>
                    <span className="text-[10px] font-MontserratBold bg-[#0070E9]/12 text-[#0070E9] px-2 py-0.5 rounded-c4 leading-[16px] h-5">
                      Pending
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center justify-between gap-6">
                 <div className="flex items-center justify-between">
                  <div>
                    <p className="text-c18 font-MontserratSemiBold">1000</p>
                    <p className="text-c12 text-000000/44 font-MontserratMedium">
                      N55,000
                    </p>
                    <span className="text-[10px] font-MontserratBold bg-[#FFAC06]/12 text-[#FFAC06] px-2 py-0.5 rounded-c4 leading-[16px] h-5">
                      Fulfilled
                    </span>
                  </div>
                </div>
               
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-c18 font-MontserratSemiBold">350,000</p>
                    <p className="text-c12 text-000000/44 font-MontserratMedium">
                      N55,000
                    </p>
                    <span className="text-[10px] font-MontserratBold bg-[#CC0000]/12 text-[#CA0202] px-2 py-0.5 rounded-c4 leading-[16px] h-5">
                      Returned
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue & Dispute Card */}
        <div className="bg-ffffff rounded-c16 w-[55%] p-6 border border-000000/4 flex flex-col h-fit animate-in fade-in zoom-in duration-300">
          {/* Header */}
          <div className="flex justify-between items-start mb-8 h-c48 border-b border-gray-000000/2">
            <h2 className="text-sm font-MontserratBold text-000000/68">
              Revenue & Dispute
            </h2>
            <FilterDropdown 
              options={["This Week", "This Month", "This Year"]} 
              defaultValue="This Month" 
              className="border border-ff715b !rounded-lg !h-fit !py-1.5 !px-3 !gap-1.5 !shadow-none" 
            />
          </div>

          {/* Stats */}
          <div className="flex  gap-6 items-stretch">
            {/* Left: Revenue */}
            <div className="flex flex-col gap-8">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 flex-shrink-0 rounded-full bg-000000/4 flex items-center justify-center text-gray-400">
                  
                   <Image src={TotalRevenue} alt="total revenue" height={30} width={30} className="opacity-44"/>
                </div>
                <div>
                  <p className="text-c12 text-000000/44 font-MontserratMedium">
                    Total Revenue
                  </p>
                  <p className="text-xl md:text-c28 font-MontserratSemiBold">
                    ₦1,500,000
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div>
                  <p className="text-c12 text-000000/44 font-MontserratMedium mb-1">
                    Paid
                  </p>
                  <p className="text-c18 font-MontserratSemiBold">
                    ₦1,000,000
                  </p>
                </div>
                <div>
                  <p className="text-c12 text-000000/44 font-MontserratMedium mb-1">
                    Pending
                  </p>
                  <p className="text-c18 font-MontserratSemiBold">₦500,000</p>
                </div>
              </div>
            </div>

            {/* Right: Dispute & Refund */}
            <div className="flex flex-col gap-8">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 flex-shrink-0 rounded-full bg-000000/4 flex items-center justify-center text-gray-400">
                   <Image src={TotalDispute} alt="total revenue" height={28} width={30} className="opacity-44"/>
                </div>
                <div>
                  <p className="text-c12 text-000000/44 font-MontserratMedium">
                    Dispute & Refund
                  </p>
                  <p className="text-xl md:text-c28 font-MontserratSemiBold">
                    210
                  </p>
                </div>
              </div>

              <div className="flex md:gap-4 box-border">
                <div>
                  <p className="text-c18 font-MontserratSemiBold">80</p>
                  <p className="text-c12 text-000000/44 font-MontserratMedium">
                    N54,000
                  </p>
                  <span className="text-[10px] font-MontserratBold bg-[#28A745]/12 text-[#4DBEA7] px-2 py-0.5 rounded-c4 leading-[16px] h-5">
                    Approved
                  </span>
                </div>
                <div>
                  <p className="text-c18 font-MontserratSemiBold">60</p>
                  <p className="text-c12 text-000000/44 font-MontserratMedium">
                    N55,000
                  </p>
                  <span className="text-[10px] font-MontserratBold bg-[#FFAC06]/12 text-[#FFAC06] px-2 py-0.5 rounded-c4 leading-[16px] h-5">
                    Pending
                  </span>
                </div>
                <div>
                  <p className="text-c18 font-MontserratSemiBold">70</p>
                  <p className="text-c12 text-000000/44 font-MontserratMedium">
                    N55,000
                  </p>
                  <span className="text-[10px] font-MontserratBold bg-[#CC0000]/12 text-[#CA0202] px-2 py-0.5 rounded-c4 leading-[16px] h-5">
                    Rejected
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Orders List Table */}
      <div className="bg-white rounded-2xl p-6 border border-000000/4  animate-in fade-in duration-300">
        <h2 className="text-base font-MontserratNormal text-000000/68 mb-6">
          List of Orders
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
