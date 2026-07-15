"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  Plane,
  Users2,
  Headset,
  FileText,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import NextImage from "next/image";
import Link from "next/link";
import FilterDropdown from "@/components/ui/seller-components/body-components/over-view/Filter-components/filterButton";
import UsersIcon from "@/assets/icons/admin/usersIcon.svg";
import Image from "next/image";
import HelpIcon from "@/assets/icons/admin/helpcenter.svg";
import pendingFile from "@/assets/icons/admin/pendingFile.svg";
export default function AdminOverviewPage() {
  const [timeFilter, setTimeFilter] = useState("Today");

  // Mock data for tickets
  const mockTickets = [
    {
      id: "TCK-2025-00423",
      subject: "Order is still hanging",
      priority: "High",
      status: "Open",
      date: "18/9/2016",
    },
    {
      id: "TCK-2025-00423",
      subject: "Order is still hanging",
      priority: "High",
      status: "Open",
      date: "18/9/2016",
    },
    {
      id: "TCK-2025-00423",
      subject: "Order is still hanging",
      priority: "High",
      status: "Open",
      date: "18/9/2016",
    },
    {
      id: "TCK-2025-00423",
      subject: "Order is still hanging",
      priority: "High",
      status: "Open",
      date: "18/9/2016",
    },
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
      <div className="flex flex-col gap-6">
        <h1 className="text-c18 font-MontserratSemiBold text-000000">
          Overview
        </h1>

        {/* Pills Date Filter Toggle */}
        <div className="flex items-center  overflow-hidden rounded-[16px]">
          {["Today", "This week", "Total"].map((filter, index) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={` text-xs font-MontserratMedium px-4 py-2 transition-all ${
                timeFilter === filter
                  ? "bg-[#6A0DAD] text-white shadow-sm"
                  : "bg-white text-gray-500 hover:text-gray-800"
              }
      ${index === 0 ? "rounded-l-[16px] " : ""}
      ${index === 2 ? "rounded-r-[16px]" : ""}
      `}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Dashboard Cards */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 justify-center">
        {/* 1. ORDERS CARD */}
        <div className="bg-ffffff max-w-137.25 rounded-c16 p-6 flex flex-col  h-fit  ">
          {/* Header */}
          <div className="flex justify-between items-start mb-8 h-c48 border-b border-gray-000000/2">
            <h2 className="text-sm font-MontserratBold text-000000/68">
              Orders
            </h2>
            <FilterDropdown
              options={["This Week", "This Month", "This Year"]}
              defaultValue="This Month"
              className="border border-ff715b !rounded-lg !h-fit !py-1.5 !px-3 !gap-1.5 !shadow-none"
            />
          </div>

          {/* Stats Breakdown Grid */}
          <div className="  flex justify-between gap-9 items-stretch   ">
            {/* Left Primary Stat */}
            <div className="flex flex-col gap-14.75  h-full min-h-39.25 ">
              <div className="flex items-center gap-3  ">
                <div className="w-14 h-14 flex-shrink-0 rounded-full bg-000000/4 flex items-center justify-center text-gray-400">
                  <Plane className="w-6.25 h-6.25 text-000000/44 " />
                </div>
                <div className="">
                  <p className="text-xl md:text-c28 font-MontserratSemiBold ">
                    1,500,000
                  </p>
                  <p className="text-c12 text-000000/44 font-MontserratMedium">
                    N55M
                  </p>
                </div>{" "}
              </div>

              <div className="col-span-1 md:col-span-2 flex flex-wrap gap-x-4 gap-y-2">
                {["NG", "US", "GH", "CN"].map((c, i) => (
                  <div
                    key={c}
                    className="text-left flex  flex-col items-start gap-2"
                  >
                    <span className="text-c18 font-MontserratSemiBold ">
                      {c}{" "}
                    </span>
                    <span className="text-c12 text-000000/44 font-MontserratMedium">
                      {i === 0 ? "150,000" : "500"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Middle Stats Badges */}
            <div className="flex flex-col justify-between min-h-39.25">
              <div className=" flex justify-between gap-6 ">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-c18 font-MontserratSemiBold">
                      1,500,000
                    </p>
                    <p className="text-c12 text-000000/44 font-MontserratMedium">
                      N54,000
                    </p>
                    <span className="text-[10px] font-MontserratBold bg-[#28A745]/12 text-[#4DBEA7]  px-2 py-0.5 rounded-c4 leading-[16px] h-5">
                      Completed
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-c18 font-MontserratSemiBold">1000</p>
                    <p className="text-c12 text-000000/44 font-MontserratMedium">
                      N55,000
                    </p>
                    <span className="text-[10px] font-MontserratBold bg-[#FFAC06]/12 text-[#FFAC06]  px-2 py-0.5 rounded-c4 leading-[16px] h-5">
                      Ongoing
                    </span>
                  </div>
                </div>
              </div>
              <div className=" flex items-center justify-between gap-6 ">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-c18 font-MontserratSemiBold">750</p>
                    <p className="text-c12 text-000000/44 font-MontserratMedium">
                      N55,000
                    </p>
                    <span className="text-[10px] font-MontserratBold bg-[#0070E9]/12 text-[#0070E9]  px-2 py-0.5 rounded-c4 leading-[16px] h-5">
                      Pending
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-c18 font-MontserratSemiBold">350,000</p>
                    <p className="text-c12 text-000000/44 font-MontserratMedium">
                      N55,000
                    </p>
                    <span className="text-[10px] font-MontserratBold bg-[#CC0000]/12 text-[#CA0202]  px-2 py-0.5 rounded-c4 leading-[16px] h-5">
                      Returned
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Details Row */}
        </div>

        {/* 2. USERS CARD */}
        <div className="bg-white rounded-2xl p-6 flex flex-col justify-between min-h-full items-stretch ">
          {/* Header */}
          <div className="flex justify-between items-start mb-6 h-12 border-b border-000000/4 ">
            <h2 className="text-sm font-MontserratBold text-000000/68">
              Users
            </h2>
            <FilterDropdown
              options={["This Week", "This Month", "This Year"]}
              defaultValue="This Week"
              className="border border-ff715b !rounded-c8 !h-fit !py-1.5 !px-3 !gap-1.5 !shadow-none"
            />
          </div>

          {/* Stats & Bar Chart Row */}
          <div className="flex justify-between gap-4 ">
            {/* Left Total Active Stat */}
            <div className="flex  flex-col gap-c48 w-full  ">
              <div className="flex  gap-3">
                <div className="w-13.5  h-13.5 rounded-full bg-000000/4 flex items-center justify-center text-gray-400">
                  <Image
                    width={27}
                    height={27}
                    src={UsersIcon}
                    alt="Users Icon"
                    className="w-6.75 h-6.75 opacity-44"
                  />
                </div>
                <div>
                  <p className="text-xl md:text-c28 font-MontserratSemiBold ">
                    1,500,000
                  </p>
                  <p className="text-[12px] text-000000/44 font-MontserratMedium">
                    Active
                  </p>
                </div>
              </div>
              <div className=" flex  gap-4">
                <div className=" justify-start">
                  <p className="text-base md:text-lg font-MontserratSemiBold text-000000">
                    500
                  </p>
                  <span className="text-c10 text-[#947FFF] font-MontserratMedium py-0.5 px-2 bg-947fff/10 rounded-c4 mt-1">
                    Buyers
                  </span>
                </div>
                <div className="">
                  <p className="text-base md:text-lg font-MontserratSemiBold text-000000">
                    250,000
                  </p>
                  <span className="text-c10 text-[#947FFF] font-MontserratMedium py-0.5 px-2 bg-947fff/10 rounded-c4 mt-1">
                    Sellers
                  </span>
                </div>
              </div>
            </div>

            {/* Right Stacked Bar Chart */}
            <div className="w-full  h-full flex items-end justify-between relative pl-3.75 ">
              {/* Y Axis Grid/Legends */}
              <div className="absolute left-0 top-0 bottom-3.75 flex flex-col justify-between text-[8px] text-000000/44 font-MontserratMedium">
                <span>500</span>
                <span>400</span>
                <span>300</span>
                <span>200</span>
                <span>100</span>
                <span>0</span>
              </div>
              {/* Bars */}
              <div className=" flex items-end gap-4.5 h-full w-full pr-3.5 ">
                {chartBars.map((bar) => (
                  <div
                    key={bar.day}
                    className="flex flex-col items-center gap-1 h-full justify-end w-4 group"
                  >
                    <div className="relative h-full   flex justify-center w-2">
                      <div
                        style={{ height: bar.height }}
                        className="absolute bottom-0 left-0 w-2 bg-[#947fff]/50 group-hover:bg-[#7f00ff] transition-all"
                      />
                      <div className="absolute w-0.25 h-full bg-000000/4 transition-all" />
                    </div>

                    <span className="text-[8px] text-000000/44 font-MontserratMedium">
                      {bar.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Details Row */}
        </div>

        {/* 3. TICKETS CARD */}
        <div className="bg-ffffff rounded-c16 p-6 border border-000000/4 flex flex-col justify-between min-h-[376px] w-full  max-w-137.25 ">
          {/* Header */}
          <div className="flex justify-between h-10 border-b border-b-000000/4  mb-4">
            <h2 className="text-base font-MontserratNormal text-000000/68">
              Tickets
            </h2>
            <Link
              href="/dashboard/admin/support"
              className="text-c12 font-MontserratMedium text-ff715b hover:underline  "
            >
              <span>View all</span>
            </Link>
          </div>

          {/* Stats Header Box */}
          <div className="flex items-center justify-between mb-c32">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-000000/4 flex items-center justify-center text-gray-400">
                <Image src={HelpIcon} alt="Help" width={26} height={28} />
              </div>
              <p className="text-c28 font-MontserratSemiBold">1500</p>
            </div>
            <span className="text-sm font-MontserratNormal text-[#FFAC06] bg-[#FFAC06]/12 px-3 py-2">
              Total pending: 320
            </span>
          </div>

          {/* Tickets Table */}
          <div className="flex-1 overflow-x-auto lg:overflow-x-hidden">
            <table className="w-full text-left border-collapse min-w-[450px] ">
              <thead className="pb-6">
                <tr className="text-c12  tex t-000000/44 font-MontserratSemiBold  ">
                  <th className=" pb-6">Ticket ID</th>
                  <th className=" pb-6">Subject</th>
                  <th className=" pb-6">Priority</th>
                  <th className=" pb-6">Status</th>
                  <th className=" pb-6">Date created</th>
                </tr>
              </thead>
              <tbody className="space-x-4 text-c12 font-MontserratMedium">
                {mockTickets.map((ticket, i) => (
                  <tr key={i} className=" transition-colors">
                    <td className="pb-6 ">{ticket.id}</td>
                    <td className="pb-6 ">{ticket.subject}</td>
                    <td className="pb-6">
                      <span className="pb-6">{ticket.priority}</span>
                    </td>
                    <td className="pb-6">{ticket.status}</td>
                    <td className="pb-6">{ticket.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. PENDING KYBS CARD */}
        <div className="bg-ffffff rounded-c16 p-6 border border-000000/4 flex flex-col justify-between min-h-[376px] w-full max-w-130.75">
          {/* Header */}
          <div className="flex justify-between h-10 border-b border-b-000000/4  mb-4">
            <h2 className="text-base font-MontserratNormal text-gray-400">
              Pending KYBs
            </h2>
            <Link
              href="/dashboard/admin/verifications"
              className="text-c12 font-MontserratMedium text-ff715b hover:underline "
            >
              <span>View all</span>
            </Link>
          </div>

          {/* Stats Header Box */}
          <div className="flex items-center justify-between mb-c32">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-000000/4 flex items-center justify-center text-gray-400">
                <Image
                  src={pendingFile}
                  alt="Pending File"
                  width={22}
                  height={26}
                />
              </div>
              <p className="text-c28 font-MontserratSemiBold">250</p>
            </div>
            <span className="text-sm font-MontserratNormal text-[#FFAC06] bg-[#FFAC06]/12 px-3 py-2">
              Total pending: 150
            </span>
          </div>

          {/* Pending KYBs Table */}
          <div className="flex-1 overflow-x-auto lg:overflow-x-hidden">
            <table className="w-full text-left border-collapse min-w-[450px]">
              <thead>
                <tr className="text-c12  tex t-000000/44 font-MontserratSemiBold ">
                  <th className=" pb-6">Business name</th>
                  <th className=" pb-6">Business type</th>
                  <th className=" pb-6">Country</th>
                </tr>
              </thead>
              <tbody className="space-x-4 text-c12 font-MontserratMedium">
                {mockKYBs.map((kyb, i) => (
                  <tr key={i} className="pb-6">
                    <td className="pb-6">{kyb.name}</td>
                    <td className="pb-6">{kyb.type}</td>
                    <td className="pb-6 ">{kyb.country}</td>
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
