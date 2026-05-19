"use client";

import React from "react";
import AdminStatsChartCard from "@/components/ui/admin-components/AdminStatsChartCard";
import { MessageSquare, Clock, Smile, Headset } from "lucide-react";

export default function SupportDepartmentPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Title */}
      <div>
        <h1 className="text-xl md:text-2xl font-MontserratBold text-[#161616]">Support Dashboard</h1>
        <p className="text-xs text-gray-400 font-MontserratMedium mt-0.5">Manage customer inquiries, dispute tickets, and platform ratings.</p>
      </div>

      {/* Support Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AdminStatsChartCard 
          title="Active Support Tickets"
          total="1,500"
          active="1,180"
          inactive="320"
          timeFilterText="This month"
        />

        {/* Customer satisfaction stats */}
        <div className="bg-white rounded-2xl p-6 border border-[#eef0f3] flex flex-col justify-between h-[280px] shadow-sm">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-MontserratBold text-gray-400">Support KPIs</h2>
            <span className="text-[9px] font-MontserratBold text-[#ff9800] bg-[#ff9800]/10 px-2.5 py-0.5 rounded-full uppercase">Target: 95%</span>
          </div>

          <div className="grid grid-cols-3 gap-3 py-4 text-center">
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100/50">
              <Clock className="w-5 h-5 mx-auto mb-1 text-[#7f00ff]" />
              <p className="text-sm font-MontserratBold text-[#161616]">1.2 hrs</p>
              <p className="text-[8px] text-gray-400 font-MontserratMedium uppercase">Avg Resolve</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100/50">
              <Smile className="w-5 h-5 mx-auto mb-1 text-[#2ea37d]" />
              <p className="text-sm font-MontserratBold text-[#161616]">94.2%</p>
              <p className="text-[8px] text-gray-400 font-MontserratMedium uppercase">Satisfaction</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100/50">
              <MessageSquare className="w-5 h-5 mx-auto mb-1 text-[#ff715b]" />
              <p className="text-sm font-MontserratBold text-[#161616]">3,420</p>
              <p className="text-[8px] text-gray-400 font-MontserratMedium uppercase">Live Chats</p>
            </div>
          </div>

          <div className="text-[10px] text-gray-400 font-MontserratMedium flex items-center gap-1.5">
            <Headset className="w-3.5 h-3.5 text-[#7f00ff]" />
            <span>Support teams currently operating at maximum bandwidth.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
