"use client";

import React, { useState } from "react";
import { Plus, MoreVertical } from "lucide-react";
import AdminStatsChartCard from "@/components/ui/admin-components/AdminStatsChartCard";
import AdminListHeader from "@/components/ui/admin-components/AdminListHeader";
import { Button } from "@/components/ui/Button/Button";

interface StaffRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "Active" | "Inactive";
  role: string;
  country: string;
  date: string;
}

export default function AdminStaffPage() {
  const [searchVal, setSearchVal] = useState("");

  // Staff members mock data
  const mockStaff: StaffRow[] = [
    { id: "B000245", name: "Kelvin Ugliegweg", email: "chinweokafor@gmail.com", phone: "+234-703235232", status: "Active", role: "Operations", country: "Nigeria", date: "18/9/2016" },
    { id: "B000245", name: "Kelvin Ugliegweg", email: "chinweokafor@gmail.com", phone: "+234-703235232", status: "Inactive", role: "Finance", country: "South Africa", date: "18/9/2016" },
    { id: "B000245", name: "Kelvin Ugliegweg", email: "chinweokafor@gmail.com", phone: "+234-703235232", status: "Active", role: "Customer support", country: "Nigeria", date: "18/9/2016" },
    { id: "B000245", name: "Kelvin Ugliegweg", email: "chinweokafor@gmail.com", phone: "+234-703235232", status: "Inactive", role: "IT support", country: "Nigeria", date: "18/9/2016" },
  ];

  // Filter rows based on search
  const filteredStaff = mockStaff.filter(row => 
    row.name.toLowerCase().includes(searchVal.toLowerCase()) ||
    row.role.toLowerCase().includes(searchVal.toLowerCase()) ||
    row.email.toLowerCase().includes(searchVal.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Page Title & Add Staff Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-MontserratBold text-[#161616]">Staff Management</h1>
          <p className="text-xs text-gray-400 font-MontserratMedium mt-0.5">Manage Staff access and roles</p>
        </div>
        
        {/* "+ Add Staff" Button using user's existing button wrapper */}
        <div className="w-full sm:w-auto">
          <Button 
            variant="primary"
            className="h-10 px-5 flex items-center justify-center gap-2 rounded-xl text-xs font-MontserratBold w-full sm:w-auto bg-[#FF715B] text-white hover:bg-opacity-90 shadow-md shadow-[#FF715B]/10 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Staff</span>
          </Button>
        </div>
      </div>

      {/* Top Stats Graph Card (Reusable) */}
      <AdminStatsChartCard 
        title="Staff"
        total="5,000"
        active="250"
        inactive="150"
        timeFilterText="This week"
      />

      {/* Main Listing Section */}
      <div className="bg-white rounded-2xl p-6 border border-[#eef0f3] shadow-sm animate-in fade-in duration-300">
        <h2 className="text-sm font-MontserratBold text-[#161616] capitalize mb-6">staff list</h2>

        {/* Filters Header (Reusable) */}
        <AdminListHeader 
          searchVal={searchVal}
          setSearchVal={setSearchVal}
          placeholder="Search staff members by name, email or role..."
        />

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-gray-100 text-[10px] text-gray-400 font-MontserratBold uppercase tracking-wider h-11">
                <th className="py-3 px-4 font-bold">Staff ID</th>
                <th className="py-3 px-4 font-bold">Full name</th>
                <th className="py-3 px-4 font-bold">Email</th>
                <th className="py-3 px-4 font-bold">Phone number</th>
                <th className="py-3 px-4 font-bold">Status</th>
                <th className="py-3 px-4 font-bold">Role</th>
                <th className="py-3 px-4 font-bold">Country</th>
                <th className="py-3 px-4 font-bold">Date added</th>
                <th className="py-3 px-4 font-bold text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-[11px] text-gray-700 font-MontserratMedium">
              {filteredStaff.length > 0 ? (
                filteredStaff.map((row, index) => (
                  <tr 
                    key={index} 
                    className="hover:bg-gray-50/50 transition-colors h-14"
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
                    <td className="py-3 px-4 text-[#161616] font-MontserratSemiBold">{row.role}</td>
                    <td className="py-3 px-4 text-gray-400">{row.country}</td>
                    <td className="py-3 px-4 text-gray-400">{row.date}</td>
                    <td className="py-3 px-4 text-right">
                      <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-all cursor-pointer">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-gray-400 font-MontserratMedium text-xs">
                    No staff members found matching search.
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
