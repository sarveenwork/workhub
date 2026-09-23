"use client";

import { Badge, useToast } from "@/src/components/ui";
import { cn } from "@/src/lib/cn";
import { companyService } from "@/src/services";
import type { Company } from "@/src/types";
import { Building2, Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface CompanySwitcherProps {
  onSwitched?: (company: Company) => void;
  className?: string;
}

export function CompanySwitcher({ onSwitched, className }: CompanySwitcherProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [active, setActive] = useState<Company | null>(null);
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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
      // Reload so company-scoped pages refresh mock data
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
          "h-9 min-w-[10rem] animate-pulse rounded-md bg-muted",
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
          "flex max-w-[16rem] items-center gap-2 rounded-md border border-border bg-card px-2.5 py-1.5 text-left transition-colors",
          multi && "hover:bg-muted/60",
          !multi && "cursor-default opacity-90",
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded bg-teal-50 text-teal-800">
          <Building2 className="h-3.5 w-3.5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-xs font-semibold text-foreground">
            {active.name}
          </span>
          <span className="block truncate text-[10px] text-muted-foreground">
            {active.code} · {active.employeeCount} employees
          </span>
        </span>
        {multi ? (
          <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        ) : null}
      </button>

      {open ? (
        <div
          role="listbox"
          className="absolute left-0 z-50 mt-1 w-[min(100vw-2rem,20rem)] rounded-md border border-border bg-card py-1 shadow-lg"
        >
          <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Switch company
          </p>
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
                  "flex w-full items-start gap-2 px-3 py-2.5 text-left text-sm hover:bg-muted",
                  selected && "bg-muted/70",
                )}
              >
                <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center">
                  {selected ? (
                    <Check className="h-3.5 w-3.5 text-teal-700" />
                  ) : null}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-1.5">
                    <span className="font-medium">{company.name}</span>
                    <Badge tone="neutral">{company.code}</Badge>
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {company.address.split(",")[0]}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
