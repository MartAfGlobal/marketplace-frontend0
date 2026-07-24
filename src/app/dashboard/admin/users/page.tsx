"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { X } from "lucide-react";
import AdminListHeader from "@/components/ui/admin-components/AdminListHeader";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Pagination from "@/components/ui/seller-components/body-components/products/pignation-button";
import StatusFrame from "@/components/admin-components/users/status-frame";
import BuyersTable from "@/components/admin-components/users/BuyersTable";
import SellersTable from "@/components/admin-components/users/SellersTable";
import activeUserIcon from "@/assets/admin/Vector.svg";
import activeIcon from "@/assets/admin/active.svg";
import inActiveIcon from "@/assets/admin/inactive.svg";
import suspendedUserIcon from "@/assets/admin/suspend.svg";
import { AdminDetails } from "@/helpers/admin/adminHelper";
import { AdminBuyerData, AdminSellerData } from "@/types/global";
import SuspendUserModal from "@/components/ui/Modals/admin/SuspendUserModal";
import DeleteUserModal from "@/components/ui/Modals/admin/DeleteUserModal";
import ResultModal from "@/components/ui/forms/resultModal";
import { Input } from "@/components/ui/forms/Input";
import { AnimatePresence } from "framer-motion";
import {
  DateFilterForm,
  FullScreenModal,
  DateRange,
} from "@/components/ui/seller-components/tables/Filters/filter-modal";
import CalenderIcon from "@/assets/Seller/calender.png";
import ArrowRightIcon from "@/assets/icons/arrowBack.svg";
import QuantityIcon from "@/assets/Seller/quantity.png";

const getDateRangeForPeriod = (period: string): { start: string; end: string } | null => {
  const now = new Date();
  if (period === "This Week") {
    const dayOfWeek = now.getDay();
    const distanceToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - distanceToMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(now);
    endOfWeek.setHours(23, 59, 59, 999);

    return {
      start: startOfWeek.toISOString(),
      end: endOfWeek.toISOString(),
    };
  } else if (period === "This Month") {
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    return {
      start: startOfMonth.toISOString(),
      end: endOfMonth.toISOString(),
    };
  } else if (period === "This Year") {
    const startOfYear = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
    const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
    return {
      start: startOfYear.toISOString(),
      end: endOfYear.toISOString(),
    };
  }
  return null;
};

