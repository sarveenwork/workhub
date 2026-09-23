"use client";

import { Badge, Button, LoadingState } from "@/src/components/ui";
import { formatDate } from "@/src/lib/format";
import { employeeMobileService } from "@/src/services";
import type { LeaveBalanceSummary, LeaveRequest } from "@/src/types";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const TYPE_LABELS: Record<LeaveRequest["type"], string> = {
  paid_leave: "Paid leave",
  unpaid_leave: "Unpaid leave",
  medical: "Medical (MC)",
  emergency: "Emergency",
};

export default function EmployeeLeavePage() {
  const [rows, setRows] = useState<LeaveRequest[]>([]);
  const [balances, setBalances] = useState<LeaveBalanceSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void Promise.all([
      employeeMobileService.listLeave(),
      employeeMobileService.getLeaveBalances(),
    ]).then(([list, bal]) => {
      if (cancelled) return;
      setRows(list);
      setBalances(bal);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading || !balances) return <LoadingState />;

  const annual = balances.balances.find((b) => b.type === "annual");
  const medical = balances.balances.find((b) => b.type === "medical");

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Leave</h1>
          <p className="mt-1 text-sm text-slate-500">
            Balances for {balances.year} and your requests.
          </p>
        </div>
        <Link href="/m/leave/apply">
          <Button size="sm">
            <Plus className="h-4 w-4" />
            Apply
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <BalanceCard
          title="Leave left"
          remaining={annual?.remaining ?? 0}
          entitled={annual?.entitled ?? 0}
          used={annual?.used ?? 0}
          accent="teal"
        />
        <BalanceCard
          title="MC available"
          remaining={medical?.remaining ?? 0}
          entitled={medical?.entitled ?? 0}
          used={medical?.used ?? 0}
          accent="sky"
        />
      </div>

      <div className="space-y-2">
        {balances.balances.map((item) => {
          const pct =
            item.entitled > 0
              ? Math.round((item.remaining / item.entitled) * 100)
              : 0;
          return (
            <div
              key={item.type}
              className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold">{item.label}</p>
                <p className="text-sm font-semibold text-teal-800">
                  {item.remaining} left
                </p>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-teal-600"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-slate-500">
                {item.used} used
                {item.pending > 0 ? ` · ${item.pending} pending` : ""} ·{" "}
                {item.entitled} entitled
              </p>
            </div>
          );
        })}
        <p className="text-[11px] text-slate-400">{balances.notes}</p>
      </div>

      <div>
        <h2 className="mb-2 text-sm font-semibold text-slate-700">
          My requests
        </h2>
        <div className="space-y-3">
          {rows.map((row) => (
            <div
              key={row.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold">
                    {TYPE_LABELS[row.type]}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {formatDate(row.startDate)}
                    {row.endDate !== row.startDate
                      ? ` → ${formatDate(row.endDate)}`
                      : ""}
                  </p>
                </div>
                <Badge
                  tone={
                    row.status === "approved"
                      ? "success"
                      : row.status === "rejected"
                        ? "danger"
                        : "warning"
                  }
                >
                  {row.status}
                </Badge>
              </div>
              <p className="mt-2 text-sm text-slate-600">{row.reason}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BalanceCard({
  title,
  remaining,
  entitled,
  used,
  accent,
}: {
  title: string;
  remaining: number;
  entitled: number;
  used: number;
  accent: "teal" | "sky";
}) {
  const bg = accent === "teal" ? "bg-teal-700" : "bg-sky-700";
  return (
    <div className={`rounded-2xl ${bg} p-4 text-white shadow-sm`}>
      <p className="text-[11px] font-medium uppercase tracking-wide text-white/70">
        {title}
      </p>
      <p className="mt-1 text-3xl font-semibold tracking-tight">{remaining}</p>
      <p className="mt-1 text-xs text-white/75">
        of {entitled} days · {used} used
      </p>
    </div>
  );
}
