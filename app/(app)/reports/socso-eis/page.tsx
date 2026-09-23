"use client";

import { DemoBanner } from "@/src/components/shared/DemoBanner";
import { PageHeader } from "@/src/components/shared/PageHeader";
import {
  Button,
  Card,
  CardHeader,
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

export default function SocsoEisReportPage() {
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [payrollId, setPayrollId] = useState("pay-2026-08");
  const [socso, setSocso] = useState<ContributionListingRow[]>([]);
  const [eis, setEis] = useState<ContributionListingRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void payrollService.list().then(setPayrolls);
  }, []);

  useEffect(() => {
    let cancelled = false;
    void reportService.socsoEisListing(payrollId).then((data) => {
      if (cancelled) return;
      setSocso(data.socso);
      setEis(data.eis);
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
      `socso-eis-${payrollId}.csv`,
      ["Type", "Employee", "Employee ID", "Employee Amount", "Employer Amount", "Total"],
      [
        ...socso.map((r) => [
          "SOCSO",
          r.employeeName,
          r.employeeCode,
          r.employeeAmount,
          r.employerAmount,
          r.total,
        ]),
        ...eis.map((r) => [
          "EIS",
          r.employeeName,
          r.employeeCode,
          r.employeeAmount,
          r.employerAmount,
          r.total,
        ]),
      ],
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="SOCSO / EIS contribution listing"
        description="Mock contribution figures. Exact rates are TO BE CONFIRMED."
        actions={
          <Button size="sm" variant="outline" onClick={exportExcel}>
            <Download className="h-4 w-4" />
            Export SOCSO/EIS
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
        <div className="space-y-6">
          <Card>
            <CardHeader title="SOCSO" />
            <Table columns={columns} data={socso} rowKey={(r) => `s-${r.employeeId}`} />
          </Card>
          <Card>
            <CardHeader title="EIS" />
            <Table columns={columns} data={eis} rowKey={(r) => `e-${r.employeeId}`} />
          </Card>
        </div>
      )}
    </div>
  );
}
