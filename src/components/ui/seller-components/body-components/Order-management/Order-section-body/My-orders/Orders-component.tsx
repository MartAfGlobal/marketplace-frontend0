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
  onFilteredCount: (count: number) => void;
  onSelectionChange?: (data: any[]) => void;
};

// ✅ All Orders
export function All({
  filters,
  currentPage,
  rowsPerPage,
  onFilteredCount,
  onSelectionChange,
}: TabProps) {
  return (
    <div>
      <AllOrderTable
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
        filters={filters}
        onFilteredCount={onFilteredCount}
        onSelectionChange={onSelectionChange}
      />
    </div>
  );
}

// ✅ Unprocessed Orders
export function Unprocessed({
  filters,
  currentPage,
  rowsPerPage,
  onFilteredCount,
  onSelectionChange,
}: TabProps) {
  return (
    <div>
      <AllOrderTable
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
        statusFilter="unprocessed"
        filters={filters}
        onFilteredCount={onFilteredCount}
        onSelectionChange={onSelectionChange}
      />
    </div>
  );
}

// ✅ Processed Orders
export function Processed({
  filters,
  currentPage,
  rowsPerPage,
  onFilteredCount,
  onSelectionChange,
}: TabProps) {
  return (
    <div>
      <AllOrderTable
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
        statusFilter="processed"
        filters={filters}
        onFilteredCount={onFilteredCount}
        onSelectionChange={onSelectionChange}
      />
    </div>
  );
}

// ✅ Fulfilled Orders
export function Fulfilled({
  filters,
  currentPage,
  rowsPerPage,
  onFilteredCount,
  onSelectionChange,
}: TabProps) {
  return (
    <div>
      <AllOrderTable
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
        statusFilter="fulfilled"
        filters={filters}
        onFilteredCount={onFilteredCount}
        onSelectionChange={onSelectionChange}
      />
    </div>
  );
}

// ✅ Delivered Orders
export function Delivered({
  filters,
  currentPage,
  rowsPerPage,
  onFilteredCount,
  onSelectionChange,
}: TabProps) {
  return (
    <div>
      <AllOrderTable
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
        statusFilter="delivered"
        filters={filters}
        onFilteredCount={onFilteredCount}
        onSelectionChange={onSelectionChange}
      />
    </div>
  );
}

// ✅ Cancelled Orders
export function Cancelled({
  filters,
  currentPage,
  rowsPerPage,
  onFilteredCount,
  onSelectionChange,
}: TabProps) {
  return (
    <div>
      <AllOrderTable
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
        statusFilter="cancelled"
        filters={filters}
        onFilteredCount={onFilteredCount}
        onSelectionChange={onSelectionChange}
      />
    </div>
  );
}
