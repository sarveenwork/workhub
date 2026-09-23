"use client";

import { DemoBanner } from "@/src/components/shared/DemoBanner";
import { PageHeader } from "@/src/components/shared/PageHeader";
import {
  Button,
  LoadingState,
  Select,
  Table,
  type Column,
} from "@/src/components/ui";
import { formatCurrency } from "@/src/lib/format";
import { employeeService, reportService } from "@/src/services";
import type { Employee, YearlyPayrollMonth } from "@/src/types";
import { Download } from "lucide-react";
import { useEffect, useState } from "react";

export default function YearlySummaryReportPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeeId, setEmployeeId] = useState("emp-001");
  const [year, setYear] = useState("2026");
  const [months, setMonths] = useState<YearlyPayrollMonth[]>([]);
  const [totals, setTotals] = useState<YearlyPayrollMonth | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void employeeService.list({ pageSize: 100 }).then((r) => {
      setEmployees(r.data.filter((e) => e.status !== "resigned"));
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    void reportService
      .yearlyPayrollSummary(employeeId, Number(year))
      .then((res) => {
        if (cancelled) return;
        setMonths(res.months);
        setTotals(res.totals);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [employeeId, year]);

  const columns: Column<YearlyPayrollMonth>[] = [
    { key: "month", header: "Month", render: (r) => r.label },
    {
      key: "basic",
      header: "Basic",
      render: (r) => formatCurrency(r.basicSalary),
    },
    { key: "ot", header: "OT", render: (r) => formatCurrency(r.overtime) },
    {
      key: "allow",
      header: "Allowances",
      render: (r) => formatCurrency(r.allowances),
    },
    {
      key: "gross",
      header: "Gross",
      render: (r) => formatCurrency(r.grossSalary),
    },
    {
      key: "ded",
      header: "Deductions",
      render: (r) => formatCurrency(r.deductions),
    },
    { key: "net", header: "Net", render: (r) => formatCurrency(r.netSalary) },
    {
      key: "cost",
      header: "Employer cost",
      render: (r) => formatCurrency(r.employerCost),
    },
  ];

  function exportExcel() {
    const all = totals ? [...months, totals] : months;
    reportService.exportCsv(
      `yearly-summary-${employeeId}-${year}.csv`,
      ["Month", "Basic", "OT", "Allowances", "Gross", "Deductions", "Net", "Employer Cost"],
      all.map((r) => [
        r.label,
        r.basicSalary,
        r.overtime,
        r.allowances,
        r.grossSalary,
        r.deductions,
        r.netSalary,
        r.employerCost,
      ]),
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Individual yearly payroll summary"
        description="Months without generated payroll show zero in this demo dataset."
        actions={
          <Button size="sm" variant="outline" onClick={exportExcel}>
            <Download className="h-4 w-4" />
            Export Yearly Summary
          </Button>
        }
      />
      <DemoBanner />
      <div className="grid gap-3 sm:grid-cols-2">
        <Select
          label="Employee"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          options={employees.map((e) => ({
            value: e.id,
            label: `${e.fullName} (${e.employeeId})`,
          }))}
        />
        <Select
          label="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          options={[
            { value: "2026", label: "2026" },
            { value: "2025", label: "2025" },
          ]}
        />
      </div>
      {loading ? (
        <LoadingState />
      ) : (
        <Table columns={columns} data={months} rowKey={(r) => String(r.month)} />
      )}
      {totals ? (
        <div className="rounded-lg border border-border bg-card p-4 text-sm">
          <p className="font-semibold">Yearly totals</p>
          <p className="mt-2 text-muted-foreground">
            Net {formatCurrency(totals.netSalary)} · Employer cost{" "}
            {formatCurrency(totals.employerCost)}
          </p>
        </div>
      ) : null}
    </div>
  );
}
