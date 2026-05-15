"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";

import DisputeTable from "@/components/ui/seller-components/tables/dispute-returns-table";
import TableHeader from "@/components/ui/seller-components/tables/table-header";
import Pagination from "../../../products/pignation-button";
import { useHttp } from "@/hooks/use-http";
import { RootState } from "@/store";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

import ArrowRightIcon from "@/assets/Seller/ArrowRight2.png";
import CalenderIcon from "@/assets/Seller/calender2.png";
import PercentageIcon from "@/assets/Seller/Percent2.png";
import Quantity from "@/assets/Seller/quantity2.png";

export default function DisputeBody({
  externalSearchQuery,
}: {
  externalSearchQuery?: string;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({});
  const [totalRows, setTotalRows] = useState(0);
  const [disputes, setDisputes] = useState<any[]>([]);
  const { sendHttpRequest, loading } = useHttp();
  const token = useSelector((state: RootState) => state.token.token);

  const rowsPerPage = 10;
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  const fetchDisputes = () => {
    if (!token) return;
    sendHttpRequest({
      requestConfig: {
        url: "/disputes/seller/",
        method: "GET",
        token: token,
        isAuth: true,
        userType: "seller",
      },
      successRes: (res) => {
        console.log("Fetched disputes:", res.data);
        // Handle various response structures (direct array, .results, or .disputes)
        const data = res.data?.results || res.data?.disputes || res.data || [];
        setDisputes(Array.isArray(data) ? data : []);
        setTotalRows(Array.isArray(data) ? data.length : 0);
      },
      errorRes: (err) => {
        console.error("Failed to fetch disputes:", err);
      },
    });
  };

  useEffect(() => {
    if (token) {
      fetchDisputes();
    }
  }, [token]);

  useEffect(() => {
    setFilters((prev) => ({ ...prev, search: externalSearchQuery }));
  }, [externalSearchQuery]);

  return (
    <div className="bg-ffffff h-fit pt-c24 px-c32 pb-c32 rounded-c16">
      <TableHeader
        title="Dispute/Returns"
        filters={filters}
        setFilters={setFilters}
        placeholder="Search by order ID, status, date..."
        hideSearchOnMobile={true}
      />

      {/* Active filter chips */}
      {Object.entries(filters).filter(([key, value]) => key !== "search" && value)
        .length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {(Object.entries(filters) as [string, any][])
            .filter(([key, value]) => key !== "search" && value)
            .map(([key, value]) => (
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
                    <Image
                      src={ArrowRightIcon}
                      alt="TO"
                      width={16}
                      height={16}
                    />
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

      {loading ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner />
        </div>
      ) : (
        <DisputeTable
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          filters={filters}
          data={disputes}
          onFilteredCountChange={setTotalRows}
        />
      )}

      <div className="w-full mt-c32">
        {totalRows > rowsPerPage && (
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
