"use client";

import { Alert, LoadingState, Select } from "@/src/components/ui";
import { formatCurrency } from "@/src/lib/format";
import { employeeMobileService } from "@/src/services";
import type { ContributionListingRow } from "@/src/types";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function EmployeeEpfPage() {
  const [periods, setPeriods] = useState<{ id: string; label: string }[]>([]);
  const [payrollId, setPayrollId] = useState("pay-2026-08");
  const [row, setRow] = useState<ContributionListingRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void employeeMobileService.listPayrollPeriods().then((list) => {
      setPeriods(list.map((p) => ({ id: p.id, label: p.label })));
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    void employeeMobileService.getEpf(payrollId).then((res) => {
      if (cancelled) return;
      setRow(res);
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
      <h1 className="text-xl font-semibold tracking-tight">EPF</h1>
      <Select
        label="Month"
        value={payrollId}
        onChange={(e) => setPayrollId(e.target.value)}
        options={periods.map((p) => ({ value: p.id, label: p.label }))}
      />
      <Alert tone="warning">Mock EPF amounts — rates TO BE CONFIRMED.</Alert>
      {loading ? (
        <LoadingState />
      ) : row ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <Row label="Employee portion" value={row.employeeAmount} />
          <Row label="Employer portion" value={row.employerAmount} />
          <Row label="Total" value={row.total} bold />
        </div>
      ) : (
        <p className="text-sm text-slate-500">No EPF row for this period.</p>
      )}
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
      className={`flex justify-between border-b border-slate-100 py-2.5 text-sm last:border-0 ${
        bold ? "font-semibold" : ""
      }`}
    >
      <span className={bold ? "" : "text-slate-500"}>{label}</span>
      <span>{formatCurrency(value)}</span>
    </div>
  );
}
