"use client";

import { DemoBanner } from "@/src/components/shared/DemoBanner";
import { PageHeader } from "@/src/components/shared/PageHeader";
import { AttendanceStatusBadge } from "@/src/components/shared/StatusBadges";
import {
  Avatar,
  DatePicker,
  Input,
  LoadingState,
  Pagination,
  Select,
  Table,
  type Column,
} from "@/src/components/ui";
import { ATTENDANCE_STATUS_LABELS, DEMO_TODAY } from "@/src/lib/constants";
import { formatDate, formatTime } from "@/src/lib/format";
import { attendanceService, employeeService } from "@/src/services";
import type {
  AttendanceRecord,
  AttendanceStatus,
  Department,
  Employee,
} from "@/src/types";
import { useEffect, useMemo, useState } from "react";

export default function AttendanceRecordsPage() {
  const [date, setDate] = useState(DEMO_TODAY);
  const [month, setMonth] = useState("");
  const [status, setStatus] = useState<AttendanceStatus | "all">("all");
  const [departmentId, setDepartmentId] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<AttendanceRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    void employeeService.list({ pageSize: 100 }).then((r) => setEmployees(r.data));
    void employeeService.getDepartments().then(setDepartments);
  }, []);

  useEffect(() => {
    let cancelled = false;
    void attendanceService
      .list({
        date: month ? undefined : date,
        month: month || undefined,
        status,
        departmentId,
        search,
        page,
        pageSize: 15,
      })
      .then((res) => {
        if (cancelled) return;
        setRows(res.data);
        setTotal(res.total);
        setTotalPages(res.totalPages);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [date, month, status, departmentId, search, page]);

  const empMap = useMemo(
    () => Object.fromEntries(employees.map((e) => [e.id, e])),
    [employees],
  );

  const columns: Column<AttendanceRecord>[] = [
    {
      key: "date",
      header: "Date",
      render: (r) => formatDate(r.date),
    },
    {
      key: "employee",
      header: "Employee",
      render: (r) => {
        const emp = empMap[r.employeeId];
        return emp ? (
          <div className="flex items-center gap-2">
            <Avatar name={emp.fullName} size="sm" />
            <span className="font-medium">{emp.fullName}</span>
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
      key: "in",
      header: "Check-in",
      render: (r) => (r.checkIn ? formatTime(r.checkIn) : "—"),
    },
    {
      key: "out",
      header: "Check-out",
      render: (r) => (r.checkOut ? formatTime(r.checkOut) : "—"),
    },
    {
      key: "hours",
      header: "Total hours",
      render: (r) => (r.totalHours != null ? `${r.totalHours}h` : "—"),
    },
    {
      key: "ot",
      header: "OT hours",
      render: (r) => (r.overtimeHours ? `${r.overtimeHours}h` : "—"),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance records"
        description="Calendar/table hybrid view with filters for date, department and status."
      />
      <DemoBanner />

      <div className="grid gap-3 rounded-lg border border-border bg-card p-4 md:grid-cols-2 xl:grid-cols-5">
        <DatePicker
          label="Date"
          value={date}
          onChange={(e) => {
            setMonth("");
            setPage(1);
            setDate(e.target.value);
          }}
        />
        <Input
          label="Month (YYYY-MM)"
          placeholder="2026-09"
          value={month}
          onChange={(e) => {
            setPage(1);
            setMonth(e.target.value);
          }}
          hint="When set, overrides single date"
        />
        <Select
          label="Status"
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value as AttendanceStatus | "all");
          }}
          options={[
            { value: "all", label: "All statuses" },
            ...Object.entries(ATTENDANCE_STATUS_LABELS).map(([value, label]) => ({
              value,
              label,
            })),
          ]}
        />
        <Select
          label="Department"
          value={departmentId}
          onChange={(e) => {
            setPage(1);
            setDepartmentId(e.target.value);
          }}
          options={[
            { value: "all", label: "All departments" },
            ...departments.map((d) => ({ value: d.id, label: d.name })),
          ]}
        />
        <Input
          label="Search"
          placeholder="Employee name or ID"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />
      </div>

      {loading ? (
        <LoadingState />
      ) : (
        <>
          <Table columns={columns} data={rows} rowKey={(r) => r.id} />
          <Pagination
            page={page}
            totalPages={totalPages}
            total={total}
            pageSize={15}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
