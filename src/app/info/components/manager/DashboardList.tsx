"use client";

import React from "react";
import { Trash2, Edit2 } from "lucide-react";

interface DashboardListProps {
  items: any[];
  type: "categories" | "images" | "countries";
  onDelete: (id: string) => Promise<void>;
  onEdit?: (item: any) => void;
}

export default function DashboardList({ items, type, onDelete, onEdit }: DashboardListProps) {
  const getLabel = () => {
    if (type === "categories") return "Current Categories";
    if (type === "images") return "Current Showcase Loop";
    return "Target Countries";
  };

  const getSyncText = () => {
    if (type === "categories") return "Categories added here update the Waitlist dropdowns in real-time.";
    if (type === "images") return "Images added here will appear in the landing page looping marquee.";
    return "Countries added here appear in the Waitlist form's country selector.";
  };

  return (
    <section className="space-y-6 min-h-0">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-MontserratBold text-[#1f1f35]">{getLabel()}</h2>
        <span className="text-xs font-MontserratMedium text-gray-400">
          {items.length} Items
        </span>
      </div>

      {/* Images tab: grid of image cards */}
      {type === "images" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:max-h-[calc(100vh-300px)] lg:overflow-y-auto pr-1 custom-scroll">
          {items.length === 0 ? (
            <div className="col-span-full rounded-[24px] border border-dashed border-gray-200 p-8 sm:p-12 text-center">
              <p className="text-sm text-gray-400 font-MontserratNormal italic">No images uploaded yet.</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="relative group rounded-[20px] overflow-hidden border border-[#e8e8f6] shadow-sm hover:shadow-md transition-all"
              >
                {/* Image thumbnail */}
                <div className="w-full h-32 sm:h-40 bg-gray-100">
                  <img
                    src={item.image_url ?? item.image}
                    alt={item.title || "Showcase image"}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23f3f4f6' width='100' height='100'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23d1d5db' font-size='12'%3ENo image%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>

                {/* Overlay info */}
                <div className="px-3 py-2 bg-white">
                  <p className="text-xs font-MontserratSemiBold text-[#1f1f35] truncate">
                    {item.title || "Showcase Image"}
                  </p>
                  <p className="text-[10px] text-gray-400 font-MontserratMedium uppercase tracking-wider">
                    Live on Website
                  </p>
                </div>

                {/* Delete button overlay */}
                <button
                  onClick={() => onDelete(item.id)}
                  className="absolute top-2 right-2 p-2 bg-white/90 rounded-full shadow text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  title="Delete image"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Categories & Countries: row list */
        <div className="grid gap-3 sm:gap-4 lg:max-h-[calc(100vh-300px)] lg:overflow-y-auto pr-2 custom-scroll">
          {items.length === 0 ? (
            <div className="rounded-[24px] border border-dashed border-gray-200 p-8 sm:p-12 text-center">
              <p className="text-sm text-gray-400 font-MontserratNormal italic">No items found.</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 sm:gap-4 p-3 bg-white rounded-[20px] sm:rounded-[24px] border border-[#e8e8f6] shadow-sm group transition-all hover:shadow-md">
                {"image_url" in item || "image" in item ? (
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-[10px] sm:rounded-[14px] overflow-hidden bg-gray-100 flex-shrink-0">
                    <img src={item.image_url ?? item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-6a0dad/5 flex items-center justify-center text-lg sm:text-xl flex-shrink-0">
                    🌍
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-MontserratSemiBold text-sm text-[#1f1f35] truncate">
                    {"name" in item ? item.name : "Item"}
                  </h4>
                  <p className="text-[10px] text-gray-400 font-MontserratMedium uppercase tracking-wider mt-1">Live on Website</p>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(item)}
                      className="p-2 sm:p-3 text-gray-300 hover:text-6a0dad transition-colors"
                      title="Edit Item"
                    >
                      <Edit2 size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => onDelete(item.id)}
                    className="p-2 sm:p-3 text-gray-300 hover:text-red-500 transition-colors"
                    title="Delete Item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <div className="rounded-[24px] bg-6a0dad/[0.03] border border-6a0dad/10 p-6">
        <h4 className="text-xs font-MontserratBold text-6a0dad uppercase tracking-[0.2em] mb-3">Dashboard Sync</h4>
        <p className="text-xs leading-5 text-6a0dad/60 font-MontserratMedium">
          {getSyncText()}
        </p>
      </div>
    </section>
  );
}
