import * as React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.ComponentProps<"input"> {
  icon?: React.ReactNode;
  valid?: boolean; // Add this prop
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, valid = true, ...props }, ref) => {
    const inputClasses = cn(
      "h-c48 p-3.5 w-full rounded-c8 border outline-none md:text-sm",
      valid ? "border-efefef focus:border-ff715b focus:ring-1 focus:ring-ff715b" : "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500",
      "focus:ring-offset-0",
      className
    );

    return (
      <div className="relative w-full">
        <input
          type={type}
          className={inputClasses}
          ref={ref}
          {...props}
        />
        {icon && (
          <div className="absolute z-30 right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export { Input };
