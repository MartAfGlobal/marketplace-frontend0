"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Search, Trash2, X } from "lucide-react";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import { useSearchSuggestions } from "@/hooks/useSearchSuggestions";

export default function MobileSearchPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");

  const {
    history,
    frequent,
    addToHistory,
    removeHistoryItem,
    clearHistory,
    removeFrequentItem,
    clearFrequent,
  } = useSearchHistory();

  const { suggestions, loading } = useSearchSuggestions(query);

  useEffect(() => {
    // Auto-focus input on page mount
    inputRef.current?.focus();
  }, []);

  const handleSearch = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;

    addToHistory(trimmed);
    router.push(
      `/products/all-products?searchKey=${encodeURIComponent(trimmed)}&search=${encodeURIComponent(trimmed)}`
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch(query);
    }
  };

  const renderHighlightedMatch = (text: string, currentQuery: string) => {
    if (!currentQuery) return <span>{text}</span>;
    const lowerText = text.toLowerCase();
    const lowerQuery = currentQuery.toLowerCase();
    const index = lowerText.indexOf(lowerQuery);

    if (index === -1) {
      return <span className="text-gray-700">{text}</span>;
    }

    const before = text.slice(0, index);
    const match = text.slice(index, index + currentQuery.length);
    const after = text.slice(index + currentQuery.length);

    return (
      <span className="text-sm">
        {before && <span className="text-gray-400 font-normal">{before}</span>}
        <span className="font-semibold ">{match}</span>
        {after && <span className="text-gray-400 font-normal">{after}</span>}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-white flex flex-col w-full max-w-lg mx-auto">
      {/* Mobile Search Header */}
      <header className="sticky top-0 z-30 bg-white px-4 pt-4 pb-3 flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Go back"
          className="p-1 -ml-1 text-gray-800 hover:text-black focus:outline-none"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="flex-1 relative flex items-center bg-white shadow-sm border border-gray-100 rounded-xl h-11 px-3">
          <Search className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search for products"
            className="w-full bg-transparent text-sm  placeholder:text-gray-400 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none"
              aria-label="Clear input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 py-3">
        {query.trim() === "" ? (
          <div>
            {/* Search History Section */}
            {history.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-MontserratSemiBold text-sm ">
                    Search history
                  </h3>
                  <button
                    type="button"
                    onClick={clearHistory}
                    title="Clear search history"
                    aria-label="Clear search history"
                    className="p-1 text-[#EF4444] hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-[#EF4444]" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {history.map((item, idx) => (
                    <div
                      key={`${item}-${idx}`}
                      className="inline-flex items-center gap-2 bg-000000/6  active:bg-[#EAEAEA] text-gray-800 text-xs px-3.5 py-1.5 rounded-md cursor-pointer transition-colors"
                    >
                      <span
                        onClick={() => handleSearch(item)}
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
                        className="text-gray-400 active:text-black focus:outline-none"
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
                  <h3 className="font-MontserratSemiBold text-sm ">
                    Frequently searched
                  </h3>
                  <button
                    type="button"
                    onClick={clearFrequent}
                    title="Clear frequently searched"
                    aria-label="Clear frequently searched"
                    className="p-1 text-[#EF4444] hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-[#EF4444]" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {frequent.map((item, idx) => (
                    <div
                      key={`${item}-${idx}`}
                      className="inline-flex items-center gap-2 bg-000000/6  active:bg-[#EAEAEA] text-gray-800 text-xs px-3.5 py-1.5 rounded-md cursor-pointer transition-colors"
                    >
                      <span
                        onClick={() => handleSearch(item)}
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
                        className="text-gray-400 active:text-black focus:outline-none"
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
              <div className="text-center py-12 text-gray-400 text-sm">
                No recent searches. Type above to find products.
              </div>
            )}
          </div>
        ) : (
          /* Live Suggestions List */
          <div className="flex flex-col divide-y divide-gray-50">
            {suggestions.map((item, idx) => (
              <div
                key={`${item}-${idx}`}
                onClick={() => handleSearch(item)}
                className="flex items-center gap-3 py-3 px-1 active:bg-gray-50 cursor-pointer transition-colors"
              >
                <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div className="flex-1">{renderHighlightedMatch(item, query)}</div>
              </div>
            ))}

            {suggestions.length === 0 && !loading && (
              <div
                onClick={() => handleSearch(query)}
                className="flex items-center gap-3 py-3 px-1 active:bg-gray-50 cursor-pointer transition-colors"
              >
                <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-sm text-gray-700">
                  Search for &quot;
                  <span className="font-semibold ">{query}</span>
                  &quot;
                </span>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
