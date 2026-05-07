"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import SearchIcon from "@/assets/headerIcon/searchIcon.svg";

interface SearchInputProps {
  placeholder?: string;
  className?: string;
  onSearchChange?: (value: string) => void;
  showDropdown?: boolean;
}

export default function SearchInput({
  placeholder = "Search for products",
  className = "",
  onSearchChange,
  showDropdown = false,
}: SearchInputProps) {
  const [searchValue, setSearchValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [history, setHistory] = useState([
    "Umbrella",
    "Ankara Shoe",
    "Headphones",
  ]);
  const [frequent, setFrequent] = useState(["Laptop", "Sneakers", "Bag"]);
  const [related, setRelated] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const inputRef = useRef<HTMLDivElement>(null);

  // Dummy related keywords for testing
  const dummyRelatedKeywords = [
    "Headphones",
    "Headset",
    "Heater",
    "Helmet",
    "Hoodie",
    "Hammock",
    "Handbag",
    "Heels",
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
        setRelated([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!showDropdown) return;

    if (isFocused) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isFocused, showDropdown]);

  const handleRemoveHistoryItem = (item: string) => {
    setHistory((prev) => prev.filter((i) => i !== item));
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const handleSelect = (keyword: string) => {
    setSearchValue(keyword);
    setIsFocused(false);
    setRelated([]);
  };

 const handleChange = (value: string) => {
  setSearchValue(value);
  onSearchChange?.(value);

  if (!showDropdown) return;

  if (value.trim() === "") {
    setRelated([]);
    return;
  }

  const filtered = dummyRelatedKeywords.filter((k) =>
    k.toLowerCase().startsWith(value.toLowerCase())
  );

  setRelated(filtered);
};


  return (
    <div
      ref={inputRef}
      className={`relative md:static md:min-w-90  w-full   ${className}`}
    >
      {/* Input */}
      <div className="relative w-full h-12 bg-ffffff shadow-customW rounded-c8">
        <Image
          src={SearchIcon}
          width={20}
          height={20}
          alt="SearchIcon"
          className="absolute left-4 top-1/2 -translate-y-1/2 "
        />
        <input
          type="text"
          placeholder={placeholder}
          value={searchValue}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => showDropdown && setIsFocused(true)}
          className={`w-full rounded-c8 pl-10 pr-4 py-2 h-full font-MontserratNormal text-000000 text-sm focus:outline-none  `}
        />
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {showDropdown &&
          isFocused &&
          (related.length > 0 ||
            (searchValue === "" &&
              (history.length > 0 || frequent.length > 0))) && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="absolute top-0 md:top-0 lg:translate-x-1/2  lg:left-0 sm:w-full sm:max-w-130 xl:max-w-157.5 mt-1 md:-mt-1.5 py-4 px-4 bg-white rounded-c8 shadow-custom  z-50 overflow-hidden"
            >
              {searchValue === "" ? (
                <>
                  {/* Show History */}
                  {history.length > 0 && (
                    <div className=" mb-4 flex justify-between items-center px-2 ">
                      <span className="font-MontserratSemiBold text-sm">
                        Search History
                      </span>
                      <button
                        className="text-ff715b/100 text-c12"
                        onClick={handleClearHistory}
                      >
                        Clear history
                      </button>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-3 px-2">
                    {history.map((item) => (
                      <div
                        key={item}
                        className="flex items-center  gap-2.5 text-c12 font-MontserratNormal cursor-pointer hover:bg-gray-100"
                      >
                        <span onClick={() => handleSelect(item)}>{item}</span>
                        <button
                          onClick={() => handleRemoveHistoryItem(item)}
                          className="text-#343330"
                        >
                          X
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Frequently Searched */}

                  {frequent.length > 0 && (
                    <div className=" flex justify-between items-center px-2 mt-6">
                      <span className="font-MontserratSemiBold text-sm">
                        Frequently searched
                      </span>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-3 px-2 mt-4">
                    {frequent.map((item) => (
                      <div
                        key={item}
                        onClick={() => handleSelect(item)}
                        className="flex items-center  gap-2.5 text-c12 font-MontserratNormal cursor-pointer hover:bg-gray-100"
                      >
                        <span>{item}</span>
                        <button
                          onClick={() => handleRemoveHistoryItem(item)}
                          className="text-#343330"
                        >
                          X
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  {/* Related Keywords */}
                  {related.map((item) => {
                    const typedPart = searchValue;
                    const restPart = item.slice(searchValue.length);
                    return (
                      <div
                        key={item}
                        onClick={() => handleSelect(item)}
                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-100"
                      >
                        <Image
                          src={SearchIcon}
                          alt="Search"
                          width={11.39}
                          height={11.39}
                        />
                        <span>
                          <span className="font-MontserratNormal text-c12 text-000000">
                            {typedPart}
                          </span>
                          <span className="font-MontserratNormal text-c12 text-gray-400">
                            {restPart}
                          </span>
                        </span>
                      </div>
                    );
                  })}
                </>
              )}
            </motion.div>
          )}
      </AnimatePresence>
    </div>
  );
}
