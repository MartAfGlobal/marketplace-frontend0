"use client";

import { motion } from "framer-motion";
import RecentPaymentTable from "../../../tables/recent-payement";
import IncomeAndExpenseChart from "./income-expense-chart";
import OverViewHeader from "./overview-header";

export default function FinanceOverview() {
  return (
    <div className="w-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <OverViewHeader />
      </motion.div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
      >
        <IncomeAndExpenseChart />
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
      >
        <RecentPaymentTable />
      </motion.div>
    </div>
  );
}

