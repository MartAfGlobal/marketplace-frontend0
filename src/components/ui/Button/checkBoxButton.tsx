"use client";
import { useState } from "react";

interface CheckBoxButtonProps {
  label?: string;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
}

export default function CheckBoxButton({
 
  defaultChecked = false,
  onChange,
}: CheckBoxButtonProps) {
  const [checked, setChecked] = useState(defaultChecked);

  const toggleCheck = () => {
    const newValue = !checked;
    setChecked(newValue);
    onChange?.(newValue);
  };

  return (
    <button
      type="button"
      onClick={toggleCheck}
      className={`rounded-c4 border flex items-center justify-center h-5 w-5 transition-colors duration-200 
        ${checked ? "bg-[#FF715B] border-[#FF715B]" : "border-[#FF715B] bg-white"}
      `}
    >
      <span
        className={`relative flex h-5 w-5 items-center justify-center rounded-c4
          ${checked ? "border-white" : "border-black/20"}
        `}
      >
        {checked && (
          <span className="absolute w-2.5 h-1.5 border-b-2 border-l-2 border-white rotate-[-45deg]" />
        )}
      </span>
    </button>
  );
}
