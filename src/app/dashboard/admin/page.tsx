"use client";

import React, { useState } from "react";
import { 
  ChevronDown, 
  Plane, 
  Users2, 
  Headset, 
  FileText,
  ArrowRight,
  HelpCircle
} from "lucide-react";
import Link from "next/link";

export default function AdminOverviewPage() {
  const [timeFilter, setTimeFilter] = useState("Today");

  // Mock data for tickets
  const mockTickets = [
    { id: "TCK-2025-00423", subject: "Order is still hanging", priority: "High", status: "Open", date: "18/9/2016" },
    { id: "TCK-2025-00423", subject: "Order is still hanging", priority: "High", status: "Open", date: "18/9/2016" },
    { id: "TCK-2025-00423", subject: "Order is still hanging", priority: "High", status: "Open", date: "18/9/2016" },
    { id: "TCK-2025-00423", subject: "Order is still hanging", priority: "High", status: "Open", date: "18/9/2016" },
  ];

  // Mock data for Pending KYBs
  const mockKYBs = [
    { name: "Chisco", type: "Individual", country: "Nigeria" },
    { name: "Irem ipsumhege", type: "Cooperate", country: "Nigeria" },
    { name: "Irem ipsumhege", type: "Cooperate", country: "Ghana" },
    { name: "Irem ipsumhegeujiegw", type: "Cooperate", country: "Uganda" },
  ];

  // CSS bar heights for User Trend Chart
  const chartBars = [
    { day: "Mon", height: "70%" },
    { day: "Tue", height: "50%" },
    { day: "Wed", height: "85%" },
    { day: "Thu", height: "35%" },
    { day: "Fri", height: "55%" },
    { day: "Sat", height: "45%" },
    { day: "Sun", height: "90%" },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header Row with Time Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-xl md:text-2xl font-MontserratBold text-[#161616]">Overview</h1>
        
        {/* Pills Date Filter Toggle */}
        <div className="flex items-center bg-gray-100 p-1 rounded-xl w-fit">
          {["Today", "This week", "Total"].map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`px-4 py-1.5 rounded-lg text-xs font-MontserratBold transition-all ${
                timeFilter === filter 
                  ? "bg-[#7f00ff] text-white shadow-sm" 
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Dashboard Cards */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* 1. ORDERS CARD */}
        <div className="bg-white rounded-2xl p-6 border border-[#eef0f3] flex flex-col justify-between min-h-[380px] shadow-sm">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-MontserratBold text-gray-400">Orders</h2>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg text-[10px] text-gray-500 font-MontserratMedium border border-[#eef0f3]">
              <span>This month</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>
          </div>

          {/* Stats Breakdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Left Primary Stat */}
            <div className="flex items-center gap-4 col-span-1 border-r border-gray-100 pr-4">
              <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                <Plane className="w-6 h-6 rotate-45" />
              </div>
              <div>
                <p className="text-xl md:text-2xl font-MontserratBold text-[#161616]">1,500,000</p>
                <p className="text-[10px] text-gray-400 font-MontserratMedium">N55M</p>
              </div>
            </div>

            {/* Middle Stats Badges */}
            <div className="space-y-4 col-span-2 pl-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-MontserratBold text-[#161616]">1,500,000</p>
                  <p className="text-[9px] text-gray-400 font-MontserratMedium">N54,000</p>
                </div>
                <span className="text-[9px] font-MontserratBold text-[#2ea37d] bg-[#2ea37d]/10 px-2.5 py-1 rounded-full uppercase">Completed</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-MontserratBold text-[#161616]">1000</p>
                  <p className="text-[9px] text-gray-400 font-MontserratMedium">N55,000</p>
                </div>
                <span className="text-[9px] font-MontserratBold text-[#ff9800] bg-[#ff9800]/10 px-2.5 py-1 rounded-full uppercase">Ongoing</span>
              </div>
            </div>
          </div>

          {/* Bottom Details Row */}
          <div className="border-t border-gray-100 pt-6 mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* Countries Stats */}
            <div className="col-span-1 md:col-span-2 flex flex-wrap gap-x-4 gap-y-2">
              {["NG", "US", "GH", "CN"].map((c, i) => (
                <div key={c} className="text-left">
                  <span className="text-[10px] font-MontserratBold text-[#161616]">{c} </span>
                  <span className="text-[10px] text-gray-400 font-MontserratMedium">{i === 0 ? "150,000" : "500"}</span>
                </div>
              ))}
            </div>

            {/* Pending & Returned Badges */}
            <div className="col-span-1 space-y-2 flex flex-col items-end md:items-start pl-2">
              <div className="flex items-center justify-between w-full">
                <span className="text-[9px] font-MontserratBold text-[#2196f3] bg-[#2196f3]/10 px-2 py-0.5 rounded-md uppercase">Pending</span>
                <span className="text-[10px] font-MontserratBold text-[#161616]">750</span>
              </div>
              <div className="flex items-center justify-between w-full">
                <span className="text-[9px] font-MontserratBold text-[#f44336] bg-[#f44336]/10 px-2 py-0.5 rounded-md uppercase">Returned</span>
                <span className="text-[10px] font-MontserratBold text-[#161616]">350,000</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. USERS CARD */}
        <div className="bg-white rounded-2xl p-6 border border-[#eef0f3] flex flex-col justify-between min-h-[380px] shadow-sm">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-MontserratBold text-gray-400">Users</h2>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg text-[10px] text-gray-500 font-MontserratMedium border border-[#eef0f3]">
              <span>This week</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>
          </div>

          {/* Stats & Bar Chart Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Left Total Active Stat */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                <Users2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xl md:text-2xl font-MontserratBold text-[#161616]">1,500,000</p>
                <p className="text-[10px] text-gray-400 font-MontserratMedium">Active</p>
              </div>
            </div>

            {/* Right Stacked Bar Chart */}
            <div className="h-32 flex items-end justify-between relative pl-4 border-l border-gray-100">
              {/* Y Axis Grid/Legends */}
              <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-between text-[8px] text-gray-400 font-MontserratMedium">
                <span>500</span>
                <span>400</span>
                <span>300</span>
                <span>200</span>
                <span>100</span>
                <span>0</span>
              </div>
              {/* Bars */}
              <div className="flex-1 flex items-end justify-around h-full pr-6">
                {chartBars.map((bar) => (
                  <div key={bar.day} className="flex flex-col items-center gap-1 h-full justify-end w-4 group">
                    <div 
                      style={{ height: bar.height }} 
                      className="w-2.5 bg-[#947fff]/50 group-hover:bg-[#7f00ff] rounded-t-sm transition-all"
                    />
                    <span className="text-[7px] text-gray-400 font-MontserratMedium">{bar.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Details Row */}
          <div className="border-t border-gray-100 pt-6 mt-6 flex justify-around">
            <div className="text-center">
              <p className="text-base md:text-lg font-MontserratBold text-[#161616]">500</p>
              <span className="text-[9px] font-MontserratBold text-[#7f00ff] bg-[#7f00ff]/10 px-2.5 py-0.5 rounded-full uppercase">Buyers</span>
            </div>
            <div className="text-center">
              <p className="text-base md:text-lg font-MontserratBold text-[#161616]">250,000</p>
              <span className="text-[9px] font-MontserratBold text-[#7f00ff] bg-[#7f00ff]/10 px-2.5 py-0.5 rounded-full uppercase">Sellers</span>
            </div>
          </div>
        </div>

        {/* 3. TICKETS CARD */}
        <div className="bg-white rounded-2xl p-6 border border-[#eef0f3] flex flex-col justify-between min-h-[380px] shadow-sm">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-MontserratBold text-gray-400">Tickets</h2>
            <Link 
              href="/dashboard/admin/support" 
              className="text-[10px] font-MontserratBold text-[#f44336] hover:underline flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Stats Header Box */}
          <div className="flex items-center justify-between bg-gray-50/50 p-4 rounded-xl mb-4 border border-gray-100/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                <HelpCircle className="w-5 h-5" />
              </div>
              <p className="text-xl font-MontserratBold text-[#161616]">1500</p>
            </div>
            <span className="text-[10px] font-MontserratBold text-[#8d6e63] bg-[#efebe9] px-3 py-1.5 rounded-lg">
              Total pending: 320
            </span>
          </div>

          {/* Tickets Table */}
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[450px]">
              <thead>
                <tr className="border-b border-gray-100 text-[10px] text-gray-400 font-MontserratBold uppercase">
                  <th className="py-2.5 font-bold">Ticket ID</th>
                  <th className="py-2.5 font-bold">Subject</th>
                  <th className="py-2.5 font-bold">Priority</th>
                  <th className="py-2.5 font-bold">Status</th>
                  <th className="py-2.5 font-bold">Date created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-[10px] text-gray-700 font-MontserratMedium">
                {mockTickets.map((ticket, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-2.5 text-gray-400">{ticket.id}</td>
                    <td className="py-2.5 text-[#161616] font-MontserratSemiBold">{ticket.subject}</td>
                    <td className="py-2.5">
                      <span className="text-[#f44336] bg-[#f44336]/10 px-2 py-0.5 rounded font-MontserratBold">{ticket.priority}</span>
                    </td>
                    <td className="py-2.5 text-[#2ea37d] font-MontserratSemiBold">{ticket.status}</td>
                    <td className="py-2.5 text-gray-400">{ticket.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. PENDING KYBS CARD */}
        <div className="bg-white rounded-2xl p-6 border border-[#eef0f3] flex flex-col justify-between min-h-[380px] shadow-sm">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-MontserratBold text-gray-400">Pending KYBs</h2>
            <Link 
              href="/dashboard/admin/verifications" 
              className="text-[10px] font-MontserratBold text-[#f44336] hover:underline flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Stats Header Box */}
          <div className="flex items-center justify-between bg-gray-50/50 p-4 rounded-xl mb-4 border border-gray-100/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                <FileText className="w-5 h-5" />
              </div>
              <p className="text-xl font-MontserratBold text-[#161616]">250</p>
            </div>
            <span className="text-[10px] font-MontserratBold text-[#8d6e63] bg-[#efebe9] px-3 py-1.5 rounded-lg">
              Total pending: 150
            </span>
          </div>

          {/* Pending KYBs Table */}
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[450px]">
              <thead>
                <tr className="border-b border-gray-100 text-[10px] text-gray-400 font-MontserratBold uppercase">
                  <th className="py-2.5 font-bold">Business name</th>
                  <th className="py-2.5 font-bold">Business type</th>
                  <th className="py-2.5 font-bold">Country</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-[10px] text-gray-700 font-MontserratMedium">
                {mockKYBs.map((kyb, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 text-[#161616] font-MontserratSemiBold">{kyb.name}</td>
                    <td className="py-3 text-gray-500">{kyb.type}</td>
                    <td className="py-3 text-gray-400">{kyb.country}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
