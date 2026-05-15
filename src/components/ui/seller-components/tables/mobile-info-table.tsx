import React from "react";

export interface MobileInfoTableRow {
  label: string | React.ReactNode;
  value: string | React.ReactNode;
}

interface MobileInfoTableProps {
  rows: MobileInfoTableRow[];
  containerClassName?: string;
}

export const MobileInfoTable = ({ rows, containerClassName = "" }: MobileInfoTableProps) => {
  if (!rows || rows.length === 0) return null;

  return (
    <div className={`flex flex-col text-c12 font-MontserratNormal bg-white ${containerClassName}`}>
      {rows.map((row, index) => {
        const isFirst = index === 0;
        const isLast = index === rows.length - 1;
        // Alternating background colors
        const bgColor = index % 2 === 0 ? "bg-[#F8F8F8]" : "bg-[#ffffff]";
        
        return (
          <div
            key={index}
            className={`flex justify-between items-center px-4 py-3 ${bgColor} ${
              isFirst ? "rounded-t-lg" : ""
            } ${isLast ? "rounded-b-lg" : ""} ${
              // Add border between white backgrounds if needed, but the original used specific styles. 
              // Original OrderItemsList: border-b border-gray-50 for white, border-white for F8F8F8. 
              // OrderInfoSections: no borders, just alternating.
              ""
            }`}
          >
            <span className="text-[#161616] min-w-[100px]">{row.label}</span>
            <span className="font-MontserratSemiBold text-[#161616] text-right">
              {row.value}
            </span>
          </div>
        );
      })}
    </div>
  );
};
