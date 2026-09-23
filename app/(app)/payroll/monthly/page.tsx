"use client";

import { DemoBanner } from "@/src/components/shared/DemoBanner";
import { PageHeader } from "@/src/components/shared/PageHeader";
import { PayrollStatusBadge } from "@/src/components/shared/StatusBadges";
import { LoadingState, Table, type Column } from "@/src/components/ui";
import { formatCurrency } from "@/src/lib/format";
import { payrollService } from "@/src/services";
import type { Payroll } from "@/src/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function MonthlyPayrollPage() {
  const router = useRouter();
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void payrollService.list().then((list) => {
      setPayrolls(list);
      setLoading(false);
    });
  }, []);

  const columns: Column<Payroll>[] = [
    { key: "period", header: "Month", render: (r) => r.periodLabel },
    {
      key: "status",
      header: "Status",
      render: (r) => <PayrollStatusBadge status={r.status} />,
    },
    { key: "count", header: "Employees", render: (r) => r.employeeCount },
    {
      key: "gross",
      header: "Gross",
      render: (r) => formatCurrency(r.totalGross),
    },
    { key: "net", header: "Net", render: (r) => formatCurrency(r.totalNet) },
    {
      key: "employer",
      header: "Employer contributions",
      render: (r) => formatCurrency(r.totalEmployerContributions),
    },
    {
      key: "cost",
      header: "Employer cost",
      render: (r) => formatCurrency(r.totalEmployerCost),
    },
  ];

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Monthly payroll"
        description="All payroll periods available in the demo dataset."
      />
      <DemoBanner />
      <Table
        columns={columns}
        data={payrolls}
        rowKey={(r) => r.id}
        onRowClick={(r) => router.push(`/payroll/${r.id}`)}
      />
    </div>
  );
}
