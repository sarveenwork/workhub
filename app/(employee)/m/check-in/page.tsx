"use client";

import {
  AttendanceStatusBadge,
  CheckInApprovalBadge,
} from "@/src/components/shared/StatusBadges";
import { Alert, Button, LoadingState, useToast } from "@/src/components/ui";
import { DEMO_TODAY } from "@/src/lib/constants";
import { formatDate, formatTime } from "@/src/lib/format";
import { attendanceService, employeeMobileService } from "@/src/services";
import type {
  AttendanceStatus,
  CheckInApprovalStatus,
  CheckInLocation,
  Employee,
  Shift,
} from "@/src/types";
import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";

export default function EmployeeMobileCheckInPage() {
  const { toast } = useToast();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [shift, setShift] = useState<Shift | null>(null);
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
    void Promise.all([
      employeeMobileService.getProfile(),
      employeeMobileService.getTodayShift(),
      attendanceService.getCheckInSession(),
    ]).then(([emp, todayShift, session]) => {
      if (cancelled) return;
      setEmployee(emp);
      setShift(todayShift);
      setCheckIn(session.checkIn);
      setCheckOut(session.checkOut);
      setStatus(session.status);
      setApprovalStatus(session.approvalStatus);
      setLocation(todayShift?.location ?? session.location);
      setLoading(false);
    });
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
      description: "Sent for admin approval",
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

  const offDay = shift?.status === "off";

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Check in</h1>
        <p className="mt-1 text-sm text-slate-500">
          {employee.fullName} · {employee.employeeId}
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
        <p className="text-sm text-slate-500">
          {formatDate(DEMO_TODAY, {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </p>
        <p className="mt-2 font-mono text-3xl font-semibold tracking-tight">
          {timeLabel}
        </p>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {status === "not_started" ? (
            <span className="text-xs text-slate-500">Not checked in</span>
          ) : (
            <AttendanceStatusBadge status={status as AttendanceStatus} />
          )}
          {approvalStatus ? (
            <CheckInApprovalBadge status={approvalStatus} />
          ) : null}
        </div>

        <LocationBlock location={location} />

        {offDay ? (
          <Alert tone="warning" className="mt-4 text-left" title="Rest day">
            No duty scheduled today. Check-in is still available for demo.
          </Alert>
        ) : null}

        <div className="mt-6 space-y-3">
          {!checkIn ? (
            <Button
              className="h-14 w-full rounded-xl text-base"
              size="lg"
              loading={busy}
              onClick={handleCheckIn}
            >
              CHECK IN
            </Button>
          ) : (
            <ResultBlock
              title="Checked in"
              time={checkIn}
              location={location}
              footer={
                approvalStatus === "pending"
                  ? "Waiting for admin approval"
                  : undefined
              }
            />
          )}

          {checkIn && !checkOut && approvalStatus !== "rejected" ? (
            <Button
              className="h-12 w-full rounded-xl"
              variant="secondary"
              size="lg"
              loading={busy}
              onClick={handleCheckOut}
            >
              CHECK OUT
            </Button>
          ) : null}

          {checkOut ? (
            <ResultBlock title="Checked out" time={checkOut} muted />
          ) : null}
        </div>
      </div>
    </div>
  );
}

function LocationBlock({ location }: { location: CheckInLocation }) {
  return (
    <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-left">
      <div className="flex items-start gap-2">
        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" />
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
            Work location
          </p>
          <p className="text-sm font-semibold">{location.label}</p>
          <p className="text-xs text-slate-500">{location.address}</p>
        </div>
      </div>
    </div>
  );
}

function ResultBlock({
  title,
  time,
  location,
  footer,
  muted,
}: {
  title: string;
  time: string;
  location?: CheckInLocation;
  footer?: string;
  muted?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border px-4 py-4 text-left ${
        muted
          ? "border-slate-200 bg-slate-50"
          : "border-emerald-200 bg-emerald-50 text-emerald-950"
      }`}
    >
      <p className="text-[11px] font-medium uppercase tracking-wide opacity-80">
        {title}
      </p>
      <p className="mt-1 text-2xl font-semibold">{formatTime(time)}</p>
      {location ? (
        <p className="mt-2 flex items-start gap-1.5 text-sm">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {location.label}
        </p>
      ) : null}
      {footer ? <p className="mt-2 text-xs opacity-80">{footer}</p> : null}
    </div>
  );
}
