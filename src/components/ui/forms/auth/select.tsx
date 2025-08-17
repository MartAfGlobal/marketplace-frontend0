import * as React from "react";
import { cn } from "@/lib/utils";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.ComponentProps<"select"> {
  options: SelectOption[];
  icon?: React.ReactNode;
  valid?: boolean; // for validation styling
  placeholder?: string; // optional placeholder text
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, icon, valid = true, placeholder, ...props }, ref) => {
    const selectClasses = cn(
      "h-c40 p-3.5 w-full rounded-c8 border outline-none md:text-sm appearance-none",
      valid
        ? "border-efefef focus:border-[#FF715B] focus:ring-2 focus:ring-ff715b"
        : "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500",
      "focus:ring-offset-0",
      className
    );

    return (
      <div className="relative w-full">
        <select
          className={selectClasses}
          ref={ref}
          {...props}
          defaultValue={placeholder ? "" : undefined} // set default if placeholder exists
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {icon && (
          <div className="absolute z-30 right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            {icon}
          </div>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export { Select };
