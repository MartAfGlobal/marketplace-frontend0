"use client";

import React from "react";
import AdminStatsChartCard from "@/components/ui/admin-components/AdminStatsChartCard";
import { DollarSign, Wallet, TrendingUp, Landmark } from "lucide-react";

export default function FinancePage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Title */}
      <div>
        <h1 className="text-xl md:text-2xl font-MontserratBold text-[#161616]">Finance Dashboard</h1>
        <p className="text-xs text-gray-400 font-MontserratMedium mt-0.5">Track payment completions, seller payouts, and platform commission revenues.</p>
      </div>

      {/* Finance Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AdminStatsChartCard 
          title="Revenue & Commission"
          total="N155,000,000"
          active="94,000"
          inactive="61,000"
          timeFilterText="This month"
        />

        {/* Financial KPI Card */}
        <div className="bg-white rounded-2xl p-6 border border-[#eef0f3] flex flex-col justify-between h-[280px] shadow-sm">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-MontserratBold text-gray-400">Financial Performance</h2>
            <span className="text-[9px] font-MontserratBold text-[#2ea37d] bg-[#2ea37d]/10 px-2.5 py-0.5 rounded-full uppercase">Optimal</span>
          </div>

          <div className="grid grid-cols-3 gap-3 py-4 text-center">
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100/50">
              <TrendingUp className="w-5 h-5 mx-auto mb-1 text-[#2ea37d]" />
              <p className="text-sm font-MontserratBold text-[#161616]">15.4%</p>
              <p className="text-[8px] text-gray-400 font-MontserratMedium uppercase">Growth</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100/50">
              <Wallet className="w-5 h-5 mx-auto mb-1 text-[#7f00ff]" />
              <p className="text-sm font-MontserratBold text-[#161616]">N24.5M</p>
              <p className="text-[8px] text-gray-400 font-MontserratMedium uppercase">Pending payouts</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100/50">
              <DollarSign className="w-5 h-5 mx-auto mb-1 text-[#ff715b]" />
              <p className="text-sm font-MontserratBold text-[#161616]">N5.8M</p>
              <p className="text-[8px] text-gray-400 font-MontserratMedium uppercase">Platform Fee</p>
            </div>
          </div>

          <div className="text-[10px] text-gray-400 font-MontserratMedium flex items-center gap-1.5">
            <Landmark className="w-3.5 h-3.5 text-[#2ea37d]" />
            <span>All bank payout requests successfully authorized and settled.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
