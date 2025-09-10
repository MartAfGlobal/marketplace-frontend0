"use client";

import { motion } from "framer-motion";
import RecentPaymentTable from "../../../tables/recent-payement";
import IncomeAndExpenseChart from "./income-expense-chart";
import OverViewHeader from "./overview-header";

export default function FinanceOverview() {
  return (
    <div className="w-full bg-ffffff h-306.5 rounded-c16 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <OverViewHeader />
      </motion.div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <IncomeAndExpenseChart />
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <RecentPaymentTable />
      </motion.div>
    </div>
  );
}
