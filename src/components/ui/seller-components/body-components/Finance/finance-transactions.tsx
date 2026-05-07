"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import TableHeader from "../../tables/table-header";
import FinanceTransactionsTable from "../../tables/finance-transaction-table";
import Pagination from "../products/pignation-button";
import Image from "next/image";
import ArrowRightIcon from "@/assets/Seller/ArrowRight2.png";
import CalenderIcon from "@/assets/Seller/calender2.png";
import PercentageIcon from "@/assets/Seller/Percent2.png";
import Quantity from "@/assets/Seller/quantity2.png";
import downloadIcon from "@/assets/icons/download.svg";

export default function FinanceTransaction() {
  const [filters, setFilters] = useState({});
  const rowsPerPage = 10;
  const totalRows = 95;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="w-full">
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

      <div className="mt-8">
        {/* {Object.keys(filters).length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {(Object.entries(filters) as [string, any][]).map(
              ([key, value]) => (
                <span key={key} className=" ">
                  {key === "date" && (
                    <span className="flex items-center gap-1">
                      <Image
                        src={CalenderIcon}
                        alt="calender"
                        width={10}
                        height={11}
                      />
                      {value.start} - {value.end}
                    </span>
                  )}
                </span>
              ),
            )}
          </div>
        )} */}

        <FinanceTransactionsTable
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          filters={filters}
        />
      </div>

      <div className="mt-10">
        {totalRows > 10 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}
      </div>
    </div>
  );
}
