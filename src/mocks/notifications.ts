import type {
  ActivityItem,
  AttendanceConfig,
  CompanySettings,
  ContributionConfig,
  Notification,
  PayrollConfig,
  User,
} from "@/src/types";

export const currentUser: User = {
  id: "user-admin",
  name: "Deepa Krishnan",
  email: "deepa.krishnan@workhub.demo",
  role: "admin",
  avatarUrl: null,
};

export const notifications: Notification[] = [
  {
    id: "n-001",
    title: "Payroll ready for review",
    message: "September 2026 payroll has been generated and is pending review.",
    category: "payroll",
    createdAt: "2026-09-20T10:05:00+08:00",
    read: false,
    href: "/payroll/pay-2026-09",
  },
  {
    id: "n-002",
    title: "3 employees absent today",
    message: "Suresh Rajan’s team reported 3 absences on 22 Sep 2026.",
    category: "attendance",
    createdAt: "2026-09-22T10:30:00+08:00",
    read: false,
    href: "/attendance/today",
  },
  {
    id: "n-003",
    title: "Leave submitted",
    message: "Kavitha Subramaniam submitted medical leave documentation.",
    category: "leave",
    createdAt: "2026-09-21T14:20:00+08:00",
    read: false,
    href: "/attendance/leave",
  },
  {
    id: "n-004",
    title: "August payroll approved",
    message: "August 2026 payroll was approved and marked as paid.",
    category: "payroll",
    createdAt: "2026-08-28T10:15:00+08:00",
    read: true,
    href: "/payroll/pay-2026-08",
  },
  {
    id: "n-005",
    title: "Monthly contribution report available",
    message: "EPF and SOCSO/EIS contribution listings for August are ready to export.",
    category: "report",
    createdAt: "2026-09-01T09:00:00+08:00",
    read: true,
    href: "/reports/epf",
  },
  {
    id: "n-006",
    title: "New employee onboarded",
    message: "Yap Shu Ting (WH-1028) was added to Operations as Reception Guard.",
    category: "system",
    createdAt: "2026-07-01T11:00:00+08:00",
    read: true,
    href: "/employees/emp-028",
  },
  {
    id: "n-007",
    title: "Late arrivals flagged",
    message: "5 late check-ins were recorded today. Review attendance for follow-up.",
    category: "attendance",
    createdAt: "2026-09-22T11:00:00+08:00",
    read: false,
    href: "/attendance/today",
  },
];

export const recentActivity: ActivityItem[] = [
  {
    id: "act-001",
    message: "Ahmad Faizal checked in at 8:57 AM",
    createdAt: "2026-09-22T08:57:00+08:00",
    type: "attendance",
  },
  {
    id: "act-002",
    message: "Suresh Rajan marked absent",
    createdAt: "2026-09-22T10:15:00+08:00",
    type: "attendance",
  },
  {
    id: "act-003",
    message: "September payroll generated",
    createdAt: "2026-09-20T10:00:00+08:00",
    type: "payroll",
  },
  {
    id: "act-004",
    message: "August payroll approved",
    createdAt: "2026-08-27T14:00:00+08:00",
    type: "payroll",
  },
  {
    id: "act-005",
    message: "Nurul Izzati profile updated",
    createdAt: "2026-09-19T16:40:00+08:00",
    type: "employee",
  },
  {
    id: "act-006",
    message: "EPF contribution report exported (demo)",
    createdAt: "2026-09-01T09:30:00+08:00",
    type: "system",
  },
];

export const companySettings: CompanySettings = {
  name: "Workhub Demo Sdn Bhd",
  registrationNumber: "202401234567 (DEMO)",
  address: "Level 12, Menara Demo, Jalan Ampang, 50450 Kuala Lumpur",
  phone: "+60 3-2123 4567",
  email: "hr@workhub.demo",
  currency: "MYR",
  timezone: "Asia/Kuala_Lumpur",
};

export const payrollConfig: PayrollConfig = {
  cutoffDay: null,
  paymentDay: null,
  includeSocsoInEmployerCost: null,
  includeEisInEmployerCost: null,
  notes:
    "Cutoff day, payment day, and which employer contributions form Overall Budget are TO BE CONFIRMED WITH CLIENT.",
};

export const attendanceConfig: AttendanceConfig = {
  standardStartTime: "09:00",
  standardEndTime: "18:00",
  lateGraceMinutes: null,
  workingDaysPerMonth: null,
  notes:
    "Exact late threshold, rest-day and public-holiday rules are TO BE CONFIRMED. Security shift hours may differ.",
};

export const contributionConfig: ContributionConfig = {
  epfEmployeeRate: null,
  epfEmployerRate: null,
  socsoEmployeeRate: null,
  socsoEmployerRate: null,
  eisEmployeeRate: null,
  eisEmployerRate: null,
  notes:
    "All statutory rates shown in the UI are mock demo values. Authoritative rates belong in the backend payroll engine — TO BE CONFIRMED WITH CLIENT.",
};
