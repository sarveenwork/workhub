"use client";

import { Badge, Button, LoadingState } from "@/src/components/ui";
import { formatDate } from "@/src/lib/format";
import { employeeMobileService } from "@/src/services";
import type { LeaveRequest } from "@/src/types";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const TYPE_LABELS: Record<LeaveRequest["type"], string> = {
  paid_leave: "Paid leave",
  unpaid_leave: "Unpaid leave",
  medical: "Medical",
  emergency: "Emergency",
};

export default function EmployeeLeavePage() {
  const [rows, setRows] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void employeeMobileService.listLeave().then((list) => {
      if (cancelled) return;
      setRows(list);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Leave</h1>
          <p className="mt-1 text-sm text-slate-500">
            Your requests and approval status.
          </p>
        </div>
        <Link href="/m/leave/apply">
          <Button size="sm">
            <Plus className="h-4 w-4" />
            Apply
          </Button>
        </Link>
      </div>

      <div className="space-y-3">
        {rows.map((row) => (
          <div
            key={row.id}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold">{TYPE_LABELS[row.type]}</p>
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
  );
}
