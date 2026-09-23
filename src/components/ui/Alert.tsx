import { cn } from "@/src/lib/cn";
import { AlertCircle, CheckCircle2, Info, TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";

type AlertTone = "info" | "success" | "warning" | "error";

const config: Record<
  AlertTone,
  { icon: typeof Info; className: string }
> = {
  info: { icon: Info, className: "border-sky-200 bg-sky-50 text-sky-900" },
  success: {
    icon: CheckCircle2,
    className: "border-emerald-200 bg-emerald-50 text-emerald-900",
  },
  warning: {
    icon: TriangleAlert,
    className: "border-amber-200 bg-amber-50 text-amber-950",
  },
  error: {
    icon: AlertCircle,
    className: "border-red-200 bg-red-50 text-red-900",
  },
};

interface AlertProps {
  tone?: AlertTone;
  title?: string;
  children: ReactNode;
  className?: string;
}

export function Alert({
  tone = "info",
  title,
  children,
  className,
}: AlertProps) {
  const { icon: Icon, className: toneClass } = config[tone];
  return (
    <div
      role="alert"
      className={cn(
        "flex gap-3 rounded-md border px-4 py-3 text-sm",
        toneClass,
        className,
      )}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div>
        {title ? <p className="font-medium">{title}</p> : null}
        <div className={cn(title && "mt-0.5 opacity-90")}>{children}</div>
      </div>
    </div>
  );
}
