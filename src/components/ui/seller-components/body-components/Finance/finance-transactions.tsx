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

export default function FinanceTransaction() {
   const [filters, setFilters] = useState({});
  const rowsPerPage = 10;
  const totalRows = 95;
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  const [currentPage, setCurrentPage] = useState(1);

  return (
    <motion.div
      className="w-full bg-ffffff h-fit rounded-c16 px-6 pt-6 pb-8"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        viewport={{ once: true }}
      >
        <TableHeader title="Transactions"  filters={filters}
        setFilters={setFilters}/>
      </motion.div>

      <motion.div
        className="w-full mt-c32"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        viewport={{ once: true }}
      >
   {/* Active filter chips */}
      {Object.keys(filters).length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {(Object.entries(filters) as [string, any][]).map(([key, value]) => (
            <span
              key={key}
              className="flex items-center gap-2 bg-ff715b/60 h-c32 px-3 py-2 text-white text-c12 font-MontserratNormal rounded-c8 circle-shadow"
            >
              {key === "date" && (
                <span className="flex items-center gap-1">
                  <Image
                    src={CalenderIcon}
                    alt="calender"
                    width={12}
                    height={13}
                  />
                  {value.start}
                  <Image src={ArrowRightIcon} alt="TO" width={16} height={16} />
                  {value.end}
                </span>
              )}
              {key === "perc" && (
                <span className="flex items-center gap-1">
                  <Image src={PercentageIcon} alt="%" width={13} height={13} />
                  <span>
                    {">"} {value}%
                  </span>
                </span>
              )}
              {key === "sku" && `SKU: ${value}`}
              {key === "qty" && (
                <span className="flex justify-center items-center gap-1">
                  <Image src={Quantity} alt="%" width={12} height={7} />
                  {value.min ?? ""}
                  <Image
                    src={ArrowRightIcon}
                    alt="TO"
                    width={16}
                    height={16}
                  />{" "}
                  {value.max ?? ""}
                </span>
              )}
            </span>
          ))}
        </div>
      )}



        <FinanceTransactionsTable
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          filters={filters}
        />
      </motion.div>

      <motion.div
        className="w-full mt-c32"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        viewport={{ once: true }}
      >
        {totalRows > 10 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}
      </motion.div>
    </motion.div>
  );
}
