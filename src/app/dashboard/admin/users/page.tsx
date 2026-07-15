"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
  } = AdminDetails();

  // Default to buyers if no type param exists
  const type = searchParams.get("type") || "buyers";
  const isBuyers = type === "buyers";

  const [searchVal, setSearchVal] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  const [selectedSeller, setSelectedSeller] = useState<AdminSellerData | null>(null);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [successModalType, setSuccessModalType] = useState<
    "suspend" | "unsuspend" | "error" | null
  >(null);

  // Buyer suspend state
  const [selectedBuyer, setSelectedBuyer] = useState<AdminBuyerData | null>(null);
  const [isBuyerSuspendModalOpen, setIsBuyerSuspendModalOpen] = useState(false);
  const [buyerSuspendSuccess, setBuyerSuspendSuccess] = useState<"suspend" | "activate" | "error" | null>(null);

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
  const buyerDetails = useSelector((state: RootState) => state.adminBuyerDetails?.adminBuyerDetails);
  const sellerDetails = useSelector((state: RootState) => state.adminSellerDetails?.adminSellerDetails);
  const totalCount = useSelector((state: RootState) => state.adminBuyerDetails?.totalCount ?? 0);

  // Fetch buyers from API whenever the page number changes
  useEffect(() => {
    if (token && isBuyers) {
      fetchAdminBuyers(currentPage)
     ;
    } else (token && !isBuyers); {
      fetchAdminSellers(currentPage);
    } 
  }, [token, currentPage, isBuyers]);

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
        : [...prev, userId],
    );
  };

  const toggleSelectAll = () => {
    setSelectedUserIds((prev) => {
      const currentRows = isBuyers ? (buyerDetails ?? []) : sellerDetails;
      const allVisibleIds = currentRows.map((row: any) => String(row.id));
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
          quantity={isBuyers ? totalCount : totalCount}
          icon={activeUserIcon}
          width={26}
          height={22}
        />
        <StatusFrame
          title={isBuyers ? "Active buyers" : "Active sellers"}
          quantity={isBuyers ? 200 : 200}
          icon={activeIcon}
          width={26}
          height={26}
        />
        <StatusFrame
          title={isBuyers ? "Inactive buyers" : "Inactive sellers"}
          quantity={isBuyers ? 250 : 250}
          icon={inActiveIcon}
          width={26}
          height={26}
        />
        <StatusFrame
          title={isBuyers ? "Suspended buyers" : "Suspended sellers"}
          quantity={isBuyers ? 50 : 50}
          icon={suspendedUserIcon}
          width={18}
          height={26}
        />
      </div>

      {/* Main Listing Section */}
      <div className="">
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
          onFilterChange={(filters) => console.log("Selected filters:", filters)}
        />

        {/* Data Table */}
        {isBuyers ? (
          <BuyersTable
            rows={buyerDetails ?? []}
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
            rows={sellerDetails ?? []}
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
