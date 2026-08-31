"use client";
import { useState, useEffect } from "react";

interface CheckBoxButtonProps {
  label?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
}

export default function CheckBoxButton({
  checked: controlledChecked,
  defaultChecked = false,
  onChange,
}: CheckBoxButtonProps) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);

  const isControlled = controlledChecked !== undefined;
  const isChecked = isControlled ? controlledChecked : internalChecked;

  useEffect(() => {
    if (!isControlled) {
      setInternalChecked(defaultChecked);
    }
  }, [defaultChecked, isControlled]);

  const toggleCheck = () => {
    const newValue = !isChecked;
    if (!isControlled) {
      setInternalChecked(newValue);
    }
    onChange?.(newValue);
  };

  return (
    <button
      type="button"
      onClick={toggleCheck}
      className={`rounded-c4 border flex items-center justify-center h-5 w-5 transition-colors duration-200 cursor-pointer
        ${isChecked ? "bg-[#FF715B] border-[#FF715B]" : "border-[#FF715B] bg-white"}
      `}
    >
      <span
        className={`relative flex h-5 w-5 items-center justify-center rounded-c4
          ${isChecked ? "border-white" : "border-black/20"}
        `}
      >
        {isChecked && (
          <span className="absolute w-2.5 h-1.5 border-b-2 border-l-2 border-white rotate-[-45deg]" />
        )}
      </span>
    </button>
  );
}
