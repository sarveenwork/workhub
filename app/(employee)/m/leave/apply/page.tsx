"use client";

import {
  Alert,
  Button,
  DatePicker,
  Input,
  LoadingState,
  Select,
  useToast,
} from "@/src/components/ui";
import { employeeMobileService } from "@/src/services";
import type { LeaveBalanceSummary, LeaveType } from "@/src/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";

export default function ApplyLeavePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [type, setType] = useState<LeaveType>("paid_leave");
  const [startDate, setStartDate] = useState("2026-09-30");
  const [endDate, setEndDate] = useState("2026-09-30");
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [balances, setBalances] = useState<LeaveBalanceSummary | null>(null);

  useEffect(() => {
    let cancelled = false;
    void employeeMobileService.getLeaveBalances().then((bal) => {
      if (!cancelled) setBalances(bal);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const hint = useMemo(() => {
    if (!balances) return null;
    if (type === "paid_leave") {
      const annual = balances.balances.find((b) => b.type === "annual");
      return annual
        ? `${annual.remaining} annual leave days remaining`
        : null;
    }
    if (type === "medical") {
      const mc = balances.balances.find((b) => b.type === "medical");
      return mc ? `${mc.remaining} MC days available` : null;
    }
    if (type === "emergency") {
      const em = balances.balances.find((b) => b.type === "emergency");
      return em ? `${em.remaining} emergency days remaining` : null;
    }
    return "Unpaid leave does not use annual / MC balance";
  }, [balances, type]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!reason.trim()) return;
    setBusy(true);
    await employeeMobileService.applyLeave({
      type,
      startDate,
      endDate,
      reason: reason.trim(),
    });
    toast({
      title: "Leave submitted",
      description: "Pending manager/HR approval (demo).",
      tone: "success",
    });
    router.push("/m/leave");
  }

  if (!balances) return <LoadingState />;

  const annual = balances.balances.find((b) => b.type === "annual");
  const medical = balances.balances.find((b) => b.type === "medical");

  return (
    <div className="space-y-4">
      <Link href="/m/leave" className="text-xs text-teal-800">
        ← Leave
      </Link>
      <h1 className="text-xl font-semibold tracking-tight">Apply leave</h1>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-slate-200 bg-white px-3 py-2.5">
          <p className="text-[10px] uppercase tracking-wide text-slate-500">
            Leave left
          </p>
          <p className="text-lg font-semibold text-teal-800">
            {annual?.remaining ?? 0}
            <span className="text-xs font-normal text-slate-500">
              {" "}
              / {annual?.entitled ?? 0}
            </span>
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-3 py-2.5">
          <p className="text-[10px] uppercase tracking-wide text-slate-500">
            MC available
          </p>
          <p className="text-lg font-semibold text-sky-800">
            {medical?.remaining ?? 0}
            <span className="text-xs font-normal text-slate-500">
              {" "}
              / {medical?.entitled ?? 0}
            </span>
          </p>
        </div>
      </div>

      <Alert tone="info">
        Leave balances are demo values. Entitlement rules are TO BE CONFIRMED.
      </Alert>

      <form onSubmit={onSubmit} className="space-y-3">
        <Select
          label="Leave type"
          value={type}
          onChange={(e) => setType(e.target.value as LeaveType)}
          options={[
            { value: "paid_leave", label: "Paid leave (annual)" },
            { value: "unpaid_leave", label: "Unpaid leave" },
            { value: "medical", label: "Medical (MC)" },
            { value: "emergency", label: "Emergency" },
          ]}
        />
        {hint ? (
          <p className="text-xs font-medium text-teal-800">{hint}</p>
        ) : null}
        <DatePicker
          label="Start date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
        <DatePicker
          label="End date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
        <Input
          label="Reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Brief reason"
          required
        />
        <Button type="submit" className="w-full" size="lg" loading={busy}>
          Submit request
        </Button>
      </form>
    </div>
  );
}
