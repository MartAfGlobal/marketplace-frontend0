import Pagination from "@/components/ui/seller-components/body-components/products/pignation-button";
import type { SupportStaffRow } from "./supportTickets";

interface SupportStaffTableProps {
  rows: SupportStaffRow[];
  loading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showPagination: boolean;
}

export default function SupportStaffTable({
  rows,
  loading,
  page,
  totalPages,
  onPageChange,
  showPagination,
}: SupportStaffTableProps) {
  return (
    <>
      <div className="mb-4 text-xs font-MontserratNormal text-[#999]">
        Staff assignments shown from tickets on the current page.
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[460px] border-collapse text-left">
          <thead>
            <tr className="h-10 bg-[#947fff] text-white">
              <th className="px-3 py-2 text-[10px] font-MontserratMedium">
                Support staff
              </th>
              <th className="px-3 py-2 text-[10px] font-MontserratMedium">
                Assigned tickets on this page
              </th>
            </tr>
          </thead>
          <tbody className="text-[11px] font-MontserratNormal text-[#666]">
            {loading ? (
              <tr>
                <td colSpan={2} className="p-8 text-center text-[#999]">
                  Loading support tickets...
                </td>
              </tr>
            ) : rows.length ? (
              rows.map((staff) => (
                <tr
                  key={staff.name}
                  className="h-10 border-b border-[#000000]/5 last:border-0"
                >
                  <td className="px-3 py-2">{staff.name}</td>
                  <td className="px-3 py-2">{staff.assignedTickets}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="p-8 text-center text-[#999]">
                  No assigned support staff found on this page.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showPagination && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </>
  );
}
