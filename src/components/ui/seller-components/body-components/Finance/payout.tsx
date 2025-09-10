"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import TableHeader from "../../tables/table-header";
import PayOutTable from "../../tables/pay-out-table";
import Pagination from "../products/pignation-button";


import ArrowRightIcon from "@/assets/Seller/ArrowRight2.png";
import CalenderIcon from "@/assets/Seller/calender2.png";
import PercentageIcon from "@/assets/Seller/Percent2.png";
import Quantity from "@/assets/Seller/quantity2.png";

export default function Payout() {
      const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 10;
  const totalRows = 95;
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  return (
    <motion.div
      className="w-full bg-ffffff h-fit rounded-c16 px-6 pt-6 pb-8"
      initial={{ opacity: 0, y: 20 }} // start hidden
      animate={{ opacity: 1, y: 0 }} // fade in and slide up
      exit={{ opacity: 0, y: 20 }} // smooth exit
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <TableHeader title="Payouts"  filters={filters}
        setFilters={setFilters} />

      <motion.div
        className="w-full mt-c32"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >

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

        <PayOutTable currentPage={currentPage} rowsPerPage={rowsPerPage} filters={filters}/>

        <AnimatePresence mode="wait">
          {totalRows > 10 && (
            <motion.div
              key={currentPage} // animate on page change
              className="w-full mt-c32"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
