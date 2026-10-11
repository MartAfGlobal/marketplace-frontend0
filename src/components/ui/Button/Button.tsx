import * as React from "react";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "../loading-spinner";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: "primary" | "secondary" | "danger" | "secodary danger";
  color?: "white" | "ff715b"
}

// Shared primitive button used across the app. This keeps the UI consistent without
// repeating the same sizing and color rules in every page. The intent is to centralize
// stateful affordances like loading/disabled behavior while leaving styling decisions to
// each calling component via the `variant` and `className` props.
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, loading = false, variant = "primary", disabled, ...props }, ref) => {
    // Base styles keep every button horizontally aligned and visually similar. We intentionally
    // keep spacing, height, and typography in one place so product pages and auth pages look
    // consistent even when they use different backgrounds or containers.
    const baseStyles =
      "inline-flex items-center p-4 justify-center rounded-c8 h-c44 font-MontserratMedium text-sm  transition-colors focus:outline-none ";

    // Variant map is intentionally small and explicit so developers can reason about supported UI
    // states without digging through CSS files. Each value is meant to be a reusable semantic variant,
    // not a free-form class override.
    const variants = {
      primary: "bg-ff715b w-full text-white hover:bg-[#e05d4a]  focus:ring-ff715b",
      secondary: "border border-ff715b text-ff715b w-full",
      danger: "bg-[#CA0202] text-white hover:bg-[#CA0202]/68 ",
      "secodary danger": "border border-[#CA0202] text-[#CA0202] "
    };

    return (
      <button
        ref={ref}
        // The button treats `loading` as a stronger state than `disabled`: users cannot click while
        // a request is still in progress, and we also prevent duplicate submits at the UI level.
        disabled={disabled || loading}
        className={cn(
          baseStyles,
          variants[variant],
          disabled && "opacity-60 cursor-not-allowed",
          className
        )}
        {...props}
      >
        {loading ? <LoadingSpinner color=""/>  : children}
      </button>
    );
  }
);

Button.displayName = "Button";
export { Button };
