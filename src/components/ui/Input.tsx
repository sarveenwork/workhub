import { cn } from "@/src/lib/cn";
import { InputHTMLAttributes, forwardRef } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id ?? props.name;
    return (
      <label className="flex flex-col gap-1.5 text-sm">
        {label ? (
          <span className="font-medium text-foreground">{label}</span>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "h-9 w-full rounded-md border border-input bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-destructive",
            className,
          )}
          {...props}
        />
        {error ? <span className="text-xs text-destructive">{error}</span> : null}
        {hint && !error ? (
          <span className="text-xs text-muted-foreground">{hint}</span>
        ) : null}
      </label>
    );
  },
);
Input.displayName = "Input";
