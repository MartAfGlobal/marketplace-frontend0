import * as React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: "primary" | "secondary" | "danger" | "secodary danger";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, loading = false, variant = "primary", disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center p-4 justify-center rounded-c8 h-c44 font-MontserratMedium text-sm  transition-colors focus:outline-none ";

    const variants = {
      primary: "bg-ff715b w-full text-white hover:bg-[#e05d4a]  focus:ring-ff715b",
      secondary: "border border-ff715b text-ff715b w-full",
      danger: "bg-[#CA0202] text-white hover:bg-[#CA0202]/68 ",
      "secodary danger": "border border-[#CA0202] text-[#CA0202] "
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
