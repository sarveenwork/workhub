"use client";

import { Alert, LoadingState, Select } from "@/src/components/ui";
import { formatCurrency } from "@/src/lib/format";
import { employeeMobileService } from "@/src/services";
import type { ContributionListingRow } from "@/src/types";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function EmployeeSocsoPage() {
  const [periods, setPeriods] = useState<{ id: string; label: string }[]>([]);
  const [payrollId, setPayrollId] = useState("pay-2026-08");
  const [socso, setSocso] = useState<ContributionListingRow | null>(null);
  const [eis, setEis] = useState<ContributionListingRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void employeeMobileService.listPayrollPeriods().then((list) => {
      setPeriods(list.map((p) => ({ id: p.id, label: p.label })));
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    void employeeMobileService.getSocsoEis(payrollId).then((res) => {
      if (cancelled) return;
      setSocso(res.socso);
      setEis(res.eis);
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
      <h1 className="text-xl font-semibold tracking-tight">SOCSO & EIS</h1>
      <Select
        label="Month"
        value={payrollId}
        onChange={(e) => setPayrollId(e.target.value)}
        options={periods.map((p) => ({ value: p.id, label: p.label }))}
      />
      <Alert tone="warning">Mock amounts — rates TO BE CONFIRMED.</Alert>
      {loading ? (
        <LoadingState />
      ) : (
        <div className="space-y-3">
          <Block title="SOCSO" row={socso} />
          <Block title="EIS" row={eis} />
        </div>
      )}
    </div>
  );
}

function Block({
  title,
  row,
}: {
  title: string;
  row: ContributionListingRow | null;
}) {
  if (!row) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
        No {title} data.
      </div>
    );
  }
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-sm font-semibold">{title}</h2>
      <div className="mt-2">
        <Row label="Employee" value={row.employeeAmount} />
        <Row label="Employer" value={row.employerAmount} />
        <Row label="Total" value={row.total} bold />
      </div>
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
      className={`flex justify-between border-b border-slate-100 py-2 text-sm last:border-0 ${
        bold ? "font-semibold" : ""
      }`}
    >
      <span className={bold ? "" : "text-slate-500"}>{label}</span>
      <span>{formatCurrency(value)}</span>
    </div>
  );
}
