"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, X, Search } from "lucide-react";
import SearchIcon from "@/assets/headerIcon/searchIcon.svg";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import { useSearchSuggestions } from "@/hooks/useSearchSuggestions";

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
  showDropdown = true,
}: SearchInputProps) {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    history,
    frequent,
    addToHistory,
    removeHistoryItem,
    clearHistory,
    removeFrequentItem,
    clearFrequent,
  } = useSearchHistory();

  const { suggestions, loading } = useSearchSuggestions(searchValue);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleExecuteSearch = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    addToHistory(trimmed);
    setIsFocused(false);
    setSearchValue(trimmed);

    router.push(
      `/products/all-products?searchKey=${encodeURIComponent(trimmed)}&search=${encodeURIComponent(trimmed)}`
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleExecuteSearch(searchValue);
    } else if (e.key === "Escape") {
      setIsFocused(false);
    }
  };

  const handleInputChange = (val: string) => {
    setSearchValue(val);
    onSearchChange?.(val);
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // If on mobile / small screen (< 1024px), redirect to dedicated mobile search page
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      e.target.blur();
      router.push("/search");
      return;
    }

    if (showDropdown) {
      setIsFocused(true);
    }
  };

  const handleInputClick = () => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      router.push("/search");
    }
  };

  const renderHighlightedMatch = (text: string, query: string) => {
    if (!query) return <span>{text}</span>;
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const index = lowerText.indexOf(lowerQuery);

    if (index === -1) {
      return <span className="text-gray-700">{text}</span>;
    }

    const before = text.slice(0, index);
    const match = text.slice(index, index + query.length);
    const after = text.slice(index + query.length);

    return (
      <span className="text-sm">
        {before && <span className="text-gray-400 font-normal">{before}</span>}
        <span className="font-semibold ">{match}</span>
        {after && <span className="text-gray-400 font-normal">{after}</span>}
      </span>
    );
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Search Input Bar */}
      <div
        onClick={handleInputClick}
        className="relative w-full h-12 bg-ffffff shadow-customW rounded-c8 flex items-center cursor-pointer"
      >
        <Image
          src={SearchIcon}
          width={20}
          height={20}
          alt="Search"
          className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
        />
        <input
          type="text"
          placeholder={placeholder}
          value={searchValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          className="w-full h-full rounded-c8 pl-11 pr-4 py-2 font-MontserratNormal text-000000 text-sm focus:outline-none bg-transparent"
        />
      </div>

      {/* Tray Dropdown Modal for Desktop */}
      <AnimatePresence>
        {showDropdown && isFocused && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute top-full left-0 w-full min-w-[340px] md:min-w-[420px] max-w-[560px] mt-2 p-5 bg-white rounded-c8  circle-shadow z-50 text-left"
          >
            {searchValue.trim() === "" ? (
              <div>
                {/* Search History Section */}
                {history.length > 0 && (
                  <div className="mb-5">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-MontserratSemiBold text-sm ">
                        Search history
                      </h4>
                      <button
                        type="button"
                        onClick={clearHistory}
                        title="Clear search history"
                        aria-label="Clear search history"
                        className="text-[#EF4444] hover:text-red-700 p-1 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-[#EF4444]" />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2.5">
                      {history.map((item, idx) => (
                        <div
                          key={`${item}-${idx}`}
                          className="inline-flex items-center gap-2 bg-000000/6 hover:bg-[#EAEAEA] text-gray-800 text-xs px-3.5 py-1.5 rounded-md cursor-pointer transition-colors"
                        >
                          <span
                            onClick={() => handleExecuteSearch(item)}
                            className="font-MontserratNormal"
                          >
                            {item}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeHistoryItem(item);
                            }}
                            className="text-gray-400 hover:text-black focus:outline-none"
                            aria-label={`Remove ${item}`}
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Frequently Searched Section */}
                {frequent.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-MontserratSemiBold text-sm ">
                        Frequently searched
                      </h4>
                      <button
                        type="button"
                        onClick={clearFrequent}
                        title="Clear frequently searched"
                        aria-label="Clear frequently searched"
                        className="text-[#EF4444] hover:text-red-700 p-1 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-[#EF4444]" />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2.5">
                      {frequent.map((item, idx) => (
                        <div
                          key={`${item}-${idx}`}
                          className="inline-flex items-center gap-2 bg-000000/6  hover:bg-[#EAEAEA] text-gray-800 text-xs px-3.5 py-1.5 rounded-md cursor-pointer transition-colors"
                        >
                          <span
                            onClick={() => handleExecuteSearch(item)}
                            className="font-MontserratNormal"
                          >
                            {item}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFrequentItem(item);
                            }}
                            className="text-gray-400 hover:text-black focus:outline-none"
                            aria-label={`Remove ${item}`}
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {history.length === 0 && frequent.length === 0 && (
                  <p className="text-gray-400 text-xs text-center py-4">
                    Type to search products
                  </p>
                )}
              </div>
            ) : (
              /* Suggestions List */
              <div className="flex flex-col max-h-[380px] overflow-y-auto">
                {suggestions.map((item, idx) => (
                  <div
                    key={`${item}-${idx}`}
                    onClick={() => handleExecuteSearch(item)}
                    className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
                  >
                    <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <div>{renderHighlightedMatch(item, searchValue)}</div>
                  </div>
                ))}

                {suggestions.length === 0 && !loading && (
                  <div
                    onClick={() => handleExecuteSearch(searchValue)}
                    className="flex items-center gap-3 px-3 py-3 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
                  >
                    <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-700">
                      Search for &quot;
                      <span className="font-semibold ">
                        {searchValue}
                      </span>
                      &quot;
                    </span>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
