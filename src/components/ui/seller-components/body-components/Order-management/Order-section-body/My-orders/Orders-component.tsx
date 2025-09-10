"use client";

import AllOrderTable from "@/components/ui/seller-components/tables/all-order-table";
import Pagination from "../../../products/pignation-button";

// 🔹 Shared props for all tabs
export type TabProps = {
  filters: Record<string, any>;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  rowsPerPage: number;
  totalPages: number;
};

// ✅ All Orders
export function All({
  filters,
  currentPage,
  setCurrentPage,
  rowsPerPage,
  totalPages,
}: TabProps) {
  return (
    <div>
      <AllOrderTable
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
        filters={filters}
      />
      <div className="w-full mt-c32">
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}

// ✅ Unprocessed Orders
export function Unprocessed({
  filters,
  currentPage,
  setCurrentPage,
  rowsPerPage,
  totalPages,
}: TabProps) {
  return (
    <div>
      <AllOrderTable
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
        statusFilter="unprocessed"
        filters={filters}
      />
      <div className="w-full mt-c32">
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}

// ✅ Processed Orders
export function Processed({
  filters,
  currentPage,
  setCurrentPage,
  rowsPerPage,
  totalPages,
}: TabProps) {
  return (
    <div>
      <AllOrderTable
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
        statusFilter="processed"
        filters={filters}
      />
      <div className="w-full mt-c32">
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}

// ✅ Fulfilled Orders
export function Fulfilled({
  filters,
  currentPage,
  setCurrentPage,
  rowsPerPage,
  totalPages,
}: TabProps) {
  return (
    <div>
      <AllOrderTable
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
        statusFilter="fulfilled"
        filters={filters}
      />
      <div className="w-full mt-c32">
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}

// ✅ Delivered Orders
export function Delivered({
  filters,
  currentPage,
  setCurrentPage,
  rowsPerPage,
  totalPages,
}: TabProps) {
  return (
    <div>
      <AllOrderTable
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
        statusFilter="delivered"
        filters={filters}
      />
      <div className="w-full mt-c32">
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}

// ✅ Cancelled Orders
export function Cancelled({
  filters,
  currentPage,
  setCurrentPage,
  rowsPerPage,
  totalPages,
}: TabProps) {
  return (
    <div>
      <AllOrderTable
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
        statusFilter="cancelled"
        filters={filters}
      />
      <div className="w-full mt-c32">
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}
