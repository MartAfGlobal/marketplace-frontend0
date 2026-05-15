"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FilteredOrders from "./my-order-selector";
import {
  All,
  Unprocessed,
  Processed,
  Fulfilled,
  Delivered,
  Cancelled,
} from "./Orders-component";

type OrderFilteredProps = {
  filters: Record<string, any>;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  rowsPerPage: number;
  totalPages: number;
  onFilteredCount: (count: number) => void;
  onSelectionChange?: (data: any[]) => void;
};

export default function OrderFiltered({
  filters,
  currentPage,
  setCurrentPage,
  rowsPerPage,
  totalPages,
  onFilteredCount,
  onSelectionChange,
}: OrderFilteredProps) {
  const [activeTab, setActiveTab] = useState("all");

  const sharedProps = {
    filters,
    currentPage,
    setCurrentPage,
    rowsPerPage,
    totalPages,
    onFilteredCount,
    onSelectionChange,
  };

  const renderSection = () => {
    switch (activeTab) {
      case "all":
        return <All {...sharedProps} />;
      case "unprocessed":
        return <Unprocessed {...sharedProps} />;
      case "processed":
        return <Processed {...sharedProps} />;
      case "fulfilled":
        return <Fulfilled {...sharedProps} />;
      case "delivered":
        return <Delivered {...sharedProps} />;
      case "cancelled":
        return <Cancelled {...sharedProps} />;
      default:
        return <All {...sharedProps} />;
    }
  };

  return (
    <div className="h-fit  flex flex-col">
      {/* 🔹 Tabs */}
      <div className="hidden lg:block">
        <FilteredOrders activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* 🔹 Main content with animation */}
      <main className="flex-1 pt-c32">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderSection()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
