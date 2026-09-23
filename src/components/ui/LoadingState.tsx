import { cn } from "@/src/lib/cn";

export function LoadingState({
  label = "Loading…",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-16 text-sm text-muted-foreground",
        className,
      )}
    >
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-r-transparent" />
      {label}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-slate-200/80", className)}
    />
  );
}
