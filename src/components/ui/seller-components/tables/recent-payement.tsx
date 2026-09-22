"use client";

import { useEffect } from "react";
import Image from "next/image";
import ArrowIcon from "@/assets/Seller/ArrowRight.svg";
import { useAppSelector } from "@/store/Provider";
import { useFetchProducts } from "@/helpers/sellers/fetchProducts";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import type { Transaction } from "@/store/finance/transactionsSlice";

function formatDate(raw: string | undefined): string {
  if (!raw) return "—";
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatAmount(amount: string | number | undefined): string {
  if (amount === undefined || amount === null) return "—";
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return String(amount);
  return `N${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function RecentPaymentTable() {
  const { fetchTransactions } = useFetchProducts();
  const token = useSelector((state: RootState) => state.token?.token);
  const { items, loading } = useAppSelector((state) => state.transactions);

  useEffect(() => {
    if (token && items.length === 0) {
      fetchTransactions(1);
    }
  }, [token]);

  const recentTransactions = items.slice(0, 6);

  const payoutTransactions = items
    .filter(
      (t) =>
        (t.transaction_type as string)?.toLowerCase().includes("payout") ||
        (t.type as string)?.toLowerCase().includes("payout") ||
        (t.category as string)?.toLowerCase().includes("payout") ||
        (t.category as string)?.toLowerCase().includes("withdrawal") ||
        (t.description as string)?.toLowerCase().includes("payout") ||
        (t.description as string)?.toLowerCase().includes("withdrawal")
    )
    .slice(0, 6);

  return (
    <div className="flex w-full min-w-0 max-w-full flex-col md:flex-col lg:flex-row gap-10 pb-10 overflow-hidden justify-center">
      {/* Payouts Table */}
      <div className="w-full min-w-0 md:w-full md:flex-none xl:w-auto xl:flex-1">
        <div className="flex justify-between items-center mb-6">
          <p className="text-c18 font-MontserratNormal">Recent Payouts</p>
          <button className="group">
            <Image
              src={ArrowIcon}
              alt="view all"
              width={15}
              height={12.5}
              className="group-hover:translate-x-0.5 transition-transform"
            />
          </button>
        </div>
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-max text-left">
            <thead className="border-b border-[#947FFF] lg:text-nowrap">
              <tr className="text-[12px] font-MontserratSemiBold text-[#947fff]">
                <th className="p-3">Date</th>
                <th className="p-3">Transaction ID</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Payout method</th>
              </tr>
            </thead>
            <tbody>
              {payoutTransactions.map((row: Transaction) => (
                <tr key={row.transaction_id}>
                   <td className="p-3 text-[12px] font-MontserratSemiBold text-000000/68 max-w-[96px] truncate" title={formatDate((row.created_at || row.date) as string)} >
                    {formatDate((row.created_at || row.date) as string)}
                  </td>
                  <td className="p-3 text-[12px] max-w-31 truncate font-MontserratSemiBold text-000000/68" title={row.transaction_id}>
                    {row.transaction_id}
                  </td>
                 
                  <td className="p-3 text-[12px] font-MontserratSemiBold text-000000/68 max-w-[121px] truncate" title= {formatAmount(row.amount)}>
                    {formatAmount(row.amount)}
                  </td>
                  <td className="p-3 text-[12px] max-w-[121px] truncate font-MontserratNormal text-000000/68" title={((row.linked_entity || row.linked_entity_type) as string) || ((row.transaction_type || row.type) as string) || "Bank transfer"}>
                    {((row.linked_entity || row.linked_entity_type) as string) || ((row.transaction_type || row.type) as string) || "Bank transfer"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {loading && (
            <div className="py-8 text-center text-[11px] font-MontserratMedium text-[#999999] animate-pulse">
              Loading payouts…
            </div>
          )}
          {!loading && payoutTransactions.length === 0 && (
            <div className="py-8 text-center text-[11px] font-MontserratMedium text-[#999999]">
              No recent payouts.
            </div>
          )}
        </div>
      </div>

      {/* Vertical Divider for XL screens */}
      <div className="hidden xl:block w-[1px] self-stretch bg-[#f0f0f0]"></div>

      {/* Transactions Table */}
      <div className="w-full min-w-0 md:w-full md:flex-none xl:w-auto xl:flex-1">
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm font-MontserratSemiBold text-[#333333]">
            Recent Transactions
          </p>
          <button className="p-1 hover:bg-gray-50 rounded-full transition-colors group">
            <Image
              src={ArrowIcon}
              alt="view all"
              width={18}
              height={18}
              className="group-hover:translate-x-0.5 transition-transform"
            />
          </button>
        </div>
        <div className="w-full  overflow-x-auto">
          <table className="w-full min-w-max text-left">
            <thead className="border-b border-[#947FFF] lg:text-nowrap">
              <tr className="text-[12px] font-MontserratSemiBold text-[#947fff]">
                <th className="p-3">Date</th>
                <th className="p-3">Transaction ID</th>
                <th className="p-3">Description</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Type</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((row: Transaction) => (
                <tr key={row.transaction_id}>
                  <td className="p-3 text-[12px] font-MontserratSemiBold text-000000/68 max-w-[96px] truncate" title={formatDate((row.created_at || row.date) as string)} >
                    {formatDate((row.created_at || row.date) as string)}
                  </td>
                  <td className="p-3 text-[12px] max-w-31 truncate font-MontserratSemiBold text-000000/68" title={row.transaction_id}>
                    {row.transaction_id}
                  </td>
                  <td className="p-3 text-[12px] font-MontserratSemiBold text-000000/68 max-w-[108px] truncate" title={(row.description as string) || "—"}>
                    {(row.description as string) || "—"}
                  </td>
                  <td className="p-3 text-[12px] font-MontserratSemiBold text-000000/68 max-w-[121px] truncate" title= {formatAmount(row.amount)}>
                    {formatAmount(row.amount)}
                  </td>
                  <td className="p-3 text-[12px] font-MontserratSemiBold text-000000/68 max-w-[40px]" title={((row.transaction_type || row.type) as string) || "—"}>
                    {((row.transaction_type || row.type) as string) || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {loading && (
            <div className="py-8 text-center text-[11px] font-MontserratMedium text-[#999999] animate-pulse">
              Loading transactions…
            </div>
          )}
          {!loading && recentTransactions.length === 0 && (
            <div className="py-8 text-center text-[11px] font-MontserratMedium text-[#999999]">
              No recent transactions.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
