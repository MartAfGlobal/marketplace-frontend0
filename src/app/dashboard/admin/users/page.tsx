"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AdminStatsChartCard from "@/components/ui/admin-components/AdminStatsChartCard";
import AdminListHeader from "@/components/ui/admin-components/AdminListHeader";

interface UserRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "Active" | "Inactive";
  totalOrders: number;
  repeatRate: string;
  country: string;
  date: string;
}

export default function AdminUsersPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Default to buyers if no type param exists
  const type = searchParams.get("type") || "buyers";
  const isBuyers = type === "buyers";

  const [searchVal, setSearchVal] = useState("");

  // Buyers list mock data
  const mockBuyers: UserRow[] = [
    { id: "B000245", name: "Kelvin Uglejfe", email: "chinweokafor@gmail.com", phone: "+234-703235232", status: "Active", totalOrders: 1500, repeatRate: "30%", country: "Nigeria", date: "18/9/2016" },
    { id: "B000246", name: "Kelvin Ugliegweg", email: "chinweokafor@gmail.com", phone: "+234-703235232", status: "Inactive", totalOrders: 260, repeatRate: "80%", country: "South Africa", date: "18/9/2016" },
    { id: "B000247", name: "Kelvin Ugliegweg", email: "chinweokafor@gmail.com", phone: "+234-703235232", status: "Active", totalOrders: 342, repeatRate: "50%", country: "Nigeria", date: "18/9/2016" },
    { id: "B000248", name: "Kelvin Ugliegweg", email: "chinweokafor@gmail.com", phone: "+234-703235232", status: "Inactive", totalOrders: 150, repeatRate: "10%", country: "Nigeria", date: "18/9/2016" },
  ];

  // Sellers list mock data
  const mockSellers: UserRow[] = [
    { id: "S000101", name: "Martaf Store Ltd", email: "info@martafstore.com", phone: "+234-809823432", status: "Active", totalOrders: 4200, repeatRate: "45%", country: "Nigeria", date: "12/5/2019" },
    { id: "S000102", name: "Adegoke Electronics", email: "adegoke@el.com", phone: "+234-708823121", status: "Active", totalOrders: 150, repeatRate: "20%", country: "Nigeria", date: "09/1/2021" },
    { id: "S000103", name: "Onaaga SuperMart", email: "hello@onaaga.com", phone: "+233-503423212", status: "Inactive", totalOrders: 980, repeatRate: "65%", country: "Ghana", date: "24/8/2020" },
  ];

  const currentRows = isBuyers ? mockBuyers : mockSellers;

  // Filter rows based on search
  const filteredRows = currentRows.filter(row => 
    row.name.toLowerCase().includes(searchVal.toLowerCase()) ||
    row.id.toLowerCase().includes(searchVal.toLowerCase()) ||
    row.email.toLowerCase().includes(searchVal.toLowerCase())
  );

  const handleRowClick = (userId: string) => {
    // Navigate to dynamic details page (Image 3)
    router.push(`/dashboard/admin/users/${userId}`);
  };

  return (
    <div className="space-y-8">
      {/* Page Title & Breadcrumbs */}
      <div>
        <div className="text-[10px] text-gray-400 font-MontserratMedium uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <span>Users</span>
          <span>&gt;</span>
          <span className="text-gray-600 font-MontserratBold capitalize">{type}</span>
        </div>
        <h1 className="text-xl md:text-2xl font-MontserratBold text-[#161616] capitalize">{type}</h1>
      </div>

      {/* Top Stats Graph Card (Reusable) */}
      <AdminStatsChartCard 
        title={type}
        total={isBuyers ? "5,000" : "1,850"}
        active={isBuyers ? "250" : "180"}
        inactive={isBuyers ? "150" : "45"}
        timeFilterText="This week"
      />

      {/* Main Listing Section */}
      <div className="bg-white rounded-2xl p-6 border border-[#eef0f3] shadow-sm animate-in fade-in duration-300">
        <h2 className="text-sm font-MontserratBold text-[#161616] capitalize mb-6">{type} list</h2>

        {/* Filters Header (Reusable) */}
        <AdminListHeader 
          searchVal={searchVal}
          setSearchVal={setSearchVal}
          placeholder={`Search ${type} by ID, name or email...`}
        />

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-gray-100 text-[10px] text-gray-400 font-MontserratBold uppercase tracking-wider h-11">
                <th className="py-3 px-4 font-bold">{isBuyers ? "Buyer ID" : "Seller ID"}</th>
                <th className="py-3 px-4 font-bold">Full name</th>
                <th className="py-3 px-4 font-bold">Email</th>
                <th className="py-3 px-4 font-bold">Phone number</th>
                <th className="py-3 px-4 font-bold">Status</th>
                <th className="py-3 px-4 font-bold">Total orders</th>
                <th className="py-3 px-4 font-bold">Repeat rate</th>
                <th className="py-3 px-4 font-bold">Country</th>
                <th className="py-3 px-4 font-bold">Last purchase date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-[11px] text-gray-700 font-MontserratMedium">
              {filteredRows.length > 0 ? (
                filteredRows.map((row) => (
                  <tr 
                    key={row.id} 
                    onClick={() => handleRowClick(row.id)}
                    className="hover:bg-gray-50/50 transition-colors h-14 cursor-pointer"
                  >
                    <td className="py-3 px-4 text-gray-400 font-MontserratMedium">{row.id}</td>
                    <td className="py-3 px-4 text-[#161616] font-MontserratSemiBold">{row.name}</td>
                    <td className="py-3 px-4 text-gray-500">{row.email}</td>
                    <td className="py-3 px-4 text-gray-500">{row.phone}</td>
                    <td className="py-3 px-4">
                      <span className={`text-[9px] font-MontserratBold px-2.5 py-0.5 rounded-full uppercase ${
                        row.status === "Active"
                          ? "text-[#2ea37d] bg-[#2ea37d]/10"
                          : "text-[#f44336] bg-[#f44336]/10"
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#161616] font-MontserratSemiBold">{row.totalOrders}</td>
                    <td className="py-3 px-4 text-[#161616] font-MontserratSemiBold">{row.repeatRate}</td>
                    <td className="py-3 px-4 text-gray-400">{row.country}</td>
                    <td className="py-3 px-4 text-gray-400">{row.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-gray-400 font-MontserratMedium text-xs">
                    No records found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
