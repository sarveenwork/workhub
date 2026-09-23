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
import { payrollService, reportService } from "@/src/services";
import type { MonthlyPayrollSummaryRow, Payroll } from "@/src/types";
import { Download } from "lucide-react";
import { useEffect, useState } from "react";

export default function PayrollSummaryReportPage() {
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [payrollId, setPayrollId] = useState("pay-2026-09");
  const [rows, setRows] = useState<MonthlyPayrollSummaryRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void payrollService.list().then((list) => {
      setPayrolls(list);
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    void reportService.monthlyPayrollSummary(payrollId).then((data) => {
      if (cancelled) return;
      setRows(data);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [payrollId]);

  const columns: Column<MonthlyPayrollSummaryRow>[] = [
    {
      key: "employee",
      header: "Employee",
      render: (r) => (
        <div>
          <p className="font-medium">{r.employeeName}</p>
          <p className="text-xs text-muted-foreground">{r.employeeCode}</p>
        </div>
      ),
    },
    { key: "basic", header: "Basic", render: (r) => formatCurrency(r.basicSalary) },
    { key: "ot", header: "OT", render: (r) => formatCurrency(r.overtime) },
    {
      key: "allow",
      header: "Allowances",
      render: (r) => formatCurrency(r.allowances),
    },
    { key: "gross", header: "Gross", render: (r) => formatCurrency(r.grossSalary) },
    { key: "epf", header: "EPF", render: (r) => formatCurrency(r.epf) },
    { key: "socso", header: "SOCSO", render: (r) => formatCurrency(r.socso) },
    { key: "eis", header: "EIS", render: (r) => formatCurrency(r.eis) },
    { key: "tax", header: "Tax", render: (r) => formatCurrency(r.tax) },
    {
      key: "ul",
      header: "Unpaid leave",
      render: (r) => formatCurrency(r.unpaidLeave),
    },
    { key: "net", header: "Net", render: (r) => formatCurrency(r.netSalary) },
    {
      key: "cost",
      header: "Employer cost",
      render: (r) => formatCurrency(r.employerCost),
    },
  ];

  function exportExcel() {
    reportService.exportCsv(
      `payroll-summary-${payrollId}.csv`,
      [
        "Employee",
        "Employee ID",
        "Basic",
        "OT",
        "Allowances",
        "Gross",
        "EPF",
        "SOCSO",
        "EIS",
        "Tax",
        "Unpaid Leave",
        "Net",
        "Employer Cost",
      ],
      rows.map((r) => [
        r.employeeName,
        r.employeeCode,
        r.basicSalary,
        r.overtime,
        r.allowances,
        r.grossSalary,
        r.epf,
        r.socso,
        r.eis,
        r.tax,
        r.unpaidLeave,
        r.netSalary,
        r.employerCost,
      ]),
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Monthly payroll summary"
        description="Exportable demo report. Production Excel generation belongs on the backend."
        actions={
          <Button size="sm" variant="outline" onClick={exportExcel}>
            <Download className="h-4 w-4" />
            Export Excel
          </Button>
        }
      />
      <DemoBanner />
      <Select
        label="Payroll period"
        value={payrollId}
        onChange={(e) => setPayrollId(e.target.value)}
        options={payrolls.map((p) => ({
          value: p.id,
          label: `${p.periodLabel} (${p.status})`,
        }))}
      />
      {loading ? (
        <LoadingState />
      ) : (
        <Table columns={columns} data={rows} rowKey={(r) => r.employeeId} />
      )}
    </div>
  );
}
