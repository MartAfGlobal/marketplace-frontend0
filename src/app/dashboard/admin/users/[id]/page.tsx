"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Edit,
  User,
  AlertTriangle,
  Trash2
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Reusing avatar picture pattern or stylised icon
import Custermer1 from "@/assets/Seller/customer1.png";

export default function AdminUserDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const isSeller = userId.startsWith("S");
  const parentCategory = isSeller ? "Sellers" : "Buyers";
  const name = isSeller ? "Martaf Store Ltd" : "Kelvin Uglejfe";

  return (
    <div className="space-y-6">
      {/* Top Breadcrumbs & Nav back */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] text-gray-400 font-MontserratMedium uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Link href={`/dashboard/admin/users?type=${isSeller ? "sellers" : "buyers"}`} className="hover:text-gray-600 transition-colors">
              {parentCategory}
            </Link>
            <span>&gt;</span>
            <span className="text-gray-600 font-MontserratBold">{name}</span>
          </div>
          <h1 className="text-xl md:text-2xl font-MontserratBold text-[#161616]">User Information</h1>
        </div>

        {/* Action Buttons: Suspend & Delete */}
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 h-10 px-5 bg-[#ff9800] text-white rounded-xl text-xs font-MontserratBold hover:bg-[#e68a00] transition-colors shadow-md shadow-[#ff9800]/10 active:scale-95 cursor-pointer">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Suspend</span>
          </button>
          <button className="flex items-center gap-2 h-10 px-5 bg-[#f44336] text-white rounded-xl text-xs font-MontserratBold hover:bg-[#d32f2f] transition-colors shadow-md shadow-[#f44336]/10 active:scale-95 cursor-pointer">
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Details Grid (3 columns on desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Column 1: Profile Summary Card */}
        <div className="bg-white rounded-2xl border border-[#eef0f3] p-6 text-center flex flex-col items-center justify-between min-h-[460px] shadow-sm animate-in fade-in slide-in-from-left-4 duration-500">
          <div className="w-full flex flex-col items-center">
            {/* Avatar Section */}
            <div className="w-36 h-36 rounded-2xl overflow-hidden border border-[#efefef] mb-5 shadow-sm">
              <Image 
                src={Custermer1} 
                alt="avatar" 
                width={144} 
                height={144} 
                className="object-cover w-full h-full"
              />
            </div>

            {/* Profile Info */}
            <h2 className="text-base font-MontserratBold text-[#161616] mb-1.5">{name}</h2>
            <span className="text-[10px] font-MontserratBold text-[#2ea37d] bg-[#2ea37d]/10 px-3 py-1 rounded-full uppercase mb-6 inline-block">
              Active
            </span>
          </div>

          {/* Contact Details Panel */}
          <div className="w-full border-t border-gray-100 pt-6 space-y-4 text-left">
            <div className="flex items-center gap-3.5 text-xs text-gray-600 font-MontserratMedium">
              <Phone className="w-4 h-4 text-gray-400 shrink-0" />
              <span>+23478564598</span>
            </div>
            <div className="flex items-center gap-3.5 text-xs text-gray-600 font-MontserratMedium">
              <Mail className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="truncate">chinweokafor@gmail.com</span>
            </div>
            <div className="flex items-center gap-3.5 text-xs text-gray-600 font-MontserratMedium">
              <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
              <span>Nigeria</span>
            </div>
          </div>
        </div>

        {/* Column 2: Account & Address Details Card */}
        <div className="lg:col-span-1 space-y-6 animate-in fade-in duration-500 delay-100">
          {/* Account Information Panel */}
          <div className="bg-white rounded-2xl border border-[#eef0f3] p-6 shadow-sm relative">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-MontserratBold text-[#161616]">Account information</h3>
              <button className="text-gray-400 hover:text-[#7f00ff] transition-colors p-1" title="Edit account details">
                <Edit className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between text-xs font-MontserratMedium">
                <span className="text-gray-400">First name</span>
                <span className="text-[#161616] font-MontserratSemiBold">{isSeller ? "Martaf" : "Kelvin"}</span>
              </div>
              <div className="flex justify-between text-xs font-MontserratMedium">
                <span className="text-gray-400">Last name</span>
                <span className="text-[#161616] font-MontserratSemiBold">{isSeller ? "Store Ltd" : "Uglejfe"}</span>
              </div>
              <div className="flex justify-between text-xs font-MontserratMedium">
                <span className="text-gray-400">Date of Birth</span>
                <span className="text-[#161616] font-MontserratSemiBold">15th June, 1984</span>
              </div>
              <div className="flex justify-between text-xs font-MontserratMedium">
                <span className="text-gray-400">Gender</span>
                <span className="text-[#161616] font-MontserratSemiBold">Male</span>
              </div>
            </div>
          </div>

          {/* Address Information Panel */}
          <div className="bg-white rounded-2xl border border-[#eef0f3] p-6 shadow-sm relative">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-MontserratBold text-[#161616]">Address information</h3>
              <button className="text-gray-400 hover:text-[#7f00ff] transition-colors p-1" title="Edit address details">
                <Edit className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between text-xs font-MontserratMedium">
                <span className="text-gray-400">Address</span>
                <span className="text-[#161616] font-MontserratSemiBold text-right max-w-[200px] truncate" title="43H, Eastern Avenue, Lagos">
                  43H, Eastern Avenue, Lagos
                </span>
              </div>
              <div className="flex justify-between text-xs font-MontserratMedium">
                <span className="text-gray-400">State/City</span>
                <span className="text-[#161616] font-MontserratSemiBold">Lagos</span>
              </div>
              <div className="flex justify-between text-xs font-MontserratMedium">
                <span className="text-gray-400">Country</span>
                <span className="text-[#161616] font-MontserratSemiBold">Nigeria</span>
              </div>
              <div className="flex justify-between text-xs font-MontserratMedium">
                <span className="text-gray-400">Zipcode</span>
                <span className="text-[#161616] font-MontserratSemiBold">900001</span>
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Usage Information Card */}
        <div className="bg-white rounded-2xl border border-[#eef0f3] p-6 shadow-sm min-h-[460px] flex flex-col animate-in fade-in slide-in-from-right-4 duration-500 delay-200">
          <h3 className="text-sm font-MontserratBold text-[#161616] mb-6">Usage Information</h3>
          <div className="space-y-5 flex-1 flex flex-col justify-around">
            <div className="flex justify-between text-xs font-MontserratMedium border-b border-gray-50 pb-3">
              <span className="text-gray-400">Last login</span>
              <span className="text-[#161616] font-MontserratSemiBold">25th April, 2025 4:00PM</span>
            </div>
            <div className="flex justify-between text-xs font-MontserratMedium border-b border-gray-50 pb-3">
              <span className="text-gray-400">IP for last login</span>
              <span className="text-[#161616] font-MontserratSemiBold">192.168.101.23</span>
            </div>
            <div className="flex justify-between text-xs font-MontserratMedium border-b border-gray-50 pb-3">
              <span className="text-gray-400">Last order date</span>
              <span className="text-[#161616] font-MontserratSemiBold">25th April, 2025</span>
            </div>
            <div className="flex justify-between text-xs font-MontserratMedium border-b border-gray-50 pb-3">
              <span className="text-gray-400">Last payment method</span>
              <span className="text-[#161616] font-MontserratSemiBold">Paystack TPP</span>
            </div>
            <div className="flex justify-between text-xs font-MontserratMedium border-b border-gray-50 pb-3">
              <span className="text-gray-400">Maximum order amount</span>
              <span className="text-[#161616] font-MontserratSemiBold">N250,000</span>
            </div>
            <div className="flex justify-between text-xs font-MontserratMedium pb-2">
              <span className="text-gray-400">Return rate</span>
              <span className="text-[#161616] font-MontserratSemiBold">30%</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
