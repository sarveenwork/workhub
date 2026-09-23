"use client";

import {
  Alert,
  Button,
  DatePicker,
  Input,
  Select,
  useToast,
} from "@/src/components/ui";
import { employeeMobileService } from "@/src/services";
import type { LeaveType } from "@/src/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function ApplyLeavePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [type, setType] = useState<LeaveType>("paid_leave");
  const [startDate, setStartDate] = useState("2026-09-30");
  const [endDate, setEndDate] = useState("2026-09-30");
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);

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

  return (
    <div className="space-y-4">
      <Link href="/m/leave" className="text-xs text-teal-800">
        ← Leave
      </Link>
      <h1 className="text-xl font-semibold tracking-tight">Apply leave</h1>
      <Alert tone="info">
        Leave balances and approval rules are TO BE CONFIRMED. This submits a
        demo pending request only.
      </Alert>

      <form onSubmit={onSubmit} className="space-y-3">
        <Select
          label="Leave type"
          value={type}
          onChange={(e) => setType(e.target.value as LeaveType)}
          options={[
            { value: "paid_leave", label: "Paid leave" },
            { value: "unpaid_leave", label: "Unpaid leave" },
            { value: "medical", label: "Medical" },
            { value: "emergency", label: "Emergency" },
          ]}
        />
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
