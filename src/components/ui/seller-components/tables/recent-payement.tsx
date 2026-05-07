"use client";

import Image from "next/image";
import ArrowIcon from "@/assets/Seller/ArrowRight.svg";

export default function RecentPaymentTable() {
  const allRows = Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    date: "15/08/2026",
    transactionid: "TRZ2038543453",
    amount: "N25,000.00",
    payoutmethod: i % 2 === 0 ? "Bank transfer" : "Credit card",
  }));
  const allRows2 = Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    date: "15/08/2026",
    transactionid: "TRZ2038543453",
    discription: "Payment for order #12345",
    amount: "N25,000.00",
    type: i % 2 === 0 ? "sales" : "Credit card",
  }));

  return (
    <div className="flex flex-col xl:flex-row justify-between pb-10 overflow-hidden">
      {/* Payouts Table */}
      <div className=" w-full max-w-104">
        <div className="flex justify-between items-center mb-6">
          <p className="text-c18 font-MontserratNormal ">Recent Payouts</p>
          <button className="">
            <Image src={ArrowIcon} alt="view all" width={15} height={12.5} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
        <div className="w-full overflow-hidden ">
          <table className="w-full text-left">
            <thead className="border-b border-[#947FFF] lg:text-nowrap">
              <tr className="text-[12px] font-MontserratSemiBold text-[#947fff]">
                <th className="p-3">Date</th>
                <th className="p-3">Transaction ID</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Payout method</th>
              </tr>
            </thead>
            <tbody className="">
              {allRows.map((row) => (
                <tr key={row.id} className="">
                  <td className="p-3 text-[12px] font-MontserratSemiBold text-000000/68">{row.date}</td>
                  <td className="p-3 text-[12px] font-MontserratSemiBold text-000000/68">{row.transactionid}</td>
                  <td className="p-3 text-[10px] font-MontserratBold text-000000/68">{row.amount}</td>
                  <td className="p-3 text-[10px] font-MontserratNormal text-000000/68">{row.payoutmethod}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vertical Divider for XL screens */}
      <div className="hidden xl:block w-[1px]  self-stretch bg-[#f0f0f0]"></div>

      {/* Transactions Table */}
      <div className=" w-full max-w-128.25">
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm font-MontserratSemiBold text-[#333333]">Recent Transactions</p>
          <button className="p-1 hover:bg-gray-50 rounded-full transition-colors group">
            <Image src={ArrowIcon} alt="view all" width={18} height={18} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
        <div className="w-full overflow-hidden ">
          <table className="w-full text-left">
            <thead className="border-b border-[#947FFF] lg:text-nowrap">
              <tr className="text-[12px] font-MontserratSemiBold text-[#947fff]">
                <th className="p-3">Date</th>
                <th className="p-3">Transaction ID</th>
                <th className="p-3">Description</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Type</th>
              </tr>
            </thead>
            <tbody className="">
              {allRows2.map((row) => (
                <tr key={row.id} className="">
                  <td className="p-3 text-[12px] font-MontserratSemiBold text-000000/68">{row.date}</td>
                  <td className="p-3 text-[12px] font-MontserratSemiBold text-000000/68">{row.transactionid}</td>
                  <td className="p-3 text-[12px] font-MontserratSemiBold text-000000/68">{row.discription}</td>
                  <td className="p-3 text-[12px] font-MontserratSemiBold text-000000/68">{row.amount}</td>
                  <td className="p-3 text-[12px] font-MontserratSemiBold text-000000/68">{row.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
