"use client";

import React, { useState, useEffect } from "react";
import { Loader2, X } from "lucide-react";

interface CountryFormProps {
  onSubmit: (name: string) => Promise<void>;
  isSubmitting: boolean;
  initialData?: any;
  onCancel?: () => void;
}

export default function CountryForm({ onSubmit, isSubmitting, initialData, onCancel }: CountryFormProps) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
    } else {
      setName("");
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name) {
      await onSubmit(name);
      if (!initialData) setName("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <label className="block text-sm font-MontserratSemiBold text-[#22223f]">Country Name</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Nigeria"
          className="w-full rounded-[20px] border border-[#e3e3f1] bg-[#fafafe] px-5 py-4 text-sm font-MontserratNormal text-[#1d1d33] outline-none transition focus:border-6a0dad focus:ring-2 focus:ring-6a0dad/10"
        />
      </div>

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
          {isSubmitting ? "Saving..." : initialData ? "Update Country" : "Save Country"}
        </button>
      </div>
    </form>
  );
}
