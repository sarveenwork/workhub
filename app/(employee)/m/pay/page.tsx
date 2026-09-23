"use client";

import { Badge, LoadingState } from "@/src/components/ui";
import { formatCurrency } from "@/src/lib/format";
import { employeeMobileService } from "@/src/services";
import type { PayrollItem } from "@/src/types";
import { ChevronRight, FileSpreadsheet, Shield, Wallet } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";

export default function EmployeePayPage() {
  const [payslip, setPayslip] = useState<{
    periodLabel: string;
    payrollId: string;
    item: PayrollItem;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void employeeMobileService.getLatestPayslip().then((pay) => {
      if (cancelled) return;
      setPayslip(pay);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">My pay</h1>
        <p className="mt-1 text-sm text-slate-500">
          Payslips and contribution summaries. Figures are demo only.
        </p>
      </div>

      {payslip ? (
        <div className="rounded-2xl bg-slate-900 p-4 text-white">
          <p className="text-xs text-teal-200/90">{payslip.periodLabel}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight">
            {formatCurrency(payslip.item.netSalary)}
          </p>
          <p className="mt-1 text-xs text-slate-400">Net salary · mock</p>
          <div className="mt-4 flex gap-2">
            <Badge tone="neutral" className="bg-white/10 text-white">
              Gross {formatCurrency(payslip.item.grossSalary)}
            </Badge>
          </div>
        </div>
      ) : null}

      <div className="space-y-2">
        <PayLink
          href="/m/pay/monthly"
          icon={<Wallet className="h-5 w-5" />}
          title="Monthly payslip"
          subtitle="Earnings, OT, deductions, net"
        />
        <PayLink
          href="/m/pay/yearly"
          icon={<FileSpreadsheet className="h-5 w-5" />}
          title="Yearly summary"
          subtitle="Month-by-month for 2026"
        />
        <PayLink
          href="/m/pay/epf"
          icon={<Shield className="h-5 w-5" />}
          title="EPF contributions"
          subtitle="Employee & employer (mock)"
        />
        <PayLink
          href="/m/pay/socso"
          icon={<Shield className="h-5 w-5" />}
          title="SOCSO & EIS"
          subtitle="Contribution listing (mock)"
        />
      </div>
    </div>
  );
}

function PayLink({
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
      className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm"
    >
      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-800">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold">{title}</span>
        <span className="block text-xs text-slate-500">{subtitle}</span>
      </span>
      <ChevronRight className="h-4 w-4 text-slate-400" />
    </Link>
  );
}
