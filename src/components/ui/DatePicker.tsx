import { cn } from "@/src/lib/cn";
import { InputHTMLAttributes, forwardRef } from "react";

export interface DatePickerProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  ({ className, label, id, ...props }, ref) => {
    const inputId = id ?? props.name;
    return (
      <label className="flex flex-col gap-1.5 text-sm">
        {label ? (
          <span className="font-medium text-foreground">{label}</span>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          type="date"
          className={cn(
            "h-9 w-full rounded-md border border-input bg-card px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            className,
          )}
          {...props}
        />
      </label>
    );
  },
);
DatePicker.displayName = "DatePicker";
