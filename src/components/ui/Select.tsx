import { cn } from "@/src/lib/cn";
import { SelectHTMLAttributes, forwardRef } from "react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, placeholder, id, ...props }, ref) => {
    const selectId = id ?? props.name;
    return (
      <label className="flex flex-col gap-1.5 text-sm">
        {label ? (
          <span className="font-medium text-foreground">{label}</span>
        ) : null}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            "h-9 w-full rounded-md border border-input bg-card px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          {...props}
        >
          {placeholder ? (
            <option value="">{placeholder}</option>
          ) : null}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>
    );
  },
);
Select.displayName = "Select";
