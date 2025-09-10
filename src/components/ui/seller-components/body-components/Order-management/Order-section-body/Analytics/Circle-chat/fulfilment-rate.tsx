"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CaretDown from "@/assets/Seller/caretDown.png";


const filterOptions = ["This Week", "This Month", "This Year"]

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const completedColor = "#c3d1ff";
const remainingColor = "#E5E7EB";

interface RateChartProps {
  value: number;
  label: string;
}

function RateChart({ value, label }: RateChartProps) {
  const data = [
    { name: "Completed", value, color: completedColor },
    { name: "Remaining", value: 100 - value, color: remainingColor },
  ];

  return (
    <div className="flex flex-col items-center w-full bg-[#]  max-w-xs gap-2 ">
      <div className="h-42 w-42 flex items-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius="100%"
              innerRadius="80%"
              startAngle={350}
              endAngle={-270}
              cornerRadius={12}
              paddingAngle={2}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>

            {/* Centered Percentage */}
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="20"
              fill={completedColor}
              fontWeight="600"
            >
              {value}%
            </text>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <p>{label}</p>
    </div>
  );
}

export default function FulfilmentRates() {
  const [selected, setSelected] = useState(filterOptions[0]);
  const [isOpen, setIsOpen] = useState(false);

  return (
   <div className="w-full max-w-c495-72 py-4 px-c32 h-83 bg-ffffff rounded-c16">
    <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-MontserratSemiBold">Fulfilment rates</h2>
    
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
     <div className="w-full flex">
      <RateChart value={85} label="Return rate" />
      <RateChart value={35} label="Dispute rate" />
    </div>
   </div>
  );
}
