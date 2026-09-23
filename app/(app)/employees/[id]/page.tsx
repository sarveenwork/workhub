"use client";

import { DemoBanner } from "@/src/components/shared/DemoBanner";
import { PageHeader } from "@/src/components/shared/PageHeader";
import {
  AttendanceStatusBadge,
  EmployeeStatusBadge,
  EmploymentTypeBadge,
  PayrollStatusBadge,
} from "@/src/components/shared/StatusBadges";
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  CardHeader,
  LoadingState,
  Table,
  Tabs,
  type Column,
  type TabItem,
} from "@/src/components/ui";
import { ALLOWANCE_TYPE_LABELS } from "@/src/lib/constants";
import {
  formatCurrency,
  formatDate,
  formatTime,
  maskBankAccount,
  maskIc,
} from "@/src/lib/format";
import {
  attendanceService,
  employeeService,
  payrollService,
} from "@/src/services";
import type {
  Allowance,
  AttendanceRecord,
  Department,
  Employee,
  Payroll,
  PayrollItem,
  Position,
} from "@/src/types";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState, type ReactNode } from "react";

export default function EmployeeDetailPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <EmployeeDetailContent />
    </Suspense>
  );
}

function EmployeeDetailContent() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") ?? "overview";

  const [tab, setTab] = useState(initialTab);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [payrollItems, setPayrollItems] = useState<PayrollItem[]>([]);
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [allowanceList, setAllowanceList] = useState<Allowance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const [emp, deps, pos, att, payItems, pays, alls] = await Promise.all([
        employeeService.getById(params.id),
        employeeService.getDepartments(),
        employeeService.getPositions(),
        attendanceService.getByEmployee(params.id),
        payrollService.getEmployeeHistory(params.id),
        payrollService.list(),
        payrollService.getAllowances(params.id),
      ]);
      if (cancelled) return;
      setEmployee(emp);
      setDepartments(deps);
      setPositions(pos);
      setAttendance(att);
      setPayrollItems(payItems);
      setPayrolls(pays);
      setAllowanceList(alls);
      setLoading(false);
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  const departmentName = useMemo(
    () => departments.find((d) => d.id === employee?.departmentId)?.name ?? "—",
    [departments, employee],
  );
  const positionTitle = useMemo(
    () => positions.find((p) => p.id === employee?.positionId)?.title ?? "—",
    [positions, employee],
  );

  if (loading) return <LoadingState />;
  if (!employee) {
    return (
      <Alert tone="error" title="Employee not found">
        The requested employee profile does not exist in demo data.
      </Alert>
    );
  }

  const attendanceColumns: Column<AttendanceRecord>[] = [
    { key: "date", header: "Date", render: (r) => formatDate(r.date) },
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

  const payrollColumns: Column<PayrollItem>[] = [
    {
      key: "period",
      header: "Period",
      render: (r) =>
        payrolls.find((p) => p.id === r.payrollId)?.periodLabel ?? r.payrollId,
    },
    {
      key: "gross",
      header: "Gross",
      render: (r) => formatCurrency(r.grossSalary),
    },
    {
      key: "net",
      header: "Net",
      render: (r) => formatCurrency(r.netSalary),
    },
    {
      key: "cost",
      header: "Employer cost",
      render: (r) => formatCurrency(r.employerCost),
    },
    {
      key: "status",
      header: "Status",
      render: (r) => {
        const status = payrolls.find((p) => p.id === r.payrollId)?.status;
        return status ? <PayrollStatusBadge status={status} /> : "—";
      },
    },
  ];

  const tabs: TabItem[] = [
    {
      id: "overview",
      label: "Overview",
      content: (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader title="Contact" />
            <dl className="space-y-3 text-sm">
              <Row label="Email" value={employee.email} />
              <Row label="Phone" value={employee.phone} />
              <Row
                label="Emergency"
                value={
                  employee.emergencyContact
                    ? `${employee.emergencyContact.name} (${employee.emergencyContact.relationship}) · ${employee.emergencyContact.phone}`
                    : "—"
                }
              />
            </dl>
          </Card>
          <Card>
            <CardHeader title="Identity & banking" />
            <dl className="space-y-3 text-sm">
              <Row label="IC / Passport" value={maskIc(employee.icPassport)} />
              <Row label="Bank" value={employee.bankName} />
              <Row
                label="Account"
                value={maskBankAccount(employee.bankAccountNumber)}
              />
            </dl>
            <p className="mt-3 text-xs text-muted-foreground">
              Sensitive fields are masked in the UI. Full values are only for
              authorized backend access later.
            </p>
          </Card>
          <Card className="lg:col-span-2">
            <CardHeader title="Notes" />
            <p className="text-sm text-muted-foreground">
              {employee.notes ?? "No notes."}
            </p>
          </Card>
        </div>
      ),
    },
    {
      id: "employment",
      label: "Employment",
      content: (
        <Card>
          <dl className="grid gap-4 sm:grid-cols-2 text-sm">
            <Row label="Employee ID" value={employee.employeeId} />
            <Row label="Department" value={departmentName} />
            <Row label="Position" value={positionTitle} />
            <Row
              label="Employment type"
              value={<EmploymentTypeBadge type={employee.employmentType} />}
            />
            <Row label="Join date" value={formatDate(employee.joinDate)} />
            <Row
              label="Resign date"
              value={employee.resignDate ? formatDate(employee.resignDate) : "—"}
            />
            <Row
              label="Basic salary"
              value={formatCurrency(employee.basicSalary)}
            />
            <Row
              label="Configured OT rate / shift"
              value={
                employee.overtimeRatePerShift != null
                  ? formatCurrency(employee.overtimeRatePerShift)
                  : employee.isSecurityGuard
                    ? "Security OT rule (see docs)"
                    : "Not configured"
              }
            />
            <Row
              label="Security guard"
              value={employee.isSecurityGuard ? "Yes" : "No"}
            />
            <Row
              label="Status"
              value={<EmployeeStatusBadge status={employee.status} />}
            />
          </dl>
        </Card>
      ),
    },
    {
      id: "attendance",
      label: "Attendance",
      content: (
        <Table
          columns={attendanceColumns}
          data={attendance}
          rowKey={(r) => r.id}
          emptyMessage="No attendance records for this employee."
        />
      ),
    },
    {
      id: "payroll",
      label: "Payroll",
      content: (
        <Table
          columns={payrollColumns}
          data={payrollItems}
          rowKey={(r) => r.id}
          emptyMessage="No payroll history."
        />
      ),
    },
    {
      id: "allowances",
      label: "Allowances",
      content: (
        <div className="space-y-3">
          {allowanceList.length === 0 ? (
            <p className="text-sm text-muted-foreground">No allowances configured.</p>
          ) : (
            allowanceList.map((a) => (
              <Card key={a.id} className="flex items-center justify-between gap-3 !p-4">
                <div>
                  <p className="text-sm font-medium">
                    {a.label || ALLOWANCE_TYPE_LABELS[a.type]}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {a.frequency} · effective {formatDate(a.effectiveDate)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatCurrency(a.amount)}</p>
                  <Badge tone={a.status === "active" ? "success" : "neutral"}>
                    {a.status}
                  </Badge>
                </div>
              </Card>
            ))
          )}
        </div>
      ),
    },
    {
      id: "documents",
      label: "Documents",
      content: (
        <Card>
          <p className="text-sm text-muted-foreground">
            Document vault is future-ready. Upload, retention and access control
            are <strong>TO BE CONFIRMED</strong> with the client and implemented
            in the backend.
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li className="rounded-md border border-dashed border-border px-3 py-2 text-muted-foreground">
              IC copy — Coming soon
            </li>
            <li className="rounded-md border border-dashed border-border px-3 py-2 text-muted-foreground">
              Employment contract — Coming soon
            </li>
            <li className="rounded-md border border-dashed border-border px-3 py-2 text-muted-foreground">
              Bank mandate — Coming soon
            </li>
          </ul>
        </Card>
      ),
    },
    {
      id: "activity",
      label: "Activity",
      content: (
        <Card>
          <ul className="space-y-3 text-sm">
            <li>Profile viewed in demo console</li>
            <li>Attendance synced from mock service</li>
            <li>Payroll history loaded from mock payrolls</li>
          </ul>
        </Card>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={
          <Link
            href="/employees"
            className="mb-2 inline-block text-xs text-muted-foreground hover:text-foreground"
          >
            ← Employees
          </Link>
        }
        title={employee.fullName}
        description={`${employee.employeeId} · ${positionTitle} · ${departmentName}`}
        actions={
          <>
            <Link href={`/employees/${employee.id}?tab=attendance`}>
              <Button variant="outline" size="sm">
                Attendance
              </Button>
            </Link>
            <Link href={`/check-in`}>
              <Button variant="outline" size="sm">
                Check-in demo
              </Button>
            </Link>
            <Button size="sm">Edit profile</Button>
          </>
        }
      />
      <DemoBanner />

      <Card className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Avatar name={employee.fullName} src={employee.avatarUrl} size="lg" />
        <div className="flex flex-wrap items-center gap-2">
          <EmployeeStatusBadge status={employee.status} />
          <EmploymentTypeBadge type={employee.employmentType} />
          {employee.isSecurityGuard ? (
            <Badge tone="info">Security Guard</Badge>
          ) : null}
          <span className="text-sm text-muted-foreground">
            Basic {formatCurrency(employee.basicSalary)}
          </span>
        </div>
      </Card>

      <Tabs items={tabs} value={tab} onChange={setTab} />
    </div>
  );
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 text-foreground">{value}</dd>
    </div>
  );
}
