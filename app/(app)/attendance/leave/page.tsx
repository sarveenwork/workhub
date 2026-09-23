"use client";

import { DemoBanner } from "@/src/components/shared/DemoBanner";
import { PageHeader } from "@/src/components/shared/PageHeader";
import { AttendanceStatusBadge } from "@/src/components/shared/StatusBadges";
import { LoadingState, Table, type Column, Alert } from "@/src/components/ui";
import { formatDate } from "@/src/lib/format";
import { attendanceService, employeeService } from "@/src/services";
import type { AttendanceRecord, Employee } from "@/src/types";
import { useEffect, useMemo, useState } from "react";

export default function LeavePage() {
  const [rows, setRows] = useState<AttendanceRecord[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const [paid, unpaid, emp] = await Promise.all([
        attendanceService.list({ status: "paid_leave", pageSize: 50 }),
        attendanceService.list({ status: "unpaid_leave", pageSize: 50 }),
        employeeService.list({ pageSize: 100 }),
      ]);
      if (cancelled) return;
      setRows([...paid.data, ...unpaid.data].sort((a, b) => b.date.localeCompare(a.date)));
      setEmployees(emp.data);
      setLoading(false);
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const empMap = useMemo(
    () => Object.fromEntries(employees.map((e) => [e.id, e])),
    [employees],
  );

  const columns: Column<AttendanceRecord>[] = [
    { key: "date", header: "Date", render: (r) => formatDate(r.date) },
    {
      key: "employee",
      header: "Employee",
      render: (r) => empMap[r.employeeId]?.fullName ?? r.employeeId,
    },
    {
      key: "status",
      header: "Leave type",
      render: (r) => <AttendanceStatusBadge status={r.status} />,
    },
    { key: "notes", header: "Notes", render: (r) => r.notes ?? "—" },
  ];

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leave"
        description="Paid and unpaid leave records. Absence is treated as unpaid leave for payroll impact (see business rules)."
      />
      <DemoBanner />
      <Alert tone="info" title="Salary impact">
        Unpaid leave deductions shown in payroll are mock values. Exact
        proration and calculation rules are TO BE CONFIRMED and will live in the
        backend payroll engine.
      </Alert>
      <Table columns={columns} data={rows} rowKey={(r) => r.id} />
    </div>
  );
}
