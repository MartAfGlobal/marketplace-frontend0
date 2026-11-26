"use client";

import React from "react";
import { useCountries } from "@/helpers/useCountries";

interface CountrySelectProps {
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  /** Emit the country code instead of the name. */
  useCode?: boolean;
  /** Restrict options to countries sellers may onboard from / ship to. */
  sellableOnly?: boolean;
  shippableOnly?: boolean;
}

/**
 * A country dropdown driven by the managed Localisation list
 * (Settings > Localisation) — the single source for countries across the
 * apps. Drop-in for any ad-hoc/hardcoded country field.
 */
export function CountrySelect({
  value,
  onChange,
  label = "Country",
  placeholder = "Select country",
  disabled,
  className = "",
  useCode = false,
  sellableOnly,
  shippableOnly,
}: CountrySelectProps) {
  const { countries } = useCountries({ sellableOnly, shippableOnly });

  return (
    <div className="w-full">
      {label && (
        <label className="block text-c12 font-MontserratMedium mb-2 text-161616">{label}</label>
      )}
      <select
        value={value ?? ""}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={
          className ||
          "h-12 px-3.5 w-full rounded-c8 text-gray-700 border border-efefef focus:border-ff715b focus:ring-1 focus:ring-ff715b outline-none text-c14 bg-white disabled:opacity-60"
        }
      >
        <option value="">{placeholder}</option>
        {countries.map((c) => (
          <option key={c.id} value={useCode ? c.code : c.name}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}
