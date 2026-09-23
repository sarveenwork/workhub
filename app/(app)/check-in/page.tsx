"use client";

import { DemoBanner } from "@/src/components/shared/DemoBanner";
import { PageHeader } from "@/src/components/shared/PageHeader";
import {
  AttendanceStatusBadge,
  CheckInApprovalBadge,
} from "@/src/components/shared/StatusBadges";
import {
  Alert,
  Avatar,
  Button,
  Card,
  LoadingState,
  useToast,
} from "@/src/components/ui";
import { DEMO_TODAY } from "@/src/lib/constants";
import { formatDate, formatTime } from "@/src/lib/format";
import { attendanceService, employeeService } from "@/src/services";
import type {
  AttendanceStatus,
  CheckInApprovalStatus,
  CheckInLocation,
  Employee,
} from "@/src/types";
import { MapPin } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CheckInPage() {
  const { toast } = useToast();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [now, setNow] = useState(new Date());
  const [checkIn, setCheckIn] = useState<string | null>(null);
  const [checkOut, setCheckOut] = useState<string | null>(null);
  const [status, setStatus] = useState<AttendanceStatus | "not_started">(
    "not_started",
  );
  const [approvalStatus, setApprovalStatus] =
    useState<CheckInApprovalStatus | null>(null);
  const [location, setLocation] = useState<CheckInLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const [session, emp] = await Promise.all([
        attendanceService.getCheckInSession(),
        employeeService.getById("emp-001"),
      ]);
      if (cancelled) return;
      setCheckIn(session.checkIn);
      setCheckOut(session.checkOut);
      setStatus(session.status);
      setApprovalStatus(session.approvalStatus);
      setLocation(session.location);
      setEmployee(emp);
      setLoading(false);
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleCheckIn() {
    setBusy(true);
    const session = await attendanceService.checkIn();
    setCheckIn(session.checkIn);
    setStatus(session.status);
    setApprovalStatus(session.approvalStatus);
    setLocation(session.location);
    setBusy(false);
    toast({
      title: `Checked in — ${session.checkIn ? formatTime(session.checkIn) : ""}`,
      description: "Submitted for admin approval with duty location.",
      tone: "success",
    });
  }

  async function handleCheckOut() {
    setBusy(true);
    const session = await attendanceService.checkOut();
    setCheckOut(session.checkOut);
    setBusy(false);
    toast({
      title: `Checked out — ${session.checkOut ? formatTime(session.checkOut) : ""}`,
      tone: "success",
    });
  }

  if (loading || !employee || !location) return <LoadingState />;

  const timeLabel = now.toLocaleTimeString("en-MY", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <PageHeader
        title="Security guard check-in"
        description="Records duty location and check-in time, then waits for admin approval."
        actions={
          <Link href="/attendance/check-ins">
            <Button variant="outline" size="sm">
              Admin review
            </Button>
          </Link>
        }
      />
      <DemoBanner />

      <Card className="text-center">
        <div className="flex flex-col items-center gap-3">
          <Avatar name={employee.fullName} size="lg" />
          <div>
            <h2 className="text-xl font-semibold">{employee.fullName}</h2>
            <p className="text-sm text-muted-foreground">
              {employee.employeeId} · Security Guard
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            {formatDate(DEMO_TODAY, {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          <p className="font-mono text-3xl font-semibold tracking-tight">
            {timeLabel}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            {status === "not_started" ? (
              <p className="text-sm text-muted-foreground">Not checked in yet</p>
            ) : (
              <AttendanceStatusBadge status={status as AttendanceStatus} />
            )}
            {approvalStatus ? (
              <CheckInApprovalBadge status={approvalStatus} />
            ) : null}
          </div>
        </div>

        <div className="mt-6 rounded-md border border-border bg-muted/40 px-4 py-3 text-left">
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" />
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Duty location
              </p>
              <p className="mt-0.5 text-sm font-semibold text-foreground">
                {location.label}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {location.address}
              </p>
              <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}{" "}
                · mock coordinates
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          {!checkIn ? (
            <Button
              className="h-16 w-full text-base"
              size="lg"
              loading={busy}
              onClick={handleCheckIn}
            >
              CHECK IN
            </Button>
          ) : (
            <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-4 text-left text-emerald-900">
              <p className="text-xs font-medium uppercase tracking-wide">
                Checked in
              </p>
              <p className="mt-1 text-2xl font-semibold">
                {formatTime(checkIn)}
              </p>
              <div className="mt-3 flex items-start gap-2 border-t border-emerald-200/80 pt-3 text-sm">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <div>
                  <p className="font-medium">{location.label}</p>
                  <p className="text-xs opacity-80">{location.address}</p>
                </div>
              </div>
              {approvalStatus === "pending" ? (
                <p className="mt-3 text-xs">
                  Waiting for admin to approve or reject this check-in.
                </p>
              ) : null}
            </div>
          )}

          {checkIn && !checkOut && approvalStatus !== "rejected" ? (
            <Button
              className="h-14 w-full"
              variant="secondary"
              size="lg"
              loading={busy}
              onClick={handleCheckOut}
            >
              CHECK OUT
            </Button>
          ) : null}

          {checkOut ? (
            <div className="rounded-md border border-border bg-muted/50 px-4 py-4 text-left">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Checked out
              </p>
              <p className="mt-1 text-2xl font-semibold">
                {formatTime(checkOut)}
              </p>
            </div>
          ) : null}
        </div>
      </Card>

      <Alert tone="info" title="Demo location">
        Location is a mock assigned post for this guard — not live GPS. Admin
        review lives under Attendance → Check-in approvals.
      </Alert>
    </div>
  );
}
