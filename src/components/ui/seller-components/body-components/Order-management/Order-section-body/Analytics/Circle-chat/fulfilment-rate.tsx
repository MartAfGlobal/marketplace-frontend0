"use client";

import Image from "next/image";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import CaretDown from "@/assets/Seller/caretDown.png";

const filterOptions = ["This Week", "This Month", "This Year"];

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
    <div className="flex flex-col items-center w-full max-w-xs gap-2">
      <div className="h-28 w-28 md:h-42 md:w-42 flex items-center">
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
      <p className="text-[10px] md:text-c12 font-MontserratMedium text-000000/50 text-center">{label}</p>
    </div>
  );
}

export default function FulfilmentRates() {
  const [selected, setSelected] = useState(filterOptions[2]);
  const [isOpen, setIsOpen] = useState(false);

  const orders = useSelector((state: any) => state.orders.orders);

  const { fulfillmentRate, disputeRate } = useMemo(() => {
    const now = new Date();

    const filtered = orders.filter((order: any) => {
      const d = new Date(order.created_at);
      if (selected === "This Week") {
        const diffDays = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
        return diffDays <= 7;
      }
      if (selected === "This Month") {
        return (
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );
      }
      return d.getFullYear() === now.getFullYear();
    });

    const total = filtered.length;
    if (total === 0) return { fulfillmentRate: 0, disputeRate: 0 };

    const fulfilled = filtered.filter((o: any) => {
      const s = (o.order_timeline_stage || o.status || "").toLowerCase();
      return s === "delivered" || s === "fulfilled" || s === "shipped";
    }).length;

    const disputed = filtered.filter((o: any) => {
      const s = (o.order_timeline_stage || o.status || "").toLowerCase();
      return s === "cancelled" || s === "returned" || s === "rejected" || s === "refunded";
    }).length;

    return {
      fulfillmentRate: Math.round((fulfilled / total) * 100),
      disputeRate: Math.round((disputed / total) * 100),
    };
  }, [orders, selected]);

  return (
    <div className="w-full lg:max-w-c495-72 py-4 px-4 md:px-c32 h-auto md:h-83 bg-ffffff rounded-c16">
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

      <div className="w-full flex justify-between gap-2 mt-4 md:mt-0">
        <RateChart value={fulfillmentRate} label="Fulfilment rate" />
        <RateChart value={disputeRate} label="Cancellation rate" />
      </div>
    </div>
  );
}
