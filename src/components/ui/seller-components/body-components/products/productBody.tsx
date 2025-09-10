"use client";

import Image from "next/image";
import AddIcon from "@/assets/Seller/addIcon.png";
import backIcon from "@/assets/Seller/red-caret-left.png";
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { useInView } from "framer-motion";

import ProductHeader from "./productHeader";
import ProductInventoryPage from "./product-inventory";
import DraftProduct from "./draft-product";
import AddProductForm from "./add-form/add-new-product";

export default function ProductBody() {
  const [showAddForm, setShowAddForm] = useState(false);

  // Refs for only header and add section
  const headerRef = useRef(null);
  const addRef = useRef(null);

  const headerInView = useInView(headerRef, { once: false });
  const addInView = useInView(addRef, { once: false });

  return (
    <div className="w-full space-y-c32 pb-c32">
      {/* Header */}
      <motion.div
        ref={headerRef}
        initial={{ opacity: 0, y: 40 }}
        animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <ProductHeader />
      </motion.div>

      {/* Add Product Header */}
      <motion.div
        ref={addRef}
        initial={{ opacity: 0, y: 30 }}
        animate={addInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center"
      >
        <div className="flex items-center gap-3">
          <Image src={AddIcon} width={24} height={24} alt="adding" />
          <p className="text-c18 font-MontserratSemiBold">
            Add New Product
          </p>
        </div>

        <button
          onClick={() => setShowAddForm((prev) => !prev)}
          className={`text-[14px] font-MontserratSemiBold flex items-center justify-center gap-2 w-c160 h-c48 rounded-c8 ${
            showAddForm
              ? "text-[#FF715B] bg-transparent"
              : "bg-ff715b text-ffffff"
          }`}
        >
          {showAddForm && (
            <Image src={backIcon} alt="back" width={16} height={16} />
          )}
          {showAddForm ? "Back to Product" : "Add Product"}
        </button>
      </motion.div>

      <AnimatePresence mode="wait">
        {!showAddForm ? (
          <motion.div
            key="tables"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
            className="space-y-c32"
          >
            
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ProductInventoryPage />
            </motion.div>

            {/* Drafts */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <DraftProduct />
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ duration: 0.5 }}
          >
            <AddProductForm />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
