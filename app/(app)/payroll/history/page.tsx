"use client";

import { DemoBanner } from "@/src/components/shared/DemoBanner";
import { PageHeader } from "@/src/components/shared/PageHeader";
import { PayrollStatusBadge } from "@/src/components/shared/StatusBadges";
import { LoadingState, Table, type Column } from "@/src/components/ui";
import { formatCurrency, formatDateTime } from "@/src/lib/format";
import { payrollService } from "@/src/services";
import type { Payroll } from "@/src/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PayrollHistoryPage() {
  const router = useRouter();
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void payrollService.list().then((list) => {
      setPayrolls(
        list.filter((p) => p.status === "paid" || p.status === "approved"),
      );
      setLoading(false);
    });
  }, []);

  const columns: Column<Payroll>[] = [
    { key: "period", header: "Period", render: (r) => r.periodLabel },
    {
      key: "status",
      header: "Status",
      render: (r) => <PayrollStatusBadge status={r.status} />,
    },
    {
      key: "approved",
      header: "Approved",
      render: (r) => (r.approvedAt ? formatDateTime(r.approvedAt) : "—"),
    },
    {
      key: "paid",
      header: "Paid",
      render: (r) => (r.paidAt ? formatDateTime(r.paidAt) : "—"),
    },
    { key: "net", header: "Net", render: (r) => formatCurrency(r.totalNet) },
  ];

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payroll history"
        description="Approved and paid payroll periods."
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
