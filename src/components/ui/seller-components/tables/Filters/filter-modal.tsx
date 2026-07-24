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
import navBack from "@/assets/icons/arrowBack.svg";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/forms/Input";

// -------------------
// Date Filter Form
// -------------------
export type DateRange = {
  start?: Date | string;
  end?: Date | string;
};
export function DateFilterForm({
  value,
  onChange,
}: {
  value: any;
  onChange: (val: any) => void;
}) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today);
  const [activeInput, setActiveInput] = useState<"from" | "to">("from");

  const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  const endOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0,
  );
  const monthDays = Array.from(
    { length: endOfMonth.getDate() },
    (_, i) => i + 1,
  );
  const monthName = currentMonth.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const handleDayClick = (day: number) => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
    );

    if (activeInput === "from") {
      onChange({ ...value, start: date.toISOString(), end: value?.end });
      setActiveInput("to");
    } else {
      // Only allow ing a date after 'start'
      if (value?.start && date < new Date(value.start)) return;
      onChange({ ...value, end: date.toISOString() });
    }
  };

  const formatDate = (date?: string) =>
    date
      ? new Date(date).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        })
      : "";

  return (
    <div className="w-full text-center">
      {/* Labels */}
      <div className="flex gap-4 mb-6 justify-center">
        <div className=" flex text-left items-center gap-4">
          <span className="font-MontserratNormal text-c12 text-000000/65">
            From
          </span>
          <button
            className={`w-full rounded-c8 shadow-customW h-12.5 py-3 px-4 font-MontserratNormal text-c18 min-w-[111.5px] ${activeInput === "from" ? "border-[#FF715B] border" : ""}`}
            onClick={() => setActiveInput("from")}
          >
            {formatDate(value?.start)}
          </button>
        </div>
        <div className=" flex gap-4 items-center ">
          <Image
            src={navBack}
            width={12}
            height={10}
            alt="Back"
            className="rotate-180"
          />
          <button
            className={`w-full rounded-c8 shadow-customW h-12.5 py-3 px-4 font-MontserratNormal text-c18 min-w-[111.5px] ${activeInput === "to" ? "border-[#FF715B] border" : ""}`}
            onClick={() => setActiveInput("to")}
          >
            {formatDate(value?.end)}
          </button>
        </div>
      </div>

      {/* Month navigation */}
      <div className="flex items-center justify-between mb-3 text-c18 font-MontserratNormal">
        <button
          className=""
          onClick={() =>
            setCurrentMonth(
              new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1),
            )
          }
        >
          <ChevronLeft size={20} />
        </button>
        <span className="text-c18 font-MontserratNormal">{monthName}</span>
        <button
          onClick={() =>
            setCurrentMonth(
              new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1),
            )
          }
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Week labels */}
      <div className="grid grid-cols-7 text-c18 font-MontserratNormal text-gray-400 mb-2">
        {days.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-2">
        {monthDays.map((day) => {
          const date = new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth(),
            day,
          );
          const ed =
            (value?.start && new Date(value.start).getDate() === day) ||
            (value?.end && new Date(value.end).getDate() === day);

          const disabled =
            activeInput === "to" &&
            value?.start &&
            date < new Date(value.start);

          return (
            <button
              key={day}
              onClick={() => !disabled && handleDayClick(day)}
              className={`w-10.5 h-10.5 rounded-full text-c18 font-MontserratNormal flex items-center justify-center
        ${ed ? "bg-[#FF715B] text-white" : disabled ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-gray-100 hover:bg-gray-200"}`}
              disabled={disabled}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// -------------------
// Percentage Filter Form (From-To)
// -------------------
function PercFilterForm({
  value,
  onChange,
}: {
  value: any;
  onChange: (val: any) => void;
}) {
  return (
    <div className="w-full text-center">
      <div className="flex  items-center gap-2 mb-4">
        <div className=" flex text-left items-center gap-4">
          <span className="font-MontserratNormal text-c12 text-000000/65">
            From
          </span>
          <Input
            type="number"
            min={0}
            max={100}
            className="min-w-[73px] shadow-customW"
            value={value?.from || ""}
            onChange={(e) =>
              onChange({ ...value, from: Number(e.target.value) })
            }
          />
        </div>
        <div className=" flex text-left items-center gap-4">
          <span className="w-c45 h-10 rounded-c8  bg-ff715b flex items-center justify-center flex-shrink-0 text-ffffff text-sm font-medium mb-1">
            To
          </span>
          <Input
            type="number"
            min={0}
            max={100}
            className="min-w-[73px] shadow-customW"
            value={value?.to || ""}
            onChange={(e) => onChange({ ...value, to: Number(e.target.value) })}
          />
        </div>
      </div>
    </div>
  );
}

// -------------------
// SKU Filter Form (Single input)
// -------------------
function SkuFilterForm({
  value,
  onChange,
}: {
  value: any;
  onChange: (val: any) => void;
}) {
  return (
    <div className="w-full text-center mb-4">
      <Input
        type="text"
        placeholder="Stock number"
        // className="border rounded-c8 py-3 px-4 text-c12 font-MontserratNormal w-full focus:border-ff715b"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

// -------------------
// Quantity Filter Form
// -------------------
function QuantityFilterForm({
  value,
  onChange,
}: {
  value: any;
  onChange: (val: any) => void;
}) {
  return (
    <div className="flex gap-3">
      <div className=" flex text-left items-center gap-4">
        <span className="font-MontserratNormal text-c12 text-000000/65">
          From
        </span>
        <Input
          type="number"
          min={1}
          className="min-w-[73px] shadow-customW"
          value={value?.min || ""}
          onChange={(e) => onChange({ ...value, min: Number(e.target.value) })}
        />
      </div>
      <div className=" flex text-left items-center gap-4">
        <span className="font-MontserratNormal text-c12 text-000000/65">
          To
        </span>

        <Input
          type="number"
          min={1}
          className="min-w-[73px] shadow-customW"
          value={value?.max || ""}
          onChange={(e) => onChange({ ...value, max: Number(e.target.value) })}
        />
      </div>
    </div>
  );
}

// -------------------
// FullScreen Modal Wrapper
// -------------------

export function FullScreenModal({
  title,
  children,
  onClose,
  onClear,
  onApply,
  isApplyDisabled,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onClear: () => void;
  onApply: () => void;
  isApplyDisabled?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        exit={{ y: 50 }}
        className="bg-white w-full max-w-92 rounded-lg px-6 py-3"
      >
        {/* Header */}
        <div className="">
          <button onClick={onClose} className="flex items-center gap-2.5 mb-4 ">
            <Image src={navBack} width={12} height={10} alt="Back" />

            <h2 className="font-MontserratSemiBold text-c12">{title}</h2>
          </button>
        </div>

        {children}

        {/* Footer */}
        <div className="flex justify-between mt-4">
          <button
            onClick={onClear}
            className={` py-2   ${
              isApplyDisabled
                ? "text-gray-300 cursor-not-allowed"
                : "text-[#FF715B]"
            }`}
          >
            Clear filters
          </button>

          <button
            onClick={onApply}
            disabled={isApplyDisabled}
            className={` py-2   ${
              isApplyDisabled
                ? "text-gray-300 cursor-not-allowed"
                : "text-[#FF715B]"
            }`}
          >
            Apply
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
// -------------------
// Main Filter Modal
// -------------------
export default function FilterModal({
  onFiltersChange,
  onClose,
}: FilterModalProps) {
  const [activeFilterModal, setActiveFilterModal] = useState<string | null>(
    null,
  );
  const [filters, setFilters] = useState<any>({});

  const filterOptions = [
    { key: "date", label: "Date", icon: CalenderIcon },
    { key: "perc", label: "Perc", icon: PercentageIcon },
    { key: "sku", label: "SKU", icon: Sku },
    { key: "qty", label: "Quantity", icon: Quantity },
  ];

  const handleApply = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
    setActiveFilterModal(null);
  };

  const handleRemove = (key: string) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleClear = () => {
    setFilters({});
    onFiltersChange({});
  };



const formatDateRange = (range: DateRange) => {
  if (!range?.start) return "";

  const formatOptions: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };

  const start = new Date(range.start).toLocaleDateString(
    undefined,
    formatOptions
  );

  const end = range.end
    ? new Date(range.end).toLocaleDateString(undefined, formatOptions)
    : null;

  return end ? `${start} – ${end}` : start;
};

  return (
    <>
      {/* Main Filter Modal */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="rounded-c8 bg-white circle-shadow py-3 px-4 w-full max-w-76 md:max-w-44 h-fit2"
        >
          {/* Applied date range */}
          {filters.date && (
            <div className="text-sm text-gray-700 font-medium mb-2">
              {formatDateRange(filters.date)}
            </div>
          )}

          <p className="text-c12 font-MontserratSemiBold pb-3">Filter by</p>
          <div className="grid grid-cols-2 gap-4 justify-center">
            {filterOptions.map((filter) => (
              <button
                key={filter.key}
                className="flex flex-col w-full max-w-16 h-16 items-center justify-center rounded-c4 p-1.25 transition text-c12 font-MontserratNormal text-center text-black/50 hover:bg-[#EC0B43]/10 hover:text-[#FF715B]"
                onClick={() => setActiveFilterModal(filter.key)}
              >
                <Image
                  src={filter.icon}
                  alt={filter.label}
                  width={24}
                  height={24}
                />
                <span className="mt-2">{filter.label}</span>
              </button>
            ))}
          </div>

          {/* Applied filters badges except date */}
          {/* {Object.keys(filters).length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {Object.entries(filters).map(
                ([key, value]) =>
                  key !== "date" && (
                    <span
                      key={key}
                      className="flex items-center gap-2 bg-gray-100 text-sm px-3 py-1 rounded-full"
                    >
                      {key}: {JSON.stringify(value)}
                      <Image
                        src={Close}
                        alt="close"
                        width={20}
                        height={20}
                        className="cursor-pointer"
                        onClick={() => handleRemove(key)}
                      />
                    </span>
                  ),
              )}
            </div>
          )} */}

          <div className="mt-3 flex justify-between">
            <button
              onClick={handleClear}
              className="text-c10 font-MontserratSemiBold text-000000/40 hover:text-[#FF715B]"
            >
              Clear filters
            </button>
            <button
              onClick={onClose}
              className="text-ff715b text-c10 font-MontserratSemiBold hover:opacity-90"
            >
              Close
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Full-screen modals */}
      <AnimatePresence>
        {activeFilterModal === "date" && (
          <FullScreenModal
            title="Date"
            onClose={() => setActiveFilterModal(null)}
            onClear={() => setFilters({ ...filters, date: {} })}
            onApply={() => handleApply("date", filters.date)}
            isApplyDisabled={!filters.date?.start || !filters.date?.end}
          >
            <DateFilterForm
              value={filters.date}
              onChange={(val) => setFilters({ ...filters, date: val })}
            />
          </FullScreenModal>
        )}

        {activeFilterModal === "perc" && (
          <FullScreenModal
            title="Enter Percentage"
            onClose={() => setActiveFilterModal(null)}
            onClear={() => setFilters({ ...filters, perc: {} })}
            onApply={() => handleApply("perc", filters.perc)}
            isApplyDisabled={!filters.perc?.from || !filters.perc?.to}
          >
            <PercFilterForm
              value={filters.perc}
              onChange={(val) => setFilters({ ...filters, perc: val })}
            />
          </FullScreenModal>
        )}

        {activeFilterModal === "sku" && (
          <FullScreenModal
            title="SKU"
            onClose={() => setActiveFilterModal(null)}
            onClear={() => setFilters({ ...filters, sku: "" })}
            onApply={() => handleApply("sku", filters.sku)}
          >
            <SkuFilterForm
              value={filters.sku}
              onChange={(val) => setFilters({ ...filters, sku: val })}
            />
          </FullScreenModal>
        )}

        {activeFilterModal === "qty" && (
          <FullScreenModal
            title="Quantity Range"
            onClose={() => setActiveFilterModal(null)}
            onClear={() => setFilters({ ...filters, qty: {} })}
            onApply={() => handleApply("qty", filters.qty)}
            isApplyDisabled={!filters.qty?.min || !filters.qty?.max}
          >
            <QuantityFilterForm
              value={filters.qty}
              onChange={(val) => setFilters({ ...filters, qty: val })}
            />
          </FullScreenModal>
        )}
      </AnimatePresence>
    </>
  );
}
