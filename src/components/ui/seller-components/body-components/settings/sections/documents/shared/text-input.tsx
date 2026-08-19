"use client";

import React from "react";
import { Label } from "@/components/ui/forms/Label";
import { Input } from "@/components/ui/forms/Input";

interface TextInputProps {
  label: string;
  placeholder?: string;
  value?: string;
  name: string;
  disabled?: boolean;
  /** HTML input type — defaults to "text" */
  type?: string;
  /** Minimum number of characters allowed */
  minLength?: number;
  /** Maximum number of characters allowed */
  maxLength?: number;
  /** Inline validation error message */
  error?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const TextInput = ({
  label,
  placeholder,
  value,
  name,
  disabled = false,
  type = "text",
  minLength,
  maxLength,
  error,
  onChange,
}: TextInputProps) => (
  <div className="flex flex-col gap-1.5">
    <Label className="">{label}</Label>
    <Input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value || ""}
      onChange={onChange}
      disabled={disabled}
      minLength={minLength}
      maxLength={maxLength}
      className={`${disabled ? "bg-gray-50 text-[#999999]" : "bg-white"} ${
        error ? "border-red-400 focus:ring-red-300" : ""
      }`}
    />
    {error && (
      <p className="text-[11px] text-red-500 font-MontserratMedium leading-tight">
        {error}
      </p>
    )}
  </div>
);
