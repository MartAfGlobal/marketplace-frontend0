"use client";

import React, { useState, useEffect } from "react";
import { Loader2, X } from "lucide-react";

interface CategoryFormProps {
  onSubmit: (name: string, isActive: boolean) => Promise<void>;
  isSubmitting: boolean;
  initialData?: any;
  onCancel?: () => void;
}

export default function CategoryForm({ onSubmit, isSubmitting, initialData, onCancel }: CategoryFormProps) {
  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setIsActive(initialData.is_active ?? true);
    } else {
      setName("");
      setIsActive(true);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name) {
      await onSubmit(name, isActive);
      if (!initialData) {
        setName("");
        setIsActive(true);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Category Name */}
      <div className="space-y-3">
        <label className="block text-sm font-MontserratSemiBold text-[#22223f]">Category Name</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Fashion & Apparel"
          className="w-full rounded-[20px] border border-[#e3e3f1] bg-[#fafafe] px-5 py-4 text-sm font-MontserratNormal text-[#1d1d33] outline-none transition focus:border-6a0dad focus:ring-2 focus:ring-6a0dad/10"
        />
      </div>

      {/* Is Active Toggle */}
      <div className="flex items-center justify-between p-5 rounded-[20px] border border-[#e3e3f1] bg-[#fafafe]">
        <div>
          <p className="text-sm font-MontserratSemiBold text-[#22223f]">Active Status</p>
          <p className="text-xs text-gray-400 font-MontserratMedium mt-0.5">
            {isActive ? "Category is visible in waitlist forms" : "Category is hidden from waitlist forms"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsActive((prev) => !prev)}
          className={`relative inline-flex h-7 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            isActive ? "bg-6a0dad" : "bg-gray-200"
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              isActive ? "translate-x-7" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        {initialData && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-full border border-gray-200 px-8 py-4 text-sm font-MontserratBold text-gray-500 transition hover:bg-gray-50 flex items-center justify-center gap-2"
          >
            <X size={18} /> Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting || !name}
          className="flex-[2] rounded-full bg-6a0dad px-8 py-4 text-sm font-MontserratBold text-white transition hover:bg-[#5a0dad] shadow-lg shadow-6a0dad/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : null}
          {isSubmitting ? "Saving..." : initialData ? "Update Category" : "Save Category"}
        </button>
      </div>
    </form>
  );
}
