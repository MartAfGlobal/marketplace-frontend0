import * as React from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends React.ComponentProps<"textarea"> {
  valid?: boolean; // for validation styling
  autoResize?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, valid = true, autoResize = true, onChange, ...props }, ref) => {
    const innerRef = React.useRef<HTMLTextAreaElement>(null);
    React.useImperativeHandle(ref, () => innerRef.current!);

    const adjustHeight = () => {
      if (!autoResize) return;
      if (innerRef.current) {
        innerRef.current.style.height = "auto";
        innerRef.current.style.height = `${innerRef.current.scrollHeight}px`;
      }
    };

    React.useEffect(() => {
      adjustHeight();
    }, [autoResize]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      adjustHeight();
      onChange?.(e);
    };

    const textareaClasses = cn(
      "p-4 w-full max-w-full box-border rounded-c12 border outline-none md:text-sm resize-none whitespace-pre-wrap break-words",
      valid
        ? "border-efefef focus:border-ff715b focus:ring-1 focus:ring-ff715b"
        : "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500",
      "focus:ring-offset-0",
      className
    );

    return (
      <textarea
        className={textareaClasses}
        ref={innerRef}
        onChange={handleChange}
        rows={1}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
