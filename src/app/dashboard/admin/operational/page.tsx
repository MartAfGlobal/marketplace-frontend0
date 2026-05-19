"use client";

import React from "react";
import AdminStatsChartCard from "@/components/ui/admin-components/AdminStatsChartCard";
import { Plane, Users2, ShieldCheck, ShoppingBag } from "lucide-react";

export default function OperationalPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Title */}
      <div>
        <h1 className="text-xl md:text-2xl font-MontserratBold text-[#161616]">Operational Dashboard</h1>
        <p className="text-xs text-gray-400 font-MontserratMedium mt-0.5">Track system activity, product listings, and verification pipelines.</p>
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AdminStatsChartCard 
          title="Operational Users"
          total="5,800"
          active="420"
          inactive="80"
          timeFilterText="This month"
        />

        <div className="bg-white rounded-2xl p-6 border border-[#eef0f3] flex flex-col justify-between h-[280px] shadow-sm">
          <h2 className="text-sm font-MontserratBold text-gray-400">Verifications & Product Queue</h2>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#2ea37d]/10 text-[#2ea37d] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-lg font-MontserratBold text-[#161616]">42</p>
                <p className="text-[9px] text-gray-400 font-MontserratMedium uppercase">Pending KYBs</p>
              </div>
            </div>
            <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#7f00ff]/10 text-[#7f00ff] flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <p className="text-lg font-MontserratBold text-[#161616]">158</p>
                <p className="text-[9px] text-gray-400 font-MontserratMedium uppercase">Product approvals</p>
              </div>
            </div>
          </div>
          <div className="text-[10px] text-gray-400 font-MontserratMedium">
            Operational status: <span className="text-[#2ea37d] font-MontserratBold uppercase">Optimal</span>
          </div>
        </div>
      </div>
    </div>
  );
}
