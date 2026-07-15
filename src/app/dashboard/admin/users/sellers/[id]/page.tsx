"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import SellerDetails from "@/components/admin-components/users/seller-details/SellerDetails";
import SuspendUserModal from "@/components/ui/Modals/admin/SuspendUserModal";
import DeleteUserModal from "@/components/ui/Modals/admin/DeleteUserModal";
import ResultModal from "@/components/ui/forms/resultModal";
import { AdminDetails } from "@/helpers/admin/adminHelper";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function AdminSellerDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const token = useSelector((state: RootState) => state.token?.token);
  const seller = useSelector((state: RootState) => state.adminSellerById?.adminSellerById);
  const { fetchAdminSellerById, toggleAdminSellerStatus, deleteAdminSeller, loading } = AdminDetails();

  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [successModalType, setSuccessModalType] = useState<
    "suspend" | "unsuspend" | "delete" | "error" | null
  >(null);

  const parentCategory = "Sellers";

  useEffect(() => {
    if (token) {
      fetchAdminSellerById(userId);
    }
  }, [token, userId]);

  const accountStatus = seller?.user_status || seller?.user_account_status || "Active";
  const isSuspended = accountStatus === "Suspended";

  const handleSuspendConfirm = (reason: string) => {
    const action = isSuspended ? "unsuspend" : "suspend";
    toggleAdminSellerStatus(
      userId,
      { action, reason },
      () => {
        setIsSuspendModalOpen(false);
        setSuccessModalType(action);
        fetchAdminSellerById(userId);
      },
      () => {
        setIsSuspendModalOpen(false);
        setSuccessModalType("error");
      }
    );
  };

  const handleDeleteConfirm = (reason: string) => {
    const formattedReason = reason.toUpperCase().replace(/[\s-]+/g, "_");
    deleteAdminSeller(
      userId,
      { reason: formattedReason, note: "" },
      () => {
        setIsDeleteModalOpen(false);
        setSuccessModalType("delete");
      },
      () => {
        setIsDeleteModalOpen(false);
        setSuccessModalType("error");
      }
    );
  };

  console.log("seller details fetch", seller);

  return (
    <div className="space-y-8 mb-[157px]">
      {/* Breadcrumbs */}
      <div>
        <div className="text-c12 font-MontserratMedium flex items-center gap-1">
          <Link
            href="/dashboard/admin/users?type=sellers"
            className="hover:text-gray-600 text-000000/12 transition-colors"
          >
            {parentCategory}
          </Link>
          <ChevronRight className="text-000000/44 w-4 h-4 px-[2.5px]" />
          <span className="font-MontserratSemiBold">
            {seller?.company_name}
          </span>
        </div>
      </div>

      <div className="flex justify-between">
        <h1 className="text-c18 font-MontserratBold">
          Seller's details
        </h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setIsSuspendModalOpen(true);
            }}
            className="w-full max-w-28 h-12 px-6 py-3 rounded-c8 bg-ffaco6 text-ffffff text-sm font-MontserratSemiBold flex justify-center items-center"
          >
            {isSuspended ? "Unsuspend" : "Suspend"}
          </button>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="w-full max-w-24 h-12 px-6 py-3 rounded-c8 bg-ca0202 text-ffffff text-sm font-MontserratSemiBold"
          >
            Delete
          </button>
        </div>
      </div>

      <SellerDetails userId={userId} />

      {/* Modals */}
      <SuspendUserModal
        isOpen={isSuspendModalOpen}
        onClose={() => setIsSuspendModalOpen(false)}
        onConfirm={handleSuspendConfirm}
        loading={loading}
        action={isSuspended ? "unsuspend" : "suspend"}
      />
      <DeleteUserModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={loading}
      />
      <ResultModal
        isOpen={successModalType !== null}
        onConfirm={() => {
          if (successModalType === "delete") {
            router.push("/dashboard/admin/users?type=sellers");
          }
          setSuccessModalType(null);
        }}
        onCancel={() => setSuccessModalType(null)}
        result={successModalType === "error" ? "error" : "success"}
        title={
          successModalType === "error"
            ? "Action Failed"
            : successModalType === "unsuspend"
            ? "User Unsuspended Successfully"
            : successModalType === "delete"
            ? "Seller Deleted Successfully"
            : "User Suspended Successfully"
        }
        message={
          successModalType === "error"
            ? "There was an error processing your request. Please try again."
            : successModalType === "unsuspend"
            ? "The seller has been successfully unsuspended."
            : successModalType === "delete"
            ? "The seller account has been permanently deleted."
            : "The seller has been successfully suspended."
        }
        discRescription={
          successModalType === "error"
            ? "Please check your network and connection, then try again."
            : successModalType === "unsuspend"
            ? "The account status of this seller is now set to active."
            : successModalType === "delete"
            ? "You will be redirected back to the sellers list."
            : "The account status of this seller is now set to suspended."
        }
        buttenText="Ok"
      />
    </div>
  );
}
