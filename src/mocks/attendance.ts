import { DEMO_TODAY } from "@/src/lib/constants";
import type { AttendanceRecord, AttendanceStatus } from "@/src/types";
import { employees } from "./employees";

function hoursBetween(checkIn: string, checkOut: string): number {
  const [ih, im] = checkIn.split(":").map(Number);
  const [oh, om] = checkOut.split(":").map(Number);
  return Math.round(((oh * 60 + om - (ih * 60 + im)) / 60) * 10) / 10;
}

type Seed = {
  employeeId: string;
  status: AttendanceStatus;
  checkIn?: string;
  checkOut?: string;
  overtimeHours?: number;
  notes?: string;
};

/** Deterministic demo attendance for DEMO_TODAY and surrounding days. */
const todaySeeds: Seed[] = [
  { employeeId: "emp-001", status: "present", checkIn: "08:57", checkOut: "18:02", overtimeHours: 0 },
  { employeeId: "emp-002", status: "late", checkIn: "09:32", checkOut: "18:05", overtimeHours: 0, notes: "Traffic delay" },
  { employeeId: "emp-003", status: "present", checkIn: "08:45", checkOut: "17:55" },
  { employeeId: "emp-004", status: "present", checkIn: "08:50", checkOut: "18:10", overtimeHours: 0.5 },
  { employeeId: "emp-005", status: "present", checkIn: "08:30", checkOut: "18:30", overtimeHours: 1 },
  { employeeId: "emp-006", status: "paid_leave", notes: "Medical leave" },
  { employeeId: "emp-007", status: "present", checkIn: "09:00", checkOut: "18:00" },
  { employeeId: "emp-008", status: "present", checkIn: "07:55", checkOut: "20:00", overtimeHours: 2 },
  { employeeId: "emp-009", status: "present", checkIn: "08:40", checkOut: "17:50" },
  { employeeId: "emp-010", status: "present", checkIn: "14:00", checkOut: "22:00" },
  { employeeId: "emp-011", status: "present", checkIn: "08:35", checkOut: "18:00" },
  { employeeId: "emp-012", status: "late", checkIn: "09:18", checkOut: "18:00", notes: "Transport delay" },
  { employeeId: "emp-014", status: "present", checkIn: "08:55", checkOut: "17:58" },
  { employeeId: "emp-015", status: "absent", notes: "No check-in" },
  { employeeId: "emp-016", status: "present", checkIn: "09:00", checkOut: "13:00" },
  { employeeId: "emp-017", status: "present", checkIn: "08:48", checkOut: "18:15", overtimeHours: 0.5 },
  { employeeId: "emp-018", status: "absent", notes: "Suspended — no duty" },
  { employeeId: "emp-019", status: "late", checkIn: "09:25", checkOut: "18:00" },
  { employeeId: "emp-020", status: "present", checkIn: "08:20", checkOut: "18:40", overtimeHours: 1 },
  { employeeId: "emp-021", status: "present", checkIn: "08:52", checkOut: "18:00" },
  { employeeId: "emp-022", status: "present", checkIn: "07:50", checkOut: "19:50", overtimeHours: 1.5 },
  { employeeId: "emp-023", status: "unpaid_leave", notes: "Approved unpaid leave" },
  { employeeId: "emp-024", status: "present", checkIn: "08:58", checkOut: "18:02" },
  { employeeId: "emp-025", status: "late", checkIn: "09:40", checkOut: "18:00", notes: "Late after shift handover" },
  { employeeId: "emp-026", status: "paid_leave", notes: "Annual leave" },
  { employeeId: "emp-027", status: "present", checkIn: "07:45", checkOut: "20:00", overtimeHours: 2 },
  { employeeId: "emp-028", status: "present", checkIn: "16:00", checkOut: "22:00" },
  { employeeId: "emp-029", status: "absent", notes: "No check-in" },
  { employeeId: "emp-030", status: "present", checkIn: "08:50", checkOut: "17:55" },
  { employeeId: "emp-031", status: "late", checkIn: "09:15", checkOut: "18:10" },
  { employeeId: "emp-032", status: "present", checkIn: "08:42", checkOut: "18:05" },
];

function buildRecord(seed: Seed, date: string, index: number): AttendanceRecord {
  const checkIn = seed.checkIn ?? null;
  const checkOut = seed.checkOut ?? null;
  return {
    id: `att-${date}-${index}`,
    employeeId: seed.employeeId,
    date,
    checkIn,
    checkOut,
    totalHours: checkIn && checkOut ? hoursBetween(checkIn, checkOut) : null,
    overtimeHours: seed.overtimeHours ?? 0,
    status: seed.status,
    notes: seed.notes ?? null,
  };
}

const historical: AttendanceRecord[] = [];

// Generate a few prior weekdays of varied attendance for calendar realism
const priorDates = [
  "2026-09-21",
  "2026-09-20",
  "2026-09-19",
  "2026-09-18",
  "2026-09-17",
  "2026-09-15",
  "2026-09-14",
];

priorDates.forEach((date, dayIdx) => {
  employees
    .filter((e) => e.status !== "resigned")
    .forEach((emp, i) => {
      const pattern = (dayIdx + i) % 7;
      let status: AttendanceStatus = "present";
      let checkIn = "08:50";
      let checkOut = "18:00";
      let ot = 0;
      let notes: string | undefined;

      if (emp.status === "on_leave") {
        status = "paid_leave";
        checkIn = "";
        checkOut = "";
      } else if (emp.status === "suspended") {
        status = "absent";
        checkIn = "";
        checkOut = "";
        notes = "Suspended";
      } else if (pattern === 0) {
        status = "late";
        checkIn = "09:20";
      } else if (pattern === 1 && i % 11 === 0) {
        status = "absent";
        checkIn = "";
        checkOut = "";
        notes = "No check-in";
      } else if (pattern === 2 && i % 13 === 0) {
        status = "unpaid_leave";
        checkIn = "";
        checkOut = "";
        notes = "Approved unpaid leave";
      } else if (pattern === 3 && emp.isSecurityGuard) {
        checkIn = "07:55";
        checkOut = "20:00";
        ot = 2;
      } else if (date === "2026-09-20" && i % 5 === 0) {
        status = "rest_day";
        checkIn = "";
        checkOut = "";
      }

      historical.push(
        buildRecord(
          {
            employeeId: emp.id,
            status,
            checkIn: checkIn || undefined,
            checkOut: checkOut || undefined,
            overtimeHours: ot,
            notes,
          },
          date,
          i,
        ),
      );
    });
});

export const attendanceRecords: AttendanceRecord[] = [
  ...todaySeeds.map((seed, i) => buildRecord(seed, DEMO_TODAY, i)),
  ...historical,
];
