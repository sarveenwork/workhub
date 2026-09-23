import { DEMO_GUARD_SITES, DEMO_TODAY } from "@/src/lib/constants";
import type { AttendanceStatus, CheckInLocation, CheckInRequest } from "@/src/types";
import { employees } from "./employees";

function site(index: number): CheckInLocation {
  const s = DEMO_GUARD_SITES[index % DEMO_GUARD_SITES.length];
  return {
    label: s.label,
    address: s.address,
    latitude: s.latitude,
    longitude: s.longitude,
  };
}

const guardIds = employees
  .filter((e) => e.isSecurityGuard && e.status === "active")
  .map((e) => e.id);

/**
 * Pending and reviewed check-in requests for security guards.
 * Mutable so approve/reject and live check-in update the demo store.
 */
export const checkInRequests: CheckInRequest[] = [
  {
    id: "cin-001",
    employeeId: guardIds[0] ?? "emp-001",
    date: DEMO_TODAY,
    checkInAt: "07:52",
    checkOutAt: null,
    location: site(0),
    attendanceStatus: "present",
    approvalStatus: "pending",
    reviewedBy: null,
    reviewedAt: null,
    reviewNotes: null,
    submittedAt: `${DEMO_TODAY}T07:52:00+08:00`,
  },
  {
    id: "cin-002",
    employeeId: guardIds[1] ?? "emp-008",
    date: DEMO_TODAY,
    checkInAt: "07:58",
    checkOutAt: null,
    location: site(1),
    attendanceStatus: "present",
    approvalStatus: "pending",
    reviewedBy: null,
    reviewedAt: null,
    reviewNotes: null,
    submittedAt: `${DEMO_TODAY}T07:58:00+08:00`,
  },
  {
    id: "cin-003",
    employeeId: guardIds[2] ?? "emp-012",
    date: DEMO_TODAY,
    checkInAt: "08:14",
    checkOutAt: null,
    location: site(2),
    attendanceStatus: "late",
    approvalStatus: "pending",
    reviewedBy: null,
    reviewedAt: null,
    reviewNotes: null,
    submittedAt: `${DEMO_TODAY}T08:14:00+08:00`,
  },
  {
    id: "cin-004",
    employeeId: guardIds[3] ?? "emp-022",
    date: DEMO_TODAY,
    checkInAt: "07:45",
    checkOutAt: "19:50",
    location: site(3),
    attendanceStatus: "present",
    approvalStatus: "approved",
    reviewedBy: "Deepa Krishnan",
    reviewedAt: `${DEMO_TODAY}T09:10:00+08:00`,
    reviewNotes: "On assigned post",
    submittedAt: `${DEMO_TODAY}T07:45:00+08:00`,
  },
  {
    id: "cin-005",
    employeeId: guardIds[4] ?? "emp-025",
    date: "2026-09-21",
    checkInAt: "09:40",
    checkOutAt: null,
    location: site(0),
    attendanceStatus: "late",
    approvalStatus: "rejected",
    reviewedBy: "Deepa Krishnan",
    reviewedAt: "2026-09-21T10:05:00+08:00",
    reviewNotes: "Check-in location did not match assigned post (demo).",
    submittedAt: "2026-09-21T09:40:00+08:00",
  },
];

/** Mutable kiosk session — security guard demo persona. */
export const checkInSession: {
  employeeId: string;
  requestId: string | null;
  checkIn: string | null;
  checkOut: string | null;
  status: AttendanceStatus | "not_started";
  approvalStatus: CheckInRequest["approvalStatus"] | null;
  location: CheckInLocation;
} = {
  employeeId: "emp-001",
  requestId: null,
  checkIn: null,
  checkOut: null,
  status: "not_started",
  approvalStatus: null,
  location: site(0),
};
