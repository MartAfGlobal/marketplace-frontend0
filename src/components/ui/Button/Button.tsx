import * as React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: "primary" | "secondary" | "danger";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, loading = false, variant = "primary", disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-c8 h-c44 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

    const variants = {
      primary: "bg-ff715b w-full text-white hover:bg-[#e05d4a] focus:ring-ff715b",
      secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-300",
      danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          baseStyles,
          variants[variant],
          disabled && "opacity-60 cursor-not-allowed",
          className
        )}
        {...props}
      >
        {loading ? "Loading..." : children}
      </button>
    );
  }
);

Button.displayName = "Button";
export { Button };
