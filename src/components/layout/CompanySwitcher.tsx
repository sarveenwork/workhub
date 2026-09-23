"use client";

import { useToast } from "@/src/components/ui";
import { cn } from "@/src/lib/cn";
import { companyService } from "@/src/services";
import type { Company } from "@/src/types";
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface CompanySwitcherProps {
  onSwitched?: (company: Company) => void;
  className?: string;
  /** Sidebar uses dark styling; default is light (header). */
  variant?: "sidebar" | "light";
}

export function CompanySwitcher({
  onSwitched,
  className,
  variant = "light",
}: CompanySwitcherProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [active, setActive] = useState<Company | null>(null);
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const sidebar = variant === "sidebar";

  useEffect(() => {
    let cancelled = false;
    void Promise.all([
      companyService.listAccessible(),
      companyService.getActive(),
    ]).then(([list, current]) => {
      if (cancelled) return;
      setCompanies(list);
      setActive(current);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  async function selectCompany(company: Company) {
    if (company.id === active?.id || busy) return;
    setBusy(true);
    try {
      const next = await companyService.switchTo(company.id);
      setActive(next);
      setOpen(false);
      toast({
        title: `Switched to ${next.name}`,
        description: "Employee lists and settings now use this company.",
        tone: "success",
      });
      onSwitched?.(next);
      window.location.reload();
    } catch (err) {
      toast({
        title: "Could not switch company",
        description: err instanceof Error ? err.message : "Unknown error",
        tone: "error",
      });
      setBusy(false);
    }
  }

  if (!active) {
    return (
      <div
        className={cn(
          "h-9 animate-pulse rounded-md",
          sidebar ? "bg-sidebar-accent" : "bg-muted",
          className,
        )}
      />
    );
  }

  const multi = companies.length > 1;

  return (
    <div className={cn("relative", className)} ref={ref}>
      <button
        type="button"
        disabled={!multi || busy}
        onClick={() => multi && setOpen((v) => !v)}
        className={cn(
          "flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left transition-colors",
          sidebar
            ? "text-sidebar-foreground hover:bg-sidebar-accent"
            : "border border-border bg-card hover:bg-muted/60",
          !multi && "cursor-default",
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Switch company"
      >
        <span
          className={cn(
            "min-w-0 flex-1 truncate text-sm font-medium",
            sidebar ? "text-white" : "text-foreground",
          )}
        >
          {active.name}
        </span>
        {multi ? (
          <ChevronsUpDown
            className={cn(
              "h-3.5 w-3.5 shrink-0",
              sidebar ? "text-sidebar-muted" : "text-muted-foreground",
            )}
          />
        ) : null}
      </button>

      {open ? (
        <div
          role="listbox"
          className={cn(
            "absolute z-50 mt-1 w-full min-w-[12rem] rounded-md border py-1 shadow-lg",
            sidebar
              ? "left-0 border-sidebar-border bg-slate-900"
              : "left-0 border-border bg-card",
          )}
        >
          {companies.map((company) => {
            const selected = company.id === active.id;
            return (
              <button
                key={company.id}
                type="button"
                role="option"
                aria-selected={selected}
                disabled={busy}
                onClick={() => selectCompany(company)}
                className={cn(
                  "flex w-full items-center gap-2 px-3 py-2 text-left text-sm",
                  sidebar
                    ? "text-sidebar-foreground hover:bg-sidebar-accent"
                    : "hover:bg-muted",
                  selected && (sidebar ? "bg-sidebar-accent" : "bg-muted/70"),
                )}
              >
                <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center">
                  {selected ? (
                    <Check className="h-3.5 w-3.5 text-teal-400" />
                  ) : null}
                </span>
                <span
                  className={cn(
                    "min-w-0 flex-1 truncate font-medium",
                    sidebar && "text-white",
                  )}
                >
                  {company.name}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
