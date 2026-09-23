"use client";

import { DemoBanner } from "@/src/components/shared/DemoBanner";
import { PageHeader } from "@/src/components/shared/PageHeader";
import { PayrollStatusBadge } from "@/src/components/shared/StatusBadges";
import {
  Alert,
  Avatar,
  Button,
  Card,
  CardHeader,
  ConfirmationDialog,
  LoadingState,
  Table,
  useToast,
  type Column,
} from "@/src/components/ui";
import { formatCurrency } from "@/src/lib/format";
import { employeeService, payrollService } from "@/src/services";
import type { Employee, Payroll, PayrollItem, PayrollStatus } from "@/src/types";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function PayrollDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const [payroll, setPayroll] = useState<Payroll | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextStatus, setNextStatus] = useState<PayrollStatus | null>(null);
  const [acting, setActing] = useState(false);

  async function refresh() {
    const [p, emp] = await Promise.all([
      payrollService.getById(params.id),
      employeeService.list({ pageSize: 100 }),
    ]);
    setPayroll(p);
    setEmployees(emp.data);
  }

  useEffect(() => {
    let cancelled = false;
    void Promise.all([
      payrollService.getById(params.id),
      employeeService.list({ pageSize: 100 }),
    ]).then(([p, emp]) => {
      if (cancelled) return;
      setPayroll(p);
      setEmployees(emp.data);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  const empMap = useMemo(
    () => Object.fromEntries(employees.map((e) => [e.id, e])),
    [employees],
  );

  const columns: Column<PayrollItem>[] = [
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
      key: "basic",
      header: "Basic",
      render: (r) => formatCurrency(r.basicSalary),
    },
    {
      key: "ot",
      header: "OT",
      render: (r) => formatCurrency(r.overtime),
    },
    {
      key: "allow",
      header: "Allowances",
      render: (r) =>
        formatCurrency(r.allowances.reduce((s, a) => s + a.amount, 0)),
    },
    {
      key: "gross",
      header: "Gross",
      render: (r) => formatCurrency(r.grossSalary),
    },
    {
      key: "ded",
      header: "Deductions",
      render: (r) => formatCurrency(r.totalDeductions),
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
  ];

  function suggestedNext(status: PayrollStatus): PayrollStatus | null {
    if (status === "draft") return "pending_review";
    if (status === "pending_review") return "approved";
    if (status === "approved") return "paid";
    return null;
  }

  async function advance() {
    if (!payroll || !nextStatus) return;
    setActing(true);
    await payrollService.updateStatus(payroll.id, nextStatus);
    await refresh();
    setActing(false);
    setNextStatus(null);
    toast({
      title: `Payroll marked ${nextStatus.replace("_", " ")}`,
      tone: "success",
    });
  }

  if (loading) return <LoadingState />;
  if (!payroll) {
    return (
      <Alert tone="error" title="Payroll not found">
        Unknown payroll id.
      </Alert>
    );
  }

  const next = suggestedNext(payroll.status);

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={
          <Link
            href="/payroll"
            className="mb-2 inline-block text-xs text-muted-foreground hover:text-foreground"
          >
            ← Payroll
          </Link>
        }
        title={payroll.periodLabel}
        description="Employee payroll list and workflow actions."
        actions={
          <>
            <PayrollStatusBadge status={payroll.status} />
            {next ? (
              <Button size="sm" onClick={() => setNextStatus(next)}>
                Mark as {next.replace("_", " ")}
              </Button>
            ) : null}
          </>
        }
      />
      <DemoBanner />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader title="Totals (mock)" />
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Gross</dt>
              <dd>{formatCurrency(payroll.totalGross)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Net</dt>
              <dd className="font-semibold">{formatCurrency(payroll.totalNet)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Employer contributions</dt>
              <dd>{formatCurrency(payroll.totalEmployerContributions)}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-2">
              <dt className="font-medium">Employer cost</dt>
              <dd className="font-semibold">
                {formatCurrency(payroll.totalEmployerCost)}
              </dd>
            </div>
          </dl>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader
            title="Breakdown sample"
            description="Open an employee row for full earnings / deductions / contributions."
          />
          <p className="text-sm text-muted-foreground">
            Overall Budget composition (EPF-only vs EPF+SOCSO+EIS) is{" "}
            <strong>TO BE CONFIRMED WITH CLIENT</strong>. See{" "}
            <code className="text-xs">docs/business-rules/payroll.md</code>.
          </p>
        </Card>
      </div>

      <Table
        columns={columns}
        data={payroll.items}
        rowKey={(r) => r.id}
        onRowClick={(r) =>
          router.push(`/payroll/${payroll.id}/employees/${r.employeeId}`)
        }
      />

      <ConfirmationDialog
        open={nextStatus != null}
        onClose={() => setNextStatus(null)}
        onConfirm={advance}
        loading={acting}
        title={`Mark payroll as ${nextStatus?.replace("_", " ")}?`}
        description="Demo workflow transition only."
        confirmLabel="Confirm"
      />
    </div>
  );
}
