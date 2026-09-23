"use client";

import { Badge, LoadingState } from "@/src/components/ui";
import { DEMO_TODAY } from "@/src/lib/constants";
import { formatDate, formatTime } from "@/src/lib/format";
import { employeeMobileService } from "@/src/services";
import type { Shift } from "@/src/types";
import { MapPin } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export default function EmployeeShiftsPage() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void employeeMobileService.getWeekShifts().then((list) => {
      if (cancelled) return;
      setShifts(list);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const today = useMemo(
    () => shifts.find((s) => s.date === DEMO_TODAY) ?? null,
    [shifts],
  );

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">My shifts</h1>
        <p className="mt-1 text-sm text-slate-500">
          Where and when you work today and this week.
        </p>
      </div>

      {today ? (
        <section className="rounded-2xl border border-teal-200 bg-teal-50/60 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-teal-800">
            Today · {formatDate(today.date, { weekday: "short", day: "numeric", month: "short" })}
          </p>
          <ShiftCard shift={today} emphasize />
        </section>
      ) : null}

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-700">This week</h2>
        {shifts.map((shift) => (
          <div
            key={shift.id}
            className={`rounded-2xl border bg-white p-3.5 shadow-sm ${
              shift.date === DEMO_TODAY
                ? "border-teal-300"
                : "border-slate-200"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold">
                  {formatDate(shift.date, {
                    weekday: "long",
                    day: "numeric",
                    month: "short",
                  })}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">{shift.roleLabel}</p>
              </div>
              <Badge
                tone={
                  shift.status === "off"
                    ? "neutral"
                    : shift.status === "completed"
                      ? "success"
                      : "primary"
                }
              >
                {shift.status}
              </Badge>
            </div>
            <ShiftCard shift={shift} />
          </div>
        ))}
      </section>
    </div>
  );
}

function ShiftCard({
  shift,
  emphasize,
}: {
  shift: Shift;
  emphasize?: boolean;
}) {
  if (shift.status === "off") {
    return (
      <p className={`mt-2 text-sm ${emphasize ? "font-medium" : "text-slate-600"}`}>
        Rest day — no duty location.
      </p>
    );
  }

  return (
    <div className="mt-2 space-y-1.5">
      <p className={`font-semibold ${emphasize ? "text-xl" : "text-base"}`}>
        {formatTime(shift.startTime)} – {formatTime(shift.endTime)}
      </p>
      <p className="flex items-start gap-1.5 text-sm text-slate-600">
        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" />
        <span>
          <span className="font-medium text-slate-900">{shift.location.label}</span>
          <span className="mt-0.5 block text-xs text-slate-500">
            {shift.location.address}
          </span>
        </span>
      </p>
      {shift.notes ? (
        <p className="text-xs text-slate-500">{shift.notes}</p>
      ) : null}
    </div>
  );
}
