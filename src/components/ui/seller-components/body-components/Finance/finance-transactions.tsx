"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import TableHeader from "../../tables/table-header";
import FinanceTransactionsTable from "../../tables/finance-transaction-table";
import Pagination from "../products/pignation-button";
import downloadIcon from "@/assets/icons/download.svg";
import { useFetchProducts } from "@/helpers/sellers/fetchProducts";
import { useAppSelector } from "@/store/Provider";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const PAGE_SIZE = 10;

export default function FinanceTransaction() {
  const [filters, setFilters] = useState<Record<string, any>>({});
  const { fetchTransactions } = useFetchProducts();
  const token = useSelector((state: RootState) => state.token.token);

  const { currentPage, totalCount } = useAppSelector(
    (state) => state.transactions,
  );

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  // Fetch page 1 on mount (re-fetches if token changes)
  useEffect(() => {
    fetchTransactions(1);
  }, [token]);

  const handlePageChange = (page: number) => {
    fetchTransactions(page);
  };

  return (
    <div className="w-full h-full">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <TableHeader
          title="Transactions"
          filters={filters}
          setFilters={setFilters}
          className="bg-transparent border border-ff715b"
          image={downloadIcon}
        />
      </motion.div>

      <div className="mt-8  h-fit">
        <FinanceTransactionsTable filters={filters} />
      </div>

      <div className="mt-10">
        {totalCount > PAGE_SIZE && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}
