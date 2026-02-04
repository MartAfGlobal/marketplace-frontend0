"use client";

import { useEffect, useState } from "react";
import OrdersNav from "./order-status-bar";
import SearchInput from "../../landindPage/Header/SearchInput";
import Orders from "./Component-ui/all-orders";
import AwaitingOrders from "./Component-ui/Awaiting-payment";
import ToShip from "./Component-ui/toship";
import Shipped from "./Component-ui/shipped";
import Proccessed from "./Component-ui/processed";
import { motion } from "framer-motion";

import ProductCard from "@/components/ui/cards/ProductCard";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import ProcessingOrders from "./Component-ui/processing";
import { useHttp } from "@/hooks/use-http";
import Disputes from "./Component-ui/dispute-items";

const tabs = [
  "All",

  "Awaiting Payment",
  "Processing",
  "To Ship",
  "Shipped",
  "Processed",
  "In Dispute",
];

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("All");

  const { sendHttpRequest, loading } = useHttp();

  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="w-full  justify-center  flex flex-col">
      <div className="flex justify-between sticky top-16 z-10 bg-white pt-c32 border-b border-black/10 w-full overflow-x-auto">
        <OrdersNav
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          className="pl-82 md:pl-0"
        />
        <SearchInput
          onSearchChange={setSearchTerm}
          showDropdown={false}
          placeholder="Order ID, Store name, Product name"
          className="border border-000000/18 focus:ring-ff715b shadow-neutral-50 hidden md:block"
        />
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="md:pt-c32 md:pb-c60 ">
          {activeTab === "All" && <Orders searchTerm={searchTerm} />}
          {activeTab === "Awaiting Payment" && (
            <AwaitingOrders searchTerm={searchTerm} />
          )}
          {activeTab === "Processing" && (
            <ProcessingOrders searchTerm={searchTerm} />
          )}
          {activeTab === "To Ship" && <ToShip searchTerm={searchTerm} />}
          {activeTab === "Shipped" && <Shipped searchTerm={searchTerm} />}
          {activeTab === "Processed" && <Proccessed searchTerm={searchTerm} />}
          {activeTab === "In Dispute" && <Disputes searchTerm={searchTerm} />}
        </div>
      </div>

      <div className="pb-3 px-6  md:hidden">
        <p className="font-MontserratNormal text-c18 text-161616 mb-c32">
          More to love
        </p>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15 },
            },
          }}
          className="grid grid-cols-2 sm:grid-cols-4 justify-center lg:grid-cols-6 gap-2.5"
        ></motion.div>
      </div>
    </div>
  );
}
