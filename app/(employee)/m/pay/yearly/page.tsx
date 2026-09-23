"use client";

import { Alert, LoadingState } from "@/src/components/ui";
import { formatCurrency } from "@/src/lib/format";
import { employeeMobileService } from "@/src/services";
import type { YearlyPayrollMonth } from "@/src/types";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function EmployeeYearlyPayPage() {
  const [months, setMonths] = useState<YearlyPayrollMonth[]>([]);
  const [totals, setTotals] = useState<YearlyPayrollMonth | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void employeeMobileService.getYearlySummary(2026).then((res) => {
      if (cancelled) return;
      setMonths(res.months.filter((m) => m.grossSalary > 0 || m.month <= 9));
      setTotals(res.totals);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-4">
      <Link href="/m/pay" className="text-xs text-teal-800">
        ← My pay
      </Link>
      <h1 className="text-xl font-semibold tracking-tight">Yearly summary</h1>
      <p className="text-sm text-slate-500">2026 · your payroll by month</p>
      <Alert tone="warning">Demo figures only.</Alert>

      {loading || !totals ? (
        <LoadingState />
      ) : (
        <>
          <div className="rounded-2xl bg-slate-900 p-4 text-white">
            <p className="text-xs text-slate-400">Year net total</p>
            <p className="mt-1 text-2xl font-semibold">
              {formatCurrency(totals.netSalary)}
            </p>
          </div>
          <div className="space-y-2">
            {months.map((m) => (
              <div
                key={m.month}
                className="rounded-xl border border-slate-200 bg-white px-3.5 py-3"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{m.label}</p>
                  <p className="text-sm font-semibold">
                    {formatCurrency(m.netSalary)}
                  </p>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Gross {formatCurrency(m.grossSalary)} · Deductions{" "}
                  {formatCurrency(m.deductions)}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
