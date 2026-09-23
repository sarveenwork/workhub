"use client";

import { DemoBanner } from "@/src/components/shared/DemoBanner";
import { PageHeader } from "@/src/components/shared/PageHeader";
import { AttendanceStatusBadge } from "@/src/components/shared/StatusBadges";
import {
  Avatar,
  Card,
  LoadingState,
  StatCard,
  Table,
  type Column,
} from "@/src/components/ui";
import { DEMO_TODAY } from "@/src/lib/constants";
import { formatDate, formatTime } from "@/src/lib/format";
import { attendanceService, employeeService } from "@/src/services";
import type {
  AttendanceOverview,
  AttendanceRecord,
  Employee,
} from "@/src/types";
import {
  AlertTriangle,
  ClipboardCheck,
  Palmtree,
  UserX,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export default function AttendanceTodayPage() {
  const [overview, setOverview] = useState<(AttendanceOverview & { date: string }) | null>(
    null,
  );
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const [o, list, empPage] = await Promise.all([
        attendanceService.getTodayOverview(),
        attendanceService.list({ date: DEMO_TODAY, pageSize: 50 }),
        employeeService.list({ pageSize: 100 }),
      ]);
      if (cancelled) return;
      setOverview(o);
      setRecords(list.data);
      setEmployees(empPage.data);
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
    {
      key: "employee",
      header: "Employee",
      render: (r) => {
        const emp = empMap[r.employeeId];
        return emp ? (
          <div className="flex items-center gap-2">
            <Avatar name={emp.fullName} size="sm" />
            <div>
              <p className="font-medium">{emp.fullName}</p>
              <p className="text-xs text-muted-foreground">{emp.employeeId}</p>
            </div>
          </div>
        ) : (
          r.employeeId
        );
      },
    },
    {
      key: "status",
      header: "Status",
      render: (r) => <AttendanceStatusBadge status={r.status} />,
    },
    {
      key: "range",
      header: "Time",
      render: (r) => {
        if (!r.checkIn) return <span className="text-muted-foreground">No check-in</span>;
        return (
          <span>
            {formatTime(r.checkIn)}
            {r.checkOut ? ` → ${formatTime(r.checkOut)}` : " → …"}
          </span>
        );
      },
    },
    {
      key: "hours",
      header: "Hours",
      render: (r) => (r.totalHours != null ? `${r.totalHours}h` : "—"),
    },
    {
      key: "ot",
      header: "OT",
      render: (r) => (r.overtimeHours ? `${r.overtimeHours}h` : "—"),
    },
    { key: "notes", header: "Notes", render: (r) => r.notes ?? "—" },
  ];

  if (loading || !overview) return <LoadingState />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Today’s attendance"
        description={`${formatDate(overview.date, {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })}`}
      />
      <DemoBanner />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Present" value={overview.present} icon={ClipboardCheck} tone="success" />
        <StatCard label="Late" value={overview.late} icon={AlertTriangle} tone="warning" />
        <StatCard label="Absent" value={overview.absent} icon={UserX} tone="danger" />
        <StatCard label="On Leave" value={overview.leave} icon={Palmtree} tone="info" />
      </div>

      <Card padding={false} className="overflow-hidden p-0">
        <div className="border-b border-border px-4 py-3">
          <h3 className="text-sm font-semibold">Daily roster</h3>
          <p className="text-xs text-muted-foreground">
            Late and absent rows are highlighted via status badges.
          </p>
        </div>
        <div className="p-4">
          <Table columns={columns} data={records} rowKey={(r) => r.id} />
        </div>
      </Card>
    </div>
  );
}
