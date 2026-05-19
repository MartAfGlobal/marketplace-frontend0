"use client";

import React from "react";
import AdminStatsChartCard from "@/components/ui/admin-components/AdminStatsChartCard";
import { ShieldAlert, Server, Cpu, Database } from "lucide-react";

export default function ITPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Title */}
      <div>
        <h1 className="text-xl md:text-2xl font-MontserratBold text-[#161616]">IT Dashboard</h1>
        <p className="text-xs text-gray-400 font-MontserratMedium mt-0.5">Monitor system resources, database logs, and staff administrative permissions.</p>
      </div>

      {/* IT Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AdminStatsChartCard 
          title="Staff Administrative Accounts"
          total="230"
          active="225"
          inactive="5"
          timeFilterText="This week"
        />

        {/* Server Health Card */}
        <div className="bg-white rounded-2xl p-6 border border-[#eef0f3] flex flex-col justify-between h-[280px] shadow-sm">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-MontserratBold text-gray-400">Server Resources</h2>
            <span className="text-[9px] font-MontserratBold text-[#2ea37d] bg-[#2ea37d]/10 px-2 py-0.5 rounded-full uppercase">99.98% Uptime</span>
          </div>

          <div className="grid grid-cols-3 gap-3 py-4 text-center">
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100/50">
              <Cpu className="w-5 h-5 mx-auto mb-1 text-[#7f00ff]" />
              <p className="text-sm font-MontserratBold text-[#161616]">12.4%</p>
              <p className="text-[8px] text-gray-400 font-MontserratMedium uppercase">CPU Load</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100/50">
              <Server className="w-5 h-5 mx-auto mb-1 text-[#2ea37d]" />
              <p className="text-sm font-MontserratBold text-[#161616]">64.2GB</p>
              <p className="text-[8px] text-gray-400 font-MontserratMedium uppercase">Memory</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100/50">
              <Database className="w-5 h-5 mx-auto mb-1 text-[#ff9800]" />
              <p className="text-sm font-MontserratBold text-[#161616]">0.4ms</p>
              <p className="text-[8px] text-gray-400 font-MontserratMedium uppercase">Latency</p>
            </div>
          </div>

          <div className="text-[10px] text-gray-400 font-MontserratMedium flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-[#2ea37d]" />
            <span>IT system logs show zero critical security vulnerabilities.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
