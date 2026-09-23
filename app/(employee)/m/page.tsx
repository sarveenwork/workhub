"use client";

import { Badge, LoadingState } from "@/src/components/ui";
import { formatCurrency, formatDate, formatTime } from "@/src/lib/format";
import { employeeMobileService } from "@/src/services";
import type {
  Company,
  Employee,
  LeaveBalanceSummary,
  PayrollItem,
  Shift,
} from "@/src/types";
import {
  Building2,
  CalendarDays,
  ChevronRight,
  Fingerprint,
  MapPin,
  Palmtree,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";

export default function EmployeeHomePage() {
  const [profile, setProfile] = useState<Employee | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [shift, setShift] = useState<Shift | null>(null);
  const [payslip, setPayslip] = useState<{
    periodLabel: string;
    item: PayrollItem;
  } | null>(null);
  const [balances, setBalances] = useState<LeaveBalanceSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void Promise.all([
      employeeMobileService.getProfile(),
      employeeMobileService.getCompany(),
      employeeMobileService.getTodayShift(),
      employeeMobileService.getLatestPayslip(),
      employeeMobileService.getLeaveBalances(),
    ]).then(([p, c, s, pay, bal]) => {
      if (cancelled) return;
      setProfile(p);
      setCompany(c);
      setShift(s);
      setPayslip(pay ? { periodLabel: pay.periodLabel, item: pay.item } : null);
      setBalances(bal);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading || !profile) return <LoadingState label="Loading…" />;

  const firstName = profile.fullName.split(" ")[0];

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs text-slate-500">
          {formatDate(new Date().toISOString(), {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          Hi, {firstName}
        </h1>
        <p className="text-sm text-slate-500">{profile.employeeId}</p>
      </div>

      {company ? (
        <div className="flex items-start gap-2.5 rounded-2xl border border-slate-200 bg-white px-3.5 py-3 shadow-sm">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-800">
            <Building2 className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
              Your company
            </p>
            <p className="truncate text-sm font-semibold text-slate-900">
              {company.name}
            </p>
            <p className="mt-0.5 text-xs text-slate-500">
              {company.code} · {company.address.split(",")[0]}
            </p>
          </div>
        </div>
      ) : null}

      <section className="rounded-2xl bg-slate-900 p-4 text-white shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wide text-teal-200/90">
            Today&apos;s shift
          </p>
          {shift ? (
            <Badge
              tone={shift.status === "off" ? "neutral" : "primary"}
              className="bg-white/10 text-white"
            >
              {shift.status}
            </Badge>
          ) : null}
        </div>
        {shift && shift.status !== "off" ? (
          <div className="mt-3 space-y-2">
            <p className="text-2xl font-semibold">
              {formatTime(shift.startTime)} – {formatTime(shift.endTime)}
            </p>
            <p className="flex items-start gap-1.5 text-sm text-slate-300">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-teal-300" />
              <span>
                <span className="font-medium text-white">{shift.location.label}</span>
                <span className="mt-0.5 block text-xs text-slate-400">
                  {shift.location.address}
                </span>
              </span>
            </p>
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-300">No duty scheduled today.</p>
        )}
        <Link
          href="/m/shifts"
          className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-teal-200"
        >
          View week <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <QuickLink
          href="/m/check-in"
          icon={<Fingerprint className="h-5 w-5" />}
          title="Check in"
          subtitle="Location & time"
        />
        <QuickLink
          href="/m/leave"
          icon={<Palmtree className="h-5 w-5" />}
          title="Leave & MC"
          subtitle={
            balances
              ? `${balances.balances.find((b) => b.type === "annual")?.remaining ?? 0} leave · ${balances.balances.find((b) => b.type === "medical")?.remaining ?? 0} MC`
              : "Balances"
          }
        />
        <QuickLink
          href="/m/pay"
          icon={<Wallet className="h-5 w-5" />}
          title="My pay"
          subtitle="Payslip & EPF"
        />
        <QuickLink
          href="/m/shifts"
          icon={<CalendarDays className="h-5 w-5" />}
          title="My shifts"
          subtitle="Week roster"
        />
      </section>

      {balances ? (
        <Link
          href="/m/leave"
          className="grid grid-cols-2 gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
        >
          <div className="rounded-xl bg-teal-50 px-3 py-2.5">
            <p className="text-[10px] font-medium uppercase tracking-wide text-teal-800/70">
              Leave left
            </p>
            <p className="text-xl font-semibold text-teal-900">
              {balances.balances.find((b) => b.type === "annual")?.remaining ?? 0}
              <span className="text-xs font-normal text-teal-800/70"> days</span>
            </p>
          </div>
          <div className="rounded-xl bg-sky-50 px-3 py-2.5">
            <p className="text-[10px] font-medium uppercase tracking-wide text-sky-800/70">
              MC available
            </p>
            <p className="text-xl font-semibold text-sky-900">
              {balances.balances.find((b) => b.type === "medical")?.remaining ?? 0}
              <span className="text-xs font-normal text-sky-800/70"> days</span>
            </p>
          </div>
        </Link>
      ) : null}

      {payslip ? (
        <Link
          href="/m/pay/monthly"
          className="block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500">Latest payslip</p>
              <p className="mt-0.5 text-sm font-semibold">{payslip.periodLabel}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </div>
          <p className="mt-3 text-2xl font-semibold tracking-tight">
            {formatCurrency(payslip.item.netSalary)}
          </p>
          <p className="mt-1 text-xs text-slate-500">Net pay · mock demo</p>
        </Link>
      ) : null}
    </div>
  );
}

function QuickLink({
  href,
  icon,
  title,
  subtitle,
}: {
  href: string;
  icon: ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm"
    >
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-800">
        {icon}
      </span>
      <p className="mt-2.5 text-sm font-semibold">{title}</p>
      <p className="text-xs text-slate-500">{subtitle}</p>
    </Link>
  );
}
