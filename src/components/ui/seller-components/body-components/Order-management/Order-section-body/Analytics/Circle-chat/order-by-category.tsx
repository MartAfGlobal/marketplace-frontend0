"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import MultiLineZigZagChart from "../../../../over-view/chat-section/mutiple-zig-chat";

import CaretDown from "@/assets/Seller/caretDown.png";

interface SecondChatProps {
  title?: string; // optional prop
}
const filterOptions = ["This Week", "This Month", "This Year"];

export default function CategoryChat({title="Orders"}:SecondChatProps) {
  const [selected, setSelected] = useState(filterOptions[0]);
  const [isOpen, setIsOpen] = useState(false);

 
  const segments = [
    { label: "Fashion & shoes", value: 2500, color: "#947FFF" },
    { label: "Electronics", value: 250, color: " #947FFF80 " },
    { label: "Beverages", value: 400, color: " #6A0DAD80" },
  ];

 
  const equalSlices = segments.map((seg) => ({
    ...seg,
    renderValue: 1, 
  }));

  
  const rotatedColors = [
    segments[2].color,
    segments[0].color,
    segments[1].color,
  ];

  return (
    <div className="w-full max-w-134.75 h-c460-69 py-6 px-8 bg-ffffff circle-shadow rounded-c16">
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-MontserratSemiBold">{title}</h2>

        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex circle-shadow text-c12 font-MontserratNormal text-ff715b bg-ffffff items-center w-full max-w-fit p-3 rounded-xl justify-center flex-shrink-0 gap-4.5 h-10"
          >
            <span>{selected}</span>
            <Image src={CaretDown} alt="filter" width={11} height={6} />
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                className="absolute z-40 right-0 mt-2 w-39 py-3 px-6 space-y-2.5 text-c12 font-MontserratNormal text-000000/50 bg-white rounded circle-shadow h-29"
              >
                {filterOptions.map((option) => (
                  <div
                    key={option}
                    onClick={() => {
                      setSelected(option);
                      setIsOpen(false);
                    }}
                    className="h-6 cursor-pointer hover:text-ff715b"
                  >
                    {option}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

     
      <div className="flex w-full max-w-87.5 p-0 m-0   h-fit items-start gap-9">
        <div className="flex-1 h-c176-69 w-c176-69  flex items-center ">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={equalSlices}
                dataKey="renderValue"
                cx="50%"
                cy="50%"
                outerRadius="100%"
                innerRadius="75%"
                startAngle={90}
                endAngle={-270}
                cornerRadius={12} 
                paddingAngle={6} 
              >
                {rotatedColors.map((color, i) => (
                  <Cell key={i} fill={color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4" >
          {segments.map((seg, i) => (
            <div
              key={seg.label}
              className="w-full max-w-35 flex gap-4 items-center  "
            >
              <div className="flex items-center gap-0.5 w-full    pb-3 max-w-23.25 text-nowrap">
                <div
                  className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: rotatedColors[i] }}
                />
                <p className="text-c10 font-MontserratMedium text-000000/50 w-full">
                  {seg.label}
                </p>
              </div>
              <div className="w-full max-w-7.75">
                <p className="font-MontserratSemiBold text-c12">{seg.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <MultiLineZigZagChart/>
    </div>
  );
}
