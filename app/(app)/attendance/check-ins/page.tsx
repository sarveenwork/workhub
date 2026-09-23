"use client";

import { DemoBanner } from "@/src/components/shared/DemoBanner";
import { PageHeader } from "@/src/components/shared/PageHeader";
import {
  AttendanceStatusBadge,
  CheckInApprovalBadge,
} from "@/src/components/shared/StatusBadges";
import {
  Avatar,
  Button,
  Card,
  Input,
  LoadingState,
  Modal,
  Select,
  StatCard,
  useToast,
} from "@/src/components/ui";
import { formatDate, formatDateTime, formatTime } from "@/src/lib/format";
import { attendanceService, employeeService } from "@/src/services";
import type {
  CheckInApprovalStatus,
  CheckInRequest,
  Employee,
} from "@/src/types";
import { CheckCircle2, Clock3, MapPin, XCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export default function CheckInApprovalsPage() {
  const { toast } = useToast();
  const [filter, setFilter] = useState<CheckInApprovalStatus | "all">("pending");
  const [requests, setRequests] = useState<CheckInRequest[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [decision, setDecision] = useState<{
    id: string;
    action: "approved" | "rejected";
    employeeName: string;
  } | null>(null);
  const [notes, setNotes] = useState("");
  const [acting, setActing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void Promise.all([
      attendanceService.listCheckInRequests({ approvalStatus: filter }),
      employeeService.list({ pageSize: 100 }),
    ]).then(([list, emp]) => {
      if (cancelled) return;
      setRequests(list);
      setEmployees(emp.data);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [filter]);

  const empMap = useMemo(
    () => Object.fromEntries(employees.map((e) => [e.id, e])),
    [employees],
  );

  const pendingCount = useMemo(
    () => requests.filter((r) => r.approvalStatus === "pending").length,
    [requests],
  );

  async function confirmDecision() {
    if (!decision) return;
    setActing(true);
    await attendanceService.reviewCheckIn(
      decision.id,
      decision.action,
      notes || undefined,
    );
    const list = await attendanceService.listCheckInRequests({
      approvalStatus: filter,
    });
    setRequests(list);
    setActing(false);
    setDecision(null);
    setNotes("");
    toast({
      title:
        decision.action === "approved"
          ? "Check-in approved"
          : "Check-in rejected",
      tone: decision.action === "approved" ? "success" : "error",
    });
  }

  if (loading) return <LoadingState label="Loading check-in requests…" />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Check-in approvals"
        description="Review security guard check-ins with duty location and punch time. Approve or reject each request."
      />
      <DemoBanner />

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard
          label="Showing"
          value={requests.length}
          icon={Clock3}
          hint={filter === "all" ? "All requests" : filter}
        />
        <StatCard
          label="Pending in this view"
          value={pendingCount}
          icon={Clock3}
          tone="warning"
        />
        <Select
          label="Filter"
          value={filter}
          onChange={(e) =>
            setFilter(e.target.value as CheckInApprovalStatus | "all")
          }
          options={[
            { value: "pending", label: "Pending" },
            { value: "approved", label: "Approved" },
            { value: "rejected", label: "Rejected" },
            { value: "all", label: "All" },
          ]}
        />
      </div>

      <div className="space-y-3">
        {requests.length === 0 ? (
          <Card>
            <p className="text-sm text-muted-foreground">
              No check-in requests for this filter.
            </p>
          </Card>
        ) : (
          requests.map((req) => {
            const emp = empMap[req.employeeId];
            return (
              <Card key={req.id} className="!p-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex gap-3">
                    <Avatar name={emp?.fullName ?? req.employeeId} />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-semibold">
                          {emp?.fullName ?? req.employeeId}
                        </h3>
                        <CheckInApprovalBadge status={req.approvalStatus} />
                        {req.attendanceStatus !== "not_started" ? (
                          <AttendanceStatusBadge status={req.attendanceStatus} />
                        ) : null}
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {emp?.employeeId ?? "—"} · {formatDate(req.date)}
                      </p>

                      <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                        <div className="rounded-md border border-border bg-muted/30 px-3 py-2">
                          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                            Check-in time
                          </p>
                          <p className="mt-0.5 text-lg font-semibold">
                            {formatTime(req.checkInAt)}
                          </p>
                          {req.checkOutAt ? (
                            <p className="text-xs text-muted-foreground">
                              Out {formatTime(req.checkOutAt)}
                            </p>
                          ) : null}
                        </div>
                        <div className="rounded-md border border-border bg-muted/30 px-3 py-2">
                          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                            Location
                          </p>
                          <p className="mt-0.5 flex items-start gap-1.5 font-medium">
                            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal-700" />
                            {req.location.label}
                          </p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {req.location.address}
                          </p>
                          <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                            {req.location.latitude.toFixed(4)},{" "}
                            {req.location.longitude.toFixed(4)}
                          </p>
                        </div>
                      </div>

                      {req.reviewedAt ? (
                        <p className="mt-2 text-xs text-muted-foreground">
                          Reviewed by {req.reviewedBy} ·{" "}
                          {formatDateTime(req.reviewedAt)}
                          {req.reviewNotes ? ` — ${req.reviewNotes}` : ""}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  {req.approvalStatus === "pending" ? (
                    <div className="flex shrink-0 gap-2 lg:flex-col">
                      <Button
                        size="sm"
                        onClick={() => {
                          setNotes("");
                          setDecision({
                            id: req.id,
                            action: "approved",
                            employeeName: emp?.fullName ?? req.employeeId,
                          });
                        }}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => {
                          setNotes("");
                          setDecision({
                            id: req.id,
                            action: "rejected",
                            employeeName: emp?.fullName ?? req.employeeId,
                          });
                        }}
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  ) : null}
                </div>
              </Card>
            );
          })
        )}
      </div>

      <Modal
        open={decision != null}
        onClose={() => setDecision(null)}
        title={
          decision?.action === "approved"
            ? "Approve check-in"
            : "Reject check-in"
        }
        description={
          decision
            ? `${decision.employeeName} — location and time stay on the record.`
            : undefined
        }
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setDecision(null)}
              disabled={acting}
            >
              Cancel
            </Button>
            <Button
              variant={decision?.action === "rejected" ? "danger" : "primary"}
              loading={acting}
              onClick={confirmDecision}
            >
              {decision?.action === "approved" ? "Approve" : "Reject"}
            </Button>
          </>
        }
      >
        <Input
          label="Review notes (optional)"
          placeholder="e.g. Verified on assigned post"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <p className="mt-3 text-xs text-muted-foreground">
          Demo only — decision is kept in-session, not a real backend audit log.
        </p>
      </Modal>
    </div>
  );
}
