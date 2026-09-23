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
import type { ContributionListingRow, Payroll } from "@/src/types";
import { Download } from "lucide-react";
import { useEffect, useState } from "react";

export default function EpfReportPage() {
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [payrollId, setPayrollId] = useState("pay-2026-08");
  const [rows, setRows] = useState<ContributionListingRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void payrollService.list().then(setPayrolls);
  }, []);

  useEffect(() => {
    let cancelled = false;
    void reportService.epfListing(payrollId).then((data) => {
      if (cancelled) return;
      setRows(data);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [payrollId]);

  const columns: Column<ContributionListingRow>[] = [
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
    {
      key: "employeeAmt",
      header: "Employee",
      render: (r) => formatCurrency(r.employeeAmount),
    },
    {
      key: "employerAmt",
      header: "Employer",
      render: (r) => formatCurrency(r.employerAmount),
    },
    { key: "total", header: "Total", render: (r) => formatCurrency(r.total) },
  ];

  function exportExcel() {
    reportService.exportCsv(
      `epf-${payrollId}.csv`,
      ["Employee", "Employee ID", "Employee Amount", "Employer Amount", "Total"],
      rows.map((r) => [
        r.employeeName,
        r.employeeCode,
        r.employeeAmount,
        r.employerAmount,
        r.total,
      ]),
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="EPF contribution listing"
        description="Mock EPF amounts for demo. Statutory rates are TO BE CONFIRMED."
        actions={
          <Button size="sm" variant="outline" onClick={exportExcel}>
            <Download className="h-4 w-4" />
            Export EPF
          </Button>
        }
      />
      <DemoBanner />
      <Select
        label="Month"
        value={payrollId}
        onChange={(e) => setPayrollId(e.target.value)}
        options={payrolls.map((p) => ({
          value: p.id,
          label: p.periodLabel,
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
