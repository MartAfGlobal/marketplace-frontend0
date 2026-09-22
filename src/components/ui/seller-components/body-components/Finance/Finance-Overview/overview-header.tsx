"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button/Button";
import BabyIcon from "@/assets/Seller/babyIcon.png";
import Payin from "@/assets/Seller/Payin.png";
import Payout from "@/assets/Seller/payout2.png";
import Pending from "@/assets/Seller/pending.png";
import RefundIcon from "@/assets/Seller/refund.png";
import FilterDropdown from "../../over-view/Filter-components/filterButton";
import { filterOptions } from "../../over-view/Filter-components/filterOptions";
import WithdrawModals from "../withdraw-modals";
import { useAppDispatch, useAppSelector } from "@/store/Provider";
import { useFetchProducts } from "@/helpers/sellers/fetchProducts";

export default function OverViewHeader() {
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(filterOptions[1]); // default: "This Month"
  const dispatch = useAppDispatch();

  const { wallet_balance: financeBalance, wallet_overview: overviewData, loading, overview_loading } =
    useAppSelector((state) => state.finance);
  const token = useAppSelector((state) => state.token?.token);
  const { fetchBalance, fetchWalletOverview } = useFetchProducts();

  useEffect(() => {
    if (token) {
      fetchBalance();
      fetchWalletOverview(selectedPeriod);
    }
  }, [token]);

  // Re-fetch Money Flow when period filter changes
  const handlePeriodChange = (value: string) => {
    setSelectedPeriod(value);
    fetchWalletOverview(value);
  };

  useEffect(() => {
    if (
      !loading &&
      !overview_loading
    ) {
      console.log("Finance Balance:", financeBalance);
      console.log("Wallet Overview:", overviewData);
    }
  }, [financeBalance, overviewData]);

  const formatCurrency = (amount: string | number | undefined) => {
    if (amount === undefined || amount === null) return "N0.00";
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return `N${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const moneyFlow = [
    {
      label: "Sales",
      amount: formatCurrency(overviewData?.sales),
      icon: Payin,
    },
    {
      label: "Payouts",
      amount: formatCurrency(overviewData?.payouts),
      icon: Payout,
    },
    {
      label: "Pending sales",
      amount: formatCurrency(overviewData?.pending_sales),
      icon: Pending,
    },
    {
      label: "Refunds",
      amount: formatCurrency(overviewData?.refunds),
      icon: RefundIcon,
    },
  ];

  return (
    <div className="w-full">
      {/* Withdraw Modal */}
      <WithdrawModals
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
      />

      {/* Top Section: Balance & Main Actions */}
      <div className="flex flex-col md:flex-row justify-between min-h-24 h-auto md:h-24 items-start md:items-center gap-6 border-b border-b-000000/4 mb-8 pb-6">
        <div className="flex items-end gap-3">
          <div className="pb-1">
            <Image src={BabyIcon} alt="balance" width={32} height={26} />
          </div>
          <div>
            <p className="text-sm font-MontserratNormal mb-3">Balance</p>
            <h2 className={`text-2xl sm:text-c32 font-MontserratNormal ${loading ? "animate-pulse opacity-50" : ""}`}>
              {formatCurrency(financeBalance?.wallet_balance)}
            </h2>
          </div>
        </div>

        <div className="flex gap-4 w-full md:max-w-86.25">
          <Button onClick={() => setIsWithdrawModalOpen(true)}>
            Withdraw Funds
          </Button>
          <Button variant={"secondary"}>Deposit</Button>
        </div>
      </div>

      {/* Stats Grid: Money Flow */}
      <div className="w-full space-y-8">
        <div className="flex justify-between items-center">
          <h3 className="text-c18 font-MontserratNormal">Money flow</h3>
          <FilterDropdown
            options={filterOptions}
            defaultValue={selectedPeriod}
            onChange={handlePeriodChange}
          />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          {moneyFlow.map((item) => (
            <div
              key={item.label}
              className="transition-all duration-300 gap-2 group flex items-end"
            >
              <div className="flex items-center justify-center mb-4">
                <Image
                  src={item.icon}
                  alt={item.label}
                  width={15}
                  height={18}
                />
              </div>
              <div>
                <span className="text-sm font-MontserratNormal mb-2 text-000000/68 uppercase">
                  {item.label}
                </span>
                <p className={`text-xl sm:text-2xl md:text-c32 font-MontserratNormal ${overview_loading ? "animate-pulse opacity-50" : ""}`}>
                  {item.amount}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
