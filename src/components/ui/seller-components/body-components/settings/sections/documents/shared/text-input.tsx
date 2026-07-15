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
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const TextInput = ({
  label,
  placeholder,
  value,
  name,
  disabled = false,
  onChange,
}: TextInputProps) => (
  <div className="flex flex-col gap-2">
    <Label className="">{label}</Label>
    <Input
      type="text"
      name={name}
      placeholder={placeholder}
      value={value || ""}
      onChange={onChange}
      disabled={disabled}
      className={`${disabled ? "bg-gray-50 text-[#999999]" : "bg-white"}`}
    />
  </div>
);
