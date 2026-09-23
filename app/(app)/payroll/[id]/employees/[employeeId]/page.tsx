"use client";

import { DemoBanner } from "@/src/components/shared/DemoBanner";
import { PageHeader } from "@/src/components/shared/PageHeader";
import {
  Alert,
  Card,
  CardHeader,
  LoadingState,
} from "@/src/components/ui";
import { formatCurrency } from "@/src/lib/format";
import { employeeService, payrollService } from "@/src/services";
import type { Employee, PayrollItem } from "@/src/types";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EmployeePayrollDetailPage() {
  const params = useParams<{ id: string; employeeId: string }>();
  const [item, setItem] = useState<PayrollItem | null>(null);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const [payItem, emp] = await Promise.all([
        payrollService.getEmployeeItem(params.id, params.employeeId),
        employeeService.getById(params.employeeId),
      ]);
      if (cancelled) return;
      setItem(payItem);
      setEmployee(emp);
      setLoading(false);
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [params.id, params.employeeId]);

  if (loading) return <LoadingState />;
  if (!item || !employee) {
    return (
      <Alert tone="error" title="Not found">
        Payroll item missing from demo data.
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={
          <Link
            href={`/payroll/${params.id}`}
            className="mb-2 inline-block text-xs text-muted-foreground hover:text-foreground"
          >
            ← Back to payroll
          </Link>
        }
        title={employee.fullName}
        description={`${employee.employeeId} · Payroll breakdown (mock figures)`}
      />
      <DemoBanner />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader title="Earnings" />
          <Line label="Basic Salary" value={item.basicSalary} />
          <Line label="Overtime" value={item.overtime} />
          {item.allowances.map((a) => (
            <Line key={a.type + a.label} label={a.label} value={a.amount} />
          ))}
          <Line label="Gross Salary" value={item.grossSalary} bold />
        </Card>

        <Card>
          <CardHeader title="Employee deductions" />
          {item.deductions.map((d) => (
            <Line key={d.type + d.label} label={d.label} value={d.amount} />
          ))}
          <Line label="Total deductions" value={item.totalDeductions} bold />
          <Line label="Net salary" value={item.netSalary} bold />
        </Card>

        <Card>
          <CardHeader title="Employer contributions" />
          {item.employerContributions.map((c) => (
            <Line
              key={c.type}
              label={c.label}
              value={c.employerAmount}
            />
          ))}
          <Line
            label="Total employer contributions"
            value={item.totalEmployerContributions}
            bold
          />
          <Line label="Employer cost" value={item.employerCost} bold />
        </Card>
      </div>

      <Alert tone="warning" title="Not statutory calculations">
        EPF, SOCSO, EIS and PCB amounts are configurable mock values for the
        demo. Exact rates, caps and rounding are TO BE CONFIRMED and will be
        implemented by the backend payroll engine.
      </Alert>
    </div>
  );
}

function Line({
  label,
  value,
  bold,
}: {
  label: string;
  value: number;
  bold?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between border-b border-border py-2 text-sm last:border-0 ${
        bold ? "font-semibold" : ""
      }`}
    >
      <span className={bold ? "text-foreground" : "text-muted-foreground"}>
        {label}
      </span>
      <span>{formatCurrency(value)}</span>
    </div>
  );
}
