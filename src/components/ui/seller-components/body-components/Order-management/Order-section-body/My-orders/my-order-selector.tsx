import { NavigationBarProps } from "@/types/global";

import { motion } from "framer-motion";
const navItems = [
  { id: "all", label: "All" },
  { id: "unprocessed", label: "Unprocessed" },
  { id: "processed", label: "Processed" },
  { id: "fulfilled", label: "Fulfilled" },
  { id: "delivered", label: "Delivered" },
  { id: "cancelled", label: "Cancelled" },
];

export default function FilteredOrders({
  activeTab,
  setActiveTab,
}: NavigationBarProps) {
  return (
    <nav className=" font-MontserratSemiBold text-sm flex gap-6 relative border-b border-b-000000/10 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className="relative flex flex-col items-center justify-center h-c48 p-4"
        >
          <p className="flex items-center gap-2">
            <span className={`${
                activeTab ===item.id? "text-6a0dad font-MontserratSemiBold text-c12": "text-000000/60 font-MontserratMedium text-c12"
            }`}>{item.label}</span>
          </p>

          {activeTab === item.id && (
            <motion.div
              layoutId="underline"
              className="absolute bottom-0 left-0 right-0 h-1 bg-6a0dad"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
        </button>
      ))}
    </nav>
  );
}
