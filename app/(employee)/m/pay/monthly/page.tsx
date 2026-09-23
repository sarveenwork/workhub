"use client";

import { Alert, LoadingState, Select } from "@/src/components/ui";
import { formatCurrency } from "@/src/lib/format";
import { employeeMobileService } from "@/src/services";
import type { PayrollItem } from "@/src/types";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";

export default function EmployeeMonthlyPayPage() {
  const [periods, setPeriods] = useState<{ id: string; label: string }[]>([]);
  const [payrollId, setPayrollId] = useState("pay-2026-09");
  const [data, setData] = useState<{
    periodLabel: string;
    item: PayrollItem;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void employeeMobileService.listPayrollPeriods().then((list) => {
      setPeriods(list.map((p) => ({ id: p.id, label: p.label })));
      if (list[0]) setPayrollId(list[0].id);
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    void employeeMobileService.getMonthlyPayslip(payrollId).then((res) => {
      if (cancelled) return;
      setData(res);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [payrollId]);

  return (
    <div className="space-y-4">
      <Link href="/m/pay" className="text-xs text-teal-800">
        ← My pay
      </Link>
      <h1 className="text-xl font-semibold tracking-tight">Monthly payslip</h1>

      <Select
        label="Period"
        value={payrollId}
        onChange={(e) => setPayrollId(e.target.value)}
        options={periods.map((p) => ({ value: p.id, label: p.label }))}
      />

      <Alert tone="warning">Demo figures — not statutory calculations.</Alert>

      {loading || !data ? (
        <LoadingState />
      ) : (
        <div className="space-y-3">
          <Section title="Earnings">
            <Row label="Basic" value={data.item.basicSalary} />
            <Row label="Overtime" value={data.item.overtime} />
            {data.item.allowances.map((a) => (
              <Row key={a.label} label={a.label} value={a.amount} />
            ))}
            <Row label="Gross" value={data.item.grossSalary} bold />
          </Section>
          <Section title="Deductions">
            {data.item.deductions.map((d) => (
              <Row key={d.label} label={d.label} value={d.amount} />
            ))}
            <Row label="Total deductions" value={data.item.totalDeductions} bold />
          </Section>
          <Section title="Net">
            <Row label="Net salary" value={data.item.netSalary} bold />
          </Section>
        </div>
      )}
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-sm font-semibold">{title}</h2>
      <div className="mt-2 divide-y divide-slate-100">{children}</div>
    </div>
  );
}

function Row({
  label,
  value,
  bold,
}: {
  label: string;
  value: number;
  bold?: boolean;
}) {
  return (
    <div
      className={`flex justify-between gap-3 py-2 text-sm ${bold ? "font-semibold" : ""}`}
    >
      <span className={bold ? "" : "text-slate-500"}>{label}</span>
      <span>{formatCurrency(value)}</span>
    </div>
  );
}
