import { DEMO_GUARD_SITES, DEMO_TODAY } from "@/src/lib/constants";
import type { CheckInLocation, LeaveRequest, Shift } from "@/src/types";

/** Demo employee persona for the mobile app (Ahmad Faizal — WH-1001). */
export const MOBILE_EMPLOYEE_ID = "emp-001";

function site(index: number): CheckInLocation {
  const s = DEMO_GUARD_SITES[index % DEMO_GUARD_SITES.length];
  return {
    label: s.label,
    address: s.address,
    latitude: s.latitude,
    longitude: s.longitude,
  };
}

/** Week around DEMO_TODAY (Mon 21 – Sun 27 Sep 2026). */
export const employeeShifts: Shift[] = [
  {
    id: "sh-01",
    employeeId: MOBILE_EMPLOYEE_ID,
    date: "2026-09-21",
    startTime: "08:00",
    endTime: "20:00",
    location: site(0),
    roleLabel: "Security Guard",
    status: "completed",
    notes: null,
  },
  {
    id: "sh-02",
    employeeId: MOBILE_EMPLOYEE_ID,
    date: "2026-09-22",
    startTime: "08:00",
    endTime: "20:00",
    location: site(0),
    roleLabel: "Security Guard",
    status: "scheduled",
    notes: "Main gate coverage",
  },
  {
    id: "sh-03",
    employeeId: MOBILE_EMPLOYEE_ID,
    date: "2026-09-23",
    startTime: "08:00",
    endTime: "20:00",
    location: site(1),
    roleLabel: "Security Guard",
    status: "scheduled",
    notes: "Relief at KLCC Tower 2",
  },
  {
    id: "sh-04",
    employeeId: MOBILE_EMPLOYEE_ID,
    date: "2026-09-24",
    startTime: "20:00",
    endTime: "08:00",
    location: site(0),
    roleLabel: "Security Guard",
    status: "scheduled",
    notes: "Night shift",
  },
  {
    id: "sh-05",
    employeeId: MOBILE_EMPLOYEE_ID,
    date: "2026-09-25",
    startTime: "00:00",
    endTime: "00:00",
    location: site(0),
    roleLabel: "Rest day",
    status: "off",
    notes: "Rostered off",
  },
  {
    id: "sh-06",
    employeeId: MOBILE_EMPLOYEE_ID,
    date: "2026-09-26",
    startTime: "08:00",
    endTime: "20:00",
    location: site(2),
    roleLabel: "Security Guard",
    status: "scheduled",
    notes: null,
  },
  {
    id: "sh-07",
    employeeId: MOBILE_EMPLOYEE_ID,
    date: "2026-09-27",
    startTime: "08:00",
    endTime: "20:00",
    location: site(3),
    roleLabel: "Security Guard",
    status: "scheduled",
    notes: "Weekend industrial park post",
  },
];

export const leaveRequests: LeaveRequest[] = [
  {
    id: "lv-001",
    employeeId: MOBILE_EMPLOYEE_ID,
    type: "medical",
    startDate: "2026-09-10",
    endDate: "2026-09-10",
    reason: "Clinic appointment",
    status: "approved",
    submittedAt: "2026-09-08T09:00:00+08:00",
    reviewedAt: "2026-09-08T14:00:00+08:00",
  },
  {
    id: "lv-002",
    employeeId: MOBILE_EMPLOYEE_ID,
    type: "unpaid_leave",
    startDate: "2026-09-28",
    endDate: "2026-09-28",
    reason: "Family matter",
    status: "pending",
    submittedAt: "2026-09-20T11:30:00+08:00",
    reviewedAt: null,
  },
];

export function getTodayShift(date = DEMO_TODAY): Shift | undefined {
  return employeeShifts.find((s) => s.date === date);
}

export { DEMO_TODAY };
