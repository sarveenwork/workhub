"use client";

import { DemoBanner } from "@/src/components/shared/DemoBanner";
import { PageHeader } from "@/src/components/shared/PageHeader";
import {
  EmployeeStatusBadge,
  EmploymentTypeBadge,
} from "@/src/components/shared/StatusBadges";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  Input,
  LoadingState,
  Pagination,
  Select,
  Table,
  type Column,
} from "@/src/components/ui";
import {
  EMPLOYEE_STATUS_LABELS,
  EMPLOYMENT_TYPE_LABELS,
} from "@/src/lib/constants";
import { formatCurrency, formatDate } from "@/src/lib/format";
import { employeeService } from "@/src/services";
import type {
  Department,
  Employee,
  EmployeeStatus,
  EmploymentType,
  Position,
} from "@/src/types";
import { MoreHorizontal, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function EmployeesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<Employee[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [employmentType, setEmploymentType] = useState<EmploymentType | "all">(
    "all",
  );
  const [status, setStatus] = useState<EmployeeStatus | "all">("all");
  const [departmentId, setDepartmentId] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"name" | "joinDate" | "salary" | "employeeId">(
    "name",
  );
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);

  useEffect(() => {
    void employeeService.getDepartments().then(setDepartments);
    void employeeService.getPositions().then(setPositions);
  }, []);

  useEffect(() => {
    let cancelled = false;
    void employeeService
      .list({
        search,
        employmentType,
        status,
        departmentId,
        sortBy,
        page,
        pageSize: 10,
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
  }, [search, employmentType, status, departmentId, sortBy, page]);

  const positionMap = useMemo(
    () => Object.fromEntries(positions.map((p) => [p.id, p.title])),
    [positions],
  );

  const columns: Column<Employee>[] = [
    {
      key: "employee",
      header: "Employee",
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.fullName} src={row.avatarUrl} />
          <div>
            <p className="font-medium text-foreground">{row.fullName}</p>
            <p className="text-xs text-muted-foreground">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "employeeId",
      header: "Employee ID",
      render: (row) => (
        <span className="font-mono text-xs">{row.employeeId}</span>
      ),
    },
    {
      key: "position",
      header: "Position",
      render: (row) => positionMap[row.positionId] ?? "—",
    },
    {
      key: "type",
      header: "Employment Type",
      render: (row) => <EmploymentTypeBadge type={row.employmentType} />,
    },
    {
      key: "joinDate",
      header: "Join Date",
      render: (row) => formatDate(row.joinDate),
    },
    {
      key: "salary",
      header: "Basic Salary",
      render: (row) => formatCurrency(row.basicSalary),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <EmployeeStatusBadge status={row.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <Link href={`/employees/${row.id}`}>
            <Button variant="ghost" size="sm">
              View
            </Button>
          </Link>
          <Link href={`/employees/${row.id}?tab=overview`}>
            <Button variant="ghost" size="sm">
              Edit
            </Button>
          </Link>
          <Dropdown
            trigger={
              <Button variant="ghost" size="sm" aria-label="More actions">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            }
          >
            <DropdownItem onClick={() => router.push(`/employees/${row.id}?tab=attendance`)}>
              Attendance
            </DropdownItem>
            <DropdownItem onClick={() => router.push(`/employees/${row.id}?tab=payroll`)}>
              Payroll
            </DropdownItem>
            <DropdownItem onClick={() => router.push(`/employees/${row.id}`)}>
              More
            </DropdownItem>
          </Dropdown>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employees"
        description="Search, filter and manage workforce profiles."
        actions={
          <Button size="sm">
            <Plus className="h-4 w-4" />
            Add Employee
          </Button>
        }
      />
      <DemoBanner />

      <div className="grid gap-3 rounded-lg border border-border bg-card p-4 md:grid-cols-2 xl:grid-cols-5">
        <div className="relative xl:col-span-2">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search name, ID or email…"
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
          />
        </div>
        <Select
          label="Employment type"
          value={employmentType}
          onChange={(e) => {
            setPage(1);
            setEmploymentType(e.target.value as EmploymentType | "all");
          }}
          options={[
            { value: "all", label: "All types" },
            ...Object.entries(EMPLOYMENT_TYPE_LABELS).map(([value, label]) => ({
              value,
              label,
            })),
          ]}
        />
        <Select
          label="Status"
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value as EmployeeStatus | "all");
          }}
          options={[
            { value: "all", label: "All statuses" },
            ...Object.entries(EMPLOYEE_STATUS_LABELS).map(([value, label]) => ({
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
        <Select
          label="Sort by"
          value={sortBy}
          onChange={(e) =>
            setSortBy(e.target.value as typeof sortBy)
          }
          options={[
            { value: "name", label: "Name" },
            { value: "employeeId", label: "Employee ID" },
            { value: "joinDate", label: "Join date" },
            { value: "salary", label: "Basic salary" },
          ]}
        />
      </div>

      {loading ? (
        <LoadingState />
      ) : (
        <>
          <Table
            columns={columns}
            data={rows}
            rowKey={(r) => r.id}
            onRowClick={(r) => router.push(`/employees/${r.id}`)}
          />
          <Pagination
            page={page}
            totalPages={totalPages}
            total={total}
            pageSize={10}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
