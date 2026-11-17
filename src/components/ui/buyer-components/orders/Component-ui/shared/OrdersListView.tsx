"use client";

import { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/Button/Button";

interface OrdersListViewProps {
  hasOrders: boolean;
  hasResults: boolean;
  emptyMessage: string;
  noResultsMessage: string;
  contentClassName?: string;
  children: ReactNode;
}

export default function OrdersListView({
  hasOrders,
  hasResults,
  emptyMessage,
  noResultsMessage,
  contentClassName = "w-full space-y-c24 mt-c32",
  children,
}: OrdersListViewProps) {
  return (
    <div className="w-full">
      <div className={contentClassName}>
        <AnimatePresence mode="wait">
          {!hasOrders ? (
            <motion.div
              key="empty-orders"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full flex flex-col items-center gap-c32 justify-center h-75.5"
            >
              <p className="text-center text-000000/60 font-MontserratMedium text-c18">
                {emptyMessage}
              </p>
              <Button className="w-51">Start shopping</Button>
            </motion.div>
          ) : !hasResults ? (
            <motion.div
              key="no-search-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex flex-col items-center justify-center h-60"
            >
              <p className="text-c16 font-MontserratMedium text-000000/60">
                {noResultsMessage}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="orders-list"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1 },
                },
              }}
              className="space-y-c24"
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
