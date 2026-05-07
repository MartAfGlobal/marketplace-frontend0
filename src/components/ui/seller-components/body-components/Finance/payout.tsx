"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import TableHeader from "../../tables/table-header";
import PayOutTable from "../../tables/pay-out-table";
import Pagination from "../products/pignation-button";
import CalenderIcon from "@/assets/Seller/calender2.png";

export default function Payout() {
   const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const totalRows = 95;
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <TableHeader 
          title="Payout History" 
          filters={filters}
          setFilters={setFilters} 
          placeholder="Search transactions, payout ID..."
        />
      </motion.div>

      <div className="mt-8">
        {Object.keys(filters).length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {(Object.entries(filters) as [string, any][]).map(([key, value]) => (
              <span
                key={key}
                className="flex items-center gap-2 bg-[#ff6b6b]/10 border border-[#ff6b6b]/20 px-3 py-1.5 text-[#ff6b6b] text-[10px] font-MontserratBold rounded-full"
              >
                {key === "date" && (
                  <span className="flex items-center gap-1">
                    <Image src={CalenderIcon} alt="calender" width={10} height={11} />
                    {value.start} - {value.end}
                  </span>
                )}
                {key === "search" && `Search: ${value}`}
              </span>
            ))}
          </div>
        )}

        <PayOutTable currentPage={currentPage} rowsPerPage={rowsPerPage} filters={filters}/>

        <AnimatePresence mode="wait">
          {totalRows > 10 && (
            <div className="w-full mt-10">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

