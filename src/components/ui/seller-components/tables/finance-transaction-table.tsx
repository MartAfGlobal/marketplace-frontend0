"use client";
import Image from "next/image";
import HandBug from "@/assets/Seller/handBug.png";

export type InventoryFullTableProps = {
  currentPage: number;
  rowsPerPage: number;
  filters?: {
    status?: string; // Completed, Pending, etc.
    cd?: "Credit" | "Debit";
    type?: string;
    search?: string; // transaction ID or linked entity search
    dateFrom?: string;
    dateTo?: string;
  };
};

export default function FinanceTransactionsTable({
  currentPage,
  rowsPerPage,
  filters = {},
}: InventoryFullTableProps) {
  // dataset
  const allRows = Array.from({ length: 95 }, (_, i) => ({
    id: i + 1,
    "date & time": "28/10/2012 5:39PM",
    transactionid: `TX9982345${i}`,
    amount: (() => {
      switch (i % 10) {
        case 0: return "N30,000";
        case 1: return "N35,000";
        case 2: return "N40,000";
        case 3: return "N45,000";
        case 4: return "N50,000";
        case 5: return "N55,000";
        case 6: return "N60,000";
        case 7: return "N65,000";
        case 8: return "N70,000";
        case 9: return "N75,000";
        default: return "N80,000";
      }
    })(),

    status: (() => {
      switch (i % 5) {
        case 0: return "Completed";
        case 1: return "Pending";
        case 2: return "Failed";
        case 3: return "Reversed";
        case 4: return "In Progress";
        default: return "Completed";
      }
    })(),

    "C/D": i % 2 === 0 ? "Debit" : "Credit",

    type: (() => {
      switch (i % 4) {
        case 0: return "Commission fee";
        case 1: return "Service charge";
        case 2: return "Late payment penalty";
        case 3: return "Refund adjustment";
        default: return "Commission fee";
      }
    })(),

    "Linked entity": `ORD7589${i}`,
    description: `Fee on transaction ${i}`,
  }));

  // ✅ Apply filters
  const filteredRows = allRows.filter((row) => {
    let match = true;

    if (filters.status && row.status.toLowerCase() !== filters.status.toLowerCase()) {
      match = false;
    }
    if (filters.cd && row["C/D"] !== filters.cd) {
      match = false;
    }
    if (filters.type && row.type.toLowerCase() !== filters.type.toLowerCase()) {
      match = false;
    }
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      if (
        !row.transactionid.toLowerCase().includes(searchTerm) &&
        !row["Linked entity"].toLowerCase().includes(searchTerm)
      ) {
        match = false;
      }
    }
    // (Optional) Date filtering — assuming your dates are ISO or comparable
    if (filters.dateFrom || filters.dateTo) {
      const rowDate = new Date("2012-10-28T17:39:00"); // replace with parsed row["date & time"]
      if (filters.dateFrom && rowDate < new Date(filters.dateFrom)) match = false;
      if (filters.dateTo && rowDate > new Date(filters.dateTo)) match = false;
    }

    return match;
  });

  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = filteredRows.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className="w-full">
      <table className="w-full border-collapse">
        {/* Table Head */}
        <thead className="text-white font-MontserratSemiBold text-c12 bg-947fff h-10">
          <tr className="h-10">
            <th className="px-1 text-left">Date & time</th>
            <th className="px-1 text-left">Transaction ID</th>
            <th className="px-1 text-left">Amount</th>
            <th className="px-1 text-left">Status</th>
            <th className="px-1 text-left">C/D</th>
            <th className="px-1 text-left">Type</th>
            <th className="px-1 text-left">Linked entity</th>
            <th className="px-1 text-left">Description</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {currentRows.map((row) => (
            <tr
              key={row.id}
              className="h-10 text-c12 font-MontserratSemiBold text-000000/60"
            >
              <td className="px-1 text-left">{row["date & time"]}</td>
              <td className="px-1 text-left">{row.transactionid}</td>
              <td className="px-1 text-left">{row.amount}</td>
              <td className="px-1 text-left text-2d7565">{row.status}</td>
              <td className="px-1 text-left">{row["C/D"]}</td>
              <td className="px-1 text-left">{row.type}</td>
              <td className="px-1 text-ff715b/80">{row["Linked entity"]}</td>
              <td className="px-1">{row.description}</td>
              <td>
                <button className="w-6 h-6 flex-shrink-0">
                  <Image
                    src={HandBug}
                    alt="side button"
                    width={24}
                    height={24}
                    className="flex-shrink-0"
                  />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {currentRows.length === 0 && (
        <p className="text-center text-gray-500 py-4">No results found</p>
      )}
    </div>
  );
}
