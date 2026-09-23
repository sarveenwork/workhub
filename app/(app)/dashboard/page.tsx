"use client";

import { DemoBanner } from "@/src/components/shared/DemoBanner";
import { PageHeader } from "@/src/components/shared/PageHeader";
import {
  Button,
  Card,
  CardHeader,
  ChartCard,
  LoadingState,
  StatCard,
} from "@/src/components/ui";
import { formatCurrency, formatDateTime } from "@/src/lib/format";
import {
  attendanceService,
  dashboardService,
  payrollService,
} from "@/src/services";
import type {
  ActivityItem,
  AttendanceOverview,
  DashboardKpis,
  PayrollTrendPoint,
} from "@/src/types";
import {
  CalendarPlus,
  CircleDollarSign,
  ClipboardCheck,
  UserPlus,
  Users,
  Wallet,
  AlertTriangle,
  UserX,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function DashboardPage() {
  const [kpis, setKpis] = useState<DashboardKpis | null>(null);
  const [overview, setOverview] = useState<AttendanceOverview | null>(null);
  const [trend, setTrend] = useState<PayrollTrendPoint[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const [k, o, t, a] = await Promise.all([
        dashboardService.getKpis(),
        attendanceService.getTodayOverview(),
        payrollService.getTrend(),
        dashboardService.getRecentActivity(),
      ]);
      if (cancelled) return;
      setKpis(k);
      setOverview(o);
      setTrend(t);
      setActivity(a);
      setLoading(false);
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading || !kpis || !overview) {
    return <LoadingState label="Loading dashboard…" />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Workforce, attendance and payroll overview for today."
        actions={
          <>
            <Link href="/employees">
              <Button variant="outline" size="sm">
                <UserPlus className="h-4 w-4" />
                Add Employee
              </Button>
            </Link>
            <Link href="/attendance/today">
              <Button variant="outline" size="sm">
                <CalendarPlus className="h-4 w-4" />
                Record Attendance
              </Button>
            </Link>
            <Link href="/payroll">
              <Button size="sm">
                <Wallet className="h-4 w-4" />
                Run Payroll
              </Button>
            </Link>
          </>
        }
      />

      <DemoBanner />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Employees"
          value={kpis.totalEmployees}
          icon={Users}
        />
        <StatCard
          label="Active Employees"
          value={kpis.activeEmployees}
          icon={Users}
          tone="success"
        />
        <StatCard
          label="Present Today"
          value={kpis.presentToday}
          icon={ClipboardCheck}
          tone="success"
        />
        <StatCard
          label="Late Today"
          value={kpis.lateToday}
          icon={AlertTriangle}
          tone="warning"
        />
        <StatCard
          label="Absent Today"
          value={kpis.absentToday}
          icon={UserX}
          tone="danger"
        />
        <StatCard
          label="Payroll This Month"
          value={formatCurrency(kpis.payrollThisMonth)}
          hint="Net (mock)"
          icon={Wallet}
        />
        <StatCard
          label="Employer Contribution"
          value={formatCurrency(kpis.employerContribution)}
          hint="Mock demo values"
          icon={CircleDollarSign}
          tone="info"
        />
        <StatCard
          label="Pending Payroll"
          value={kpis.pendingPayroll}
          icon={Wallet}
          tone="warning"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-1">
          <CardHeader
            title="Attendance overview"
            description="Today — 22 September 2026"
          />
          <div className="space-y-3">
            {(
              [
                ["Present", overview.present, "bg-emerald-500"],
                ["Late", overview.late, "bg-amber-500"],
                ["Absent", overview.absent, "bg-red-500"],
                ["Leave", overview.leave, "bg-sky-500"],
              ] as const
            ).map(([label, value, color]) => {
              const total =
                overview.present +
                overview.late +
                overview.absent +
                overview.leave;
              const pct = total ? Math.round((value / total) * 100) : 0;
              return (
                <div key={label}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium">
                      {value} · {pct}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${color}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <Link
            href="/attendance/today"
            className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
          >
            View today&apos;s attendance →
          </Link>
        </Card>

        <ChartCard
          className="xl:col-span-2"
          title="Payroll overview"
          description="Monthly net payroll vs employer cost (mock)"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} width={70} />
              <Tooltip
                formatter={(value) => formatCurrency(Number(value ?? 0))}
              />
              <Legend />
              <Bar dataKey="netPayroll" name="Net payroll" fill="#0f766e" radius={2} />
              <Bar
                dataKey="employerCost"
                name="Employer cost"
                fill="#94a3b8"
                radius={2}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Recent activity" />
          <ul className="divide-y divide-border">
            {activity.map((item) => (
              <li key={item.id} className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <div>
                  <p className="text-sm text-foreground">{item.message}</p>
                  <p className="mt-0.5 text-xs capitalize text-muted-foreground">
                    {item.type}
                  </p>
                </div>
                <time className="shrink-0 text-xs text-muted-foreground">
                  {formatDateTime(item.createdAt)}
                </time>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader title="Quick actions" />
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              { href: "/employees", label: "Add Employee", desc: "Create a worker profile" },
              { href: "/attendance/today", label: "Record Attendance", desc: "Review today’s check-ins" },
              { href: "/payroll", label: "Run Payroll", desc: "Open payroll workflow" },
              { href: "/reports", label: "View Reports", desc: "Payroll & contributions" },
            ].map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="rounded-md border border-border px-4 py-3 transition-colors hover:bg-muted/50"
              >
                <p className="text-sm font-medium">{action.label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {action.desc}
                </p>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
