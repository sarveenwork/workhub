import type {
  AllowanceType,
  AttendanceStatus,
  CheckInApprovalStatus,
  EmployeeStatus,
  EmploymentType,
  NotificationCategory,
  PayrollStatus,
} from "@/src/types";

export const EMPLOYMENT_TYPE_LABELS: Record<EmploymentType, string> = {
  full_time: "Full-time",
  part_time: "Part-time",
  contract: "Contract",
};

export const EMPLOYEE_STATUS_LABELS: Record<EmployeeStatus, string> = {
  active: "Active",
  on_leave: "On Leave",
  resigned: "Resigned",
  suspended: "Suspended",
};

export const ATTENDANCE_STATUS_LABELS: Record<AttendanceStatus, string> = {
  present: "Present",
  late: "Late",
  absent: "Absent",
  unpaid_leave: "Unpaid Leave",
  paid_leave: "Paid Leave",
  rest_day: "Rest Day",
  public_holiday: "Public Holiday",
};

export const PAYROLL_STATUS_LABELS: Record<PayrollStatus, string> = {
  draft: "Draft",
  pending_review: "Pending Review",
  approved: "Approved",
  paid: "Paid",
};

export const ALLOWANCE_TYPE_LABELS: Record<AllowanceType, string> = {
  petrol: "Petrol Allowance",
  management: "Management Allowance",
  housing: "Housing Allowance",
  meal: "Meal Allowance",
  travel: "Travel Allowance",
  phone: "Phone Allowance",
  other: "Other Allowance",
};

export const NOTIFICATION_CATEGORY_LABELS: Record<NotificationCategory, string> = {
  payroll: "Payroll",
  attendance: "Attendance",
  leave: "Leave",
  system: "System",
  report: "Report",
};

export const CHECK_IN_APPROVAL_LABELS: Record<CheckInApprovalStatus, string> = {
  pending: "Pending approval",
  approved: "Approved",
  rejected: "Rejected",
};

/** Demo duty sites for security-guard check-in (mock locations). */
export const DEMO_GUARD_SITES = [
  {
    id: "site-ampang",
    label: "Menara Ampang Gate A",
    address: "Jalan Ampang, 50450 Kuala Lumpur",
    latitude: 3.1612,
    longitude: 101.7195,
  },
  {
    id: "site-klcc",
    label: "KLCC Tower 2 Loading Bay",
    address: "Persiaran KLCC, 50088 Kuala Lumpur",
    latitude: 3.1579,
    longitude: 101.7116,
  },
  {
    id: "site-pj",
    label: "Damansara Heights Post",
    address: "Jalan Semantan, 50490 Kuala Lumpur",
    latitude: 3.1518,
    longitude: 101.6664,
  },
  {
    id: "site-shah",
    label: "Shah Alam Industrial Park",
    address: "Seksyen 16, 40200 Shah Alam, Selangor",
    latitude: 3.0733,
    longitude: 101.5185,
  },
] as const;

/** Demo reference date for consistent mock attendance “today”. */
export const DEMO_TODAY = "2026-09-22";

export const DEMO_BANNER =
  "Demo data — figures are illustrative. Statutory rates and calculations are TO BE CONFIRMED.";