export default function AdminUsersPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const {
    fetchAdminBuyers,
    loading,
    fetchAdminSellers,
    toggleAdminSellerStatus,
    toggleAdminBuyerStatus,
    deleteAdminSeller,
    deleteAdminBuyer,
    fetchAdminBuyerStats,
  } = AdminDetails();

  // Default to buyers if no type param exists
  const type = searchParams.get("type") || "buyers";
  const isBuyers = type === "buyers";

  const [searchVal, setSearchVal] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  // Period and active filter states
  const [selectedMonth, setSelectedMonth] = useState("This Month");
  const [activeFilters, setActiveFilters] = useState<{
    date?: { start: string; end: string };
    status?: string;
    country?: string;
    qty?: { min?: number; max?: number };
  }>({});

  // Sub-modal open state
  const [activeModal, setActiveModal] = useState<
    "Date" | "Status" | "Country" | "Quantity" | null
  >(null);

  // Temporary values inside filter modals
  const [tempDate, setTempDate] = useState<DateRange>({});
  const [tempStatus, setTempStatus] = useState("");
  const [tempCountry, setTempCountry] = useState("");
  const [tempQty, setTempQty] = useState<{ min?: number; max?: number }>({});

  const [selectedSeller, setSelectedSeller] = useState<AdminSellerData | null>(null);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [successModalType, setSuccessModalType] = useState<
    "suspend" | "unsuspend" | "error" | null
  >(null);

  // Buyer suspend state
  const [selectedBuyer, setSelectedBuyer] = useState<AdminBuyerData | null>(null);
  const [isBuyerSuspendModalOpen, setIsBuyerSuspendModalOpen] = useState(false);
  const [buyerSuspendSuccess, setBuyerSuspendSuccess] = useState<
    "suspend" | "activate" | "error" | null
  >(null);

  // Shared delete state
  const [selectedDeleteSeller, setSelectedDeleteSeller] = useState<AdminSellerData | null>(null);
  const [selectedDeleteBuyer, setSelectedDeleteBuyer] = useState<AdminBuyerData | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteSuccessType, setDeleteSuccessType] = useState<"deleted" | "error" | null>(null);

  const handleSuspendConfirm = (reason: string) => {
    if (!selectedSeller) return;
    const isSuspended = selectedSeller.user_status === "Suspended";
    const action = isSuspended ? "unsuspend" : "suspend";
    toggleAdminSellerStatus(
      selectedSeller.user_id,
      { action, reason },
      () => {
        setIsSuspendModalOpen(false);
        setSuccessModalType(action);
        fetchAdminSellers(currentPage);
      },
      () => {
        setIsSuspendModalOpen(false);
        setSuccessModalType("error");
      }
    );
  };

  const handleBuyerSuspendConfirm = (reason: string) => {
    if (!selectedBuyer) return;
    const isSuspended = selectedBuyer.account_status === "Suspended";
    const action = isSuspended ? "activate" : "suspend";
    const formattedReason = reason.toUpperCase().replace(/[\s-]+/g, "_");
    toggleAdminBuyerStatus(
      selectedBuyer.user_id,
      { action, reason: formattedReason, note: "" },
      () => {
        setIsBuyerSuspendModalOpen(false);
        setBuyerSuspendSuccess(action);
        fetchAdminBuyers(currentPage);
      }
    );
  };

  const handleDeleteConfirm = (reason: string) => {
    const formattedReason = reason.toUpperCase().replace(/[\s-]+/g, "_");
    if (selectedDeleteSeller) {
      deleteAdminSeller(
        selectedDeleteSeller.user_id,
        { reason: formattedReason, note: "" },
        () => {
          setIsDeleteModalOpen(false);
          setDeleteSuccessType("deleted");
          fetchAdminSellers(currentPage);
        },
        () => {
          setIsDeleteModalOpen(false);
          setDeleteSuccessType("error");
        }
      );
    } else if (selectedDeleteBuyer) {
      deleteAdminBuyer(
        selectedDeleteBuyer.user_id,
        { reason: formattedReason, note: "" },
        () => {
          setIsDeleteModalOpen(false);
          setDeleteSuccessType("deleted");
          fetchAdminBuyers(currentPage);
        },
        () => {
          setIsDeleteModalOpen(false);
          setDeleteSuccessType("error");
        }
      );
    }
  };

  const token = useSelector((state: RootState) => state.token?.token);
  const buyerDetails = useSelector(
    (state: RootState) => state.adminBuyerDetails?.adminBuyerDetails
  );
  const sellerDetails = useSelector(
    (state: RootState) => state.adminSellerDetails?.adminSellerDetails
  );
  const apiTotalCount = useSelector(
    (state: RootState) => state.adminBuyerDetails?.totalCount ?? 0
  );
  const buyerStats = useSelector(
    (state: RootState) => state.adminBuyerStats?.stats
  );

  // Fetch buyers from API whenever the page number changes
  useEffect(() => {
    if (token && isBuyers) {
      fetchAdminBuyers(currentPage);
      fetchAdminBuyerStats();
    } else if (token && !isBuyers) {
      fetchAdminSellers(currentPage);
    }
  }, [token, currentPage, isBuyers]);

  // Reset page when search, type, or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [type, searchVal, activeFilters]);

  // Handle period change from dropdown ("This Week", "This Month", "This Year")
  const handleMonthChange = (period: string) => {
    setSelectedMonth(period);
    const range = getDateRangeForPeriod(period);
    if (range) {
      setActiveFilters((prev) => ({ ...prev, date: range }));
    } else {
      setActiveFilters((prev) => {
        const next = { ...prev };
        delete next.date;
        return next;
      });
    }
  };

  // Handle option select from Filter options dropdown ("Date", "Status", "Country", "Quantity")
  const handleOptionSelect = (option: string) => {
    if (option === "Date") {
      setTempDate(activeFilters.date || {});
      setActiveModal("Date");
    } else if (option === "Status") {
      setTempStatus(activeFilters.status || "");
      setActiveModal("Status");
    } else if (option === "Country") {
      setTempCountry(activeFilters.country || "");
      setActiveModal("Country");
    } else if (option === "Quantity") {
      setTempQty(activeFilters.qty || {});
      setActiveModal("Quantity");
    }
  };

  // Click outside to close active dropdown row
  useEffect(() => {
    const handleOutsideClick = () => {
      setActiveRowId(null);
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  // Filter buyers
  const filteredBuyers = (buyerDetails ?? []).filter((buyer) => {
    if (searchVal.trim()) {
      const q = searchVal.trim().toLowerCase();
      const haystack = [
        buyer.id,
        buyer.user_id,
        buyer.first_name,
        buyer.last_name,
        `${buyer.first_name || ""} ${buyer.last_name || ""}`,
        buyer.email,
        buyer.phone,
        buyer.country,
        buyer.state,
        buyer.city,
        buyer.account_status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }

    if (activeFilters.date?.start && activeFilters.date?.end) {
      const rowDateStr = buyer.created_at || buyer.date_joined;
      if (!rowDateStr) return false;
      const rowTime = new Date(rowDateStr).getTime();
      const startTime = new Date(activeFilters.date.start).getTime();
      const endDate = new Date(activeFilters.date.end);
      endDate.setHours(23, 59, 59, 999);
      const endTime = endDate.getTime();
      if (rowTime < startTime || rowTime > endTime) return false;
    }

    if (activeFilters.status && activeFilters.status !== "All") {
      const statusQ = activeFilters.status.toLowerCase();
      const buyerStatus = (buyer.account_status || "").toLowerCase();
      if (buyerStatus !== statusQ) return false;
    }

    if (activeFilters.country && activeFilters.country.trim()) {
      const countryQ = activeFilters.country.trim().toLowerCase();
      const locationStr = [buyer.country, buyer.state, buyer.city]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!locationStr.includes(countryQ)) return false;
    }

    if (activeFilters.qty) {
      const totalOrders = buyer.total_orders || 0;
      if (activeFilters.qty.min !== undefined && totalOrders < activeFilters.qty.min) return false;
      if (activeFilters.qty.max !== undefined && totalOrders > activeFilters.qty.max) return false;
    }

    return true;
  });

  // Filter sellers
  const filteredSellers = (sellerDetails ?? []).filter((seller) => {
    if (searchVal.trim()) {
      const q = searchVal.trim().toLowerCase();
      const haystack = [
        seller.id,
        seller.user_id,
        seller.seller_ref,
        seller.company_name,
        seller.user_email,
        seller.phone,
        seller.company_country_name,
        seller.location,
        seller.user_status,
        seller.kyc_status,
        seller.bank_verification_status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }

    if (activeFilters.date?.start && activeFilters.date?.end) {
      const rowDateStr = seller.created_at;
      if (!rowDateStr) return false;
      const rowTime = new Date(rowDateStr).getTime();
      const startTime = new Date(activeFilters.date.start).getTime();
      const endDate = new Date(activeFilters.date.end);
      endDate.setHours(23, 59, 59, 999);
      const endTime = endDate.getTime();
      if (rowTime < startTime || rowTime > endTime) return false;
    }

    if (activeFilters.status && activeFilters.status !== "All") {
      const statusQ = activeFilters.status.toLowerCase();
      const sellerStatus = (seller.user_status || seller.kyc_status || "").toLowerCase();
      if (sellerStatus !== statusQ) return false;
    }

    if (activeFilters.country && activeFilters.country.trim()) {
      const countryQ = activeFilters.country.trim().toLowerCase();
      const locationStr = [seller.company_country_name, seller.location]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!locationStr.includes(countryQ)) return false;
    }

    if (activeFilters.qty) {
      const totalOrders = seller.total_orders || 0;
      if (activeFilters.qty.min !== undefined && totalOrders < activeFilters.qty.min) return false;
      if (activeFilters.qty.max !== undefined && totalOrders > activeFilters.qty.max) return false;
    }

    return true;
  });

  const PAGE_SIZE = 20;
  const currentFilteredRows = isBuyers ? filteredBuyers : filteredSellers;
  const totalFilteredCount = currentFilteredRows.length;
  const paginatedRows = currentFilteredRows.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleRowClick = (userId: string) => {
    if (isBuyers) {
      router.push(`/dashboard/admin/users/buyers/${userId}`);
    } else {
      router.push(`/dashboard/admin/users/sellers/${userId}`);
    }
  };

  const truncateText = (value: string | number | undefined, maxLength = 10) => {
    const text = String(value ?? "").trim();
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleSelectAll = () => {
    setSelectedUserIds((prev) => {
      const allVisibleIds = (paginatedRows as any[]).map((row: any) => String(row.id));
      const allSelected = allVisibleIds.every((id) => prev.includes(id));

      return allSelected
        ? prev.filter((id) => !allVisibleIds.includes(id))
        : [...new Set([...prev, ...allVisibleIds])];
    });
  };

  return (
    <div className="space-y-8 bg-ffffff p-6 rounded-c16">
      {/* Page Title & Breadcrumbs */}
      <div>
        <h1 className="text-c20 font-MontserratMedium py-2">
          {isBuyers ? "Buyers" : "Sellers"}
        </h1>
      </div>

      {/* Top Stats Graph Card (Reusable) */}
      <div className="justify-between flex items-center w-full">
        <StatusFrame
          title={isBuyers ? "Total buyers" : "Total sellers"}
          quantity={isBuyers ? apiTotalCount : apiTotalCount}
          icon={activeUserIcon}
          width={26}
          height={22}
        />
        <StatusFrame
          title={isBuyers ? "Active buyers" : "Active sellers"}
          quantity={isBuyers ? (buyerStats?.active_customers ?? 0) : 0}
          icon={activeIcon}
          width={26}
          height={26}
        />
        <StatusFrame
          title={isBuyers ? "Inactive buyers" : "Inactive sellers"}
          quantity={isBuyers ? (buyerStats?.inactive_customers ?? 0) : 0}
          icon={inActiveIcon}
          width={26}
          height={26}
        />
        <StatusFrame
          title={isBuyers ? "Suspended buyers" : "Suspended sellers"}
          quantity={isBuyers ? (buyerStats?.suspended_customers ?? 0) : 0}
          icon={suspendedUserIcon}
          width={18}
          height={26}
        />
      </div>

      {/* Main Listing Section */}
      <div>
        <h2 className="text-base font-MontserratNormal text-000000 mb-6">
          {type === "buyers" ? "Buyer's" : "Seller's"} table
        </h2>

        {/* Filters Header (Reusable) */}
        <AdminListHeader
          searchVal={searchVal}
          setSearchVal={setSearchVal}
          placeholder={`Search ${type} by ID, name or email...`}
          searchExpandable={true}
          filterOptions={["Date", "Status", "Country", "Quantity"]}
          selectedMonth={selectedMonth}
          onMonthChange={handleMonthChange}
          onOptionSelect={handleOptionSelect}
        />

        {/* Active Filter Chips */}
        {Object.keys(activeFilters).length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6 animate-in fade-in duration-200">
            {activeFilters.date?.start && activeFilters.date?.end && (
              <span className="flex items-center gap-2 bg-[#FF715B]/10 border border-[#FF715B]/20 text-[#FF715B] h-8 px-3 text-xs font-MontserratNormal rounded-c8 shadow-sm">
                <Image src={CalenderIcon} alt="calendar" width={12} height={13} />
                <span>
                  {new Date(activeFilters.date.start).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <Image src={ArrowRightIcon} alt="to" width={12} height={12} className="rotate-180" />
                <span>
                  {new Date(activeFilters.date.end).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <button
                  onClick={() =>
                    setActiveFilters((prev) => {
                      const next = { ...prev };
                      delete next.date;
                      return next;
                    })
                  }
                  className="hover:opacity-75 ml-1"
                >
                  <X size={14} />
                </button>
              </span>
            )}

            {activeFilters.status && (
              <span className="flex items-center gap-2 bg-[#FF715B]/10 border border-[#FF715B]/20 text-[#FF715B] h-8 px-3 text-xs font-MontserratNormal rounded-c8 shadow-sm">
                <span>Status: {activeFilters.status}</span>
                <button
                  onClick={() =>
                    setActiveFilters((prev) => {
                      const next = { ...prev };
                      delete next.status;
                      return next;
                    })
                  }
                  className="hover:opacity-75 ml-1"
                >
                  <X size={14} />
                </button>
              </span>
            )}

            {activeFilters.country && (
              <span className="flex items-center gap-2 bg-[#FF715B]/10 border border-[#FF715B]/20 text-[#FF715B] h-8 px-3 text-xs font-MontserratNormal rounded-c8 shadow-sm">
                <span>Country: {activeFilters.country}</span>
                <button
                  onClick={() =>
                    setActiveFilters((prev) => {
                      const next = { ...prev };
                      delete next.country;
                      return next;
                    })
                  }
                  className="hover:opacity-75 ml-1"
                >
                  <X size={14} />
                </button>
              </span>
            )}

            {activeFilters.qty && (
              <span className="flex items-center gap-2 bg-[#FF715B]/10 border border-[#FF715B]/20 text-[#FF715B] h-8 px-3 text-xs font-MontserratNormal rounded-c8 shadow-sm">
                <Image src={QuantityIcon} alt="qty" width={12} height={12} />
                <span>
                  Orders: {activeFilters.qty.min ?? 0} - {activeFilters.qty.max ?? "∞"}
                </span>
                <button
                  onClick={() =>
                    setActiveFilters((prev) => {
                      const next = { ...prev };
                      delete next.qty;
                      return next;
                    })
                  }
                  className="hover:opacity-75 ml-1"
                >
                  <X size={14} />
                </button>
              </span>
            )}

            <button
              onClick={() => setActiveFilters({})}
              className="text-xs font-MontserratSemiBold text-000000/40 hover:text-[#FF715B] underline ml-2"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Data Table */}
        {isBuyers ? (
          <BuyersTable
            rows={paginatedRows as AdminBuyerData[]}
            selectedUserIds={selectedUserIds}
            activeRowId={activeRowId}
            loading={loading}
            onSelectAll={toggleSelectAll}
            onToggleRow={toggleUserSelection}
            onRowClick={handleRowClick}
            onSetActiveRowId={setActiveRowId}
            truncateText={truncateText}
            onSuspendClick={(buyer) => {
              setSelectedBuyer(buyer);
              setIsBuyerSuspendModalOpen(true);
            }}
            onDeleteClick={(buyer) => {
              setSelectedDeleteBuyer(buyer);
              setSelectedDeleteSeller(null);
              setIsDeleteModalOpen(true);
            }}
          />
        ) : (
          <SellersTable
            rows={paginatedRows as AdminSellerData[]}
            selectedUserIds={selectedUserIds}
            activeRowId={activeRowId}
            loading={loading}
            onSelectAll={toggleSelectAll}
            onToggleRow={toggleUserSelection}
            onRowClick={handleRowClick}
            onSetActiveRowId={setActiveRowId}
            truncateText={truncateText}
            onSuspendClick={(seller) => {
              setSelectedSeller(seller);
              setIsSuspendModalOpen(true);
            }}
            onDeleteClick={(seller) => {
              setSelectedDeleteSeller(seller);
              setSelectedDeleteBuyer(null);
              setIsDeleteModalOpen(true);
            }}
          />
        )}

        {/* Pagination Section */}
        {totalFilteredCount > PAGE_SIZE && (
          <div className="flex justify-end mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(totalFilteredCount / PAGE_SIZE)}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        )}
      </div>

      {/* Filter Sub-modals */}
      <AnimatePresence>
        {/* Date Filter Modal */}
        {activeModal === "Date" && (
          <FullScreenModal
            title="Date Range"
            onClose={() => setActiveModal(null)}
            onClear={() => {
              setTempDate({});
              setActiveFilters((prev) => {
                const next = { ...prev };
                delete next.date;
                return next;
              });
              setActiveModal(null);
            }}
            onApply={() => {
              if (tempDate.start && tempDate.end) {
                setActiveFilters((prev) => ({
                  ...prev,
                  date: { start: String(tempDate.start), end: String(tempDate.end) },
                }));
              }
              setActiveModal(null);
            }}
            isApplyDisabled={!tempDate.start || !tempDate.end}
          >
            <DateFilterForm value={tempDate} onChange={setTempDate} />
          </FullScreenModal>
        )}

        {/* Status Filter Modal */}
        {activeModal === "Status" && (
          <FullScreenModal
            title="Filter by Status"
            onClose={() => setActiveModal(null)}
            onClear={() => {
              setTempStatus("");
              setActiveFilters((prev) => {
                const next = { ...prev };
                delete next.status;
                return next;
              });
              setActiveModal(null);
            }}
            onApply={() => {
              if (tempStatus) {
                setActiveFilters((prev) => ({ ...prev, status: tempStatus }));
              }
              setActiveModal(null);
            }}
            isApplyDisabled={!tempStatus}
          >
            <div className="flex flex-wrap gap-2.5 py-4 justify-center">
              {(isBuyers
                ? ["Active", "Inactive", "Suspended"]
                : ["Active", "Pending", "Verified", "Suspended", "Rejected"]
              ).map((s) => (
                <button
                  key={s}
                  onClick={() => setTempStatus(s)}
                  className={`py-2 px-4 rounded-c8 text-xs font-MontserratNormal transition-colors ${
                    tempStatus === s
                      ? "bg-[#FF715B] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </FullScreenModal>
        )}

        {/* Country Filter Modal */}
        {activeModal === "Country" && (
          <FullScreenModal
            title="Filter by Country / Location"
            onClose={() => setActiveModal(null)}
            onClear={() => {
              setTempCountry("");
              setActiveFilters((prev) => {
                const next = { ...prev };
                delete next.country;
                return next;
              });
              setActiveModal(null);
            }}
            onApply={() => {
              if (tempCountry.trim()) {
                setActiveFilters((prev) => ({ ...prev, country: tempCountry.trim() }));
              }
              setActiveModal(null);
            }}
            isApplyDisabled={!tempCountry.trim()}
          >
            <div className="py-4">
              <Input
                type="text"
                placeholder="e.g. Nigeria, Lagos, Abuja..."
                value={tempCountry}
                onChange={(e) => setTempCountry(e.target.value)}
                className="w-full"
              />
            </div>
          </FullScreenModal>
        )}

        {/* Quantity Filter Modal */}
        {activeModal === "Quantity" && (
          <FullScreenModal
            title="Total Orders Range"
            onClose={() => setActiveModal(null)}
            onClear={() => {
              setTempQty({});
              setActiveFilters((prev) => {
                const next = { ...prev };
                delete next.qty;
                return next;
              });
              setActiveModal(null);
            }}
            onApply={() => {
              if (tempQty.min !== undefined || tempQty.max !== undefined) {
                setActiveFilters((prev) => ({ ...prev, qty: tempQty }));
              }
              setActiveModal(null);
            }}
          >
            <div className="flex items-center gap-4 py-4">
              <div className="flex-1">
                <span className="text-xs font-MontserratNormal text-gray-500 mb-1 block">
                  Min Orders
                </span>
                <Input
                  type="number"
                  min={0}
                  placeholder="0"
                  value={tempQty.min ?? ""}
                  onChange={(e) =>
                    setTempQty((prev) => ({
                      ...prev,
                      min: e.target.value !== "" ? Number(e.target.value) : undefined,
                    }))
                  }
                />
              </div>
              <span className="text-gray-400 mt-5">-</span>
              <div className="flex-1">
                <span className="text-xs font-MontserratNormal text-gray-500 mb-1 block">
                  Max Orders
                </span>
                <Input
                  type="number"
                  min={0}
                  placeholder="100"
                  value={tempQty.max ?? ""}
                  onChange={(e) =>
                    setTempQty((prev) => ({
                      ...prev,
                      max: e.target.value !== "" ? Number(e.target.value) : undefined,
                    }))
                  }
                />
              </div>
            </div>
          </FullScreenModal>
        )}
      </AnimatePresence>

      {/* Seller Suspend Modal */}
      {selectedSeller && (
        <SuspendUserModal
          isOpen={isSuspendModalOpen}
          onClose={() => {
            setIsSuspendModalOpen(false);
            setSelectedSeller(null);
          }}
          onConfirm={handleSuspendConfirm}
          loading={loading}
          action={selectedSeller.user_status === "Suspended" ? "unsuspend" : "suspend"}
        />
      )}

      {/* Buyer Suspend Modal */}
      {selectedBuyer && (
        <SuspendUserModal
          isOpen={isBuyerSuspendModalOpen}
          onClose={() => {
            setIsBuyerSuspendModalOpen(false);
            setSelectedBuyer(null);
          }}
          onConfirm={handleBuyerSuspendConfirm}
          loading={loading}
          action={selectedBuyer.account_status === "Suspended" ? "unsuspend" : "suspend"}
        />
      )}

      {/* Shared Delete Modal */}
      <DeleteUserModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedDeleteSeller(null);
          setSelectedDeleteBuyer(null);
        }}
        onConfirm={handleDeleteConfirm}
        loading={loading}
      />

      {/* Seller Suspend Result Modal */}
      <ResultModal
        isOpen={successModalType !== null}
        onConfirm={() => setSuccessModalType(null)}
        onCancel={() => setSuccessModalType(null)}
        result={successModalType === "error" ? "error" : "success"}
        title={
          successModalType === "error"
            ? "Action Failed"
            : successModalType === "unsuspend"
            ? "Seller Unsuspended Successfully"
            : "Seller Suspended Successfully"
        }
        message={
          successModalType === "error"
            ? "There was an error updating the seller status. Please try again."
            : successModalType === "unsuspend"
            ? "The seller has been successfully unsuspended."
            : "The seller has been successfully suspended."
        }
        discRescription={
          successModalType === "error"
            ? "Please check your network and connection, then try again."
            : successModalType === "unsuspend"
            ? "The account status of this seller is now set to active."
            : "The account status of this seller is now set to suspended."
        }
        buttenText="Ok"
      />

      {/* Buyer Suspend Result Modal */}
      <ResultModal
        isOpen={buyerSuspendSuccess !== null}
        onConfirm={() => setBuyerSuspendSuccess(null)}
        onCancel={() => setBuyerSuspendSuccess(null)}
        result={buyerSuspendSuccess === "error" ? "error" : "success"}
        title={
          buyerSuspendSuccess === "error"
            ? "Action Failed"
            : buyerSuspendSuccess === "activate"
            ? "Buyer Activated Successfully"
            : "Buyer Suspended Successfully"
        }
        message={
          buyerSuspendSuccess === "error"
            ? "There was an error updating the buyer status. Please try again."
            : buyerSuspendSuccess === "activate"
            ? "The buyer has been successfully activated."
            : "The buyer has been successfully suspended."
        }
        discRescription={
          buyerSuspendSuccess === "error"
            ? "Please check your network and connection, then try again."
            : buyerSuspendSuccess === "activate"
            ? "The account status of this buyer is now set to active."
            : "The account status of this buyer is now set to suspended."
        }
        buttenText="Ok"
      />

      {/* Delete Result Modal */}
      <ResultModal
        isOpen={deleteSuccessType !== null}
        onConfirm={() => setDeleteSuccessType(null)}
        onCancel={() => setDeleteSuccessType(null)}
        result={deleteSuccessType === "error" ? "error" : "success"}
        title={
          deleteSuccessType === "error"
            ? "Action Failed"
            : "User Deleted Successfully"
        }
        message={
          deleteSuccessType === "error"
            ? "There was an error deleting the user. Please try again."
            : "The account has been permanently deleted."
        }
        discRescription={
          deleteSuccessType === "error"
            ? "Please check your network and connection, then try again."
            : "The user no longer has access to this platform."
        }
        buttenText="Ok"
      />
    </div>
  );
}
