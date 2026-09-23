"use client";

import { DemoBanner } from "@/src/components/shared/DemoBanner";
import { PageHeader } from "@/src/components/shared/PageHeader";
import { PayrollStatusBadge } from "@/src/components/shared/StatusBadges";
import {
  Button,
  Card,
  ConfirmationDialog,
  LoadingState,
  StatCard,
  Table,
  useToast,
  type Column,
} from "@/src/components/ui";
import { formatCurrency, formatDateTime } from "@/src/lib/format";
import { payrollService } from "@/src/services";
import type { Payroll } from "@/src/types";
import { CircleDollarSign, Wallet } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PayrollOverviewPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [acting, setActing] = useState(false);

  async function refresh() {
    const list = await payrollService.list();
    setPayrolls(list);
  }

  useEffect(() => {
    let cancelled = false;
    void payrollService.list().then((list) => {
      if (cancelled) return;
      setPayrolls(list);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const latest = payrolls.find((p) => p.year === 2026 && p.month === 9);

  const columns: Column<Payroll>[] = [
    {
      key: "period",
      header: "Period",
      render: (r) => <span className="font-medium">{r.periodLabel}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (r) => <PayrollStatusBadge status={r.status} />,
    },
    {
      key: "employees",
      header: "Employees",
      render: (r) => r.employeeCount,
    },
    {
      key: "net",
      header: "Total net",
      render: (r) => formatCurrency(r.totalNet),
    },
    {
      key: "cost",
      header: "Employer cost",
      render: (r) => formatCurrency(r.totalEmployerCost),
    },
    {
      key: "generated",
      header: "Generated",
      render: (r) => formatDateTime(r.generatedAt),
    },
  ];

  async function submitForReview() {
    if (!latest) return;
    setActing(true);
    await payrollService.updateStatus(latest.id, "pending_review");
    await refresh();
    setActing(false);
    setConfirmOpen(false);
    toast({
      title: "Payroll submitted for review",
      description: "Demo workflow only — no backend persistence.",
      tone: "success",
    });
  }

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payroll overview"
        description="Monthly payroll workflow: Draft → Review → Approved → Paid."
        actions={
          <>
            <Link href="/payroll/monthly">
              <Button variant="outline" size="sm">
                Monthly list
              </Button>
            </Link>
            <Button size="sm" onClick={() => setConfirmOpen(true)}>
              Run payroll
            </Button>
          </>
        }
      />
      <DemoBanner />

      {latest ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Current period"
            value={latest.periodLabel}
            icon={Wallet}
          />
          <StatCard
            label="Status"
            value={<PayrollStatusBadge status={latest.status} />}
          />
          <StatCard
            label="Total net"
            value={formatCurrency(latest.totalNet)}
            icon={Wallet}
            hint="Mock"
          />
          <StatCard
            label="Employer cost"
            value={formatCurrency(latest.totalEmployerCost)}
            icon={CircleDollarSign}
            hint="Includes mock employer contributions"
          />
        </div>
      ) : null}

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold">Workflow</h3>
            <p className="text-xs text-muted-foreground">
              Click a payroll row to open detail and advance status.
            </p>
          </div>
          {latest ? (
            <Link href={`/payroll/${latest.id}`}>
              <Button size="sm">Open {latest.periodLabel}</Button>
            </Link>
          ) : null}
        </div>
        <ol className="mb-6 grid gap-2 sm:grid-cols-4 text-sm">
          {["Draft", "Pending Review", "Approved", "Paid"].map((step, i) => (
            <li
              key={step}
              className="rounded-md border border-border bg-muted/40 px-3 py-2"
            >
              <span className="text-xs text-muted-foreground">Step {i + 1}</span>
              <p className="font-medium">{step}</p>
            </li>
          ))}
        </ol>
        <Table
          columns={columns}
          data={payrolls}
          rowKey={(r) => r.id}
          onRowClick={(r) => router.push(`/payroll/${r.id}`)}
        />
      </Card>

      <ConfirmationDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={submitForReview}
        loading={acting}
        title="Run / submit September payroll?"
        description="Marks the current demo payroll as pending review. Calculations are mock."
        confirmLabel="Submit for review"
      />
    </div>
  );
}
