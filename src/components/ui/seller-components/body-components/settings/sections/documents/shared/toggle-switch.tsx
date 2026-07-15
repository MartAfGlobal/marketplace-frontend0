"use client";

import React from "react";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}

export const ToggleSwitch = ({ checked, onChange, disabled = false }: ToggleSwitchProps) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onChange}
    className={`w-11 h-6 rounded-full p-1 transition-colors flex items-center ${checked ? "bg-[#ff6b6b]" : "bg-[#f0f0f0]"} ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
  >
    <div className={`w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${checked ? "translate-x-5" : "translate-x-0"}`} />
  </button>
);
