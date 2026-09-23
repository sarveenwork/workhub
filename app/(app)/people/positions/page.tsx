"use client";

import { DemoBanner } from "@/src/components/shared/DemoBanner";
import { PageHeader } from "@/src/components/shared/PageHeader";
import { LoadingState, Table, type Column } from "@/src/components/ui";
import { employeeService } from "@/src/services";
import type { Department, Position } from "@/src/types";
import { useEffect, useMemo, useState } from "react";

export default function PositionsPage() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      employeeService.getPositions(),
      employeeService.getDepartments(),
    ]).then(([p, d]) => {
      setPositions(p);
      setDepartments(d);
      setLoading(false);
    });
  }, []);

  const deptMap = useMemo(
    () => Object.fromEntries(departments.map((d) => [d.id, d.name])),
    [departments],
  );

  const columns: Column<Position>[] = [
    { key: "code", header: "Code", render: (r) => r.code },
    { key: "title", header: "Position", render: (r) => r.title },
    {
      key: "dept",
      header: "Department",
      render: (r) => deptMap[r.departmentId] ?? "—",
    },
  ];

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Positions"
        description="Includes Security Guard, PO, PPO, RG and office roles."
      />
      <DemoBanner />
      <Table columns={columns} data={positions} rowKey={(r) => r.id} />
    </div>
  );
}
