import React, { useState } from 'react';
import Image from "next/image";
import HandBug from "@/assets/Seller/handBug.png";
import ViewIcon from "@/assets/admin/eye.svg";
import { AnimatePresence, motion } from "framer-motion";

export default function PayoutHistoryTab() {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [activeRowId, setActiveRowId] = useState<string | null>(null);

  const mockData = Array.from({ length: 8 }).map((_, i) => ({
    id: `P-${i}`,
    date: '20-07-2025',
    method: 'Bank account',
    amount: 'N20,000',
    balance: 'N20,000',
    status: i === 0 ? 'Unprocessed' : 'Delivered',
    fees: i === 0 ? '0' : 'N200'
  }));

    const getStatusColor = (status: string) => {
    switch (status) {
      case 'Unprocessed': return 'text-[#CA0202] bg-[#CA0202]/12';
      // case 'Processed': return 'text-[#0070E9] bg-[#0070E9]/12';
      // case 'Fulfilled': return 'text-[#947FFF] bg-[#947FFF]/12';
      // case 'Shipped': return 'text-[#FFAC06] bg-[#FFAC06]/12';
      case 'Delivered': return 'text-[#00BE5C] bg-[#00BE5C]/12';
      default: return 'text-gray-500 bg-gray-100';
    }
  };
  const handleSelectAll = () => {
    if (selectedRows.length === mockData.length) setSelectedRows([]);
    else setSelectedRows(mockData.map(d => d.id));
  };

  const handleToggleRow = (id: string) => {
    setSelectedRows(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]);
  };

  return (
    <div className="w-full">
      <h3 className="font-MontserratMedium text-base text-[#161616] mb-6">Payout history</h3>
      <div className="overflow-x-auto min-h-[250px]">
        <table className="w-full text-left">
          <thead>
            <tr className="h-10.5 bg-[#947fff] text-ffffff text-nowrap">
              <th className="font-MontserratNormal text-sm text-center w-10 p-3 ">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className={`mx-auto flex h-4 w-4 items-center justify-center border duration-200 ${
                    selectedRows.length === mockData.length
                      ? "border-[#ff715b] bg-[#ff715b]"
                      : "border-white hover:border-[#ff715b]"
                  }`}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={`h-2.5 w-2.5 ${selectedRows.length === mockData.length ? "text-white" : "text-[#ff715b] opacity-0"}`}>
                    <path d="M5 12.5 9.5 17 19 7.5" />
                  </svg>
                </button>
              </th>
              <th className="p-3 font-MontserratNormal text-sm max-w-[120px]">Date</th>
              <th className="p-3 font-MontserratNormal text-sm max-w-[159px]">Payout method</th>
              <th className="p-3 font-MontserratNormal text-sm max-w-[141.15px]">Amount</th>
              <th className="p-3 font-MontserratNormal text-sm max-w-[141.15px]">Balance</th>
              <th className="p-3 font-MontserratNormal text-sm text-center max-w-[104px]">Status</th>
              <th className="p-3 font-MontserratNormal text-sm text-center max-w-[63px]">Fees</th>
              <th className="p-3 font-MontserratNormal text-sm text-center"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-[13px] text-[#000000]/68 font-MontserratMedium">
            {mockData.map((row) => (
              <tr key={row.id} className="transition-colors h-10.5 text-[#000000]/68 cursor-pointer hover:bg-gray-50">
                <td className="py-3 px-4">
                  <button
                    type="button"
                    onClick={() => handleToggleRow(row.id)}
                    className={`mx-auto flex h-4 w-4 items-center justify-center border transition-all duration-200 ${
                      selectedRows.includes(row.id)
                        ? "border-[#ff715b] bg-[#ff715b]"
                        : "border-[#161616] hover:border-[#ff715b]"
                    }`}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={`h-2.5 w-2.5 ${selectedRows.includes(row.id) ? "text-white" : "text-[#ff715b] opacity-0"}`}>
                      <path d="M5 12.5 9.5 17 19 7.5" />
                    </svg>
                  </button>
                </td>
                <td className="p-3 truncate " title={row.date}>{row.date}</td>
                <td className="p-3 truncate " title={row.method}>{row.method}</td>
                <td className="p-3 truncate " title={row.amount}>{row.amount}</td>
                <td className="p-3 truncate " title={row.balance}>{row.balance}</td>
                <td className="p-3 text-center">
                  <span className={`px-3 py-1 h-6 rounded-[32px] text-center text-[10px] block truncate  max-w-fit ${getStatusColor(row.status)}`} title={row.status}>
                    {row.status}
                  </span>
              
                </td>
                <td className="p-3 text-center truncate max-w-[80px] " title={row.fees}>{row.fees}</td>
                <td className="p-3 text-center relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveRowId(activeRowId === row.id ? null : row.id);
                    }}
                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors mx-auto"
                  >
                    <Image src={HandBug} alt="actions" width={16} height={16} />
                  </button>
                  <AnimatePresence>
                    {activeRowId === row.id && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 text-c12 font-MontserratNormal top-full px-4 mt-2 w-max rounded-c8 bg-ffffff shadow-custom border border-000000/4 overflow-hidden z-50 whitespace-nowrap"
                      >
                        <button className="w-full py-2 text-left flex items-center gap-3">
                          <Image src={ViewIcon} alt="View" width={15} height={10} />
                          <span className="text-[#ff715b] text-sm font-MontserratMedium hover:text-[#ff715b]/80 transition-colors">View payout details</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
