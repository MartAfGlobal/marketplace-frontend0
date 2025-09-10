"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

import CalenderIcon from "@/assets/Seller/calender.png";
import PercentageIcon from "@/assets/Seller/percent.png";
import Quantity from "@/assets/Seller/quantity.png";
import Sku from "@/assets/Seller/sku.png";
import Close from "@/assets/Seller/cancelledIcon.png";
import { FilterModalProps } from "@/types/global";

// Sub-filter forms -----------------
function DateFilterForm({
  value,
  onChange,
}: {
  value: any;
  onChange: (val: any) => void;
}) {
  return (
    <div className=" flex flex-col gap-1 text-c10 font-MontserratNormal">
      <div>
        <label htmlFor="">from</label>
        <input
          type="date"
          className="border rounded p-2 w-full"
          value={value?.start || ""}
          onChange={(e) => onChange({ ...value, start: e.target.value })}
        />
      </div>

      <div>
        <label htmlFor="">to</label>
        <input
          type="date"
          className="border rounded p-2 w-full"
          value={value?.end || ""}
          onChange={(e) => onChange({ ...value, end: e.target.value })}
        />
      </div>
    </div>
  );
}

function PercFilterForm({
  value,
  onChange,
}: {
  value: any;
  onChange: (val: any) => void;
}) {
  return (
    <input
      type="number"
      min={0}
      max={100}
      placeholder="Enter %"
      className="border rounded p-2 w-full"
      value={value || ""}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  );
}

function SkuFilterForm({
  value,
  onChange,
}: {
  value: any;
  onChange: (val: any) => void;
}) {
  return (
    <input
      type="text"
      placeholder="Enter SKU"
      className="border rounded p-2 w-full"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

function QuantityFilterForm({ value, onChange }: { value: any; onChange: (val: any) => void }) {
  return (
    <div className="flex gap-3">
      <input
        type="number"
        min={1}
        placeholder="Min"
        className="border rounded p-2 w-full"
        value={value?.min || ""}
        onChange={(e) => onChange({ ...value, min: Number(e.target.value) })}
      />
      <input
        type="number"
        min={1}
        placeholder="Max"
        className="border rounded p-2 w-full"
        value={value?.max || ""}
        onChange={(e) => onChange({ ...value, max: Number(e.target.value) })}
      />
    </div>
  );
}

// -----------------

export default function FilterModal({
  onFiltersChange,
  onClose,
}: FilterModalProps) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [tempFilters, setTempFilters] = useState<any>({});
  const [appliedFilters, setAppliedFilters] = useState<any>({});

  const handleChange = (key: string, value: any) => {
    setTempFilters({ ...tempFilters, [key]: value });
  };

  const handleApply = () => {
    setAppliedFilters(tempFilters);
    onFiltersChange(tempFilters);
    onClose?.();
  };

  const handleClear = () => {
    setTempFilters({});
    setAppliedFilters({});
    onFiltersChange({});
  };

  const removeFilter = (key: string) => {
    const newFilters = { ...appliedFilters };
    delete newFilters[key];
    setAppliedFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const filterOptions = [
    { key: "date", label: "Date", icon: CalenderIcon },
    { key: "perc", label: "Perc", icon: PercentageIcon },
    { key: "sku", label: "SKU", icon: Sku },
    { key: "qty", label: "Quantity", icon: Quantity },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="rounded-c8 bg-white circle-shadow py-3 px-4 w-full max-w-44 h-fit2"
      >
        <p className="text-c12 font-MontserratSemiBold pb-3">Filter by</p>
        <div className="grid grid-cols-2 gap-4 justify-center">
          {filterOptions.map((filter) => (
            <motion.button
              key={filter.key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex flex-col w-full max-w-16 h-16 items-center justify-center rounded-c4 p-1.25 transition text-c12 font-MontserratNormal text-center
                ${
                  activeFilter === filter.key
                    ? "bg-[#EC0B43]/10 text-[#FF715B]"
                    : "text-black/50 hover:bg-[#EC0B43]/10 hover:text-[#FF715B]"
                }`}
              onClick={() => setActiveFilter(filter.key)}
            >
              <Image
                src={filter.icon}
                alt={filter.label}
                width={24}
                height={24}
              />
              <span className="mt-2">{filter.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Active filter form */}
        <div className="mt-4">
          {activeFilter === "date" && (
            <DateFilterForm
              value={tempFilters.date}
              onChange={(val) => handleChange("date", val)}
            />
          )}
          {activeFilter === "perc" && (
            <PercFilterForm
              value={tempFilters.perc}
              onChange={(val) => handleChange("perc", val)}
            />
          )}
          {activeFilter === "sku" && (
            <SkuFilterForm
              value={tempFilters.sku}
              onChange={(val) => handleChange("sku", val)}
            />
          )}
          {activeFilter === "qty" && (
            <QuantityFilterForm
              value={tempFilters.qty}
              onChange={(val) => handleChange("qty", val)}
            />
          )}
        </div>

        {/* Apply + Clear */}
        <div className="mt-3 flex justify-between">
          <button
            onClick={handleClear}
            className="text-c10 font-MontserratSemiBold text-000000/40 hover:text-[#FF715B]"
          >
            Clear filters
          </button>
          <button
            onClick={handleApply}
            className="text-ff715b text-c10 font-MontserratSemiBold hover:opacity-90"
          >
            Apply
          </button>
        </div>

        {/* Applied filters */}
        {Object.keys(appliedFilters).length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {appliedFilters.date && (
              <span className="flex items-center gap-2 bg-gray-100 text-sm px-3 py-1 rounded-full">
                {appliedFilters.date.start} – {appliedFilters.date.end}
                <Image
                  src={Close}
                  alt="close"
                  width={20}
                  height={20}
                  className="cursor-pointer"
                  onClick={() => removeFilter("date")}
                />
              </span>
            )}
            {appliedFilters.perc && (
              <span className="flex items-center gap-2 bg-gray-100 text-sm px-3 py-1 rounded-full">
                % &gt; {appliedFilters.perc}
                <Image
                  src={Close}
                  alt="close"
                  width={20}
                  height={20}
                  className="cursor-pointer"
                  onClick={() => removeFilter("perc")}
                />
              </span>
            )}
            {appliedFilters.sku && (
              <span className="flex items-center gap-2 bg-gray-100 text-sm px-3 py-1 rounded-full">
                SKU: {appliedFilters.sku}
                <Image
                  src={Close}
                  alt="close"
                  width={20}
                  height={20}
                  className="cursor-pointer"
                  onClick={() => removeFilter("sku")}
                />
              </span>
            )}
            {appliedFilters.qty && (
              <span className="flex items-center gap-2 bg-gray-100 text-sm px-3 py-1 rounded-full">
                Qty: {appliedFilters.qty}
                <Image
                  src={Close}
                  alt="close"
                  width={20}
                  height={20}
                  className="cursor-pointer"
                  onClick={() => removeFilter("qty")}
                />
              </span>
            )}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
