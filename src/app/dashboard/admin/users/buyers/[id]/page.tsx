"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import CustomerImage from "@/assets/admin/customerImage.svg";
import Phonicon from "@/assets/admin/phone.svg";
import { Mail, MapPin, Edit, ChevronRight, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import EditUserModal from "@/components/ui/Modals/admin/EditUserModal";
import EditAccountModal from "@/components/ui/Modals/admin/EditAccountModal";
import SuspendUserModal from "@/components/ui/Modals/admin/SuspendUserModal";
import DeleteUserModal from "@/components/ui/Modals/admin/DeleteUserModal";
import ResultModal from "@/components/ui/forms/resultModal";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AdminDetails } from "@/helpers/admin/adminHelper";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { AdminBuyerDetailsData } from "@/types/global";

export default function AdminBuyerDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const token = useSelector((state: RootState) => state.token?.token);
  const { fetchAdminBuyerById, toggleAdminBuyerStatus, deleteAdminBuyer, updateAdminBuyer, loading } =
    AdminDetails();

  const [buyer, setBuyer] = useState<AdminBuyerDetailsData | null>(null);
  const [isEditAddressModalOpen, setIsEditAddressModalOpen] = useState(false);
  const [isEditAccountModalOpen, setIsEditAccountModalOpen] = useState(false);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [successModalType, setSuccessModalType] = useState<
    "suspend" | "activate" | "delete" | "edit-account" | "error" | null
  >(null);

  const parentCategory = "Buyers";

  const fullName = buyer
    ? [buyer.first_name, buyer.last_name].filter(Boolean).join(" ") ||
      buyer?.user_id
    : "—";
  const statusLabel =
    buyer?.account_status === "Active"
      ? "Active"
      : buyer?.account_status === "Suspended"
        ? "Suspended"
        : "Inactive";
  const statusColor =
    statusLabel === "Active"
      ? "text-[#4DBEA7] bg-[#28A745]/12"
      : statusLabel === "Suspended"
        ? "text-[#ff9800] bg-[#ff9800]/12"
        : "text-[#f44336] bg-[#f44336]/12";

  useEffect(() => {
    if (token) {
      fetchAdminBuyerById(userId, (data) => setBuyer(data));
    }
  }, [token, userId]);

  const handleEditAddressConfirm = (data: any) => {
    updateAdminBuyer(
      userId,
      {
        address: data.address,
        city: data.city,
        state: data.state,
        country: data.country,
        postal_code: data.zipcode,
      },
      () => {
        setIsEditAddressModalOpen(false);
        setSuccessModalType("edit-account");
        fetchAdminBuyerById(userId, (updated) => setBuyer(updated));
      },
      () => {
        setIsEditAddressModalOpen(false);
        setSuccessModalType("error");
      }
    );
  };

  const handleEditAccountConfirm = (data: any) => {
    updateAdminBuyer(
      userId,
      {
        first_name: data.firstName,
        last_name: data.lastName,
        dob: data.dob,
        gender: data.gender ? data.gender.toUpperCase() : undefined,
      },
      () => {
        setIsEditAccountModalOpen(false);
        setSuccessModalType("edit-account");
        fetchAdminBuyerById(userId, (updated) => setBuyer(updated));
      },
      () => {
        setIsEditAccountModalOpen(false);
        setSuccessModalType("error");
      }
    );
  };


  const handleSuspendConfirm = (reason: string) => {
    const formattedReason = reason.toUpperCase().replace(/\s+/g, "_");

    toggleAdminBuyerStatus(
      userId,
      {
        action: "suspend",
        reason: formattedReason,
        note: "",
      },
      () => {
        setIsSuspendModalOpen(false);
        setSuccessModalType("suspend");
        fetchAdminBuyerById(userId, (data) => setBuyer(data));
      },
    );
  };

  const handleActivate = () => {
    toggleAdminBuyerStatus(
      userId,
      {
        action: "activate",
      },
      () => {
        setSuccessModalType("activate");
        fetchAdminBuyerById(userId, (data) => setBuyer(data));
      },
    );
  };

  const handleDeleteConfirm = (reason: string) => {
    const formattedReason = reason.toUpperCase().replace(/[\s-]+/g, "_");
    deleteAdminBuyer(
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

  const defaultAddr =
    buyer?.default_address ||
    buyer?.addresses?.find((a) => a.is_default) ||
    buyer?.addresses?.[0];

  return (
    <div className="space-y-8 mb-[157px]">
      {/* Breadcrumbs */}
      <div>
        <div className="text-c12 font-MontserratMedium flex items-center gap-1">
          <Link
            href="/dashboard/admin/users?type=buyers"
            className="hover:text-gray-600 text-000000/12 transition-colors"
          >
            {parentCategory}
          </Link>
          <ChevronRight className="text-000000/44 w-4 h-4 px-[2.5px]" />
          <span className="font-MontserratSemiBold">
            {fullName}
          </span>
        </div>
      </div>

      <div className="flex justify-between">
        <h1 className="text-c18 font-MontserratBold">
          User Information
        </h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (buyer?.account_status === "Suspended") {
                handleActivate();
              } else {
                setIsSuspendModalOpen(true);
              }
            }}
            className="w-full max-w-28 h-12 px-6 py-3 rounded-c8 bg-ffaco6 text-ffffff text-sm font-MontserratSemiBold"
          >
            {buyer?.account_status === "Suspended" ? "Activate" : "Suspend"}
          </button>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="w-full max-w-24 h-12 px-6 py-3 rounded-c8 bg-ca0202 text-ffffff text-sm font-MontserratSemiBold"
          >
            Delete
          </button>
        </div>
      </div>

      {loading && !buyer ? (
        /* Loading state */
        <div className="flex justify-center items-center h-60">
          <LoadingSpinner size={40} color="border-ff715b" />
        </div>
      ) : (
        <div className="flex gap-8 justify-center items-start h-120">
          {/* Column 1: Profile Card */}
          <div className="bg-ffffff rounded-c16 p-6 text-center flex flex-col items-center gap-4 h-full w-full max-w-61 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="w-full flex flex-col items-center">
              <div className="w-full max-w-49 h-49 overflow-hidden mb-4">
                {buyer?.profile_picture_url ? (
                  <Image
                    src={buyer.profile_picture_url}
                    alt="avatar"
                    width={244}
                    height={244}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full bg-[#f0f2f5] flex items-center justify-center">
                    <User className="w-24 h-24 text-[#b0b8c1]" strokeWidth={1.2} />
                  </div>
                )}
              </div>
              <div className="h-22.5 w-full">
                <h2 className="text-c18 font-MontserratSemiBold mb-2 w-full truncate">
                  {fullName}
                </h2>
                <span
                  className={`text-[12px] font-MontserratMedium px-6 py-2 rounded-c4 w-fit h-8 inline-block ${statusColor}`}
                >
                  {statusLabel}
                </span>
              </div>
            </div>

            {/* Contact Details */}
            <div className="w-full space-y-3.5">
              <div className="flex items-center gap-2 w-full justify-center text-c12 font-MontserratNormal text-000000/68">
                <Image
                  src={Phonicon}
                  alt="Phone"
                  width={11.5}
                  height={17.5}
                  className="w-4 h-4 shrink-0"
                />
                <span>{defaultAddr?.phone || buyer?.phone || "—"}</span>
              </div>
              <div className="flex items-center gap-2 w-full justify-center text-c12 font-MontserratNormal text-000000/68">
                <Image
                  src={Phonicon}
                  alt="Phone"
                  width={11.5}
                  height={17.5}
                  className="w-4 h-4 shrink-0"
                />
                <span>{buyer?.phone2 || "—"}</span>
              </div>
              <div className="flex items-center justify-center w-full gap-2 text-c12 font-MontserratNormal text-000000/68">
                <Mail className="w-4 h-4 text-[#343330] shrink-0" />
                <span className="truncate">{buyer?.email || "—"}</span>
              </div>
              <div className="flex items-center gap-2 justify-center w-full text-c12 font-MontserratNormal text-000000/68">
                <MapPin className="w-4 h-4 text-[#343330] shrink-0" />
                <span>
                  {[
                    defaultAddr?.city || defaultAddr?.shipping_location_name || buyer?.city,
                    defaultAddr?.state || buyer?.state,
                    defaultAddr?.country_name || defaultAddr?.country || buyer?.country,
                  ]
                    .filter(Boolean)
                    .join(", ") || "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Column 2: Account & Address Details */}
          <div className="w-full max-w-109 flex-col flex justify-between animate-in fade-in duration-500 delay-100 h-full gap-4">
            {/* Account Information */}
            <div className="bg-ffffff rounded-c16 border border-[#eef0f3] p-6 shadow-sm relative">
              <div className="flex justify-between items-center pb-2 mb-4">
                <h3 className="font-MontserratSemiBold text-base">
                  Account information
                </h3>
                <button onClick={() => setIsEditAccountModalOpen(true)}>
                  <Edit className="w-[18.75px] h-[18.75px] text-ff715b" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm font-MontserratNormal text-000000/68">
                    First name
                  </span>
                  <span className="font-MontserratNormal text-sm text-000000">
                    {buyer?.first_name || "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-MontserratNormal text-000000/68">
                    Last name
                  </span>
                  <span className="font-MontserratNormal text-sm text-000000">
                    {buyer?.last_name || "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-MontserratNormal text-000000/68">
                    Email
                  </span>
                  <span className="font-MontserratNormal text-sm text-000000 truncate max-w-[200px]">
                    {buyer?.email || "—"}
                  </span>
                </div>
              
              
                <div className="flex justify-between">
                  <span className="text-sm font-MontserratNormal text-000000/68">
                    Date of Birth
                  </span>
                  <span className="font-MontserratNormal text-sm text-000000">
                    {(() => {
                      if (!buyer?.dob) return "—";
                      const dateObj = new Date(buyer.dob);
                      if (isNaN(dateObj.getTime())) return buyer.dob;
                      
                      const day = dateObj.getDate();
                      const year = dateObj.getFullYear();
                      const month = dateObj.toLocaleDateString("en-GB", { month: "long" });
                      
                      // Get ordinal suffix
                      const getOrdinalSuffix = (d: number) => {
                        if (d > 3 && d < 21) return "th";
                        switch (d % 10) {
                          case 1:  return "st";
                          case 2:  return "nd";
                          case 3:  return "rd";
                          default: return "th";
                        }
                      };
                      
                      return `${day}${getOrdinalSuffix(day)} ${month}, ${year}`;
                    })()}
                  </span>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="bg-ffffff rounded-2xl border border-[#eef0f3] p-6 shadow-sm relative">
              <div className="flex justify-between items-center pb-2 mb-4">
                <h3 className="font-MontserratSemiBold text-base">
                  Address information
                </h3>
                <button
                  onClick={() => setIsEditAddressModalOpen(true)}
                  className="text-sm font-MontserratNormal text-000000/68 hover:text-[#7f00ff] transition-colors p-1"
                >
                  <Edit className="w-[18.75px] h-[18.75px] text-ff715b" />
                </button>
              </div>
              <div className="space-y-4">
                {(defaultAddr?.full_address || defaultAddr?.address || buyer?.address) && (
                  <div className="flex justify-between gap-4">
                    <span className="text-sm font-MontserratNormal text-000000/68 shrink-0">
                      Address
                    </span>
                    <span className="font-MontserratNormal text-sm text-000000 text-right truncate max-w-[220px]">
                      {defaultAddr?.full_address || defaultAddr?.address || buyer?.address}
                    </span>
                  </div>
                )}
                {/* <div className="flex justify-between">
                  <span className="text-sm font-MontserratNormal text-000000/68">
                    City
                  </span>
                  <span className="font-MontserratNormal text-sm text-000000">
                    {defaultAddr?.city || defaultAddr?.shipping_location_name || buyer?.city || "—"}
                  </span>
                </div> */}
                <div className="flex justify-between">
                  <span className="text-sm font-MontserratNormal text-000000/68">
                    State/city
                  </span>
                  <span className="font-MontserratNormal text-sm text-000000">
                    {defaultAddr?.state || buyer?.state ||defaultAddr?.city || defaultAddr?.shipping_location_name || buyer?.city || "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-MontserratNormal text-000000/68">
                    Country
                  </span>
                  <span className="font-MontserratNormal text-sm text-000000">
                    {defaultAddr?.country_name || defaultAddr?.country || buyer?.country || "—"}
                  </span>
                </div>
                {(defaultAddr?.postal_code || buyer?.postal_code) && (
                  <div className="flex justify-between">
                    <span className="text-sm font-MontserratNormal text-000000/68">
                      Zipcode
                    </span>
                    <span className="font-MontserratNormal text-sm text-000000">
                      {defaultAddr?.postal_code || buyer?.postal_code}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Column 3: Usage Information */}
          <div className="bg-ffffff rounded-c16 p-6 h-full w-full max-w-90 flex flex-col animate-in fade-in slide-in-from-right-4 duration-500 delay-200">
            <h3 className="font-MontserratSemiBold text-base pb-6">
              Usage Information
            </h3>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between">
                <span className="text-sm font-MontserratNormal text-000000/68">
                  Last login
                </span>
                <span className="font-MontserratNormal text-sm text-000000">
                  {buyer?.last_login
                    ? new Date(buyer.last_login).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "—"}
                </span>
              </div>
              <div className="justify-between flex">
                <span className="text-sm font-MontserratNormal text-000000/68">
                  IP for last login
                </span>
                <span className="font-MontserratNormal text-sm text-000000">
                  {buyer?.last_login_ip ?? "—"}
                </span>
              </div>
              <div className="justify-between flex">
                <span className="text-sm font-MontserratNormal text-000000/68">
                  Last order date
                </span>
                <span className="font-MontserratNormal text-sm text-000000">
                  {buyer?.last_order_date ?? "—"}
                </span>
              </div>
              <div className="justify-between flex">
                <span className="text-sm font-MontserratNormal text-000000/68">
                  Total orders
                </span>
                <span className="font-MontserratNormal text-sm text-000000">
                  {buyer?.total_orders ?? "—"}
                </span>
              </div>
              <div className="justify-between flex">
                <span className="text-sm font-MontserratNormal text-000000/68">
                  Last payment method
                </span>
                <span className="font-MontserratNormal text-sm text-000000">
                  {buyer?.total_orders ?? "—"}
                </span>
              </div>
              <div className="justify-between flex">
                <span className="text-sm font-MontserratNormal text-000000/68">
                  Maximum order amount
                </span>
                <span className="font-MontserratNormal text-sm text-000000">
                  {buyer?.max_order_amount ?? "—"}
                </span>
              </div>
              <div className="justify-between flex">
                <span className="text-sm font-MontserratNormal text-000000/68">
                  Return rate
                </span>
                <span className="font-MontserratNormal text-sm text-000000">
                  {buyer?.return_rat ?? "—"} %
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-MontserratNormal text-000000/68">
                  Loyalty points
                </span>
                <span className="font-MontserratNormal text-sm text-000000">
                  {buyer?.loyalty_points ?? "—"}
                </span>
              </div>
           
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <EditUserModal
        isOpen={isEditAddressModalOpen}
        onClose={() => setIsEditAddressModalOpen(false)}
        onConfirm={handleEditAddressConfirm}
        loading={loading}
        initialData={{
          address: defaultAddr?.address || buyer?.address || "",
          city: defaultAddr?.city || buyer?.city || "",
          state: defaultAddr?.state || buyer?.state || "",
          country: defaultAddr?.country_name || defaultAddr?.country || buyer?.country || "",
          zipcode: defaultAddr?.postal_code || buyer?.postal_code || "",
        }}
      />
      <EditAccountModal
        isOpen={isEditAccountModalOpen}
        onClose={() => setIsEditAccountModalOpen(false)}
        onConfirm={handleEditAccountConfirm}
        loading={loading}
        initialData={{
          firstName: buyer?.first_name || "",
          lastName: buyer?.last_name || "",
          dob: buyer?.dob || "",
          gender: buyer?.gender_display || buyer?.gender || "",
        }}
      />
      <SuspendUserModal
        isOpen={isSuspendModalOpen}
        onClose={() => setIsSuspendModalOpen(false)}
        onConfirm={handleSuspendConfirm}
        loading={loading}
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
            router.push("/dashboard/admin/users?type=buyers");
          }
          setSuccessModalType(null);
        }}
        onCancel={() => setSuccessModalType(null)}
        result={successModalType === "error" ? "error" : "success"}
        title={
          successModalType === "error"
            ? "Action Failed"
            : successModalType === "activate"
            ? "User Activated Successfully"
            : successModalType === "delete"
            ? "Buyer Deleted Successfully"
            : successModalType === "edit-account"
            ? "Profile Updated Successfully"
            : "User Suspended Successfully"
        }
        message={
          successModalType === "error"
            ? "There was an error processing your request. Please try again."
            : successModalType === "activate"
            ? "The user has been successfully activated."
            : successModalType === "delete"
            ? "The buyer account has been permanently deleted."
            : successModalType === "edit-account"
            ? "The buyer's profile details have been updated."
            : "The user has been successfully suspended."
        }
        discRescription={
          successModalType === "error"
            ? "Please check your network and connection, then try again."
            : successModalType === "activate"
            ? "The account status of this user is now set to active."
            : successModalType === "delete"
            ? "You will be redirected back to the buyers list."
            : successModalType === "edit-account"
            ? "The profile changes are now applied to this account."
            : "The account status of this user is now set to suspended."
        }
        buttenText="Ok"
      />
    </div>
  );
}
