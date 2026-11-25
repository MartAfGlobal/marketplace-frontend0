"use client";

import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-c16 font-MontserratSemiBold text-161616 mb-1">{children}</h3>;
}

export function Row({
  title,
  desc,
  children,
  muted = false,
  indent = false,
}: {
  title: string;
  desc?: string;
  children: React.ReactNode;
  muted?: boolean;
  indent?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between py-4 gap-4 ${indent ? "pl-4 border-l-2 border-000000/6 ml-1" : ""}`}>
      <div className={muted ? "opacity-40" : ""}>
        <p className="text-c14 text-161616">{title}</p>
        {desc && <p className="text-c12 text-000000/45 mt-0.5">{desc}</p>}
      </div>
      {children}
    </div>
  );
}

export function NumberField({
  value,
  unit,
  onSave,
  min = 0,
  width = "w-24",
  disabled = false,
}: {
  value: any;
  unit?: string;
  onSave: (v: number) => void;
  min?: number;
  width?: string;
  disabled?: boolean;
}) {
  const [v, setV] = useState(value ?? "");
  useEffect(() => setV(value ?? ""), [value]);
  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        min={min}
        value={v}
        disabled={disabled}
        onChange={(e) => setV(e.target.value)}
        onBlur={() => {
          const next = v === "" ? min : Number(v);
          if (String(v) !== String(value ?? "")) onSave(next);
        }}
        className={`${width} h-11 px-3 text-center rounded-c8 border border-efefef focus:border-ff715b focus:ring-1 focus:ring-ff715b outline-none text-c14 disabled:bg-000000/4 disabled:text-000000/30`}
      />
      {unit && <span className="text-c14 text-161616">{unit}</span>}
    </div>
  );
}

/** Naira money input showing a formatted ₦ value. Stores a plain number. */
export function MoneyField({
  value,
  onSave,
  width = "w-36",
}: {
  value: any;
  onSave: (v: number | null) => void;
  width?: string;
}) {
  const [v, setV] = useState(value ?? "");
  const [focused, setFocused] = useState(false);
  useEffect(() => setV(value ?? ""), [value]);

  const display = focused
    ? v
    : v === "" || v === null || v === undefined
    ? ""
    : `₦${Number(v).toLocaleString()}`;

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        inputMode="numeric"
        value={display}
        onFocus={() => setFocused(true)}
        onChange={(e) => setV(e.target.value.replace(/[₦,\s]/g, ""))}
        onBlur={() => {
          setFocused(false);
          const raw = String(v).replace(/[₦,\s]/g, "");
          const next = raw === "" ? null : Number(raw);
          if (String(raw) !== String(value ?? "")) onSave(next);
        }}
        className={`${width} h-11 px-3 text-center rounded-c8 border border-efefef focus:border-ff715b focus:ring-1 focus:ring-ff715b outline-none text-c14`}
      />
      <span className="text-c14 text-161616">Naira</span>
    </div>
  );
}

export function TextField({
  value,
  onSave,
  placeholder,
  width = "w-56",
}: {
  value: any;
  onSave: (v: string) => void;
  placeholder?: string;
  width?: string;
}) {
  const [v, setV] = useState(value ?? "");
  useEffect(() => setV(value ?? ""), [value]);
  return (
    <input
      type="text"
      value={v}
      placeholder={placeholder}
      onChange={(e) => setV(e.target.value)}
      onBlur={() => {
        if (String(v) !== String(value ?? "")) onSave(v);
      }}
      className={`${width} h-11 px-4 rounded-xl border border-000000/10 focus:border-ff715b outline-none text-c14`}
    />
  );
}

export function Dropdown({
  value,
  options,
  onChange,
  width = "w-44",
}: {
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
  width?: string;
}) {
  return (
    <div className="relative">
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className={`${width} h-11 pl-4 pr-9 rounded-xl border border-000000/10 bg-[#f4f4f6] text-c14 text-161616 outline-none appearance-none`}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="w-4 h-4 text-000000/40 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
  );
}

/** Segmented pill (e.g. Manual | Automatic); active segment is green. */
export function Segmented({
  value,
  options,
  onChange,
}: {
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="inline-flex rounded-c8 bg-000000/4 p-1">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={`px-4 h-9 rounded-c6 text-c14 font-MontserratMedium transition-colors ${
              active ? "bg-[#2ec27e] text-white" : "text-000000/40"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
