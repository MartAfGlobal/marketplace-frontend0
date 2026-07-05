"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import CustomerImage from "@/assets/admin/customerImage.svg";
import Phonicon from "@/assets/admin/phone.svg";
import {
  Phone,
  Mail,
  MapPin,
  Edit,
  User,
  AlertTriangle,
  Trash2,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import SellerDetails from "@/components/admin-components/users/seller-details/SellerDetails";
import EditUserModal from "@/components/ui/Modals/admin/EditUserModal";
import EditAccountModal from "@/components/ui/Modals/admin/EditAccountModal";
import SuspendUserModal from "@/components/ui/Modals/admin/SuspendUserModal";
import DeleteUserModal from "@/components/ui/Modals/admin/DeleteUserModal";

// Reusing avatar picture pattern or stylised icon
import Custermer1 from "@/assets/Seller/customer1.png";

export default function AdminUserDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const isSeller = userId.startsWith("S");
  const parentCategory = isSeller ? "Sellers" : "Buyers";
  const name = isSeller ? "Martaf Store Ltd" : "Kelvin Uglejfe";

  const [isEditAddressModalOpen, setIsEditAddressModalOpen] = useState(false);
  const [isEditAccountModalOpen, setIsEditAccountModalOpen] = useState(false);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleEditAddressConfirm = (data: any) => {
    console.log("Updated address data:", data);
    setIsEditAddressModalOpen(false);
  };

  const handleEditAccountConfirm = (data: any) => {
    console.log("Updated account data:", data);
    setIsEditAccountModalOpen(false);
  };

  const handleSuspendConfirm = (reason: string) => {
    console.log("Suspend reason:", reason);
    setIsSuspendModalOpen(false);
  };

  const handleDeleteConfirm = (reason: string) => {
    console.log("Delete reason:", reason);
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Top Breadcrumbs & Nav back */}

      <div>
        <div className="text-c12  font-MontserratMedium    flex items-center gap-1">
          <Link
            href={`/dashboard/admin/users?type=${isSeller ? "sellers" : "buyers"}`}
            className="hover:text-gray-600 text-000000/12 transition-colors"
          >
            {parentCategory}
          </Link>
          <ChevronRight className="text-000000/44 w-4 h-4 px-[2.5px]" />
          <span className=" font-MontserratSemiBold">{name}</span>
        </div>
      </div>

      <div className="flex justify-between">
        <h1 className="text-c18 font-MontserratBold ">{isSeller ? "Seller's details" : "User Information"}</h1>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSuspendModalOpen(true)}
            className="w-full max-w-28 h-12 px-6 py-3 rounded-c8 bg-ffaco6 text-ffffff text-sm font-MontserratSemiBold"
          >
            Suspend
          </button>
          <button 
            onClick={() => setIsDeleteModalOpen(true)}
            className="w-full max-w-24 h-12 px-6 py-3 rounded-c8 bg-ca0202 text-ffffff text-sm font-MontserratSemiBold"
          >
            Delete
          </button>
        </div>
      </div>

      {isSeller ? (
        <SellerDetails userId={userId} />
      ) : (
        <div className="flex gap-8 justify-center items-start h-120">
          <div className="bg-ffffff rounded-c16  p-6 text-center  flex flex-col items-center gap-4 h-full w-full max-w-61 animate-in fade-in slide-in-from-left-4 duration-500 ">
            <div className="w-full  flex flex-col items-center ">
              <div className="w-full max-w-49  h-49 overflow-hidden  mb-4 ">
              <Image
                src={CustomerImage}
                alt="avatar"
                width={244}
                height={244}
                className=" object-cover w-full h-full"
              />
            </div>

            <div className="h-22.5 w-full">
              {/* Profile Info */}
              <h2 className="text-c18 font-MontserratSemiBold  mb-2">{name}</h2>
              <span className="text-[12px] font-MontserratMedium text-[#4DBEA7] bg-[#28A745]/12 px-6 py-2 rounded-c4 w-21.75 h-8  inline-block">
                Active
              </span>
            </div>
          </div>

          {/* Contact Details Panel */}
          <div className="w-full f space-y-3.5">
            <div className="flex items-center gap-2 w-full justify-center text-c12 font-MontserratNormal text-000000/68">
              <Image
                src={Phonicon}
                alt="Phone"
                width={11.5}
                height={17.5}
                className="w-4 h-4 text-sm font-MontserratNormal text-000000/68 shrink-0"
              />
              <span>+23478564598</span>
            </div>
            <div className="flex items-center justify-center w-full gap-2 text-c12 font-MontserratNormal text-000000/68">
              <Mail className="w-4 h-4 text-[#343330] shrink-0" />
              <span className="truncate">chinweokafor@gmail.com</span>
            </div>
            <div className="flex items-center gap-2 justify-center w-full text-c12 font-MontserratNormal text-000000/68">
              <MapPin className="w-4 h-4 text-[#343330] shrink-0" />
              <span>Nigeria</span>
            </div>
          </div>
        </div>

        {/* Column 2: Account & Address Details Card */}
        <div className="w-full max-w-109 flex-col flex justify-between animate-in fade-in duration-500 delay-100 h-full">
          {/* Account Information Panel */}
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
              <div className="flex justify-between ">
                <span className="text-sm font-MontserratNormal text-000000/68">
                  First name
                </span>
                <span className="font-MontserratNormal text-sm text-000000">
                  {isSeller ? "Martaf" : "Kelvin"}
                </span>
              </div>
              <div className="flex justify-between ">
                <span className="text-sm font-MontserratNormal text-000000/68">
                  Last name
                </span>
                <span className="font-MontserratNormal text-sm text-000000">
                  {isSeller ? "Store Ltd" : "Uglejfe"}
                </span>
              </div>
              <div className="flex justify-between ">
                <span className="text-sm font-MontserratNormal text-000000/68">
                  Date of Birth
                </span>
                <span className="font-MontserratNormal text-sm text-000000">
                  15th June, 1984
                </span>
              </div>
              <div className="flex justify-between ">
                <span className="text-sm font-MontserratNormal text-000000/68">
                  Gender
                </span>
                <span className="font-MontserratNormal text-sm text-000000">
                  Male
                </span>
              </div>
            </div>
          </div>

          {/* Address Information Panel */}
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
              <div className="flex justify-between ">
                <span className="text-sm font-MontserratNormal text-000000/68">
                  Address
                </span>
                <span
                  className="font-MontserratNormal text-sm text-000000 text-right max-w-[200px] truncate"
                  title="43H, Eastern Avenue, Lagos"
                >
                  43H, Eastern Avenue, Lagos
                </span>
              </div>
              <div className="flex justify-between ">
                <span className="text-sm font-MontserratNormal text-000000/68">
                  State/City
                </span>
                <span className="font-MontserratNormal text-sm text-000000">
                  Lagos
                </span>
              </div>
              <div className="flex justify-between ">
                <span className="text-sm font-MontserratNormal text-000000/68">
                  Country
                </span>
                <span className="font-MontserratNormal text-sm text-000000">
                  Nigeria
                </span>
              </div>
              <div className="flex justify-between ">
                <span className="text-sm font-MontserratNormal text-000000/68">
                  Zipcode
                </span>
                <span className="font-MontserratNormal text-sm text-000000">
                  900001
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Usage Information Card */}
        <div className="bg-ffffff rounded-c16 p-6 h-full w-full max-w-90 flex flex-col animate-in fade-in slide-in-from-right-4 duration-500 delay-200">
          <h3 className="font-MontserratSemiBold text-base pb-6 ">
            Usage Information
          </h3>
          <div className=" flex flex-col gap-4">
            <div className="flex justify-between  ">
              <span className="text-sm font-MontserratNormal text-000000/68">
                Last login
              </span>
              <span className="font-MontserratNormal text-sm text-000000">
                25th April, 2025 4:00PM
              </span>
            </div>
            <div className="flex justify-between ">
              <span className="text-sm font-MontserratNormal text-000000/68">
                IP for last login
              </span>
              <span className="font-MontserratNormal text-sm text-000000">
                192.168.101.23
              </span>
            </div>
            <div className="flex justify-between ">
              <span className="text-sm font-MontserratNormal text-000000/68">
                Last order date
              </span>
              <span className="font-MontserratNormal text-sm text-000000">
                25th April, 2025
              </span>
            </div>
            <div className="flex justify-between ">
              <span className="text-sm font-MontserratNormal text-000000/68">
                Last payment method
              </span>
              <span className="font-MontserratNormal text-sm text-000000">
                Paystack TPP
              </span>
            </div>
            <div className="flex justify-between ">
              <span className="text-sm font-MontserratNormal text-000000/68">
                Maximum order amount
              </span>
              <span className="font-MontserratNormal text-sm text-000000">
                N250,000
              </span>
            </div>
            <div className="flex justify-between  pb-2">
              <span className="text-sm font-MontserratNormal text-000000/68">
                Return rate
              </span>
              <span className="font-MontserratNormal text-sm text-000000">
                30%
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
        initialData={{ address: "43H, Eastern Avenue, Lagos", state: "Lagos", country: "Nigeria", zipcode: "900001" }}
      />
      <EditAccountModal 
        isOpen={isEditAccountModalOpen} 
        onClose={() => setIsEditAccountModalOpen(false)} 
        onConfirm={handleEditAccountConfirm} 
        initialData={{ firstName: isSeller ? "Martaf" : "Kelvin", lastName: isSeller ? "Store Ltd" : "Uglejfe", dob: "15th June, 1984", gender: "Male" }}
      />
      <SuspendUserModal 
        isOpen={isSuspendModalOpen} 
        onClose={() => setIsSuspendModalOpen(false)} 
        onConfirm={handleSuspendConfirm} 
      />
      <DeleteUserModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        onConfirm={handleDeleteConfirm} 
      />
    </div>
  );
}
