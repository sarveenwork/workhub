"use client";

import { DemoBanner } from "@/src/components/shared/DemoBanner";
import { PageHeader } from "@/src/components/shared/PageHeader";
import { LoadingState, Table, type Column } from "@/src/components/ui";
import { employeeService } from "@/src/services";
import type { Department } from "@/src/types";
import { useEffect, useState } from "react";

export default function DepartmentsPage() {
  const [rows, setRows] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void employeeService.getDepartments().then((d) => {
      setRows(d);
      setLoading(false);
    });
  }, []);

  const columns: Column<Department>[] = [
    { key: "code", header: "Code", render: (r) => r.code },
    { key: "name", header: "Department", render: (r) => r.name },
    {
      key: "count",
      header: "Employees (approx)",
      render: (r) => r.employeeCount,
    },
  ];

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Departments"
        description="Organizational units used for filtering employees and attendance."
      />
      <DemoBanner />
      <Table columns={columns} data={rows} rowKey={(r) => r.id} />
    </div>
  );
}
