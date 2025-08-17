import * as React from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends React.ComponentProps<"textarea"> {
  valid?: boolean; // for validation styling
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, valid = true, ...props }, ref) => {
    const textareaClasses = cn(
      "h-c120 p-4 w-full rounded-c12 border outline-none resize-none md:text-sm",
      valid
        ? "border-efefef focus:border-[#FF715B] focus:ring-2 focus:ring-ff715b"
        : "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500",
      "focus:ring-offset-0",
      className
    );

    return (
      <textarea
        className={textareaClasses}
        ref={ref}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
