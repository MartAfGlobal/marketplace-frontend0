"use client";

import { motion } from "framer-motion";

interface OrdersNavProps {
  tabs: string[];
  activeTab: string;
  pageTitle: string;
}

export default function ProgressStatus({ tabs, activeTab, pageTitle }: OrdersNavProps) {
  return (
    <div className="w-full h-38 ">
      {/* Step circles & lines */}
      <div className="flex mx-auto w-fit">
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab;
          const isCompleted = tabs.indexOf(activeTab) > index;

          return (
            <div key={tab} className="flex flex-col items-center flex-1 w-full">
              <div className="flex items-center justify-center w-full">
                <motion.div
                  className={`flex items-center  justify-center h-8 w-8 rounded-full border-2 text-sm font-bold shrink-0
                    ${
                      isActive
                        ? "border-6a0dad bg-6a0dad text-white"
                        : isCompleted
                        ? "border-6a0dad bg-6a0dad text-ffffff"
                        : "border-000000/10 text-000000/10"
                    }`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {index + 1}
                </motion.div>

                {index < tabs.length - 1 && (
                  <div className="  w-60 ">
                    <motion.div
                      className="h-[2px] flex-1 w-full max-w-60"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                      style={{
                        backgroundColor: isCompleted ? "#6a0dad" : "#d1d5db",
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Step labels */}
      <div className="flex w-full justify-between  mt-6 mb-c48">
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab;
          const isCompleted = tabs.indexOf(activeTab) > index;

          return (
            <div key={tab} className="w-fit">
              <motion.p
                className={`text-c18 font-MontserratSemiBold 
                  ${
                    isActive
                      ? "text-6a0dad"
                      : isCompleted
                      ? "text-6a0dad"
                      : "text-000000/10"
                  }`}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                {tab}
              </motion.p>
            </div>
          );
        })}
      </div>

    
      <motion.p
        key={activeTab}
        className="font-MontserratNormal text-center  m-0 text-c18 text-161616"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {pageTitle}
      </motion.p>
    </div>
  );
}
